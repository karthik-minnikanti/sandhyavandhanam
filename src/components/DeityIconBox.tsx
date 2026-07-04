import React from "react";
import {
  View,
  Image,
  StyleSheet,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

type Props = {
  source: ImageSourcePropType;
  width: number;
  /** height / width — portrait boxes show faces better than squares. */
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export default function DeityIconBox({
  source,
  width,
  aspectRatio = 1.25,
  style,
  accessibilityLabel,
}: Props) {
  const height = Math.round(width * aspectRatio);

  return (
    <View style={[styles.box, { width, height }, style]}>
      <Image
        source={source}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderColor: colors.gold,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: "hidden",
    padding: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
