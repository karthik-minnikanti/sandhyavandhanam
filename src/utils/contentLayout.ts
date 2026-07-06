import { type ViewStyle } from "react-native";
import { useWindowDimensions } from "react-native";

/** Max readable line width — content centers with wider side margins on large screens. */
export const CONTENT_MAX_WIDTH = 440;

const MIN_SIDE_GUTTER = 16;

export function contentHorizontalPadding(screenWidth: number): number {
  if (screenWidth <= CONTENT_MAX_WIDTH + MIN_SIDE_GUTTER * 2) {
    return MIN_SIDE_GUTTER;
  }
  return (screenWidth - CONTENT_MAX_WIDTH) / 2;
}

export function contentInsetStyle(screenWidth: number): ViewStyle {
  return { paddingHorizontal: contentHorizontalPadding(screenWidth) };
}

/** Inner width for grids/lists inside a padded column. */
export function contentInnerWidth(screenWidth: number): number {
  const pad = contentHorizontalPadding(screenWidth);
  return screenWidth - pad * 2;
}

export function useContentLayout() {
  const { width: screenWidth } = useWindowDimensions();
  return {
    screenWidth,
    contentInset: contentInsetStyle(screenWidth),
    bookPageFrame: {
      maxWidth: CONTENT_MAX_WIDTH,
      width: "100%" as const,
      alignSelf: "center" as const,
    },
  };
}
