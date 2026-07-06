import React from "react";
import { View, Text, StyleSheet, type TextStyle, type StyleProp } from "react-native";
import { colors } from "../theme/colors";
import { splitMantraLines } from "../utils/mantraLines";

type Props = {
  mantra: string;
  style?: StyleProp<TextStyle>;
  lineStyle?: StyleProp<TextStyle>;
};

export default function MantraText({ mantra, style, lineStyle }: Props) {
  const lines = splitMantraLines(mantra);

  return (
    <View style={styles.block}>
      {lines.map((line, i) => (
        <Text key={i} style={[styles.line, style, lineStyle]}>
          {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
  },
  line: {
    fontSize: 15,
    lineHeight: 28,
    color: colors.text,
    textAlign: "left",
    width: "100%",
  },
});
