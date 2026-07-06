/**
 * Per-section Hanumad Ashtakam audio (downloaded on demand from GitHub).
 * Files: src/audio/hanumad-ashtakam/01.mp3 through 09.mp3 (8 slokas + phala shruti).
 */
import {
  getHanumadAshtakamReaderPages,
  hanumadAshtakamSections,
} from "../content/hanumadAshtakam";

export const HANUMAD_ASHTAKAM_AUDIO_PACK = "hanumad-ashtakam-audio" as const;

const READER_PAGES = getHanumadAshtakamReaderPages();

const sectionAudioPaths: readonly string[] = hanumadAshtakamSections.map(
  (_, i) => `src/audio/hanumad-ashtakam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return hanumadAshtakamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getHanumadAshtakamPageAudioTrackPaths(
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

export function hasHanumadAshtakamPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getHanumadAshtakamPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const HANUMAD_ASHTAKAM_AUDIO_FILES = sectionAudioPaths;
