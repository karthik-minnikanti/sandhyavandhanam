/**
 * Section audio paths for Sandhyavandanam (downloaded on demand from GitHub).
 */
import { sandhyavandanamSections } from "../content/sandhyavandanamKrishnaYajurveda";

const sectionAudioPaths: (string | undefined)[] = [
  "src/audio/1.mp3",
  "src/audio/2.mp3",
  "src/audio/3.mp3",
  "src/audio/4.mp3",
  "src/audio/5.mp3",
  "src/audio/6.mp3",
  "src/audio/7.mp3",
  "src/audio/8.mp3",
  "src/audio/9.mp3",
  "src/audio/10.mp3",
  "src/audio/11.mp3", // 10: మంత్రాచమనం — ప్రాతః కాలమున
  "src/audio/20.mp3", // 11: మంత్రాచమనం — మధ్యాహ్న కాలమున
  undefined, // 12: మంత్రాచమనం — సాయం కాలమున
  "src/audio/14.mp3",
  "src/audio/15.mp3",
  "src/audio/16.mp3",
  "src/audio/17.mp3",
  ...Array.from(
    { length: sandhyavandanamSections.length - 17 },
    () => undefined
  ),
];

export const SANDHYAVANDANAM_AUDIO_PACK = "sandhyavandanam-audio" as const;

export function getSectionAudioPath(sectionIndex: number): string | undefined {
  if (sectionIndex < 0 || sectionIndex >= sectionAudioPaths.length)
    return undefined;
  return sectionAudioPaths[sectionIndex];
}

/** Section 21 in UI (currentPage 20 → sectionIndex 19): two tracks in sequence. */
const SECTION_21_AUDIO = ["src/audio/18.mp3", "src/audio/19.mp3"] as const;

/** Returns one or more repo paths for a section. Empty if no audio. */
export function getSectionAudioTrackPaths(sectionIndex: number): readonly string[] {
  if (sectionIndex === 19) return SECTION_21_AUDIO;
  const one = getSectionAudioPath(sectionIndex);
  return one !== undefined ? [one] : [];
}

/** Inline audio for specific mantra lines (e.g. పశ్చాత్ హస్తే in Arghya). */
export const INLINE_AUDIO_SUB1_PATH = "src/audio/sub1.mp3";

/** సూర్యోపస్థానమ్ — మధ్యాహ్నే block only (not full section). */
export const INLINE_AUDIO_SURYOPASTHANAM_MADHYAHNA_PATH = "src/audio/21.mp3";
