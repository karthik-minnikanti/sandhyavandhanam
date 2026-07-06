/**
 * Per-section Subrahmanya Ashtakam audio (downloaded on demand from GitHub).
 * Files: src/audio/subrahmanya-ashtakam/01.mp3 through 10.mp3 (8 slokas + 2 phala shruti).
 */
import {
  getSubrahmanyaAshtakamReaderPages,
  subrahmanyaAshtakamSections,
} from "../content/subrahmanyaAshtakam";

export const SUBRAHMANYA_ASHTAKAM_AUDIO_PACK =
  "subrahmanya-ashtakam-audio" as const;

const READER_PAGES = getSubrahmanyaAshtakamReaderPages();

const sectionAudioPaths: readonly string[] = subrahmanyaAshtakamSections.map(
  (_, i) =>
    `src/audio/subrahmanya-ashtakam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return subrahmanyaAshtakamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getSubrahmanyaAshtakamPageAudioTrackPaths(
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

export function hasSubrahmanyaAshtakamPageAudio(
  readerPageIndex: number
): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getSubrahmanyaAshtakamPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const SUBRAHMANYA_ASHTAKAM_AUDIO_FILES = sectionAudioPaths;
