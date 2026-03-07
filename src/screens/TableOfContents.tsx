import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TableOfContents">;
};

const chapters = [
  {
    key: "SandhyavandanamVidhanam" as const,
    titleTe: "కృష్ణ యజుర్వేద సంధ్యావందనం",
    titleEn: "Sandhyavandanam Vidhanam",
    description: "Krishna Yajurveda — full text, Pratah / Madhyahnika / Sayam",
  },
  {
    key: "YagnopaveetamVidhi" as const,
    titleTe: "యజ్ఞోపవీత ధారణ విధిః",
    titleEn: "Yagnopaveetha Dharana Vidhi",
    description: "Sacred thread wearing procedure — full text",
  },
];

export default function TableOfContents({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contents</Text>
        <Text style={styles.headerSubtitle}>విషయ సూచిక</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((ch, i) => (
          <Pressable
            key={ch.key}
            style={({ pressed }) => [
              styles.chapterCard,
              pressed && styles.chapterCardPressed,
            ]}
            onPress={() => navigation.navigate(ch.key)}
          >
            <View style={styles.chapterNumber}>
              <Text style={styles.chapterNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.chapterBody}>
              <Text style={styles.chapterTitleTe}>{ch.titleTe}</Text>
              <Text style={styles.chapterTitleEn}>{ch.titleEn}</Text>
              <Text style={styles.chapterDesc}>{ch.description}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>← Back to cover</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textOnDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    marginTop: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  chapterCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  chapterCardPressed: {
    opacity: 0.9,
  },
  chapterNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.gold,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  chapterNumberText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  chapterBody: {
    flex: 1,
  },
  chapterTitleTe: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.goldLight,
    marginBottom: 4,
  },
  chapterTitleEn: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textOnDark,
    marginBottom: 6,
  },
  chapterDesc: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    lineHeight: 20,
  },
  backBtn: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    paddingVertical: 14,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnPressed: {
    opacity: 0.9,
  },
  backBtnText: {
    color: colors.textOnDark,
    fontWeight: "600",
    fontSize: 15,
  },
});
