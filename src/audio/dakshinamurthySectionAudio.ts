/**
 * Per-section Dakshinamurthy Stotram audio (downloaded on demand from GitHub).
 * Files: src/audio/dakshinamurthy/01.mp3 (dhyanam) through 11.mp3 (sloka 10).
 */
import {
  dakshinamurthyStotramSections,
  getDakshinamurthyReaderPages,
} from "../content/dakshinamurthyStotram";

export const DAKSHINAMURTHY_AUDIO_PACK = "dakshinamurthy-audio" as const;

const READER_PAGES = getDakshinamurthyReaderPages();

const sectionAudioPaths: readonly string[] = dakshinamurthyStotramSections.map(
  (_, i) => `src/audio/dakshinamurthy/${String(i + 1).padStart(2, "0")}.mp3`
);

function sectionIndexFor(titleTe: string): number {
  return dakshinamurthyStotramSections.findIndex((s) => s.titleTe === titleTe);
}

/** Audio paths for one reader page (plays in sequence when page has multiple slokas). */
export function getDakshinamurthyPageAudioTrackPaths(
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

export function hasDakshinamurthyPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return getDakshinamurthyPageAudioTrackPaths(readerPageIndex).length > 0;
}

export const DAKSHINAMURTHY_AUDIO_FILES = sectionAudioPaths;
