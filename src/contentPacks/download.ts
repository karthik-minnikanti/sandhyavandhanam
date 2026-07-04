import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { githubRawUrl } from "./config";
import { getContentPack } from "./manifest";
import type { AudioUriSource, ContentPackId } from "./types";

const VERSIONS_KEY = "@sandhyavandanam/contentPackVersions";
const CACHE_ROOT = `${FileSystem.documentDirectory ?? ""}content-packs/`;

type StoredVersions = Partial<Record<ContentPackId, number>>;

async function readStoredVersions(): Promise<StoredVersions> {
  try {
    const raw = await AsyncStorage.getItem(VERSIONS_KEY);
    return raw ? (JSON.parse(raw) as StoredVersions) : {};
  } catch {
    return {};
  }
}

async function writeStoredVersion(packId: ContentPackId, version: number): Promise<void> {
  const versions = await readStoredVersions();
  versions[packId] = version;
  await AsyncStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
}

async function invalidateIfStale(packId: ContentPackId): Promise<void> {
  const pack = getContentPack(packId);
  const versions = await readStoredVersions();
  if (versions[packId] === pack.version) return;

  const dir = `${CACHE_ROOT}${packId}`;
  const info = await FileSystem.getInfoAsync(dir);
  if (info.exists) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  }
  delete versions[packId];
  await AsyncStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
}

function localFilePath(packId: ContentPackId, repoPath: string): string {
  const fileName = repoPath.split("/").pop() ?? repoPath;
  return `${CACHE_ROOT}${packId}/${fileName}`;
}

export async function isFileCached(
  packId: ContentPackId,
  repoPath: string
): Promise<boolean> {
  if (Platform.OS === "web") return false;
  await invalidateIfStale(packId);
  const info = await FileSystem.getInfoAsync(localFilePath(packId, repoPath));
  return info.exists;
}

export async function countCachedFiles(packId: ContentPackId): Promise<number> {
  const pack = getContentPack(packId);
  let count = 0;
  for (const file of pack.files) {
    if (await isFileCached(packId, file)) count += 1;
  }
  return count;
}

export async function resolveAudioSource(
  packId: ContentPackId,
  repoPath: string
): Promise<AudioUriSource> {
  if (Platform.OS === "web") {
    return { uri: githubRawUrl(repoPath) };
  }

  await invalidateIfStale(packId);

  const localPath = localFilePath(packId, repoPath);
  const info = await FileSystem.getInfoAsync(localPath);

  if (info.exists) {
    return { uri: localPath };
  }

  const dir = `${CACHE_ROOT}${packId}`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  const result = await FileSystem.downloadAsync(githubRawUrl(repoPath), localPath);
  return { uri: result.uri };
}

export async function resolveAudioTracks(
  packId: ContentPackId,
  repoPaths: readonly string[]
): Promise<AudioUriSource[]> {
  return Promise.all(repoPaths.map((path) => resolveAudioSource(packId, path)));
}

export async function downloadContentPack(
  packId: ContentPackId,
  onProgress?: (downloaded: number, total: number) => void
): Promise<void> {
  const pack = getContentPack(packId);
  await invalidateIfStale(packId);
  const dir = `${CACHE_ROOT}${packId}`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

  let downloaded = 0;
  for (const file of pack.files) {
    await resolveAudioSource(packId, file);
    downloaded += 1;
    onProgress?.(downloaded, pack.files.length);
  }

  await writeStoredVersion(packId, pack.version);
}

export async function deleteContentPack(packId: ContentPackId): Promise<void> {
  const dir = `${CACHE_ROOT}${packId}`;
  const info = await FileSystem.getInfoAsync(dir);
  if (info.exists) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  }
  const versions = await readStoredVersions();
  delete versions[packId];
  await AsyncStorage.setItem(VERSIONS_KEY, JSON.stringify(versions));
}
