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
  Image,
  PanResponder,
  ActivityIndicator,
} from "react-native";
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
  getLalithaSectionAudioTracks,
  hasLalithaSectionAudio,
  LALITHA_AUDIO_CREDIT,
} from "../audio/lalithaSectionAudio";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";

const deviImage = require("../../assets/gayatri-mata.jpg");
const SWIPE_THRESHOLD = 50;

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
        <Image
          source={deviImage}
          style={styles.deviImage}
          resizeMode="contain"
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
  const soundRef = useRef<Audio.Sound | null>(null);
  const pageScrollRef = useRef<ScrollView>(null);
  const { fontSize, setLastSection, refreshStreak } = useApp();
  const fontScale = FONT_SCALE[fontSize];
  const sectionIndex = currentPage > 0 ? currentPage - 1 : -1;
  const audioTracks = getLalithaSectionAudioTracks(sectionIndex);
  const hasAudio = hasLalithaSectionAudio(sectionIndex);

  useEffect(() => {
    if (currentPage > 0) {
      const sec = lalithaSahasranamamSections[currentPage - 1];
      if (sec) {
        setLastSection(currentPage, sec.titleTe);
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
      if (trackIndex >= audioTracks.length) {
        await stopAndUnload();
        return;
      }
      const source = audioTracks[trackIndex];
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
      } catch (_) {
        setIsPlaying(false);
      } finally {
        setAudioLoading(false);
      }
    },
    [audioTracks, stopAndUnload]
  );

  const handlePlayPause = useCallback(async () => {
    if (!hasAudio) return;
    if (isPlaying || audioLoading) {
      await stopAndUnload();
      return;
    }
    setAudioLoading(true);
    await stopAndUnload();
    await playTrack(0);
  }, [hasAudio, isPlaying, audioLoading, playTrack, stopAndUnload]);

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

  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 15;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        if (dx > SWIPE_THRESHOLD) goPrevRef.current();
        else if (dx < -SWIPE_THRESHOLD) goNextRef.current();
      },
    })
  ).current;

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
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backBtnText}>← Contents</Text>
        </Pressable>
        <Pressable
          onPress={handlePlayPause}
          disabled={!hasAudio}
          style={({ pressed }) => [
            styles.speakerBtn,
            !hasAudio && styles.speakerBtnDisabled,
            pressed && hasAudio && styles.pressed,
          ]}
          accessibilityLabel={hasAudio ? "Play section audio" : "No audio"}
        >
          {audioLoading ? (
            <ActivityIndicator size="small" color={colors.goldLight} />
          ) : (
            <Text style={[styles.speakerIcon, !hasAudio && styles.speakerIconDisabled]}>
              {isPlaying ? "⏹" : "🔊"}
            </Text>
          )}
        </Pressable>
      </View>

      <View style={styles.contentHalf} {...panResponder.panHandlers}>
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

      <View style={styles.navBar}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
        >
          <Text style={[styles.navBtnText, !canGoPrev && styles.navBtnTextDisabled]}>
            ← Previous
          </Text>
        </Pressable>
        <Text style={styles.pageIndicator}>
          {currentPage + 1} / {TOTAL_PAGES}
        </Text>
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
    paddingTop: Platform.OS === "ios" ? 52 : 44,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  pressed: { opacity: 0.8 },
  backBtnText: {
    color: colors.goldLight,
    fontSize: 14,
    fontWeight: "600",
  },
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
    width: 120,
    height: 160,
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
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
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
