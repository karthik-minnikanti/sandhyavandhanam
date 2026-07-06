import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  label: string;
  onPress: () => void;
};

/** Tappable page indicator — opens section picker. */
export default function PageIndicatorButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      accessibilityLabel="Jump to section"
      hitSlop={8}
    >
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    maxWidth: 140,
  },
  btnPressed: {
    opacity: 0.75,
  },
  text: {
    fontSize: 13,
    color: colors.textOnDarkMuted,
    fontWeight: "600",
    textAlign: "center",
  },
});
