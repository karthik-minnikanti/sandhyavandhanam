import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  page: number;
  onPress: () => void;
  align?: "left" | "center";
};

export default function ContinueReadingLink({
  title,
  page,
  onPress,
  align = "center",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        align === "left" ? styles.linkLeft : styles.linkCenter,
        pressed && styles.linkPressed,
      ]}
      accessibilityLabel={`Continue reading ${title}, page ${page + 1}`}
      hitSlop={6}
    >
      <Text style={styles.text} numberOfLines={1}>
        → Continue · {title} · p.{page + 1}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  linkCenter: {
    alignSelf: "center",
  },
  linkLeft: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  linkPressed: {
    opacity: 0.75,
  },
  text: {
    fontSize: 12,
    color: colors.goldLight,
    textAlign: "center",
  },
});
