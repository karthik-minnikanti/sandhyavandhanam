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
} from "react-native";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import {
  dakshinamurthyOpening,
  getDakshinamurthyReaderPages,
  type StotramSection,
} from "../content/dakshinamurthyStotram";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";
import DeityIconBox from "../components/DeityIconBox";
import MantraText from "../components/MantraText";
import ReaderAudioControl from "../components/ReaderAudioControl";
import SectionPicker, { type SectionPickerItem } from "../components/SectionPicker";
import PageIndicatorButton from "../components/PageIndicatorButton";
import { showAudioError } from "../utils/audioError";
import { useContentPacks } from "../context/ContentPackContext";
import type { AudioUriSource } from "../contentPacks/types";
import {
  getDakshinamurthyPageAudioTrackPaths,
  hasDakshinamurthyPageAudio,
  DAKSHINAMURTHY_AUDIO_PACK,
} from "../audio/dakshinamurthySectionAudio";
import { DEITY_ICONS } from "../content/deityIcons";
import ReaderOnboarding, {
  SWIPE_NAV_ONBOARDING_STEPS,
} from "../components/ReaderOnboarding";
import { readerNavBarStyle, readerTopBarStyle } from "../utils/readerLayout";
import { useReaderPageSwipe } from "../hooks/useReaderPageSwipe";
import { navigateToContents } from "../utils/catalogNavigation";

const shivaImage = DEITY_ICONS.shiva;
const READER_PAGES = getDakshinamurthyReaderPages();
const TOTAL_PAGES = READER_PAGES.length + 1;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SCALE: Record<FontSize, number> = { small: 0.9, medium: 1, large: 1.15 };

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "DakshinamurthyStotram">;
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
  fontScale = 1,
}: {
  pageIndex: number;
  fontScale?: number;
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

  if (pageIndex === 0) {
    return (
      <View style={[styles.pageContent, styles.firstPageContent]}>
        <DeityIconBox
          source={shivaImage}
          width={120}
          aspectRatio={1.33}
          style={styles.deityImage}
          accessibilityLabel="Sri Dakshinamurthy"
        />
        <Text style={[styles.opening, scaled.opening]}>{dakshinamurthyOpening}</Text>
        <Text style={[styles.bookPageHint, scaled.hint]}>
          దక్షిణామూర్తి స్తోత్రం →
        </Text>
      </View>
    );
  }

  const page = READER_PAGES[pageIndex - 1];
  const showSlokaLabels = page.sections.length > 1;

  return (
    <View style={styles.pageContent}>
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
    </View>
  );
}

export default function DakshinamurthyStotram({ navigation }: Props) {
  useKeepAwake();
  const route = useRoute<RouteProp<RootStackParamList, "DakshinamurthyStotram">>();
  const initialPage = route.params?.initialPage ?? 0;
  const [currentPage, setCurrentPage] = useState(() =>
    Math.min(Math.max(0, initialPage), TOTAL_PAGES - 1)
  );
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
  const fontScale = FONT_SCALE[fontSize];
  const pageScrollRef = useRef<ScrollView>(null);

  const readerPageIndex = currentPage > 0 ? currentPage - 1 : -1;
  const audioTrackPaths = getDakshinamurthyPageAudioTrackPaths(readerPageIndex);
  const hasAudio = hasDakshinamurthyPageAudio(readerPageIndex);

  const sectionItems = useMemo((): SectionPickerItem[] => {
    const items: SectionPickerItem[] = [{ label: "Cover", page: 0 }];
    READER_PAGES.forEach((page, index) => {
      items.push({ label: page.titleTe, page: index + 1 });
    });
    return items;
  }, []);

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
    if (currentPage > 0) {
      const page = READER_PAGES[currentPage - 1];
      if (page) {
        setLastSection("DakshinamurthyStotram", currentPage, page.titleTe);
        refreshStreak();
      }
    }
  }, [currentPage, setLastSection, refreshStreak]);

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
        DAKSHINAMURTHY_AUDIO_PACK,
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
    audioTrackPaths,
  ]);

  useEffect(() => {
    stopAndUnload();
  }, [currentPage, stopAndUnload]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => {
      if (p >= TOTAL_PAGES - 1) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return p + 1;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => {
      if (p <= 0) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      return p - 1;
    });
  }, []);

  const pageSwipe = useReaderPageSwipe(goPrev, goNext);
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < TOTAL_PAGES - 1;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(currentPage / (TOTAL_PAGES - 1)) * 100}%` },
          ]}
        />
      </View>
      <View style={[styles.topBar, readerTopBarStyle(insets)]}>
        <Pressable
          onPress={() => navigateToContents(navigation)}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backBtnText}>← Contents</Text>
        </Pressable>
        <ReaderAudioControl
          packId={DAKSHINAMURTHY_AUDIO_PACK}
          hasAudio={hasAudio}
          isPlaying={isPlaying}
          audioLoading={audioLoading}
          onPlayPause={handlePlayPause}
        />
      </View>

      <View style={styles.contentHalf} {...pageSwipe.panHandlers}>
        <View style={styles.bookPage}>
          <ScrollView
            ref={pageScrollRef}
            style={styles.pageScroll}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <PageContent pageIndex={currentPage} fontScale={fontScale} />
          </ScrollView>
        </View>
      </View>

      <View style={[styles.navBar, readerNavBarStyle(insets)]}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
        >
          <Text style={[styles.navBtnText, !canGoPrev && styles.navBtnTextDisabled]}>
            ← Previous
          </Text>
        </Pressable>
        <PageIndicatorButton
          label={`${currentPage + 1} / ${TOTAL_PAGES}`}
          onPress={() => setSectionPickerVisible(true)}
        />
        <Pressable
          onPress={goNext}
          disabled={!canGoNext}
          style={[styles.navBtn, !canGoNext && styles.navBtnDisabled]}
        >
          <Text style={[styles.navBtnText, !canGoNext && styles.navBtnTextDisabled]}>
            Next →
          </Text>
        </Pressable>
      </View>

      <ReaderOnboarding
        visible={preferencesLoaded && !hintsSeen}
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  backBtn: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  pressed: { opacity: 0.8 },
  backBtnText: {
    color: colors.goldLight,
    fontSize: 14,
    fontWeight: "600",
  },
  contentHalf: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gold,
  },
  navBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
    borderRadius: 10,
    minWidth: 88,
    alignItems: "center",
  },
  navBtnDisabled: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.6,
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.goldLight,
  },
  navBtnTextDisabled: {
    color: colors.textOnDarkMuted,
  },
  pageIndicator: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    fontWeight: "600",
  },
});
