import { createStotramSectionAudio } from "./createStotramSectionAudio";
import {
  chandrasekharaAshtakamSections,
  getChandrasekharaAshtakamReaderPages,
} from "../content/chandrasekharaAshtakam";

const audio = createStotramSectionAudio(
  "chandrasekhara-audio",
  "chandrasekhara",
  chandrasekharaAshtakamSections,
  getChandrasekharaAshtakamReaderPages()
);

export const CHANDRASEKHARA_AUDIO_PACK = audio.packId;
export const CHANDRASEKHARA_AUDIO_FILES = audio.sectionAudioPaths;
export const getChandrasekharaPageAudioTrackPaths = audio.getPageAudioTrackPaths;
export const hasChandrasekharaPageAudio = audio.hasPageAudio;
