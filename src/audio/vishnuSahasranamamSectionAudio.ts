/**
 * Per-section Vishnu Sahasranamam audio (downloaded on demand from GitHub).
 * Files: src/audio/vishnu-sahasranamam/01.mp3 through 19.mp3 (one per reader section).
 */
import {
  getVishnuSahasranamamReaderPages,
  vishnuSahasranamamSections,
} from "../content/vishnuSahasranamam";

export const VISHNU_SAHASRANAMAM_AUDIO_PACK = "vishnu-sahasranamam-audio" as const;

const READER_PAGES = getVishnuSahasranamamReaderPages();

const sectionAudioPaths: readonly string[] = vishnuSahasranamamSections.map(
  (_, i) =>
    `src/audio/vishnu-sahasranamam/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return vishnuSahasranamamSections.findIndex((s) => s.titleTe === titleTe);
}

export function getVishnuSahasranamamPageAudioTrackPaths(
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

export function hasVishnuSahasranamamPageAudio(
  readerPageIndex: number
): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return (
    getVishnuSahasranamamPageAudioTrackPaths(readerPageIndex).length > 0
  );
}

export const VISHNU_SAHASRANAMAM_AUDIO_FILES = sectionAudioPaths;
