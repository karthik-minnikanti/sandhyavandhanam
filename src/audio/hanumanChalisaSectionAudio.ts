/**
 * Per-section Hanuman Chalisa audio (downloaded on demand from GitHub).
 * Files: src/audio/hanuman-chalisa/01.mp3 through 43.mp3 (dohas + 40 chaupais).
 */
import {
  getHanumanChalisaReaderPages,
  hanumanChalisaSections,
} from "../content/hanumanChalisa";

export const HANUMAN_CHALISA_AUDIO_PACK = "hanuman-chalisa-audio" as const;

const READER_PAGES = getHanumanChalisaReaderPages();

const sectionAudioPaths: readonly string[] = hanumanChalisaSections.map(
  (_, i) => `src/audio/hanuman-chalisa/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return hanumanChalisaSections.findIndex((s) => s.titleTe === titleTe);
}

export function getHanumanChalisaPageAudioTrackPaths(
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

export function hasHanumanChalisaPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getHanumanChalisaPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const HANUMAN_CHALISA_AUDIO_FILES = sectionAudioPaths;
