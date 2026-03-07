import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";

const gayatriMataImage = require("../../assets/gayatri-mata.jpg");
const AUTO_OPEN_DELAY_MS = 1500;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "BookCover">;
};

export default function BookCover({ navigation }: Props) {
  const { height } = useWindowDimensions();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.navigate("TableOfContents");
    }, AUTO_OPEN_DELAY_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigation]);

  const openBook = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    navigation.navigate("TableOfContents");
  };

  return (
    <Pressable
      style={[styles.cover, { minHeight: height }]}
      onPress={openBook}
    >
      {/* Book spine */}
      <View style={styles.spine}>
        <View style={styles.spineStrip} />
      </View>

      {/* Main cover content */}
      <View style={styles.coverInner}>
        <View style={styles.frame}>
          <Text style={styles.om}>ॐ</Text>
          <Image
            source={gayatriMataImage}
            style={styles.gayatriImage}
            resizeMode="contain"
            accessibilityLabel="Gayatri Mata"
          />
          <View style={styles.divider} />
          <Text style={styles.title}>సంధ్యావందనం</Text>
          <Text style={styles.titleEn}>Sandhyavandanam</Text>
          <View style={styles.subtitleBlock}>
            <Text style={styles.subtitle}>సంధ్యావందన విధానం</Text>
            <Text style={styles.subtitle}>యజ్ఞోపవీత ధారణ విధిః</Text>
          </View>
        </View>
      </View>
    </Pressable>
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
    paddingVertical: 32,
    paddingHorizontal: 28,
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
    fontSize: 28,
    color: colors.goldLight,
    marginBottom: 12,
    fontWeight: "300",
  },
  gayatriImage: {
    width: 160,
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
    overflow: "hidden",
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
    marginBottom: 20,
    borderRadius: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.goldLight,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 1,
  },
  titleEn: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textOnDarkMuted,
    marginBottom: 16,
    letterSpacing: 3,
  },
  subtitleBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    lineHeight: 22,
    opacity: 0.95,
  },
});
