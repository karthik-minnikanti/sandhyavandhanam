import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS, type FontSize } from "./keys";
import type { CatalogScreen, LastReading } from "../content/catalog";
import {
  findCatalogItemByTitle,
  isCatalogScreen,
} from "../content/catalog";

const get = async <T>(key: string, fallback: T): Promise<T> => {
  try {
    const v = await AsyncStorage.getItem(key);
    if (v == null) return fallback;
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};

const set = async (key: string, value: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};

export const getFontSize = () => get<FontSize>(STORAGE_KEYS.FONT_SIZE, "medium");
export const setFontSize = (v: FontSize) => set(STORAGE_KEYS.FONT_SIZE, v);

export const getLastSection = async (): Promise<LastReading | null> => {
  const page = await get<number>(STORAGE_KEYS.LAST_SECTION_PAGE, -1);
  const title = await get<string>(STORAGE_KEYS.LAST_SECTION_TITLE, "");
  const screenKeyRaw = await get<string>(STORAGE_KEYS.LAST_SECTION_SCREEN, "");
  if (page < 0 || !title) return null;

  if (isCatalogScreen(screenKeyRaw)) {
    return { screenKey: screenKeyRaw, page, title };
  }

  const match = findCatalogItemByTitle(title);
  if (match) {
    const migrated: LastReading = {
      screenKey: match.item.key,
      page,
      title,
    };
    await setLastSection(migrated.screenKey, page, title);
    return migrated;
  }

  return null;
};

export const setLastSection = async (
  screenKey: CatalogScreen,
  page: number,
  title: string
) => {
  await set(STORAGE_KEYS.LAST_SECTION_PAGE, page);
  await set(STORAGE_KEYS.LAST_SECTION_TITLE, title);
  await set(STORAGE_KEYS.LAST_SECTION_SCREEN, screenKey);
};

const today = () => new Date().toISOString().slice(0, 10);

export const getStreak = async (): Promise<{ count: number; lastDate: string }> => {
  const count = await get<number>(STORAGE_KEYS.STREAK_COUNT, 0);
  const lastDate = await get<string>(STORAGE_KEYS.STREAK_LAST_DATE, "");
  return { count, lastDate };
};

export const updateStreak = async (): Promise<number> => {
  const { count, lastDate } = await getStreak();
  const t = today();
  if (lastDate === t) return count;
  const prev = lastDate ? new Date(lastDate) : null;
  const now = new Date(t);
  const diffDays = prev ? Math.floor((now.getTime() - prev.getTime()) / 86400000) : 999;
  let next = count;
  if (diffDays === 0) next = count;
  else if (diffDays === 1) next = count + 1;
  else next = 1;
  await set(STORAGE_KEYS.STREAK_COUNT, next);
  await set(STORAGE_KEYS.STREAK_LAST_DATE, t);
  return next;
};

export const getIntroSeen = () => get<boolean>(STORAGE_KEYS.INTRO_SEEN, false);
export const setIntroSeen = (v: boolean) => set(STORAGE_KEYS.INTRO_SEEN, v);

export const getHintsSeen = () => get<boolean>(STORAGE_KEYS.HINTS_SEEN, false);
export const setHintsSeen = (v: boolean) => set(STORAGE_KEYS.HINTS_SEEN, v);

export const getReminder = async (): Promise<{ enabled: boolean; hour: number; minute: number }> => {
  const enabled = await get<boolean>(STORAGE_KEYS.REMINDER_ENABLED, false);
  const hour = await get<number>(STORAGE_KEYS.REMINDER_HOUR, 6);
  const minute = await get<number>(STORAGE_KEYS.REMINDER_MINUTE, 0);
  return { enabled, hour, minute };
};
export const setReminder = async (enabled: boolean, hour: number, minute: number) => {
  await set(STORAGE_KEYS.REMINDER_ENABLED, enabled);
  await set(STORAGE_KEYS.REMINDER_HOUR, hour);
  await set(STORAGE_KEYS.REMINDER_MINUTE, minute);
};

export const getAutoSlideEnabled = () => get<boolean>(STORAGE_KEYS.AUTO_SLIDE_ENABLED, false);
export const setAutoSlideEnabled = (v: boolean) => set(STORAGE_KEYS.AUTO_SLIDE_ENABLED, v);

export const getSelectedContentsGroup = () =>
  get<string | null>(STORAGE_KEYS.SELECTED_CONTENTS_GROUP, null);
export const setSelectedContentsGroup = (groupId: string | null) =>
  set(STORAGE_KEYS.SELECTED_CONTENTS_GROUP, groupId);

export const getFavorites = () =>
  get<CatalogScreen[]>(STORAGE_KEYS.FAVORITES, []);
export const setFavorites = (keys: CatalogScreen[]) =>
  set(STORAGE_KEYS.FAVORITES, keys);
