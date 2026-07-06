import { createStotramSectionAudio } from "./createStotramSectionAudio";
import {
  arunachalaAshtakamSections,
  getArunachalaAshtakamReaderPages,
} from "../content/arunachalaAshtakam";

const audio = createStotramSectionAudio(
  "arunachala-audio",
  "arunachala",
  arunachalaAshtakamSections,
  getArunachalaAshtakamReaderPages()
);

export const ARUNACHALA_AUDIO_PACK = audio.packId;
export const ARUNACHALA_AUDIO_FILES = audio.sectionAudioPaths;
export const getArunachalaPageAudioTrackPaths = audio.getPageAudioTrackPaths;
export const hasArunachalaPageAudio = audio.hasPageAudio;
