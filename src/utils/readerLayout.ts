import { Platform, type ViewStyle } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

/** Bottom nav padding — respects gesture bar & 3-button navigation. */
export function readerNavBarStyle(insets: EdgeInsets): ViewStyle {
  return {
    paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 8 : 12),
  };
}

/** Top bar padding — status bar & notch. */
export function readerTopBarStyle(insets: EdgeInsets): ViewStyle {
  const base = Platform.OS === "ios" ? 8 : 10;
  return {
    paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 44 : 36) + base,
  };
}
