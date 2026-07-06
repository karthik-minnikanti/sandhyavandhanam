import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
  type ImageSourcePropType,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import type { CatalogScreen } from "../content/catalog";
import { navigateToContents } from "../utils/catalogNavigation";
import { colors } from "../theme/colors";
import type { StotramReaderPage, StotramSection } from "../content/stotramTypes";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";
import DeityIconBox from "../components/DeityIconBox";
import MantraText from "../components/MantraText";
import ReaderAudioControl from "../components/ReaderAudioControl";
import FavoriteStarButton from "../components/FavoriteStarButton";
import { useContentPacks } from "../context/ContentPackContext";
import type { AudioUriSource, ContentPackId } from "../contentPacks/types";
import { isAudioPackPublished } from "../contentPacks/manifest";
import ReaderOnboarding, {
  SWIPE_NAV_ONBOARDING_STEPS,
} from "../components/ReaderOnboarding";
import SectionPicker, { type SectionPickerItem } from "../components/SectionPicker";
import PageIndicatorButton from "../components/PageIndicatorButton";
import { showAudioError } from "../utils/audioError";
import { readerNavBarStyle, readerTopBarStyle, readerBarStyles } from "../utils/readerLayout";
import { contentInsetStyle, CONTENT_MAX_WIDTH } from "../utils/contentLayout";
import { useReaderPageSwipe } from "../hooks/useReaderPageSwipe";
import ReaderNavButton from "./ReaderNavButton";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SCALE: Record<FontSize, number> = { small: 0.9, medium: 1, large: 1.15 };

export type StotramReaderConfig = {
  opening: string;
  coverHint: string;
  deityImage: ImageSourcePropType;
  deityLabel: string;
  readerPages: StotramReaderPage[];
  audioPackId: ContentPackId;
  getPageAudioTrackPaths: (readerPageIndex: number) => readonly string[];
  hasPageAudio: (readerPageIndex: number) => boolean;
  /** One scrollable page: deity, opening, and all sections — no separate cover. */
  skipCover?: boolean;
  audioCredit?: string;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  initialPage?: number;
  screenKey: CatalogScreen;
  config: StotramReaderConfig;
};

function SlokaBlock({
  section,
  showLabel,
  fontScale,
}: {
  section: StotramSection;
  showLabel: boolean;
  fontScale: number;
}) {
  const lineStyle = useMemo(
    () => ({
      fontSize: 15 * fontScale,
      lineHeight: 28 * fontScale,
    }),
    [fontScale]
  );

  return (
    <View style={styles.slokaBlock}>
      {showLabel ? (
        <Text style={[styles.slokaLabel, { fontSize: 14 * fontScale }]}>
          {section.titleTe}
        </Text>
      ) : null}
      <MantraText mantra={section.mantra} lineStyle={lineStyle} />
    </View>
  );
}

function PageContent({
  pageIndex,
  fontScale,
  config,
}: {
  pageIndex: number;
  fontScale: number;
  config: StotramReaderConfig;
}) {
  const scaled = useMemo(
    () => ({
      pageTitle: { fontSize: 17 * fontScale },
      pageTitleEn: { fontSize: 13 * fontScale },
      opening: { fontSize: 18 * fontScale },
      hint: { fontSize: 14 * fontScale },
    }),
    [fontScale]
  );

  if (!config.skipCover && pageIndex === 0) {
    return (
      <View style={[styles.pageContent, styles.firstPageContent]}>
        <DeityIconBox
          source={config.deityImage}
          width={120}
          aspectRatio={1.33}
          style={styles.deityImage}
          accessibilityLabel={config.deityLabel}
        />
        <Text style={[styles.opening, scaled.opening]}>{config.opening}</Text>
        <Text style={[styles.bookPageHint, scaled.hint]}>{config.coverHint}</Text>
      </View>
    );
  }

  const readerPageIndex = config.skipCover ? pageIndex : pageIndex - 1;
  const page = config.readerPages[readerPageIndex];
  if (!page) return null;

  const showSlokaLabels = page.sections.length > 1;

  return (
    <View style={styles.pageContent}>
      {config.skipCover && pageIndex === 0 ? (
        <View style={styles.coverBlock}>
          <DeityIconBox
            source={config.deityImage}
            width={120}
            aspectRatio={1.33}
            style={styles.deityImage}
            accessibilityLabel={config.deityLabel}
          />
          <Text style={[styles.opening, scaled.opening]}>{config.opening}</Text>
        </View>
      ) : null}
      <Text style={[styles.sectionTitleTe, scaled.pageTitle]}>{page.titleTe}</Text>
      {page.titleEn ? (
        <Text style={[styles.sectionTitleEn, scaled.pageTitleEn]}>{page.titleEn}</Text>
      ) : null}
      {page.sections.map((section) => (
        <SlokaBlock
          key={section.titleTe}
          section={section}
          showLabel={showSlokaLabels}
          fontScale={fontScale}
        />
      ))}
      {config.audioCredit ? (
        <Text style={[styles.audioCredit, scaled.hint]}>{config.audioCredit}</Text>
      ) : null}
    </View>
  );
}

export default function StotramReaderView({
  navigation,
  initialPage = 0,
  screenKey,
  config,
}: Props) {
  useKeepAwake();
  const skipCover = config.skipCover ?? false;
  const totalPages = skipCover
    ? config.readerPages.length
    : config.readerPages.length + 1;
  const [currentPage, setCurrentPage] = useState(() => {
    const max = Math.max(0, totalPages - 1);
    const requested = initialPage ?? 0;
    return Math.min(skipCover && requested > 0 ? 0 : requested, max);
  });
  const [hintIndex, setHintIndex] = useState(0);
  const [sectionPickerVisible, setSectionPickerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const resolvedTracksRef = useRef<AudioUriSource[]>([]);
  const playNextTrackRef = useRef<((trackIndex: number) => Promise<void>) | null>(null);
  const {
    preferencesLoaded,
    hintsSeen,
    markHintsSeen,
    setLastSection,
    refreshStreak,
    fontSize,
  } = useApp();
  const { resolveAudioTracks } = useContentPacks();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const contentInset = contentInsetStyle(screenWidth);
  const fontScale = FONT_SCALE[fontSize];
  const pageScrollRef = useRef<ScrollView>(null);

  const readerPageIndex = skipCover
    ? currentPage
    : currentPage > 0
      ? currentPage - 1
      : -1;
  const audioTrackPaths = config.getPageAudioTrackPaths(readerPageIndex);
  const hasAudio =
    isAudioPackPublished(config.audioPackId) &&
    config.hasPageAudio(readerPageIndex);

  const sectionItems = useMemo((): SectionPickerItem[] => {
    const items: SectionPickerItem[] = skipCover
      ? []
      : [{ label: "Cover", page: 0 }];
    config.readerPages.forEach((page, index) => {
      items.push({
        label: page.titleTe,
        page: skipCover ? index : index + 1,
      });
    });
    return items;
  }, [config.readerPages, skipCover]);

  const jumpToPage = useCallback((page: number) => {
    setCurrentPage((p) => {
      if (page === p) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return page;
    });
  }, []);

  useEffect(() => {
    if (!hintsSeen) setHintIndex(0);
  }, [hintsSeen]);

  useEffect(() => {
    const readerIndex = skipCover ? currentPage : currentPage - 1;
    if (readerIndex >= 0) {
      const page = config.readerPages[readerIndex];
      if (page) {
        setLastSection(screenKey, currentPage, page.titleTe);
        refreshStreak();
      }
    }
  }, [
    currentPage,
    config.readerPages,
    screenKey,
    setLastSection,
    refreshStreak,
    skipCover,
  ]);

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [currentPage]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  const stopAndUnload = useCallback(async () => {
    const sound = soundRef.current;
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (_) {}
      soundRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAndUnload();
    };
  }, [stopAndUnload]);

  const playTrack = useCallback(
    async (trackIndex: number) => {
      const tracks = resolvedTracksRef.current;
      if (trackIndex >= tracks.length) {
        await stopAndUnload();
        return;
      }
      const source = tracks[trackIndex];
      try {
        const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
        soundRef.current = sound;
        setIsPlaying(true);
        sound.setOnPlaybackStatusUpdate((status) => {
          if (
            "isLoaded" in status &&
            status.isLoaded &&
            status.didJustFinish &&
            !status.isPlaying
          ) {
            const nextIndex = trackIndex + 1;
            if (nextIndex < tracks.length) {
              sound.unloadAsync().catch(() => {});
              soundRef.current = null;
              playNextTrackRef.current?.(nextIndex);
            } else {
              stopAndUnload();
            }
          }
        });
      } catch {
        setIsPlaying(false);
        showAudioError();
      } finally {
        setAudioLoading(false);
      }
    },
    [stopAndUnload]
  );

  playNextTrackRef.current = playTrack;

  const handlePlayPause = useCallback(async () => {
    if (!hasAudio) return;
    if (isPlaying || audioLoading) {
      await stopAndUnload();
      return;
    }
    setAudioLoading(true);
    await stopAndUnload();
    try {
      resolvedTracksRef.current = await resolveAudioTracks(
        config.audioPackId,
        audioTrackPaths
      );
      await playTrack(0);
    } catch {
      setIsPlaying(false);
      setAudioLoading(false);
      showAudioError();
    }
  }, [
    hasAudio,
    isPlaying,
    audioLoading,
    playTrack,
    stopAndUnload,
    resolveAudioTracks,
    config.audioPackId,
    audioTrackPaths,
  ]);

  useEffect(() => {
    stopAndUnload();
  }, [currentPage, stopAndUnload]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => {
      if (p >= totalPages - 1) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return p + 1;
    });
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => {
      if (p <= 0) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return p - 1;
    });
  }, []);

  const pageSwipe = useReaderPageSwipe(goPrev, goNext);
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;
  const showPageNav = totalPages > 1;
  const progressWidth =
    totalPages <= 1 ? 100 : (currentPage / (totalPages - 1)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressWidth}%` },
          ]}
        />
      </View>
      <View style={[readerBarStyles.topBar, readerTopBarStyle(insets), contentInset]}>
        <Pressable
          onPress={() => navigateToContents(navigation)}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          accessibilityLabel="Back to contents"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={20} color={colors.goldLight} />
        </Pressable>
        <View style={styles.topBarActions}>
          <FavoriteStarButton screenKey={screenKey} size={20} />
          <ReaderAudioControl
          packId={config.audioPackId}
          hasAudio={hasAudio}
          isPlaying={isPlaying}
          audioLoading={audioLoading}
          onPlayPause={handlePlayPause}
        />
        </View>
      </View>

      <View style={[styles.contentHalf, contentInset]} {...pageSwipe.panHandlers}>
        <View style={[styles.bookPage, styles.bookPageSized]}>
          <ScrollView
            ref={pageScrollRef}
            style={styles.pageScroll}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <PageContent pageIndex={currentPage} fontScale={fontScale} config={config} />
          </ScrollView>
        </View>
      </View>

      {showPageNav ? (
        <View style={[readerBarStyles.navBar, readerNavBarStyle(insets), contentInset]}>
          <ReaderNavButton direction="prev" disabled={!canGoPrev} onPress={goPrev} />
          <PageIndicatorButton
            label={`${currentPage + 1} / ${totalPages}`}
            onPress={() => setSectionPickerVisible(true)}
          />
          <ReaderNavButton direction="next" disabled={!canGoNext} onPress={goNext} />
        </View>
      ) : null}

      <ReaderOnboarding
        visible={preferencesLoaded && !hintsSeen && showPageNav}
        steps={SWIPE_NAV_ONBOARDING_STEPS}
        stepIndex={hintIndex}
        onNext={() => setHintIndex((i) => i + 1)}
        onDone={markHintsSeen}
      />

      <SectionPicker
        visible={sectionPickerVisible}
        sections={sectionItems}
        currentPage={currentPage}
        onSelect={jumpToPage}
        onClose={() => setSectionPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: colors.surfaceLight,
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.gold,
  },
  backBtn: {
    paddingVertical: 4,
    paddingRight: 4,
    marginRight: 4,
  },
  topBarActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: { opacity: 0.7 },
  contentHalf: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 6,
  },
  bookPageSized: {
    maxWidth: CONTENT_MAX_WIDTH,
    width: "100%",
    alignSelf: "center",
  },
  bookPage: {
    flex: 1,
    minHeight: 0,
    backgroundColor: colors.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.paperDark,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  pageScroll: {
    flex: 1,
  },
  pageScrollContent: {
    padding: 24,
    paddingBottom: 24,
  },
  pageContent: {
    minHeight: 200,
    width: "100%",
  },
  firstPageContent: {
    alignItems: "center",
  },
  deityImage: {
    marginBottom: 20,
  },
  opening: {
    color: colors.accent,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
  bookPageHint: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 32,
  },
  sectionTitleTe: {
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 4,
  },
  sectionTitleEn: {
    color: colors.textMuted,
    marginBottom: 12,
  },
  slokaBlock: {
    marginBottom: 20,
    width: "100%",
  },
  slokaLabel: {
    fontWeight: "600",
    color: colors.accent,
    marginBottom: 6,
  },
  coverBlock: {
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  audioCredit: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 24,
    fontStyle: "italic",
  },
});
