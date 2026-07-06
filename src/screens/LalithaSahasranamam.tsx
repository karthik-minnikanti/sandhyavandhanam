import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  UIManager,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import {
  lalithaOpening,
  lalithaSahasranamamSections,
} from "../content/lalithaSahasranamam";
import {
  getLalithaSectionAudioTrackPaths,
  hasLalithaSectionAudio,
  LALITHA_AUDIO_CREDIT,
  LALITHA_AUDIO_PACK,
} from "../audio/lalithaSectionAudio";
import { isAudioPackPublished } from "../contentPacks/manifest";
import { useContentPacks } from "../context/ContentPackContext";
import type { AudioUriSource } from "../contentPacks/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";
import ReaderOnboarding, {
  BASIC_READER_ONBOARDING_STEPS,
} from "../components/ReaderOnboarding";
import ReaderAudioControl from "../components/ReaderAudioControl";
import FavoriteStarButton from "../components/FavoriteStarButton";
import SectionPicker, { type SectionPickerItem } from "../components/SectionPicker";
import PageIndicatorButton from "../components/PageIndicatorButton";
import { showAudioError } from "../utils/audioError";
import DeityIconBox from "../components/DeityIconBox";
import { readerNavBarStyle, readerTopBarStyle, readerBarStyles } from "../utils/readerLayout";
import { useReaderPageSwipe } from "../hooks/useReaderPageSwipe";
import { navigateToContents } from "../utils/catalogNavigation";
import { useContentLayout } from "../utils/contentLayout";
import ReaderNavButton from "../components/ReaderNavButton";

import { DEITY_ICONS } from "../content/deityIcons";

const deviImage = DEITY_ICONS.lalitha;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SCALE: Record<FontSize, number> = { small: 0.9, medium: 1, large: 1.15 };

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "LalithaSahasranamam">;
};

const TOTAL_PAGES = lalithaSahasranamamSections.length + 1;

function PageContent({ pageIndex, fontScale = 1 }: { pageIndex: number; fontScale?: number }) {
  const scaled = useMemo(
    () => ({
      sectionTitle: { fontSize: 17 * fontScale },
      sectionTitleEn: { fontSize: 13 * fontScale },
      mantra: { fontSize: 15 * fontScale, lineHeight: 26 * fontScale },
      opening: { fontSize: 18 * fontScale },
      hint: { fontSize: 14 * fontScale },
    }),
    [fontScale]
  );

  if (pageIndex === 0) {
    return (
      <View style={[styles.pageContent, styles.firstPageContent]}>
        <DeityIconBox
          source={deviImage}
          width={120}
          aspectRatio={1.33}
          style={styles.deviImage}
          accessibilityLabel="Sri Lalitha Devi"
        />
        <Text style={[styles.opening, scaled.opening]}>{lalithaOpening}</Text>
        <Text style={[styles.bookPageHint, scaled.hint]}>
          శ్రీ లలితా సహస్ర నామ స్తోత్రం →
        </Text>
        <Text style={[styles.audioCredit, scaled.hint]}>{LALITHA_AUDIO_CREDIT}</Text>
      </View>
    );
  }

  const sec = lalithaSahasranamamSections[pageIndex - 1];
  return (
    <View style={styles.pageContent}>
      <Text style={[styles.sectionTitleTe, scaled.sectionTitle]}>{sec.titleTe}</Text>
      {sec.titleEn ? (
        <Text style={[styles.sectionTitleEn, scaled.sectionTitleEn]}>{sec.titleEn}</Text>
      ) : null}
      <Text style={[styles.mantra, scaled.mantra]}>{sec.mantra}</Text>
    </View>
  );
}

export default function LalithaSahasranamam({ navigation }: Props) {
  useKeepAwake();
  const route = useRoute<RouteProp<RootStackParamList, "LalithaSahasranamam">>();
  const initialPage = route.params?.initialPage ?? 0;
  const [currentPage, setCurrentPage] = useState(() =>
    Math.min(Math.max(0, initialPage), TOTAL_PAGES - 1)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [sectionPickerVisible, setSectionPickerVisible] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const pageScrollRef = useRef<ScrollView>(null);
  const {
    fontSize,
    setLastSection,
    refreshStreak,
    preferencesLoaded,
    hintsSeen,
    markHintsSeen,
  } = useApp();
  const { resolveAudioTracks } = useContentPacks();
  const insets = useSafeAreaInsets();
  const { contentInset, bookPageFrame } = useContentLayout();
  const fontScale = FONT_SCALE[fontSize];
  const sectionIndex = currentPage > 0 ? currentPage - 1 : -1;
  const audioTrackPaths = getLalithaSectionAudioTrackPaths(sectionIndex);
  const hasAudio =
    isAudioPackPublished(LALITHA_AUDIO_PACK) &&
    hasLalithaSectionAudio(sectionIndex);
  const resolvedTracksRef = useRef<AudioUriSource[]>([]);

  const sectionItems = useMemo((): SectionPickerItem[] => {
    const items: SectionPickerItem[] = [{ label: "Cover", page: 0 }];
    lalithaSahasranamamSections.forEach((sec, index) => {
      items.push({ label: sec.titleTe, page: index + 1 });
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
      const sec = lalithaSahasranamamSections[currentPage - 1];
      if (sec) {
        setLastSection("LalithaSahasranamam", currentPage, sec.titleTe);
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
            stopAndUnload();
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
        LALITHA_AUDIO_PACK,
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
          <FavoriteStarButton screenKey="LalithaSahasranamam" size={20} />
          <ReaderAudioControl
            packId={LALITHA_AUDIO_PACK}
            hasAudio={hasAudio}
            isPlaying={isPlaying}
            audioLoading={audioLoading}
            onPlayPause={handlePlayPause}
          />
        </View>
      </View>

      <View style={[styles.contentHalf, contentInset]} {...pageSwipe.panHandlers}>
        <View style={[styles.bookPage, bookPageFrame]}>
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

      <View style={[readerBarStyles.navBar, readerNavBarStyle(insets), contentInset]}>
        <ReaderNavButton direction="prev" disabled={!canGoPrev} onPress={goPrev} />
        <PageIndicatorButton
          label={`${currentPage + 1} / ${TOTAL_PAGES}`}
          onPress={() => setSectionPickerVisible(true)}
        />
        <ReaderNavButton direction="next" disabled={!canGoNext} onPress={goNext} />
      </View>

      <ReaderOnboarding
        visible={preferencesLoaded && !hintsSeen}
        steps={BASIC_READER_ONBOARDING_STEPS}
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
  speakerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBtnDisabled: {
    opacity: 0.4,
  },
  speakerIcon: {
    fontSize: 22,
  },
  speakerIconDisabled: {
    opacity: 0.6,
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
  },
  firstPageContent: {
    alignItems: "center",
  },
  deviImage: {
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
  audioCredit: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
    opacity: 0.85,
  },
  audioHint: {
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.75,
  },
  sectionTitleTe: {
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 4,
  },
  sectionTitleEn: {
    color: colors.textMuted,
    marginBottom: 8,
  },
  mantra: {
    color: colors.text,
  },
});
