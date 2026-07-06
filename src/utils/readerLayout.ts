import { Platform, StyleSheet, type ViewStyle } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

/** Bottom nav padding — respects gesture bar & 3-button navigation. */
export function readerNavBarStyle(insets: EdgeInsets): ViewStyle {
  return {
    paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 4 : 6),
  };
}

/** Top bar padding — status bar & notch. */
export function readerTopBarStyle(insets: EdgeInsets): ViewStyle {
  const extra = Platform.OS === "ios" ? 2 : 4;
  return {
    paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 44 : 36) + extra,
  };
}

export const readerBarStyles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 4,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.gold,
  },
});
