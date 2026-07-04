/**
 * Per-section Lalitha Sahasranamam audio (gurujnanam.org).
 * Section MP3s are downloaded on demand from the public GitHub repo.
 */
export const LALITHA_AUDIO_CREDIT = "gurujnanam.org";

export const LALITHA_AUDIO_PACK = "lalitha-audio" as const;

const sectionAudioPaths: readonly string[] = [
  "src/audio/lalitha/02.mp3", // ధ్యానం
  "src/audio/lalitha/04.mp3", // నామాలు ॥ 1–10 ॥
  "src/audio/lalitha/05.mp3",
  "src/audio/lalitha/06.mp3",
  "src/audio/lalitha/07.mp3",
  "src/audio/lalitha/08.mp3",
  "src/audio/lalitha/09.mp3",
  "src/audio/lalitha/10.mp3",
  "src/audio/lalitha/11.mp3",
  "src/audio/lalitha/12.mp3",
  "src/audio/lalitha/13.mp3",
  "src/audio/lalitha/14.mp3",
  "src/audio/lalitha/15.mp3",
  "src/audio/lalitha/16.mp3",
  "src/audio/lalitha/17.mp3",
  "src/audio/lalitha/18.mp3",
  "src/audio/lalitha/19.mp3",
  "src/audio/lalitha/20.mp3",
  "src/audio/lalitha/21.mp3",
  "src/audio/lalitha/22.mp3",
];

export function hasLalithaAudio(): boolean {
  return sectionAudioPaths.length > 0;
}

export function hasLalithaSectionAudio(sectionIndex: number): boolean {
  if (sectionIndex < 0 || sectionIndex >= sectionAudioPaths.length)
    return false;
  return true;
}

export function getLalithaSectionAudioTrackPaths(
  sectionIndex: number
): readonly string[] {
  if (!hasLalithaSectionAudio(sectionIndex)) return [];
  return [sectionAudioPaths[sectionIndex]];
}
