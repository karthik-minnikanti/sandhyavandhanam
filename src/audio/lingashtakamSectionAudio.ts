/**
 * Lingashtakam audio — full stotram recitation from vedasonline.in.
 */
import { getLingashtakamReaderPages } from "../content/lingashtakam";

export const LINGASHTAKAM_AUDIO_PACK = "lingashtakam-audio" as const;

export const LINGASHTAKAM_AUDIO_CREDIT = "vedasonline.in";

const FULL_TRACK = "src/audio/lingashtakam/full.mp3" as const;

const READER_PAGES = getLingashtakamReaderPages();

export function getLingashtakamPageAudioTrackPaths(
  readerPageIndex: number
): readonly string[] {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length) return [];
  return [FULL_TRACK];
}

export function hasLingashtakamPageAudio(readerPageIndex: number): boolean {
  if (readerPageIndex < 0 || readerPageIndex >= READER_PAGES.length)
    return false;
  return true;
}

export const LINGASHTAKAM_AUDIO_FILES = [FULL_TRACK] as const;
