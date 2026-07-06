/**
 * Per-section Gananayaka Ashtakam audio (downloaded on demand from GitHub).
 * Files: src/audio/gananayaka-ashtakam/01.mp3 through 09.mp3 (8 slokas + phala shruti).
 */
import {
  gananayakaAshtakamSections,
  getGananayakaAshtakamReaderPages,
} from "../content/gananayakaAshtakam";

export const GANANAYAKA_ASHTAKAM_AUDIO_PACK =
  "gananayaka-ashtakam-audio" as const;

const READER_PAGES = getGananayakaAshtakamReaderPages();

const sectionAudioPaths: readonly string[] = gananayakaAshtakamSections.map(
  (_, i) =>
    `src/audio/gananayaka-ashtakam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return gananayakaAshtakamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getGananayakaAshtakamPageAudioTrackPaths(
  readerPageIndex: number
): readonly string[] {
  const page = READER_PAGES[readerPageIndex];
  if (!page) return [];

  return page.sections
    .map((section) => {
      const idx = sectionIndexFor(section.titleTe);
      return idx >= 0 ? sectionAudioPaths[idx] : undefined;
    })
    .filter((p): p is string => p !== undefined);
}

export function hasGananayakaAshtakamPageAudio(
  readerPageIndex: number
): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getGananayakaAshtakamPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const GANANAYAKA_ASHTAKAM_AUDIO_FILES = sectionAudioPaths;
