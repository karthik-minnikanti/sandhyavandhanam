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
  Modal,
  useWindowDimensions,
} from "react-native";
import { Audio } from "expo-av";
import { useKeepAwake } from "expo-keep-awake";
import { useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import {
  opening,
  suklamBaradaram,
  gurushakshath,
  sandhyavandanamSections,
} from "../content/sandhyavandanamKrishnaYajurveda";
import type { Section } from "../content/sandhyavandanamKrishnaYajurveda";
import { getSectionAudioTracks, INLINE_AUDIO_SUB1 } from "../audio/sectionAudio";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";

const gayatriMataImage = require("../../assets/gayatri-mata.jpg");

const SWIPE_THRESHOLD = 50;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SCALE: Record<FontSize, number> = { small: 0.9, medium: 1, large: 1.15 };
const HINTS_LENGTH = 4;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SandhyavandanamVidhanam">;
};

const TOTAL_PAGES = sandhyavandanamSections.length + 1; // +1 for opening page

// స్మృత్యాచమనం sections (indices 1–5): namas 1–24; last line on 22–24 page is శ్రీ పరబ్రహ్మణే (no number)
const AACHAMANAM_START_NUMBERS = [1, 5, 10, 16, 22];

function numberMantraLines(
  text: string,
  startAt: number = 1,
  numberOnlyFirst?: number
): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const count = numberOnlyFirst ?? lines.length;
  const linesToNumber = lines.slice(0, count);
  return linesToNumber
    .map((line, i) => `${startAt + i}. ${line}`)
    .join("\n");
}

function numberMeaningParagraphs(text: string): string {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((p, i) => `${i + 1}. ${p}`).join("\n\n");
}

function numberKriyaSteps(text: string): string {
  const steps = text.split(/\n\n+/).map((s) => s.trim()).filter(Boolean);
  return steps.map((step, i) => `${i + 1}. ${step}`).join("\n\n");
}

/** Renders text with **bold** segments as React Native Text children. */
function renderTextWithBold(
  text: string,
  normalStyle: object,
  boldStyle: object
): React.ReactNode {
  const parts = text.split(/\*\*([^*]*)\*\*/g);
  return parts.map((part, i) => (
    <Text key={i} style={i % 2 === 0 ? normalStyle : [normalStyle, boldStyle]}>
      {part}
    </Text>
  ));
}

type InlineAudioConfig = {
  lineContains: string;
  asset: number;
  onPlay: (asset: number) => void;
};

/** Renders mantra string with heading lines (lines ending with ":") highlighted. */
function renderMantraWithHeadings(
  mantraDisplay: string,
  baseStyle: object,
  boldStyle: object,
  headingStyle: object,
  inlineAudio?: InlineAudioConfig
): React.ReactNode {
  const lines = mantraDisplay.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();
    const isHeading = trimmed.length > 0 && trimmed.endsWith(":");
    const showInlinePlay =
      inlineAudio && trimmed.includes(inlineAudio.lineContains);

    const lineContent = (() => {
      if (trimmed === "") {
        return <Text style={baseStyle}>{"\n"}</Text>;
      }
      if (isHeading) {
        return (
          <Text style={[baseStyle, headingStyle]}>
            {line}
          </Text>
        );
      }
      if (line.includes("**")) {
        return (
          <Text style={baseStyle}>
            {renderTextWithBold(line, baseStyle, boldStyle)}
          </Text>
        );
      }
      return (
        <Text style={baseStyle}>
          {line}
        </Text>
      );
    })();

    if (showInlinePlay && inlineAudio) {
      return (
        <View key={i} style={styles.inlineAudioRow}>
          <View style={styles.inlineAudioTextWrap}>{lineContent}</View>
          <Pressable
            onPress={() => inlineAudio.onPlay(inlineAudio.asset)}
            style={styles.inlinePlayBtn}
            accessibilityLabel="Play audio"
          >
            <Text style={styles.inlinePlayIcon}>🔊</Text>
          </Pressable>
        </View>
      );
    }

    return <React.Fragment key={i}>{lineContent}</React.Fragment>;
  });
}

function BookPageContent({
  pageIndex,
  meaningExpanded,
  onToggleMeaning,
  fontScale = 1,
  inlineAudioForLine,
  onPlayInlineAudio,
}: {
  pageIndex: number;
  meaningExpanded: boolean;
  onToggleMeaning: () => void;
  fontScale?: number;
  inlineAudioForLine?: { lineContains: string; asset: number };
  onPlayInlineAudio?: (asset: number) => void;
}) {
  const scaled = useMemo(
    () => ({
      sectionTitle: { fontSize: 17 * fontScale },
      sectionTitleEn: { fontSize: 13 * fontScale },
      note: { fontSize: 13 * fontScale },
      mantra: { fontSize: 15 * fontScale, lineHeight: 26 * fontScale },
      meaningToggle: { fontSize: 14 * fontScale },
      meaning: { fontSize: 14 * fontScale, lineHeight: 22 * fontScale },
    }),
    [fontScale]
  );
  if (pageIndex === 0) {
    return (
      <View style={[styles.pageContent, styles.firstPageContent]}>
        <Image
          source={gayatriMataImage}
          style={styles.gayatriImage}
          resizeMode="contain"
          accessibilityLabel="Gayatri Mata"
        />
        <Text style={styles.opening}>{opening}</Text>
        <Text style={[styles.firstPageSloka, scaled.mantra]}>{suklamBaradaram}</Text>
        <Text style={[styles.firstPageSloka, scaled.mantra]}>{gurushakshath}</Text>
      </View>
    );
  }

  const sectionIndex = pageIndex - 1;
  const sec = sandhyavandanamSections[sectionIndex] as Section;
  const hasMeaning = Boolean(sec.meaning?.trim());
  const isSmruthyachamanam = sectionIndex >= 1 && sectionIndex <= 5;
  const namasStart = isSmruthyachamanam
    ? AACHAMANAM_START_NUMBERS[sectionIndex - 1]
    : 1;
  const mantraLines = sec.mantra
    ? sec.mantra.split("\n").map((l) => l.trim()).filter(Boolean)
    : [];
  const isLastNamasPage = sectionIndex === 5 && mantraLines.length === 4;
  const mantraDisplay = sec.mantra
    ? isSmruthyachamanam
      ? numberMantraLines(
          sec.mantra,
          namasStart,
          isLastNamasPage ? 3 : undefined
        )
      : sec.mantra
    : "";
  const meaningDisplay = sec.meaning
    ? isSmruthyachamanam
      ? numberMeaningParagraphs(sec.meaning)
      : sec.meaning
    : "";

  const toggleMeaning = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggleMeaning();
  };

  return (
    <View style={styles.pageContent}>
      <Text style={[styles.sectionTitleTe, scaled.sectionTitle]}>{sec.titleTe}</Text>
      {sec.titleEn ? (
        <Text style={[styles.sectionTitleEn, scaled.sectionTitleEn]}>{sec.titleEn}</Text>
      ) : null}
      {sec.note ? <Text style={[styles.note, scaled.note]}>{sec.note}</Text> : null}
      {sec.mantra ? (
        <View style={styles.mantraBlock}>
          {renderMantraWithHeadings(
            mantraDisplay,
            [styles.mantra, scaled.mantra],
            styles.mantraBold,
            styles.mantraHeading,
            inlineAudioForLine && onPlayInlineAudio
              ? {
                  lineContains: inlineAudioForLine.lineContains,
                  asset: inlineAudioForLine.asset,
                  onPlay: onPlayInlineAudio,
                }
              : undefined
          )}
          {isLastNamasPage ? (
            <Text style={[styles.mantra, styles.mantraLastLineRight, scaled.mantra]}>
              {mantraLines[3]}
            </Text>
          ) : null}
        </View>
      ) : null}

      {hasMeaning ? (
        <View style={styles.meaningBlock}>
          <Pressable
            onPress={toggleMeaning}
            style={({ pressed }) => [
              styles.meaningToggle,
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.meaningToggleText, scaled.meaningToggle]}>
              {meaningExpanded ? "▼ అర్థం" : "▶ అర్థం"}
            </Text>
          </Pressable>
          {meaningExpanded ? (
            <Text style={[styles.meaning, scaled.meaning]}>{meaningDisplay}</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default function SandhyavandanamVidhanam({ navigation }: Props) {
  useKeepAwake();
  const route = useRoute<RouteProp<RootStackParamList, "SandhyavandanamVidhanam">>();
  const initialPage = route.params?.initialPage ?? 0;
  const [currentPage, setCurrentPage] = useState(() =>
    Math.min(Math.max(0, initialPage), TOTAL_PAGES - 1)
  );
  const [meaningExpanded, setMeaningExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const autoSlideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageScrollRef = useRef<ScrollView>(null);
  const kriyaScrollRef = useRef<ScrollView>(null);
  const {
    fontSize,
    setLastSection,
    refreshStreak,
    preferencesLoaded,
    hintsSeen,
    markHintsSeen,
    autoSlideEnabled,
  } = useApp();
  const fontScale = FONT_SCALE[fontSize];

  useEffect(() => {
    if (currentPage > 0) {
      const sec = sandhyavandanamSections[currentPage - 1];
      if (sec) {
        setLastSection(currentPage, sec.titleTe);
        refreshStreak();
      }
    }
  }, [currentPage, setLastSection, refreshStreak]);

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ y: 0, animated: false });
    kriyaScrollRef.current?.scrollTo({ y: 0, animated: false });
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

  const sectionIndex = currentPage > 0 ? currentPage - 1 : -1;
  const audioTracks = getSectionAudioTracks(sectionIndex);
  const hasAudio = audioTracks.length > 0;

  const playNextTrackRef = useRef<((trackIndex: number) => Promise<void>) | null>(null);

  const playTrack = useCallback(
    async (trackIndex: number) => {
      if (trackIndex >= audioTracks.length) {
        await stopAndUnload();
        return;
      }
      const source = audioTracks[trackIndex];
      try {
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: true,
        });
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
            if (nextIndex < audioTracks.length) {
              sound.unloadAsync().catch(() => {});
              soundRef.current = null;
              playNextTrackRef.current?.(nextIndex);
            } else {
              stopAndUnload();
            }
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

  playNextTrackRef.current = playTrack;

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

  const handlePlayInlineAudio = useCallback(
    async (asset: number) => {
      await stopAndUnload();
      try {
        const { sound } = await Audio.Sound.createAsync(asset, {
          shouldPlay: true,
        });
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (
            "isLoaded" in status &&
            status.isLoaded &&
            status.didJustFinish &&
            !status.isPlaying
          ) {
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
        });
      } catch (_) {}
    },
    [stopAndUnload]
  );

  useEffect(() => {
    stopAndUnload();
  }, [currentPage, stopAndUnload]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => {
      if (p >= TOTAL_PAGES - 1) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMeaningExpanded(false);
      return p + 1;
    });
  }, []);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => {
      if (p <= 0) return p;
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMeaningExpanded(false);
      return p - 1;
    });
  }, []);

  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  // Auto-slide: advance page after duration based on content length
  useEffect(() => {
    if (autoSlideTimerRef.current) {
      clearTimeout(autoSlideTimerRef.current);
      autoSlideTimerRef.current = null;
    }
    if (!autoSlideEnabled || currentPage >= TOTAL_PAGES - 1) return;
    const section = currentPage > 0 ? sandhyavandanamSections[currentPage - 1] : null;
    let contentLen = 0;
    if (currentPage === 0) {
      contentLen = opening.length + suklamBaradaram.length + gurushakshath.length;
    } else if (section) {
      contentLen = (section.mantra?.length ?? 0) + (section.kriya?.length ?? 0);
    }
    const durationMs = Math.min(90000, Math.max(6000, Math.round((contentLen / 25) * 1000)));
    autoSlideTimerRef.current = setTimeout(() => {
      autoSlideTimerRef.current = null;
      goNext();
    }, durationMs);
    return () => {
      if (autoSlideTimerRef.current) {
        clearTimeout(autoSlideTimerRef.current);
        autoSlideTimerRef.current = null;
      }
    };
  }, [currentPage, autoSlideEnabled]);

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

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < TOTAL_PAGES - 1;
  const currentSection =
    currentPage > 0 ? sandhyavandanamSections[currentPage - 1] : null;
  const currentSectionIndex = currentPage > 0 ? currentPage - 1 : -1;
  const kriyaAvailable = Boolean(currentSection?.kriya?.trim());
  const kriyaText = currentSection?.kriya ?? "";
  const isKriyaSmruthyachamanam =
    currentSectionIndex >= 1 && currentSectionIndex <= 5;
  const kriyaDisplay =
    kriyaAvailable && isKriyaSmruthyachamanam
      ? numberKriyaSteps(kriyaText)
      : kriyaText;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${(currentPage / (TOTAL_PAGES - 1)) * 100}%` },
          ]}
        />
      </View>
      <View style={[styles.topBar, isLandscape && styles.topBarLandscape]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={[styles.backBtnText, isLandscape && styles.backBtnTextLandscape]}>← Contents</Text>
        </Pressable>
        <Pressable
          onPress={handlePlayPause}
          disabled={!hasAudio}
          style={({ pressed }) => [
            styles.speakerBtn,
            isLandscape && styles.speakerBtnLandscape,
            !hasAudio && styles.speakerBtnDisabled,
            pressed && hasAudio && styles.pressed,
          ]}
          accessibilityLabel={hasAudio ? "Play section audio" : "No audio for this section"}
        >
          {audioLoading ? (
            <ActivityIndicator size="small" color={colors.goldLight} />
          ) : (
            <Text style={[styles.speakerIcon, isLandscape && styles.speakerIconLandscape, !hasAudio && styles.speakerIconDisabled]}>
              {isPlaying ? "⏹" : "🔊"}
            </Text>
          )}
        </Pressable>
      </View>

      <View style={[styles.mainContentWrapper, isLandscape && styles.mainContentWrapperLandscape]}>
        <View
          style={[
            styles.contentHalf,
            !kriyaAvailable && styles.contentHalfFull,
            isLandscape && styles.contentHalfLandscape,
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.bookPage}>
            <ScrollView
              ref={pageScrollRef}
              style={styles.pageScroll}
              contentContainerStyle={styles.pageScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <BookPageContent
                pageIndex={currentPage}
                meaningExpanded={meaningExpanded}
                onToggleMeaning={() => setMeaningExpanded((e) => !e)}
                fontScale={fontScale}
                inlineAudioForLine={
                  currentPage > 0 &&
                  sandhyavandanamSections[currentPage - 1].titleTe.includes(
                    "అర్ఘ్యప్రదానము"
                  )
                    ? {
                        lineContains: "పశ్చాత్ హస్తే జలమాదాయ ఉత్థాయ",
                        asset: INLINE_AUDIO_SUB1,
                      }
                    : undefined
                }
                onPlayInlineAudio={handlePlayInlineAudio}
              />
            </ScrollView>
            <Text style={styles.swipeCue}>← Swipe to turn page</Text>
          </View>
        </View>

        {kriyaAvailable ? (
          <View style={[styles.kriyaHalf, isLandscape && styles.kriyaHalfLandscape]}>
            <Text style={styles.kriyaLabel}>క్రియ</Text>
            <ScrollView
              ref={kriyaScrollRef}
              style={styles.kriyaScroll}
              contentContainerStyle={styles.kriyaScrollContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={[styles.kriyaText, { fontSize: 15 * fontScale, lineHeight: 24 * fontScale }]}>
                {kriyaDisplay}
              </Text>
            </ScrollView>
          </View>
        ) : null}
      </View>

      {/* Bottom nav bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={[
            styles.navBtn,
            !canGoPrev && styles.navBtnDisabled,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.navBtnText,
              !canGoPrev && styles.navBtnTextDisabled,
            ]}
          >
            Previous
          </Text>
        </Pressable>
        <Text style={styles.pageIndicator} numberOfLines={1}>
          Section {currentPage + 1} of {TOTAL_PAGES}
        </Text>
        <Pressable
          onPress={goNext}
          disabled={!canGoNext}
          style={[
            styles.navBtn,
            !canGoNext && styles.navBtnDisabled,
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.navBtnText,
              !canGoNext && styles.navBtnTextDisabled,
            ]}
          >
            Next
          </Text>
        </Pressable>
      </View>

      {preferencesLoaded && !hintsSeen && (
        <Modal visible={hintIndex < HINTS_LENGTH} transparent animationType="fade">
          <View style={styles.hintOverlay}>
            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>How to use</Text>
              <View style={styles.hintStepIndicator}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.hintStepDot,
                      i === hintIndex && styles.hintStepDotActive,
                      i < hintIndex && styles.hintStepDotDone,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.hintText}>
                {[
                  "Swipe left or right to turn pages",
                  "Tap 'అర్థం' to expand meaning",
                  "Tap speaker icon to play section audio",
                  "Turn on 'Auto slide' in Preferences (from Contents) to advance pages automatically by content length",
                ][hintIndex]}
              </Text>
              <Pressable
                style={({ pressed }) => [styles.hintBtn, pressed && styles.pressed]}
                onPress={() => {
                  if (hintIndex < 3) setHintIndex((i) => i + 1);
                  else markHintsSeen();
                }}
              >
                <Text style={styles.hintBtnText}>
                  {hintIndex < 3 ? "Next" : "Done"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
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
  topBarLandscape: {
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 12,
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
  backBtnTextLandscape: {
    fontSize: 13,
  },
  speakerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  speakerBtnLandscape: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 36,
  },
  speakerBtnDisabled: {
    opacity: 0.4,
  },
  speakerIcon: {
    fontSize: 22,
  },
  speakerIconLandscape: {
    fontSize: 18,
  },
  speakerIconDisabled: {
    opacity: 0.6,
  },
  swipeCue: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  mainContentWrapper: {
    flex: 1,
    minHeight: 0,
  },
  mainContentWrapperLandscape: {
    flexDirection: "row",
  },
  contentHalf: {
    flex: 65,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  contentHalfLandscape: {
    flex: 1,
    minWidth: 0,
    paddingBottom: 8,
  },
  contentHalfFull: {
    flex: 1,
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
  gayatriImage: {
    width: 120,
    height: 160,
    marginBottom: 20,
  },
  opening: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },
  firstPageSloka: {
    color: colors.accent,
    textAlign: "center",
    marginTop: 16,
  },
  sectionTitleTe: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 4,
  },
  sectionTitleEn: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
  },
  note: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textMuted,
    marginBottom: 8,
  },
  mantraBlock: {
    gap: 0,
  },
  mantra: {
    fontSize: 15,
    lineHeight: 26,
    color: colors.text,
  },
  mantraBold: {
    fontWeight: "700",
  },
  mantraHeading: {
    fontWeight: "700",
    color: colors.text,
  },
  inlineAudioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 2,
  },
  inlineAudioTextWrap: {
    flex: 1,
  },
  inlinePlayBtn: {
    padding: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  inlinePlayIcon: {
    fontSize: 18,
  },
  mantraLastLineRight: {
    alignSelf: "flex-end",
    textAlign: "right",
    marginTop: 12,
    paddingRight: 8,
  },
  meaningBlock: {
    marginTop: 16,
  },
  meaningToggle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.paperDark,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  meaningToggleText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "600",
  },
  meaning: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    fontStyle: "italic",
    marginTop: 12,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.border,
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnDisabled: {
    backgroundColor: colors.surfaceLight,
    opacity: 0.6,
  },
  navBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.goldLight,
    textAlign: "center",
  },
  navBtnTextDisabled: {
    color: colors.textOnDarkMuted,
  },
  pageIndicator: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    fontWeight: "600",
  },
  hintOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 28,
  },
  hintCard: {
    backgroundColor: colors.paper,
    borderRadius: 16,
    padding: 28,
    borderWidth: 2,
    borderColor: colors.gold,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  hintTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.accent,
    textAlign: "center",
    marginBottom: 4,
  },
  hintSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  hintStepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  hintStepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.paperDark,
  },
  hintStepDotActive: {
    width: 28,
    backgroundColor: colors.gold,
  },
  hintStepDotDone: {
    backgroundColor: colors.accent,
  },
  hintText: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 10,
  },
  hintTextEn: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  hintBtn: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  hintBtnText: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  hintBtnEn: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  kriyaHalf: {
    flex: 35,
    minHeight: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.gold,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  kriyaHalfLandscape: {
    flex: 1,
    minWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 2,
    borderLeftColor: colors.gold,
  },
  kriyaScroll: {
    flex: 1,
  },
  kriyaScrollContent: {
    paddingBottom: 16,
  },
  kriyaLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.goldLight,
    marginBottom: 8,
  },
  kriyaText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textOnDark,
    textAlign: "left",
    paddingHorizontal: 4,
  },
});
