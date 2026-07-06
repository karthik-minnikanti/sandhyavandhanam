export type StotramSection = {
  titleTe: string;
  titleEn?: string;
  mantra: string;
};

export type StotramReaderPage = {
  titleTe: string;
  titleEn?: string;
  sections: StotramSection[];
};

/** Cover is page 0; returned pages map to reader page indices 0..n-1. */
export function buildStotramReaderPages(
  sections: StotramSection[],
  slokasPerPage: number,
  options?: { leadingSectionAlone?: boolean }
): StotramReaderPage[] {
  if (sections.length === 0) return [];

  const leadingAlone = options?.leadingSectionAlone ?? false;
  const pages: StotramReaderPage[] = [];

  const pushChunk = (chunk: StotramSection[], indexStart: number) => {
    const first = indexStart + 1;
    const last = indexStart + chunk.length;
    pages.push({
      titleTe:
        first === last
          ? chunk[0].titleTe
          : `శ్లోకాలు ॥ ${first}–${last} ॥`,
      titleEn:
        first === last ? chunk[0].titleEn : `Verses ${first}–${last}`,
      sections: chunk,
    });
  };

  if (leadingAlone) {
    const [first, ...rest] = sections;
    pages.push({
      titleTe: first.titleTe,
      titleEn: first.titleEn,
      sections: [first],
    });
    for (let i = 0; i < rest.length; i += slokasPerPage) {
      pushChunk(rest.slice(i, i + slokasPerPage), i);
    }
    return pages;
  }

  for (let i = 0; i < sections.length; i += slokasPerPage) {
    pushChunk(sections.slice(i, i + slokasPerPage), i);
  }
  return pages;
}

/** One scrollable reader page with all sections (after cover). */
export function singleStotramReaderPage(
  titleTe: string,
  sections: StotramSection[],
  titleEn?: string
): StotramReaderPage[] {
  return [{ titleTe, titleEn, sections }];
}
