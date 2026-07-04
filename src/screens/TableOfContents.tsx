import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { colors } from "../theme/colors";
import { useContentPacks } from "../context/ContentPackContext";
import type { ContentPackId } from "../contentPacks/types";
import {
  CONTENTS_GROUPS,
  type CatalogItem,
  type DeityGroup,
} from "../content/catalog";
import DeityIconBox from "../components/DeityIconBox";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TableOfContents">;
};

const GRID_GAP = 12;
const GRID_COLUMNS = 3;

function openCatalogItem(
  navigation: Props["navigation"],
  item: CatalogItem
) {
  if (item.supportsInitialPage) {
    navigation.navigate(item.key, undefined);
    return;
  }
  navigation.navigate(item.key);
}

function DeityGridTile({
  group,
  width,
  iconWidth,
  selected,
  onPress,
}: {
  group: DeityGroup;
  width: number;
  iconWidth: number;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        { width },
        selected && styles.tileSelected,
        pressed && styles.tilePressed,
      ]}
      onPress={onPress}
      accessibilityLabel={group.deityEn}
    >
      <View style={styles.iconWrap}>
        <DeityIconBox
          source={group.icon}
          width={iconWidth}
          aspectRatio={1.25}
          accessibilityLabel={group.deityEn}
        />
        {group.items.length > 1 ? (
          <View style={styles.itemCount}>
            <Text style={styles.itemCountText}>{group.items.length}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {group.gridLabelTe}
      </Text>
    </Pressable>
  );
}

function CatalogListItem({
  item,
  onOpen,
  onDownload,
  packStatus,
}: {
  item: CatalogItem;
  onOpen: () => void;
  onDownload: (packId: ContentPackId) => void;
  packStatus: { downloaded: number; total: number; downloading: boolean } | null;
}) {
  const isComplete =
    packStatus != null &&
    packStatus.total > 0 &&
    packStatus.downloaded >= packStatus.total;
  const isDownloading = packStatus?.downloading ?? false;

  return (
    <View style={styles.listItem}>
      <Pressable
        style={({ pressed }) => [styles.listItemMain, pressed && styles.listItemPressed]}
        onPress={onOpen}
      >
        <Text style={styles.listItemTe}>{item.titleTe}</Text>
        <Text style={styles.listItemEn}>{item.titleEn}</Text>
        {item.description ? (
          <Text style={styles.listItemDesc}>{item.description}</Text>
        ) : null}
        {packStatus && isDownloading && Platform.OS !== "web" ? (
          <Text style={styles.audioStatus}>
            {packStatus.downloaded}/{packStatus.total}
          </Text>
        ) : null}
      </Pressable>
      {item.audioPackId && Platform.OS !== "web" ? (
        <Pressable
          style={({ pressed }) => [
            styles.listDownload,
            isDownloading && styles.listDownloadDisabled,
            pressed && !isDownloading && styles.listDownloadPressed,
          ]}
          disabled={isDownloading}
          hitSlop={8}
          onPress={() => onDownload(item.audioPackId!)}
          accessibilityLabel={
            isComplete
              ? "Re-download audio"
              : isDownloading
                ? "Downloading audio"
                : "Download audio"
          }
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={colors.textOnDarkMuted} />
          ) : (
            <Feather
              name={isComplete ? "check" : "download"}
              size={15}
              color={isComplete ? colors.gold : colors.textOnDarkMuted}
            />
          )}
        </Pressable>
      ) : null}
    </View>
  );
}

export default function TableOfContents({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { progress, downloadPack } = useContentPacks();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  const tileWidth =
    (screenWidth - 48 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const iconWidth = Math.min(72, Math.round(tileWidth - 8));

  const handleOpenItem = useCallback(
    (item: CatalogItem) => {
      openCatalogItem(navigation, item);
    },
    [navigation]
  );

  const handleTilePress = useCallback((group: DeityGroup) => {
    setSelectedGroupId((current) => (current === group.id ? null : group.id));
  }, []);

  const handleDownloadAudio = useCallback(
    async (packId: ContentPackId) => {
      try {
        await downloadPack(packId);
      } catch {
        // Progress reflected in context; icon stays tappable to retry.
      }
    },
    [downloadPack]
  );

  const selectedGroup = CONTENTS_GROUPS.find((g) => g.id === selectedGroupId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Contents</Text>
          <Text style={styles.headerSubtitle}>విషయ సూచిక</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Preferences")}
          style={({ pressed }) => [styles.menuBtn, pressed && styles.menuBtnPressed]}
          accessibilityLabel="Preferences"
        >
          <Text style={styles.menuBtnText}>☰</Text>
        </Pressable>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {CONTENTS_GROUPS.map((group) => (
            <DeityGridTile
              key={group.id}
              group={group}
              width={tileWidth}
              iconWidth={iconWidth}
              selected={selectedGroupId === group.id}
              onPress={() => handleTilePress(group)}
            />
          ))}
        </View>

        {selectedGroup ? (
          <View style={styles.listPanel}>
            <Text style={styles.listPanelTitle}>{selectedGroup.deityTe}</Text>
            <Text style={styles.listPanelSubtitle}>{selectedGroup.deityEn}</Text>
            {selectedGroup.items.map((item) => (
              <CatalogListItem
                key={item.key}
                item={item}
                onOpen={() => handleOpenItem(item)}
                onDownload={handleDownloadAudio}
                packStatus={
                  item.audioPackId ? progress[item.audioPackId] : null
                }
              />
            ))}
          </View>
        ) : (
          <Text style={styles.gridHint}>Tap a deity to see available texts</Text>
        )}
      </ScrollView>
      <Pressable
        style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>← Back to cover</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textOnDark,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textOnDarkMuted,
    marginTop: 4,
  },
  menuBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  menuBtnPressed: {
    opacity: 0.8,
  },
  menuBtnText: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.goldLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GRID_GAP,
  },
  tile: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  tileSelected: {
    backgroundColor: colors.surface,
  },
  tilePressed: {
    opacity: 0.85,
  },
  iconWrap: {
    position: "relative",
    marginBottom: 8,
    alignItems: "center",
  },
  itemCount: {
    position: "absolute",
    right: -4,
    bottom: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  itemCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.goldLight,
    textAlign: "center",
  },
  gridHint: {
    marginTop: 24,
    fontSize: 13,
    color: colors.textOnDarkMuted,
    textAlign: "center",
  },
  listPanel: {
    marginTop: 20,
    padding: 14,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  listPanelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.goldLight,
  },
  listPanelSubtitle: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  listItemMain: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 8,
  },
  listItemPressed: {
    opacity: 0.9,
  },
  listItemTe: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  listItemEn: {
    fontSize: 12,
    color: colors.textOnDarkMuted,
    marginTop: 2,
  },
  listItemDesc: {
    fontSize: 11,
    color: colors.textOnDarkMuted,
    marginTop: 4,
    lineHeight: 16,
  },
  audioStatus: {
    fontSize: 11,
    color: colors.textOnDarkMuted,
    marginTop: 4,
  },
  listDownload: {
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  listDownloadDisabled: {
    opacity: 0.6,
  },
  listDownloadPressed: {
    opacity: 0.5,
  },
  backBtn: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    paddingVertical: 14,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    alignItems: "center",
  },
  backBtnPressed: {
    opacity: 0.9,
  },
  backBtnText: {
    color: colors.textOnDark,
    fontWeight: "600",
    fontSize: 15,
  },
});
