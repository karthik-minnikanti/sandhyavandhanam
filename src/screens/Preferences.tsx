import React, { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import { useApp } from "../context/AppContext";
import { useContentPacks } from "../context/ContentPackContext";
import { CONTENT_PACK_LIST } from "../contentPacks/manifest";

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
  const { progress, downloadPack, deletePack } = useContentPacks();

  const handleDownload = useCallback(
    async (packId: (typeof CONTENT_PACK_LIST)[number]["id"]) => {
      try {
        await downloadPack(packId);
      } catch {
        // Error state is shown on the pack row.
      }
    },
    [downloadPack]
  );

  const handleDelete = useCallback(
    async (packId: (typeof CONTENT_PACK_LIST)[number]["id"]) => {
      await deletePack(packId);
    },
    [deletePack]
  );

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
            Show how-to guide again
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Audio downloads</Text>
        <Text style={styles.sectionHint}>
          Audio is fetched from GitHub when you play a section. Download a pack
          here to keep it available offline.
        </Text>
        {CONTENT_PACK_LIST.map((pack) => {
          const status = progress[pack.id];
          const isComplete =
            status.total > 0 && status.downloaded >= status.total;
          return (
            <View key={pack.id} style={styles.packCard}>
              <Text style={styles.packTitle}>{pack.title}</Text>
              <Text style={styles.packTitleTe}>{pack.titleTe}</Text>
              <Text style={styles.packDescription}>{pack.description}</Text>
              <Text style={styles.packStatus}>
                {Platform.OS === "web"
                  ? "Streams from GitHub on web"
                  : status.downloading
                    ? `Downloading… ${status.downloaded}/${status.total}`
                    : isComplete
                      ? "Downloaded for offline use"
                      : status.downloaded > 0
                        ? `${status.downloaded}/${status.total} cached`
                        : "Not downloaded yet"}
              </Text>
              {status.error ? (
                <Text style={styles.packError}>{status.error}</Text>
              ) : null}
              <View style={styles.packActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.packActionBtn,
                    styles.packDownloadBtn,
                    (status.downloading || Platform.OS === "web") &&
                      styles.packActionBtnDisabled,
                    pressed && !status.downloading && styles.pressed,
                  ]}
                  disabled={status.downloading || Platform.OS === "web"}
                  onPress={() => handleDownload(pack.id)}
                >
                  {status.downloading ? (
                    <ActivityIndicator size="small" color={colors.text} />
                  ) : (
                    <Text style={styles.packDownloadText}>
                      {isComplete ? "Re-download" : "Download all"}
                    </Text>
                  )}
                </Pressable>
                {Platform.OS !== "web" && status.downloaded > 0 ? (
                  <Pressable
                    style={({ pressed }) => [
                      styles.packActionBtn,
                      styles.packDeleteBtn,
                      status.downloading && styles.packActionBtnDisabled,
                      pressed && styles.pressed,
                    ]}
                    disabled={status.downloading}
                    onPress={() => handleDelete(pack.id)}
                  >
                    <Text style={styles.packDeleteText}>Delete</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
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
  sectionHint: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    marginBottom: 8,
    lineHeight: 18,
  },
  packCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  packTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  packTitleTe: {
    fontSize: 13,
    color: colors.goldLight,
    marginTop: 2,
  },
  packDescription: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    marginTop: 6,
  },
  packStatus: {
    fontSize: 12,
    color: colors.textOnDark,
    marginTop: 8,
  },
  packError: {
    fontSize: 12,
    color: "#f87171",
    marginTop: 4,
  },
  packActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  packActionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 110,
    alignItems: "center",
  },
  packActionBtnDisabled: {
    opacity: 0.5,
  },
  packDownloadBtn: {
    backgroundColor: colors.gold,
  },
  packDownloadText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  packDeleteBtn: {
    backgroundColor: colors.surfaceLight,
  },
  packDeleteText: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
  },
});
