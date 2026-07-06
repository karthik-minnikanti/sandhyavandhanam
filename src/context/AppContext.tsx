import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { FontSize } from "../storage/keys";
import {
  getFontSize,
  setFontSize as persistFontSize,
  getLastSection,
  setLastSection as persistLastSection,
  getStreak,
  updateStreak as persistUpdateStreak,
  getIntroSeen,
  setIntroSeen as persistIntroSeen,
  getHintsSeen,
  setHintsSeen as persistHintsSeen,
  getReminder,
  setReminder as persistReminder,
  getAutoSlideEnabled,
  setAutoSlideEnabled as persistAutoSlideEnabled,
} from "../storage/preferences";
import { scheduleDailyReminder, cancelReminder } from "../notifications/reminder";
import type { CatalogScreen, LastReading } from "../content/catalog";

type AppState = {
  preferencesLoaded: boolean;
  fontSize: FontSize;
  lastSection: LastReading | null;
  streak: number;
  introSeen: boolean;
  hintsSeen: boolean;
  reminder: { enabled: boolean; hour: number; minute: number };
  autoSlideEnabled: boolean;
};

type AppContextValue = AppState & {
  setFontSize: (v: FontSize) => Promise<void>;
  setLastSection: (screenKey: CatalogScreen, page: number, title: string) => Promise<void>;
  refreshLastSection: () => Promise<void>;
  refreshStreak: () => Promise<void>;
  markIntroSeen: () => Promise<void>;
  markHintsSeen: () => Promise<void>;
  showHintsAgain: () => Promise<void>;
  setReminder: (enabled: boolean, hour: number, minute: number) => Promise<void>;
  refreshReminder: () => Promise<void>;
  setAutoSlideEnabled: (v: boolean) => Promise<void>;
};

const screenshotMode = process.env.EXPO_PUBLIC_SCREENSHOT_MODE === "1";

const defaultState: AppState = {
  preferencesLoaded: false,
  fontSize: "medium",
  lastSection: null,
  streak: 0,
  introSeen: false,
  hintsSeen: false,
  reminder: { enabled: false, hour: 6, minute: 0 },
  autoSlideEnabled: false,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const load = useCallback(async () => {
    const [fontSize, lastSection, streak, introSeen, hintsSeen, reminder, autoSlideEnabled] = await Promise.all([
      getFontSize(),
      getLastSection(),
      getStreak(),
      getIntroSeen(),
      getHintsSeen(),
      getReminder(),
      getAutoSlideEnabled(),
    ]);
    setState({
      preferencesLoaded: true,
      fontSize,
      lastSection,
      streak: streak.count,
      introSeen: screenshotMode ? true : introSeen,
      hintsSeen: screenshotMode ? true : hintsSeen,
      reminder,
      autoSlideEnabled,
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setFontSize = useCallback(async (v: FontSize) => {
    await persistFontSize(v);
    setState((s) => ({ ...s, fontSize: v }));
  }, []);

  const setLastSection = useCallback(
    async (screenKey: CatalogScreen, page: number, title: string) => {
      await persistLastSection(screenKey, page, title);
      setState((s) => ({ ...s, lastSection: { screenKey, page, title } }));
    },
    []
  );

  const refreshLastSection = useCallback(async () => {
    const last = await getLastSection();
    setState((s) => ({ ...s, lastSection: last }));
  }, []);

  const refreshStreak = useCallback(async () => {
    const next = await persistUpdateStreak();
    setState((s) => ({ ...s, streak: next }));
  }, []);

  const markIntroSeen = useCallback(async () => {
    await persistIntroSeen(true);
    setState((s) => ({ ...s, introSeen: true }));
  }, []);

  const markHintsSeen = useCallback(async () => {
    await persistHintsSeen(true);
    setState((s) => ({ ...s, hintsSeen: true }));
  }, []);

  const showHintsAgain = useCallback(async () => {
    await persistHintsSeen(false);
    setState((s) => ({ ...s, hintsSeen: false }));
  }, []);

  const setReminder = useCallback(async (enabled: boolean, hour: number, minute: number) => {
    await persistReminder(enabled, hour, minute);
    setState((s) => ({ ...s, reminder: { enabled, hour, minute } }));
    if (enabled) {
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelReminder();
    }
  }, []);

  const refreshReminder = useCallback(async () => {
    const reminder = await getReminder();
    setState((s) => ({ ...s, reminder }));
  }, []);

  const setAutoSlideEnabled = useCallback(async (v: boolean) => {
    await persistAutoSlideEnabled(v);
    setState((s) => ({ ...s, autoSlideEnabled: v }));
  }, []);

  const value: AppContextValue = {
    ...state,
    setFontSize,
    setLastSection,
    refreshLastSection,
    refreshStreak,
    markIntroSeen,
    markHintsSeen,
    showHintsAgain,
    setReminder,
    refreshReminder,
    setAutoSlideEnabled,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
