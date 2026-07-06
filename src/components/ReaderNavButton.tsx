import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../theme/colors";

type Props = {
  direction: "prev" | "next";
  disabled?: boolean;
  onPress: () => void;
};

export default function ReaderNavButton({ direction, disabled, onPress }: Props) {
  const isPrev = direction === "prev";
  const color = disabled ? colors.textOnDarkMuted : colors.goldLight;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, disabled && styles.btnDisabled]}
      accessibilityLabel={isPrev ? "Previous page" : "Next page"}
      hitSlop={6}
    >
      <View style={styles.content}>
        {isPrev ? (
          <Feather name="chevron-left" size={18} color={color} style={styles.iconPrev} />
        ) : null}
        <Text style={[styles.label, { color }]} numberOfLines={1}>
          {isPrev ? "Previous" : "Next"}
        </Text>
        {!isPrev ? (
          <Feather name="chevron-right" size={18} color={color} style={styles.iconNext} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    minWidth: 76,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPrev: {
    marginLeft: -6,
    marginRight: -1,
  },
  iconNext: {
    marginLeft: -1,
    marginRight: -6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
});
