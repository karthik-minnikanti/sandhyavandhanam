import { createStotramSectionAudio } from "./createStotramSectionAudio";
import {
  dvadasaJyotirlingaSections,
  getDvadasaJyotirlingaReaderPages,
} from "../content/dvadasaJyotirlingaStotram";

const audio = createStotramSectionAudio(
  "jyotirlinga-audio",
  "jyotirlinga",
  dvadasaJyotirlingaSections,
  getDvadasaJyotirlingaReaderPages()
);

export const JYOTIRLINGA_AUDIO_PACK = audio.packId;
export const JYOTIRLINGA_AUDIO_FILES = audio.sectionAudioPaths;
export const getJyotirlingaPageAudioTrackPaths = audio.getPageAudioTrackPaths;
export const hasJyotirlingaPageAudio = audio.hasPageAudio;
