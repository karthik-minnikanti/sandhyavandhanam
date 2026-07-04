import type { ContentPack, ContentPackId } from "./types";

const SANDHYAVANDANAM_AUDIO_FILES = [
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
  "src/audio/11.mp3",
  "src/audio/14.mp3",
  "src/audio/15.mp3",
  "src/audio/16.mp3",
  "src/audio/17.mp3",
  "src/audio/18.mp3",
  "src/audio/19.mp3",
  "src/audio/20.mp3",
  "src/audio/21.mp3",
  "src/audio/sub1.mp3",
] as const;

const LALITHA_AUDIO_FILES = [
  "src/audio/lalitha/02.mp3",
  "src/audio/lalitha/04.mp3",
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
] as const;

export const CONTENT_PACKS: Record<ContentPackId, ContentPack> = {
  "sandhyavandanam-audio": {
    id: "sandhyavandanam-audio",
    title: "Sandhyavandanam audio",
    titleTe: "సంధ్యావందనం శ్రవణం",
    description: "Section audio for Krishna Yajurveda Sandhyavandanam",
    version: 1,
    files: SANDHYAVANDANAM_AUDIO_FILES,
  },
  "lalitha-audio": {
    id: "lalitha-audio",
    title: "Lalitha Sahasranamam audio",
    titleTe: "లలితా సహస్రనామ శ్రవణం",
    description: "Per-section audio (Samavedam Shanmukha Sarma)",
    version: 1,
    files: LALITHA_AUDIO_FILES,
  },
};

export const CONTENT_PACK_LIST = Object.values(CONTENT_PACKS);

export function getContentPack(id: ContentPackId): ContentPack {
  return CONTENT_PACKS[id];
}
