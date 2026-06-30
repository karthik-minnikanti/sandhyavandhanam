/**
 * Section audio sources for Sandhyavandanam.
 * To add more: place MP3 files in assets/audio/ and add require() below.
 * Path is relative to this file: src/audio -> ../../ = project root.
 */
import { sandhyavandanamSections } from "../content/sandhyavandanamKrishnaYajurveda";

const sectionAudioAssets: (number | undefined)[] = [
  require("./1.mp3"),
  require("./2.mp3"),
  require("./3.mp3"),
  require("./4.mp3"),
  require("./5.mp3"),
  require("./6.mp3"),
  require("./7.mp3"),
  require("./8.mp3"),
  require("./9.mp3"),
  require("./10.mp3"),
  require("./11.mp3"), // 10: మంత్రాచమనం — ప్రాతః కాలమున
  require("./20.mp3"), // 11: మంత్రాచమనం — మధ్యాహ్న కాలమున
  undefined, // 12: మంత్రాచమనం — సాయం కాలమున
  require("./14.mp3"),
  require("./15.mp3"),
  require("./16.mp3"),
  require("./17.mp3"),
  ...Array.from(
    { length: sandhyavandanamSections.length - 17 },
    () => undefined
  ),
];

export function getSectionAudio(sectionIndex: number): number | undefined {
  if (sectionIndex < 0 || sectionIndex >= sectionAudioAssets.length)
    return undefined;
  return sectionAudioAssets[sectionIndex];
}

/** Section 21 in UI (currentPage 20 → sectionIndex 19): two tracks in sequence (18.mp3 then 19.mp3). */
const SECTION_21_AUDIO = [require("./18.mp3"), require("./19.mp3")];

/** Returns one or more audio assets for a section. Empty if no audio. */
export function getSectionAudioTracks(sectionIndex: number): number[] {
  if (sectionIndex === 19) return SECTION_21_AUDIO;
  const one = getSectionAudio(sectionIndex);
  return one !== undefined ? [one] : [];
}

/** Inline audio for specific mantra lines (e.g. పశ్చాత్ హస్తే in Arghya). */
export const INLINE_AUDIO_SUB1 = require("./sub1.mp3");

/** సూర్యోపస్థానమ్ — మధ్యాహ్నే block only (not full section). */
export const INLINE_AUDIO_SURYOPASTHANAM_MADHYAHNA = require("./21.mp3");
