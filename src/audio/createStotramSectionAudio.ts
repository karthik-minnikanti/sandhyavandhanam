import type { StotramReaderPage, StotramSection } from "../content/stotramTypes";
import type { ContentPackId } from "../contentPacks/types";

export function createStotramSectionAudio(
  packId: ContentPackId,
  audioSubdir: string,
  sections: readonly StotramSection[],
  readerPages: readonly StotramReaderPage[]
) {
  const sectionAudioPaths: readonly string[] = sections.map(
    (_, i) => `src/audio/${audioSubdir}/${String(i + 1).padStart(2, "0")}.mp3`
  );

  function sectionIndexFor(titleTe: string): number {
    return sections.findIndex((s) => s.titleTe === titleTe);
  }

  function getPageAudioTrackPaths(readerPageIndex: number): readonly string[] {
    const page = readerPages[readerPageIndex];
    if (!page) return [];

    return page.sections
      .map((section) => {
        const idx = sectionIndexFor(section.titleTe);
        return idx >= 0 ? sectionAudioPaths[idx] : undefined;
      })
      .filter((p): p is string => p !== undefined);
  }

  function hasPageAudio(readerPageIndex: number): boolean {
    if (readerPageIndex < 0 || readerPageIndex >= readerPages.length)
      return false;
    return getPageAudioTrackPaths(readerPageIndex).length > 0;
  }

  return {
    packId,
    sectionAudioPaths,
    getPageAudioTrackPaths,
    hasPageAudio,
  };
}
