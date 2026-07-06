import React, { useCallback } from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import type { CatalogScreen } from "../content/catalog";
import { colors } from "../theme/colors";

type Props = {
  screenKey: CatalogScreen;
  size?: number;
};

export default function FavoriteStarButton({ screenKey, size = 20 }: Props) {
  const { favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(screenKey);

  const handlePress = useCallback(() => {
    toggleFavorite(screenKey);
  }, [screenKey, toggleFavorite]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
      accessibilityLabel={isFavorite ? "Remove from favourites" : "Add to favourites"}
    >
      <Text
        style={[
          styles.star,
          { fontSize: size },
          isFavorite ? styles.starOn : styles.starOff,
        ]}
      >
        {isFavorite ? "★" : "☆"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    opacity: 0.7,
  },
  star: {
    lineHeight: undefined,
  },
  starOn: {
    color: colors.gold,
  },
  starOff: {
    color: colors.textOnDarkMuted,
  },
});
