import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

export type OnboardingStepKind =
  | "swipe"
  | "nav"
  | "meaning"
  | "speaker"
  | "preferences";

export type OnboardingStep = {
  kind: OnboardingStepKind;
  title: string;
  body: string;
};

export const SANDHYA_ONBOARDING_STEPS: OnboardingStep[] = [
  {
    kind: "swipe",
    title: "Turn pages",
    body: "Swipe left or right on the reading area.",
  },
  {
    kind: "nav",
    title: "Previous / Next",
    body: "You can also use the buttons at the bottom.",
  },
  {
    kind: "meaning",
    title: "Meaning",
    body: "Tap ‘అర్థం’ to expand the meaning.",
  },
  {
    kind: "speaker",
    title: "Audio",
    body: "Tap the speaker icon at the top to play section audio.",
  },
  {
    kind: "preferences",
    title: "Settings",
    body: "Open ☰ from Contents to change font size, reminders, and more.",
  },
];

export const BASIC_READER_ONBOARDING_STEPS: OnboardingStep[] =
  SANDHYA_ONBOARDING_STEPS.filter((s) => s.kind !== "meaning");

export const SWIPE_NAV_ONBOARDING_STEPS: OnboardingStep[] =
  SANDHYA_ONBOARDING_STEPS.filter(
    (s) =>
      s.kind === "swipe" || s.kind === "nav" || s.kind === "preferences"
  );

type Props = {
  visible: boolean;
  steps: OnboardingStep[];
  stepIndex: number;
  onNext: () => void;
  onDone: () => void;
};

function SwipeDemo() {
  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shift, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shift, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shift]);

  const pageShift = shift.interpolate({
    inputRange: [0, 1],
    outputRange: [-28, 28],
  });

  return (
    <View style={styles.demoSwipeWrap}>
      <Text style={styles.demoSwipeArrow}>←</Text>
      <Animated.View
        style={[styles.demoPage, { transform: [{ translateX: pageShift }] }]}
      >
        <View style={styles.demoPageLine} />
        <View style={[styles.demoPageLine, styles.demoPageLineShort]} />
        <View style={styles.demoFinger}>
          <Text>👆</Text>
        </View>
      </Animated.View>
      <Text style={styles.demoSwipeArrow}>→</Text>
    </View>
  );
}

function NavDemo({ bottomInset }: { bottomInset: number }) {
  return (
    <View style={[styles.demoNavShell, { paddingBottom: bottomInset }]}>
      <View style={styles.demoNavBar}>
        <View style={styles.demoNavBtn}>
          <Text style={styles.demoNavBtnText}>Previous</Text>
        </View>
        <Text style={styles.demoNavIndicator}>Section 1 of 26</Text>
        <View style={[styles.demoNavBtn, styles.demoNavBtnActive]}>
          <Text style={styles.demoNavBtnTextActive}>Next</Text>
        </View>
      </View>
    </View>
  );
}

export default function ReaderOnboarding({
  visible,
  steps,
  stepIndex,
  onNext,
  onDone,
}: Props) {
  const insets = useSafeAreaInsets();
  const step = steps[stepIndex];
  const isLast = stepIndex >= steps.length - 1;

  if (!step) return null;

  const showNavSpotlight = step.kind === "nav";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={[styles.overlay, showNavSpotlight && styles.overlayNavStep]}
      >
        {showNavSpotlight ? (
          <>
            <View style={styles.dimTop} />
            <View style={styles.demoNavArea}>
              <NavDemo bottomInset={Math.max(insets.bottom, 12)} />
            </View>
          </>
        ) : (
          <View style={styles.dimFull} />
        )}

        <View style={styles.card}>
          <Text style={styles.title}>How to use</Text>
          <Text style={styles.stepTitle}>{step.title}</Text>

          {step.kind === "swipe" ? <SwipeDemo /> : null}
          {step.kind === "speaker" ? (
            <View style={styles.demoSpeakerRow}>
              <Feather name="chevron-left" size={20} color={colors.goldLight} />
              <View style={styles.demoSpeakerBtn}>
                <Text style={styles.demoSpeakerIcon}>🔊</Text>
              </View>
            </View>
          ) : null}
          {step.kind === "meaning" ? (
            <View style={styles.demoMeaningBtn}>
              <Text style={styles.demoMeaningText}>అర్థం ▼</Text>
            </View>
          ) : null}
          {step.kind === "preferences" ? (
            <View style={styles.demoMenuRow}>
              <Text style={styles.demoMenuIcon}>☰</Text>
              <Text style={styles.demoMenuLabel}>Preferences</Text>
            </View>
          ) : null}

          <Text style={styles.body}>{step.body}</Text>

          <View style={styles.stepDots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === stepIndex && styles.dotActive,
                  i < stepIndex && styles.dotDone,
                ]}
              />
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            onPress={isLast ? onDone : onNext}
          >
            <Text style={styles.btnText}>{isLast ? "Done" : "Next"}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  overlayNavStep: {
    justifyContent: "flex-start",
    paddingTop: 56,
  },
  dimFull: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  dimTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.62)",
  },
  demoNavArea: {
    backgroundColor: "rgba(0,0,0,0.62)",
    borderTopWidth: 2,
    borderTopColor: colors.gold,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.paperDark,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textMuted,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 14,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    textAlign: "center",
    marginTop: 8,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.paperDark,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 20,
  },
  dotDone: {
    backgroundColor: colors.gold,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnPressed: { opacity: 0.85 },
  btnText: {
    color: colors.textOnDark,
    fontSize: 15,
    fontWeight: "600",
  },
  demoSwipeWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 4,
  },
  demoSwipeArrow: {
    fontSize: 22,
    color: colors.accent,
    fontWeight: "600",
  },
  demoPage: {
    width: 100,
    height: 72,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.gold,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  demoPageLine: {
    height: 4,
    width: "80%",
    backgroundColor: colors.paperDark,
    borderRadius: 2,
    marginVertical: 3,
  },
  demoPageLineShort: {
    width: "55%",
    alignSelf: "flex-start",
  },
  demoFinger: {
    position: "absolute",
    bottom: -6,
  },
  demoNavShell: {
    backgroundColor: colors.surface,
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  demoNavBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.gold,
    paddingTop: 10,
  },
  demoNavBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    minWidth: 76,
    alignItems: "center",
  },
  demoNavBtnActive: {
    backgroundColor: colors.accent,
  },
  demoNavBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textOnDarkMuted,
  },
  demoNavBtnTextActive: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  demoNavIndicator: {
    fontSize: 11,
    color: colors.textOnDarkMuted,
    fontWeight: "600",
  },
  demoSpeakerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 4,
  },
  demoSpeakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.gold,
  },
  demoSpeakerIcon: { fontSize: 18 },
  demoMeaningBtn: {
    alignSelf: "flex-start",
    backgroundColor: colors.paperDark,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  demoMeaningText: {
    color: colors.accent,
    fontWeight: "600",
    fontSize: 14,
  },
  demoMenuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 4,
  },
  demoMenuIcon: {
    fontSize: 22,
    color: colors.goldLight,
  },
  demoMenuLabel: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "600",
  },
});
