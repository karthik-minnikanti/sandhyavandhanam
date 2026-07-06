/**
 * Per-section Lingashtakam audio (downloaded on demand from GitHub).
 * Files: src/audio/lingashtakam/01.mp3 through 09.mp3 (8 slokas + phala shruti).
 */
import {
  getLingashtakamReaderPages,
  lingashtakamSections,
} from "../content/lingashtakam";

export const LINGASHTAKAM_AUDIO_PACK = "lingashtakam-audio" as const;

const READER_PAGES = getLingashtakamReaderPages();

const sectionAudioPaths: readonly string[] = lingashtakamSections.map(
  (_, i) => `src/audio/lingashtakam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return lingashtakamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getLingashtakamPageAudioTrackPaths(
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

export function hasLingashtakamPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getLingashtakamPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const LINGASHTAKAM_AUDIO_FILES = sectionAudioPaths;
