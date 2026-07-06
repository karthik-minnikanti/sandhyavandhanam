/**
 * Per-section Govinda Namalu audio (downloaded on demand from GitHub).
 * Files: src/audio/govinda-namalu/01.mp3 through 38.mp3.
 */
import {
  getGovindaNamaluReaderPages,
  govindaNamaluSections,
} from "../content/govindaNamalu";

export const GOVINDA_NAMALU_AUDIO_PACK = "govinda-namalu-audio" as const;

const READER_PAGES = getGovindaNamaluReaderPages();

const sectionAudioPaths: readonly string[] = govindaNamaluSections.map(
  (_, i) => `src/audio/govinda-namalu/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return govindaNamaluSections.findIndex((s) => s.titleTe === titleTe);
}

export function getGovindaNamaluPageAudioTrackPaths(
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

export function hasGovindaNamaluPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getGovindaNamaluPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const GOVINDA_NAMALU_AUDIO_FILES = sectionAudioPaths;
