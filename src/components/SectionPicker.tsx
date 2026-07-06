import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { colors } from "../theme/colors";

export type SectionPickerItem = {
  label: string;
  page: number;
};

type Props = {
  visible: boolean;
  title?: string;
  sections: SectionPickerItem[];
  currentPage: number;
  onSelect: (page: number) => void;
  onClose: () => void;
};

export default function SectionPicker({
  visible,
  title = "Jump to section",
  sections,
  currentPage,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.close}>✕</Text>
            </Pressable>
          </View>
          <FlatList
            data={sections}
            keyExtractor={(item) => String(item.page)}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const selected = item.page === currentPage;
              return (
                <Pressable
                  style={({ pressed }) => [
                    styles.row,
                    selected && styles.rowSelected,
                    pressed && styles.rowPressed,
                  ]}
                  onPress={() => {
                    onSelect(item.page);
                    onClose();
                  }}
                >
                  <Text style={styles.rowPage}>{item.page + 1}</Text>
                  <Text
                    style={[styles.rowLabel, selected && styles.rowLabelSelected]}
                    numberOfLines={2}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    maxHeight: "70%",
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  close: {
    fontSize: 18,
    color: colors.textOnDarkMuted,
    paddingHorizontal: 4,
  },
  list: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  rowSelected: {
    backgroundColor: colors.background,
  },
  rowPressed: {
    opacity: 0.85,
  },
  rowPage: {
    width: 28,
    fontSize: 13,
    fontWeight: "600",
    color: colors.gold,
    textAlign: "center",
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    color: colors.textOnDark,
    lineHeight: 18,
  },
  rowLabelSelected: {
    color: colors.goldLight,
    fontWeight: "600",
  },
});
