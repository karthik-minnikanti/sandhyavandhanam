import React, { useState, useCallback, useRef, useEffect } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import {
  yagnopaveethaOpening,
  yagnopaveethaDharanaSections,
} from "../content/yagnopaveethaDharanaVidhi";
import { useApp } from "../context/AppContext";
import ReaderOnboarding, {
  SWIPE_NAV_ONBOARDING_STEPS,
} from "../components/ReaderOnboarding";
import { readerNavBarStyle, readerTopBarStyle } from "../utils/readerLayout";
import { useReaderPageSwipe } from "../hooks/useReaderPageSwipe";
import DeityIconBox from "../components/DeityIconBox";
import { DEITY_ICONS } from "../content/deityIcons";

const dharanaImage = DEITY_ICONS.gayatri;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "YagnopaveetamVidhi">;
};

const TOTAL_PAGES = yagnopaveethaDharanaSections.length + 1;

function PageContent({ pageIndex }: { pageIndex: number }) {
  if (pageIndex === 0) {
    return (
      <View style={[styles.pageContent, styles.firstPageContent]}>
        <DeityIconBox
          source={dharanaImage}
          width={120}
          aspectRatio={1.33}
          style={styles.dharanaImage}
          accessibilityLabel="Yagnopaveetha Dharana"
        />
        <Text style={styles.opening}>{yagnopaveethaOpening}</Text>
        <Text style={styles.bookPageHint}>యజ్ఞోపవీత ధారణ విధిః →</Text>
      </View>
    );
  }
  const sec = yagnopaveethaDharanaSections[pageIndex - 1];
  return (
    <View style={styles.pageContent}>
      <Text style={styles.sectionTitleTe}>{sec.titleTe}</Text>
      {sec.titleEn ? (
        <Text style={styles.sectionTitleEn}>{sec.titleEn}</Text>
      ) : null}
      <Text style={styles.mantra}>{sec.mantra}</Text>
    </View>
  );
}

export default function YagnopaveetamVidhi({ navigation }: Props) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const { preferencesLoaded, hintsSeen, markHintsSeen } = useApp();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!hintsSeen) setHintIndex(0);
  }, [hintsSeen]);

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
  const kriyaAvailable = false; // set true when kriya content is provided

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, readerTopBarStyle(insets)]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backBtnText}>← Contents</Text>
        </Pressable>
      </View>

      <View
        style={[styles.contentHalf, !kriyaAvailable && styles.contentHalfFull]}
        {...pageSwipe.panHandlers}
      >
        <View style={styles.bookPage}>
          <ScrollView
            style={styles.pageScroll}
            contentContainerStyle={styles.pageScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <PageContent pageIndex={currentPage} />
          </ScrollView>
        </View>
      </View>

      {kriyaAvailable ? (
        <View style={styles.kriyaHalf}>
          <Text style={styles.kriyaLabel}>క్రియ</Text>
          <Text style={styles.kriyaPlaceholder}>
            యజ్ఞోపవీత ధారణ క్రియ — steps / actions
          </Text>
        </View>
      ) : null}

      <View style={[styles.navBar, readerNavBarStyle(insets)]}>
        <Pressable
          onPress={goPrev}
          disabled={!canGoPrev}
          style={[styles.navBtn, !canGoPrev && styles.navBtnDisabled]}
        >
          <Text
            style={[styles.navBtnText, !canGoPrev && styles.navBtnTextDisabled]}
          >
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
          <Text
            style={[styles.navBtnText, !canGoNext && styles.navBtnTextDisabled]}
          >
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
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
  dharanaImage: {
    marginBottom: 20,
  },
  opening: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 24,
  },
  bookPageHint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 32,
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
  mantra: {
    fontSize: 15,
    lineHeight: 26,
    color: colors.text,
  },
  kriyaHalf: {
    flex: 35,
    backgroundColor: colors.surface,
    borderTopWidth: 2,
    borderTopColor: colors.gold,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  kriyaLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.goldLight,
    marginBottom: 8,
  },
  kriyaPlaceholder: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    textAlign: "center",
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
