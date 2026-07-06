import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useApp } from "../context/AppContext";
import { useContentPacks } from "../context/ContentPackContext";
import type { ContentPackId } from "../contentPacks/types";
import { isAudioPackPublished } from "../contentPacks/manifest";
import {
  CONTENTS_GROUPS,
  findCatalogItem,
  findGroupForScreen,
  getCatalogItemsForScreens,
  type CatalogItem,
  type DeityGroup,
} from "../content/catalog";
import DeityIconBox from "../components/DeityIconBox";
import ContinueReadingLink from "../components/ContinueReadingLink";
import FavoriteStarButton from "../components/FavoriteStarButton";
import { navigateToCatalogItem } from "../utils/catalogNavigation";
import {
  contentInsetStyle,
  contentInnerWidth,
} from "../utils/contentLayout";
import { getSelectedContentsGroup, setSelectedContentsGroup } from "../storage/preferences";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "TableOfContents">;
};

const GRID_GAP = 12;
const GRID_COLUMNS = 3;
const TILE_RADIUS = 12;

function DeityGridTile({
  group,
  width,
  iconWidth,
  selected,
  expanded,
  onPress,
}: {
  group: DeityGroup;
  width: number;
  iconWidth: number;
  selected: boolean;
  expanded?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [{ width }, pressed && styles.tilePressed]}
      onPress={onPress}
      accessibilityLabel={group.deityEn}
    >
      <View
        style={[
          styles.tile,
          selected && !expanded && styles.tileSelected,
          selected && expanded && styles.tileExpanded,
        ]}
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
      </View>
    </Pressable>
  );
}

function CatalogListItem({
  item,
  onOpen,
  onDownload,
  packStatus,
  embedded,
}: {
  item: CatalogItem;
  onOpen: () => void;
  onDownload: (packId: ContentPackId) => void;
  packStatus: { downloaded: number; total: number; downloading: boolean } | null;
  embedded?: boolean;
}) {
  const isComplete =
    packStatus != null &&
    packStatus.total > 0 &&
    packStatus.downloaded >= packStatus.total;
  const isDownloading = packStatus?.downloading ?? false;
  const showDownload =
    item.audioPackId != null &&
    isAudioPackPublished(item.audioPackId) &&
    Platform.OS !== "web";

  return (
    <View style={[styles.listItem, embedded && styles.listItemEmbedded]}>
      <Pressable
        style={({ pressed }) => [styles.listItemMain, pressed && styles.listItemPressed]}
        onPress={onOpen}
      >
        <Text style={styles.listItemTe}>{item.titleTe}</Text>
        <Text style={styles.listItemEn}>{item.titleEn}</Text>
        {item.description ? (
          <Text style={styles.listItemDesc}>{item.description}</Text>
        ) : null}
        {packStatus && isDownloading && showDownload ? (
          <Text style={styles.audioStatus}>
            {packStatus.downloaded}/{packStatus.total}
          </Text>
        ) : null}
      </Pressable>
      <FavoriteStarButton screenKey={item.key} size={18} />
      {showDownload ? (
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
  const { lastSection, favorites } = useApp();
  const { progress, downloadPack } = useContentPacks();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupLoaded, setGroupLoaded] = useState(false);
  const [favouritesOpen, setFavouritesOpen] = useState(false);

  const innerWidth = contentInnerWidth(screenWidth);

  const continueReading = useMemo(() => {
    if (!lastSection) return null;
    const item = findCatalogItem(lastSection.screenKey);
    if (!item) return null;
    return { item, page: lastSection.page };
  }, [lastSection]);

  const favoriteItems = useMemo(
    () => getCatalogItemsForScreens(favorites),
    [favorites]
  );

  const openItem = useCallback(
    (item: CatalogItem, explicitPage?: number) => {
      const resumePage =
        explicitPage ??
        (lastSection?.screenKey === item.key ? lastSection.page : undefined);
      navigateToCatalogItem(navigation.navigate, item, resumePage);
    },
    [navigation, lastSection]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await getSelectedContentsGroup();
      if (cancelled) return;
      if (saved) {
        setSelectedGroupId(saved);
      } else if (lastSection) {
        const group = findGroupForScreen(lastSection.screenKey);
        if (group) setSelectedGroupId(group.id);
      }
      setGroupLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [lastSection]);

  const handleTilePress = useCallback((group: DeityGroup) => {
    setSelectedGroupId((current) => {
      const next = current === group.id ? null : group.id;
      setSelectedContentsGroup(next);
      return next;
    });
  }, []);

  const tileWidth =
    (innerWidth - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;
  const iconWidth = Math.min(72, Math.round(tileWidth - 8));

  const handleOpenItem = useCallback(
    (item: CatalogItem) => {
      openItem(item);
    },
    [openItem]
  );

  const handleContinue = useCallback(() => {
    if (!continueReading) return;
    openItem(continueReading.item, continueReading.page);
  }, [openItem, continueReading]);

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

  const deityRows = useMemo(() => {
    const rows: DeityGroup[][] = [];
    for (let i = 0; i < CONTENTS_GROUPS.length; i += GRID_COLUMNS) {
      rows.push(CONTENTS_GROUPS.slice(i, i + GRID_COLUMNS));
    }
    return rows;
  }, []);

  const renderListPanel = (group: DeityGroup) => (
    <View style={styles.listPanel}>
      <Text style={styles.listPanelTitle}>{group.deityTe}</Text>
      <Text style={styles.listPanelSubtitle}>{group.deityEn}</Text>
      {group.items.map((item) => (
        <CatalogListItem
          key={item.key}
          item={item}
          onOpen={() => handleOpenItem(item)}
          onDownload={handleDownloadAudio}
          packStatus={
            item.audioPackId && isAudioPackPublished(item.audioPackId)
              ? progress[item.audioPackId]
              : null
          }
          embedded
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, contentInsetStyle(screenWidth)]}>
        <Pressable
          onPress={() => navigation.navigate("BookCover")}
          style={({ pressed }) => [styles.coverBackBtn, pressed && styles.coverBackBtnPressed]}
          accessibilityLabel="Back to cover"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={20} color={colors.goldLight} />
        </Pressable>
        <View style={styles.headerTextBlock}>
          <Text style={styles.headerTitle}>Contents</Text>
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
        contentContainerStyle={[
          styles.scrollContent,
          contentInsetStyle(screenWidth),
        ]}
        showsVerticalScrollIndicator={false}
      >
        {continueReading ? (
          <ContinueReadingLink
            title={continueReading.item.titleTe}
            page={continueReading.page}
            onPress={handleContinue}
            align="left"
          />
        ) : null}

        {favoriteItems.length > 0 ? (
          <View style={styles.favouritesPanel}>
            <Pressable
              style={({ pressed }) => [
                styles.favouritesHeader,
                pressed && styles.listItemPressed,
              ]}
              onPress={() => setFavouritesOpen((open) => !open)}
              accessibilityLabel={
                favouritesOpen ? "Collapse favourites" : "Expand favourites"
              }
            >
              <Text style={styles.favouritesHeaderText}>
                Favourites ({favoriteItems.length})
              </Text>
              <Feather
                name={favouritesOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color={colors.goldLight}
              />
            </Pressable>
            {favouritesOpen
              ? favoriteItems.map((item) => (
                  <View key={item.key} style={styles.favouriteRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.favouriteRowMain,
                        pressed && styles.listItemPressed,
                      ]}
                      onPress={() => openItem(item)}
                    >
                      <Text style={styles.favouriteRowTitle} numberOfLines={1}>
                        {item.titleTe}
                      </Text>
                    </Pressable>
                    <FavoriteStarButton screenKey={item.key} size={16} />
                  </View>
                ))
              : null}
          </View>
        ) : null}

        {deityRows.map((row, rowIndex) => {
          const rowExpanded =
            selectedGroup != null && row.some((g) => g.id === selectedGroup.id);

          return (
            <View key={rowIndex} style={styles.rowBlock}>
              <View style={styles.gridRow}>
                {row.map((group) => {
                  const isSelected = selectedGroupId === group.id;
                  return (
                    <DeityGridTile
                      key={group.id}
                      group={group}
                      width={tileWidth}
                      iconWidth={iconWidth}
                      selected={isSelected}
                      expanded={isSelected && rowExpanded}
                      onPress={() => handleTilePress(group)}
                    />
                  );
                })}
              </View>
              {rowExpanded && selectedGroup
                ? renderListPanel(selectedGroup)
                : null}
            </View>
          );
        })}

        {!selectedGroup && groupLoaded ? (
          <Text style={styles.gridHint}>Tap a deity to see available texts</Text>
        ) : null}
      </ScrollView>
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
    paddingTop: Platform.OS === "ios" ? 52 : 40,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceLight,
  },
  coverBackBtn: {
    paddingVertical: 4,
    paddingRight: 4,
    marginRight: 4,
  },
  coverBackBtnPressed: {
    opacity: 0.7,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  menuBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  menuBtnPressed: {
    opacity: 0.8,
  },
  menuBtnText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.goldLight,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 28,
  },
  favouritesPanel: {
    marginBottom: 14,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    overflow: "hidden",
  },
  favouritesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  favouritesHeaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.goldLight,
  },
  favouriteRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  favouriteRowMain: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 12,
    paddingRight: 4,
  },
  favouriteRowTitle: {
    fontSize: 13,
    color: colors.textOnDark,
  },
  gridRow: {
    flexDirection: "row",
    gap: GRID_GAP,
  },
  rowBlock: {
    marginBottom: GRID_GAP,
  },
  tile: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tileSelected: {
    backgroundColor: colors.surface,
    borderRadius: TILE_RADIUS,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
  },
  tileExpanded: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: TILE_RADIUS,
    borderTopRightRadius: TILE_RADIUS,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.surfaceLight,
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
    backgroundColor: colors.surface,
    borderBottomLeftRadius: TILE_RADIUS,
    borderBottomRightRadius: TILE_RADIUS,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.surfaceLight,
    overflow: "hidden",
    marginTop: -1,
    paddingHorizontal: 12,
    paddingTop: 2,
    paddingBottom: 10,
  },
  listPanelTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.goldLight,
    paddingTop: 4,
  },
  listPanelSubtitle: {
    fontSize: 11,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  listItemEmbedded: {
    borderTopWidth: 0,
    marginTop: 4,
    paddingTop: 4,
  },
  listItemMain: {
    flex: 1,
    paddingVertical: 9,
    paddingRight: 6,
  },
  listItemPressed: {
    opacity: 0.9,
  },
  listItemTe: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textOnDark,
  },
  listItemEn: {
    fontSize: 11,
    color: colors.textOnDarkMuted,
    marginTop: 1,
  },
  listItemDesc: {
    fontSize: 10,
    color: colors.textOnDarkMuted,
    marginTop: 2,
    lineHeight: 14,
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
});
