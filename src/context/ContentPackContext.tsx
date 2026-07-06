import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import {
  countCachedFiles,
  deleteContentPack,
  downloadContentPack,
  resolveAudioSource,
  resolveAudioTracks,
} from "../contentPacks/download";
import { CONTENT_PACK_LIST } from "../contentPacks/manifest";
import type {
  AudioUriSource,
  ContentPackId,
  ContentPackProgress,
} from "../contentPacks/types";

type ContentPackContextValue = {
  ready: boolean;
  progress: Record<ContentPackId, ContentPackProgress>;
  refreshProgress: () => Promise<void>;
  resolveAudioSource: (
    packId: ContentPackId,
    repoPath: string
  ) => Promise<AudioUriSource>;
  resolveAudioTracks: (
    packId: ContentPackId,
    repoPaths: readonly string[]
  ) => Promise<AudioUriSource[]>;
  downloadPack: (packId: ContentPackId) => Promise<void>;
  deletePack: (packId: ContentPackId) => Promise<void>;
};

const defaultProgress = (): ContentPackProgress => ({
  downloaded: 0,
  total: 0,
  downloading: false,
  error: null,
});

const ContentPackContext = createContext<ContentPackContextValue | null>(null);

export function ContentPackProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Record<ContentPackId, ContentPackProgress>>({
    "sandhyavandanam-audio": defaultProgress(),
    "lalitha-audio": defaultProgress(),
    "dakshinamurthy-audio": defaultProgress(),
    "lingashtakam-audio": defaultProgress(),
    "arunachala-audio": defaultProgress(),
    "chandrasekhara-audio": defaultProgress(),
    "jyotirlinga-audio": defaultProgress(),
  });

  const refreshProgress = useCallback(async () => {
    const next: Record<ContentPackId, ContentPackProgress> = {
      "sandhyavandanam-audio": defaultProgress(),
      "lalitha-audio": defaultProgress(),
      "dakshinamurthy-audio": defaultProgress(),
      "lingashtakam-audio": defaultProgress(),
      "arunachala-audio": defaultProgress(),
      "chandrasekhara-audio": defaultProgress(),
      "jyotirlinga-audio": defaultProgress(),
    };

    for (const pack of CONTENT_PACK_LIST) {
      const downloaded =
        Platform.OS === "web" ? 0 : await countCachedFiles(pack.id);
      next[pack.id] = {
        downloaded,
        total: pack.files.length,
        downloading: false,
        error: null,
      };
    }

    setProgress(next);
    setReady(true);
  }, []);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const downloadPack = useCallback(
    async (packId: ContentPackId) => {
      setProgress((current) => ({
        ...current,
        [packId]: {
          ...current[packId],
          downloading: true,
          error: null,
        },
      }));

      try {
        await downloadContentPack(packId, (downloaded, total) => {
          setProgress((current) => ({
            ...current,
            [packId]: {
              ...current[packId],
              downloaded,
              total,
              downloading: true,
              error: null,
            },
          }));
        });
        await refreshProgress();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Download failed";
        setProgress((current) => ({
          ...current,
          [packId]: {
            ...current[packId],
            downloading: false,
            error: message,
          },
        }));
        throw error;
      }
    },
    [refreshProgress]
  );

  const deletePack = useCallback(
    async (packId: ContentPackId) => {
      await deleteContentPack(packId);
      await refreshProgress();
    },
    [refreshProgress]
  );

  const resolveAudioSourceWithRefresh = useCallback(
    async (packId: ContentPackId, repoPath: string) => {
      const source = await resolveAudioSource(packId, repoPath);
      await refreshProgress();
      return source;
    },
    [refreshProgress]
  );

  const resolveAudioTracksWithRefresh = useCallback(
    async (packId: ContentPackId, repoPaths: readonly string[]) => {
      const tracks = await resolveAudioTracks(packId, repoPaths);
      await refreshProgress();
      return tracks;
    },
    [refreshProgress]
  );

  const value = useMemo<ContentPackContextValue>(
    () => ({
      ready,
      progress,
      refreshProgress,
      resolveAudioSource: resolveAudioSourceWithRefresh,
      resolveAudioTracks: resolveAudioTracksWithRefresh,
      downloadPack,
      deletePack,
    }),
    [
      ready,
      progress,
      refreshProgress,
      resolveAudioSourceWithRefresh,
      resolveAudioTracksWithRefresh,
      downloadPack,
      deletePack,
    ]
  );

  return (
    <ContentPackContext.Provider value={value}>
      {children}
    </ContentPackContext.Provider>
  );
}

export function useContentPacks() {
  const ctx = useContext(ContentPackContext);
  if (!ctx) {
    throw new Error("useContentPacks must be used within ContentPackProvider");
  }
  return ctx;
}
