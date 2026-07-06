/**
 * Per-section Ganesha Pancharatnam audio (downloaded on demand from GitHub).
 * Files: src/audio/ganesha-pancharatnam/01.mp3 through 06.mp3 (5 slokas + phala shruti).
 */
import {
  ganeshaPancharatnamSections,
  getGaneshaPancharatnamReaderPages,
} from "../content/ganeshaPancharatnam";

export const GANESHA_PANCHARATNAM_AUDIO_PACK =
  "ganesha-pancharatnam-audio" as const;

const READER_PAGES = getGaneshaPancharatnamReaderPages();

const sectionAudioPaths: readonly string[] = ganeshaPancharatnamSections.map(
  (_, i) =>
    `src/audio/ganesha-pancharatnam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return ganeshaPancharatnamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getGaneshaPancharatnamPageAudioTrackPaths(
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

export function hasGaneshaPancharatnamPageAudio(
  readerPageIndex: number
): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getGaneshaPancharatnamPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const GANESHA_PANCHARATNAM_AUDIO_FILES = sectionAudioPaths;
