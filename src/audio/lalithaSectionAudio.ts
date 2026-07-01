/**
 * Per-section Lalitha Sahasranamam audio — Samavedam Guru Garu (gurujnanam.org).
 * Section MP3s split from the full stotram recording to match each reader page.
 */
export const LALITHA_AUDIO_CREDIT =
  "సమవేదం గురు గారు · gurujnanam.org";

const sectionAudioAssets: number[] = [
  require("./lalitha/01.mp3"),
  require("./lalitha/02.mp3"),
  require("./lalitha/03.mp3"),
  require("./lalitha/04.mp3"),
  require("./lalitha/05.mp3"),
  require("./lalitha/06.mp3"),
  require("./lalitha/07.mp3"),
  require("./lalitha/08.mp3"),
  require("./lalitha/09.mp3"),
  require("./lalitha/10.mp3"),
  require("./lalitha/11.mp3"),
  require("./lalitha/12.mp3"),
  require("./lalitha/13.mp3"),
  require("./lalitha/14.mp3"),
  require("./lalitha/15.mp3"),
  require("./lalitha/16.mp3"),
  require("./lalitha/17.mp3"),
  require("./lalitha/18.mp3"),
  require("./lalitha/19.mp3"),
  require("./lalitha/20.mp3"),
  require("./lalitha/21.mp3"),
  require("./lalitha/22.mp3"),
  require("./lalitha/23.mp3"),
];

export function hasLalithaAudio(): boolean {
  return sectionAudioAssets.length > 0;
}

export function hasLalithaSectionAudio(sectionIndex: number): boolean {
  if (sectionIndex < 0 || sectionIndex >= sectionAudioAssets.length)
    return false;
  return true;
}

export function getLalithaSectionAudioTracks(sectionIndex: number): number[] {
  if (!hasLalithaSectionAudio(sectionIndex)) return [];
  return [sectionAudioAssets[sectionIndex]];
}
