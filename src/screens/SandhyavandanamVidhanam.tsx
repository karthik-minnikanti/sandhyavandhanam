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
  FlatList,
} from "react-native";
import { Audio } from "expo-av";
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
import { getSectionAudio } from "../audio/sectionAudio";
import { useApp } from "../context/AppContext";
import type { FontSize } from "../storage/keys";

const gayatriMataImage = require("../../assets/gayatri-mata.jpg");

const SWIPE_THRESHOLD = 50;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FONT_SCALE: Record<FontSize, number> = { small: 0.9, medium: 1, large: 1.15 };
const HINTS_LENGTH = 3;

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

function BookPageContent({
  pageIndex,
  meaningExpanded,
  onToggleMeaning,
  fontScale = 1,
}: {
  pageIndex: number;
  meaningExpanded: boolean;
  onToggleMeaning: () => void;
  fontScale?: number;
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
          <Text style={[styles.mantra, scaled.mantra]}>
            {typeof mantraDisplay === "string" && mantraDisplay.includes("**")
              ? renderTextWithBold(mantraDisplay, styles.mantra, styles.mantraBold)
              : mantraDisplay}
          </Text>
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
  const route = useRoute<RouteProp<RootStackParamList, "SandhyavandanamVidhanam">>();
  const initialPage = route.params?.initialPage ?? 0;
  const [currentPage, setCurrentPage] = useState(() =>
    Math.min(Math.max(0, initialPage), TOTAL_PAGES - 1)
  );
  const [meaningExpanded, setMeaningExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [tocVisible, setTocVisible] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const {
    fontSize,
    setFontSize,
    setLastSection,
    refreshStreak,
    hintsSeen,
    markHintsSeen,
    showHintsAgain,
    reminder,
    setReminder,
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
  const audioSource = getSectionAudio(sectionIndex);
  const hasAudio = audioSource !== undefined;

  const handlePlayPause = useCallback(async () => {
    if (!hasAudio) return;
    if (isPlaying || audioLoading) {
      await stopAndUnload();
      return;
    }
    setAudioLoading(true);
    try {
      await stopAndUnload();
      const { sound } = await Audio.Sound.createAsync(
        audioSource as number,
        { shouldPlay: true }
      );
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
  }, [hasAudio, isPlaying, audioLoading, audioSource, stopAndUnload]);

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
          accessibilityLabel={hasAudio ? "Play section audio" : "No audio for this section"}
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

      <View
        style={[styles.contentHalf, !kriyaAvailable && styles.contentHalfFull]}
        {...panResponder.panHandlers}
      >
        <View style={styles.bookPage}>
          <ScrollView
            style={styles.pageScroll}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <BookPageContent
              pageIndex={currentPage}
              meaningExpanded={meaningExpanded}
              onToggleMeaning={() => setMeaningExpanded((e) => !e)}
              fontScale={fontScale}
            />
          </ScrollView>
          <Text style={styles.swipeCue}>← Swipe to turn page</Text>
        </View>
      </View>

      {kriyaAvailable ? (
        <View style={styles.kriyaHalf}>
          <Text style={styles.kriyaLabel}>క్రియ</Text>
          <ScrollView
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

      {/* Bottom nav bar */}
      <View style={styles.navBar}>
        <Pressable
          onPress={() => setTocVisible(true)}
          style={({ pressed }) => [styles.navBarIconBtn, pressed && styles.pressed]}
          accessibilityLabel="Sections"
        >
          <Text style={styles.navBarIconBtnText}>☰</Text>
        </Pressable>
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

      <Modal visible={tocVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setTocVisible(false)} />
          <View style={styles.tocModal}>
            <Text style={styles.tocModalTitle}>విషయ సూచిక</Text>
            <Text style={styles.tocSectionLabel}>Font size</Text>
            <View style={styles.fontSizeRow}>
              {(["small", "medium", "large"] as const).map((size) => (
                <Pressable
                  key={size}
                  style={[
                    styles.fontSizeBtn,
                    fontSize === size && styles.fontSizeBtnActive,
                  ]}
                  onPress={() => setFontSize(size)}
                >
                  <Text
                    style={[
                      styles.fontSizeBtnText,
                      fontSize === size && styles.fontSizeBtnTextActive,
                    ]}
                  >
                    {size === "small" ? "Small" : size === "medium" ? "Medium" : "Large"}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.tocSectionLabel}>Daily reminder</Text>
            <Pressable
              style={[
                styles.reminderBtn,
                reminder.enabled && styles.reminderBtnActive,
              ]}
              onPress={() =>
                setReminder(!reminder.enabled, reminder.hour, reminder.minute)
              }
            >
              <Text style={styles.reminderBtnText}>
                {reminder.enabled
                  ? `On – ${reminder.hour}:${String(reminder.minute).padStart(2, "0")} (సంధ్యావందనం)`
                  : "Off – Tap to enable"}
              </Text>
            </Pressable>
            <Text style={styles.tocSectionLabel}>Tips</Text>
            <Pressable
              style={({ pressed }) => [styles.showHintsAgainBtn, pressed && styles.pressed]}
              onPress={() => {
                showHintsAgain();
                setHintIndex(0);
                setTocVisible(false);
              }}
            >
              <Text style={styles.showHintsAgainBtnText}>
                ఎలా వాడాలి మళ్ళీ చూడండి / Show tips again
              </Text>
            </Pressable>
            <FlatList
              data={sandhyavandanamSections}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item, index }) => (
                <Pressable
                  style={({ pressed }) => [styles.tocItem, pressed && styles.pressed]}
                  onPress={() => {
                    setCurrentPage(index + 1);
                    setTocVisible(false);
                  }}
                >
                  <Text style={styles.tocItemText} numberOfLines={1}>{item.titleTe}</Text>
                </Pressable>
              )}
              style={styles.tocList}
            />
            <Pressable style={styles.tocCloseBtn} onPress={() => setTocVisible(false)}>
              <Text style={styles.tocCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {!hintsSeen && (
        <Modal visible={hintIndex < HINTS_LENGTH} transparent animationType="fade">
          <View style={styles.hintOverlay}>
            <View style={styles.hintCard}>
              <Text style={styles.hintTitle}>ఎలా వాడాలి</Text>
              <Text style={styles.hintSubtitle}>How to use</Text>
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
                  "పేజీలు మార్చడానికి ఎడమ / కుడి స్వైప్ చేయండి",
                  "అర్థం చూడడానికి 'అర్థం' పై టాప్ చేయండి",
                  "ఆడియో వినడానికి స్పీకర్ నొక్కండి"
                ][hintIndex]}
              </Text>
              <Text style={styles.hintTextEn}>
                {[
                  "Swipe left or right to turn pages",
                  "Tap 'అర్థం' to expand meaning",
                  "Tap speaker icon to play section audio"
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
                  {hintIndex < 3 ? "తర్వాత →" : "పూర్తి"}
                </Text>
              </Pressable>
              <Text style={styles.hintBtnEn}>
                {hintIndex < 3 ? "Next" : "Done"}
              </Text>
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
  swipeCue: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  contentHalf: {
    flex: 65,
    paddingHorizontal: 16,
    paddingTop: 12,
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
  navBarIconBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.surface,
    borderRadius: 6,
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navBarIconBtnText: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.goldLight,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 24,
  },
  tocModal: {
    backgroundColor: colors.paper,
    borderRadius: 12,
    maxHeight: "80%",
    padding: 16,
  },
  tocModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.accent,
    marginBottom: 12,
  },
  tocSectionLabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  fontSizeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  fontSizeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.paperDark,
  },
  fontSizeBtnActive: {
    backgroundColor: colors.gold,
  },
  fontSizeBtnText: {
    fontSize: 13,
    color: colors.text,
  },
  fontSizeBtnTextActive: {
    fontWeight: "600",
    color: colors.text,
  },
  reminderBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.paperDark,
    marginBottom: 12,
  },
  reminderBtnActive: {
    backgroundColor: colors.surfaceLight,
  },
  reminderBtnText: {
    fontSize: 14,
    color: colors.text,
  },
  showHintsAgainBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.paperDark,
    marginBottom: 12,
  },
  showHintsAgainBtnText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tocList: { maxHeight: 400 },
  tocItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tocItemText: {
    fontSize: 15,
    color: colors.text,
  },
  tocCloseBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
  },
  tocCloseText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.goldLight,
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
