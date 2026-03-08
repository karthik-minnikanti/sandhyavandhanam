import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import { useApp } from "../context/AppContext";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Preferences">;
};

export default function Preferences({ navigation }: Props) {
  const {
    fontSize,
    setFontSize,
    reminder,
    setReminder,
    autoSlideEnabled,
    setAutoSlideEnabled,
    showHintsAgain,
  } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Preferences</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Font size</Text>
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

        <Text style={styles.sectionLabel}>Daily reminder</Text>
        <Pressable
          style={[
            styles.optionBtn,
            reminder.enabled && styles.optionBtnActive,
          ]}
          onPress={() =>
            setReminder(!reminder.enabled, reminder.hour, reminder.minute)
          }
        >
          <Text style={styles.optionBtnText}>
            {reminder.enabled
              ? `On – ${reminder.hour}:${String(reminder.minute).padStart(2, "0")} (సంధ్యావందనం)`
              : "Off – Tap to enable"}
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Auto slide</Text>
        <Pressable
          style={[
            styles.optionBtn,
            autoSlideEnabled && styles.optionBtnActive,
          ]}
          onPress={() => setAutoSlideEnabled(!autoSlideEnabled)}
        >
          <Text style={styles.optionBtnText}>
            {autoSlideEnabled
              ? "On – Pages advance by content length"
              : "Off – Tap to enable"}
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Tips</Text>
        <Pressable
          style={({ pressed }) => [styles.optionBtn, pressed && styles.pressed]}
          onPress={() => showHintsAgain()}
        >
          <Text style={styles.showHintsAgainText}>
            Show tips again
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 52 : 44,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginRight: 12,
  },
  pressed: { opacity: 0.8 },
  backBtnText: {
    color: colors.goldLight,
    fontSize: 14,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textOnDark,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    marginBottom: 6,
    marginTop: 16,
  },
  fontSizeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  fontSizeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  fontSizeBtnActive: {
    backgroundColor: colors.gold,
  },
  fontSizeBtnText: {
    fontSize: 13,
    color: colors.textOnDark,
  },
  fontSizeBtnTextActive: {
    fontWeight: "600",
    color: colors.text,
  },
  optionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 4,
  },
  optionBtnActive: {
    backgroundColor: colors.surfaceLight,
  },
  optionBtnText: {
    fontSize: 14,
    color: colors.textOnDark,
  },
  showHintsAgainText: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
  },
});
