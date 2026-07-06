import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import { useApp } from "../context/AppContext";
import DeityIconBox from "../components/DeityIconBox";
import { DEITY_ICONS } from "../content/deityIcons";
import ContinueReadingLink from "../components/ContinueReadingLink";
import { findCatalogItem } from "../content/catalog";
import { openReaderFromCover } from "../utils/catalogNavigation";

const gayatriMataImage = DEITY_ICONS.gayatri;
const AUTO_OPEN_DELAY_MS = 1500;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "BookCover">;
};

export default function BookCover({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    streak,
    lastSection,
    introSeen,
    preferencesLoaded,
    markIntroSeen,
  } = useApp();

  const continueReading = useMemo(() => {
    if (!lastSection) return null;
    const item = findCatalogItem(lastSection.screenKey);
    if (!item) return null;
    return { item, page: lastSection.page };
  }, [lastSection]);

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1") return;
    if (!preferencesLoaded) return;
    if (introSeen) return;
    if (continueReading) return;

    timerRef.current = setTimeout(() => {
      markIntroSeen();
      navigation.navigate("TableOfContents");
    }, AUTO_OPEN_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    navigation,
    introSeen,
    continueReading,
    preferencesLoaded,
    markIntroSeen,
  ]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openBook = () => {
    clearTimer();
    markIntroSeen();
    navigation.navigate("TableOfContents");
  };

  const openContinue = () => {
    if (!continueReading) return;
    clearTimer();
    markIntroSeen();
    openReaderFromCover(navigation, continueReading.item, continueReading.page);
  };

  return (
    <View style={[styles.cover, { minHeight: height }]}>
      <Pressable style={StyleSheet.absoluteFill} onPress={openBook}>
        <View style={styles.spine}>
          <View style={styles.spineStrip} />
        </View>

        <View style={styles.coverInner}>
          <View style={styles.frame}>
            <Text style={styles.om}>ॐ</Text>
            <DeityIconBox
              source={gayatriMataImage}
              width={140}
              aspectRatio={1.25}
              style={styles.gayatriImage}
              accessibilityLabel="Gayatri Mata"
            />
            <View style={styles.divider} />
            <Text style={styles.title}>వేదగాయత్రి</Text>
            <Text style={styles.titleEn}>VedGayatri</Text>
            <View style={styles.subtitleBlock}>
              <Text style={styles.subtitle}>కృష్ణ యజుర్వేద సంధ్యావందనం</Text>
              <Text style={styles.subtitle}>యజ్ఞోపవీత ధారణ విధిః</Text>
              <Text style={styles.subtitle}>శ్రీ లలితా సహస్ర నామ స్తోత్రం</Text>
              <Text style={styles.subtitle}>శ్రీ శివ స్తోత్రాలు</Text>
            </View>
            {streak > 0 ? (
              <Text style={styles.streakText}>ॐ {streak} day streak</Text>
            ) : null}
            {continueReading ? (
              <ContinueReadingLink
                title={continueReading.item.titleTe}
                page={continueReading.page}
                onPress={openContinue}
              />
            ) : (
              <Text style={styles.tapHint}>Tap to open</Text>
            )}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  spine: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 16,
    backgroundColor: colors.surfaceLight,
    borderRightWidth: 2,
    borderRightColor: colors.gold,
    justifyContent: "center",
  },
  spineStrip: {
    width: 4,
    alignSelf: "center",
    flex: 1,
    maxHeight: "60%",
    backgroundColor: colors.gold,
    opacity: 0.8,
    borderRadius: 2,
  },
  coverInner: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingLeft: 40,
  },
  frame: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 22,
    borderWidth: 2,
    borderColor: colors.gold,
    borderRadius: 16,
    backgroundColor: colors.surface,
    minWidth: 260,
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  om: {
    fontSize: 26,
    color: colors.goldLight,
    marginBottom: 8,
    fontWeight: "300",
  },
  gayatriImage: {
    marginBottom: 14,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
    marginBottom: 14,
    borderRadius: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.goldLight,
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: 1,
  },
  titleEn: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textOnDarkMuted,
    marginBottom: 12,
    letterSpacing: 2,
  },
  subtitleBlock: {
    alignItems: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    lineHeight: 20,
    opacity: 0.95,
    textAlign: "center",
  },
  streakText: {
    fontSize: 13,
    color: colors.gold,
    opacity: 0.9,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  tapHint: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    marginTop: 10,
    opacity: 0.8,
  },
});
