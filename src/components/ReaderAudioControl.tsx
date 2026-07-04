import React, { useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useContentPacks } from "../context/ContentPackContext";
import type { ContentPackId } from "../contentPacks/types";
import { colors } from "../theme/colors";

type Props = {
  packId: ContentPackId;
  hasAudio: boolean;
  isPlaying: boolean;
  audioLoading: boolean;
  onPlayPause: () => void;
  compact?: boolean;
};

export default function ReaderAudioControl({
  packId,
  hasAudio,
  isPlaying,
  audioLoading,
  onPlayPause,
  compact = false,
}: Props) {
  const { progress, downloadPack } = useContentPacks();
  const packStatus = progress[packId];
  const isComplete =
    packStatus.total > 0 && packStatus.downloaded >= packStatus.total;
  const isDownloading = packStatus.downloading;
  const showDownload = hasAudio && Platform.OS !== "web" && !isComplete;

  const handleDownload = useCallback(async () => {
    try {
      await downloadPack(packId);
    } catch {
      // Error is reflected in pack progress.
    }
  }, [downloadPack, packId]);

  if (!hasAudio) {
    return (
      <View style={[styles.btn, styles.btnDisabled, compact && styles.btnCompact]}>
        <Text
          style={[
            styles.speakerIcon,
            styles.iconDisabled,
            compact && styles.iconCompact,
          ]}
        >
          🔊
        </Text>
      </View>
    );
  }

  if (showDownload) {
    return (
      <Pressable
        onPress={handleDownload}
        disabled={isDownloading}
        style={({ pressed }) => [
          styles.btn,
          compact && styles.btnCompact,
          isDownloading && styles.btnDisabled,
          pressed && !isDownloading && styles.pressed,
        ]}
        accessibilityLabel="Download audio"
      >
        {isDownloading ? (
          <View style={styles.downloadRow}>
            <ActivityIndicator size="small" color={colors.textOnDarkMuted} />
            <Text style={[styles.downloadLabel, compact && styles.downloadLabelCompact]}>
              Downloading…
            </Text>
          </View>
        ) : (
          <View style={styles.downloadRow}>
            <Feather
              name="download"
              size={compact ? 14 : 15}
              color={colors.textOnDarkMuted}
            />
            <Text style={[styles.downloadLabel, compact && styles.downloadLabelCompact]}>
              Download audio
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPlayPause}
      disabled={audioLoading}
      style={({ pressed }) => [
        styles.btn,
        compact && styles.btnCompact,
        pressed && styles.pressed,
      ]}
      accessibilityLabel={isPlaying ? "Stop audio" : "Play section audio"}
    >
      {audioLoading ? (
        <ActivityIndicator size="small" color={colors.goldLight} />
      ) : (
        <Text style={[styles.speakerIcon, compact && styles.iconCompact]}>
          {isPlaying ? "⏹" : "🔊"}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  btnCompact: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 36,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  speakerIcon: {
    fontSize: 22,
  },
  iconCompact: {
    fontSize: 18,
  },
  iconDisabled: {
    opacity: 0.6,
  },
  downloadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  downloadLabel: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    fontWeight: "500",
  },
  downloadLabelCompact: {
    fontSize: 12,
  },
});
