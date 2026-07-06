/**
 * Per-section Sankat Mochana Hanuman Ashtakam audio (downloaded on demand from GitHub).
 * Files: src/audio/sankat-mochana-hanuman/01.mp3 through 09.mp3 (8 slokas + phala shruti).
 */
import {
  getSankatMochanaHanumanAshtakamReaderPages,
  sankatMochanaHanumanAshtakamSections,
} from "../content/sankatMochanaHanumanAshtakam";

export const SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_PACK =
  "sankat-mochana-hanuman-audio" as const;

const READER_PAGES = getSankatMochanaHanumanAshtakamReaderPages();

const sectionAudioPaths: readonly string[] =
  sankatMochanaHanumanAshtakamSections.map(
    (_, i) =>
      `src/audio/sankat-mochana-hanuman/${String(i + 1).padStart(2, "0")}.mp3`
  );

function sectionIndexFor(titleTe: string): number {
  return sankatMochanaHanumanAshtakamSections.findIndex(
    (s) => s.titleTe === titleTe
  );
}

export function getSankatMochanaHanumanAshtakamPageAudioTrackPaths(
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

export function hasSankatMochanaHanumanAshtakamPageAudio(
  readerPageIndex: number
): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return (
    getSankatMochanaHanumanAshtakamPageAudioTrackPaths(readerPageIndex).length >
    0
  );
}

export const SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_FILES = sectionAudioPaths;
