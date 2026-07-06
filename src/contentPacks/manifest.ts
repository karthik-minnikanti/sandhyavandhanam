import type { ContentPack, ContentPackId } from "./types";
import { ARUNACHALA_AUDIO_FILES } from "../audio/arunachalaSectionAudio";
import { CHANDRASEKHARA_AUDIO_FILES } from "../audio/chandrasekharaSectionAudio";
import { JYOTIRLINGA_AUDIO_FILES } from "../audio/jyotirlingaSectionAudio";
import { SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_FILES } from "../audio/sankatMochanaHanumanAshtakamSectionAudio";
import { HANUMAN_CHALISA_AUDIO_FILES } from "../audio/hanumanChalisaSectionAudio";
import { HANUMAD_ASHTAKAM_AUDIO_FILES } from "../audio/hanumadAshtakamSectionAudio";
import { GANESHA_PANCHARATNAM_AUDIO_FILES } from "../audio/ganeshaPancharatnamSectionAudio";
import { GANANAYAKA_ASHTAKAM_AUDIO_FILES } from "../audio/gananayakaAshtakamSectionAudio";
import { GOVINDA_NAMALU_AUDIO_FILES } from "../audio/govindaNamaluSectionAudio";
import { VENKATESHA_ASHTAKAM_AUDIO_FILES } from "../audio/venkateshaAshtakamSectionAudio";
import { VISHNU_SAHASRANAMAM_AUDIO_FILES } from "../audio/vishnuSahasranamamSectionAudio";
import { SUBRAHMANYA_ASHTAKAM_AUDIO_FILES } from "../audio/subrahmanyaAshtakamSectionAudio";

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

const DAKSHINAMURTHY_AUDIO_FILES = [
  "src/audio/dakshinamurthy/01.mp3",
  "src/audio/dakshinamurthy/02.mp3",
  "src/audio/dakshinamurthy/03.mp3",
  "src/audio/dakshinamurthy/04.mp3",
  "src/audio/dakshinamurthy/05.mp3",
  "src/audio/dakshinamurthy/06.mp3",
  "src/audio/dakshinamurthy/07.mp3",
  "src/audio/dakshinamurthy/08.mp3",
  "src/audio/dakshinamurthy/09.mp3",
  "src/audio/dakshinamurthy/10.mp3",
  "src/audio/dakshinamurthy/11.mp3",
] as const;

const LINGASHTAKAM_AUDIO_FILES = ["src/audio/lingashtakam/full.mp3"] as const;

export const CONTENT_PACKS: Record<ContentPackId, ContentPack> = {
  "sandhyavandanam-audio": {
    id: "sandhyavandanam-audio",
    title: "Sandhyavandanam audio",
    titleTe: "సంధ్యావందనం శ్రవణం",
    description: "Section audio for Krishna Yajurveda Sandhyavandanam",
    version: 1,
    files: SANDHYAVANDANAM_AUDIO_FILES,
    audioPublished: true,
  },
  "lalitha-audio": {
    id: "lalitha-audio",
    title: "Lalitha Sahasranamam audio",
    titleTe: "లలితా సహస్రనామ శ్రవణం",
    description: "Per-section audio (Samavedam Shanmukha Sarma)",
    version: 1,
    files: LALITHA_AUDIO_FILES,
    audioPublished: true,
  },
  "dakshinamurthy-audio": {
    id: "dakshinamurthy-audio",
    title: "Dakshinamurthy Stotram audio",
    titleTe: "దక్షిణామూర్తి స్తోత్ర శ్రవణం",
    description: "Dhyanam and 10 slokas — one track per section",
    version: 1,
    files: DAKSHINAMURTHY_AUDIO_FILES,
    audioPublished: false,
  },
  "lingashtakam-audio": {
    id: "lingashtakam-audio",
    title: "Lingashtakam audio",
    titleTe: "లింగాష్టక శ్రవణం",
    description: "Full stotram recitation (vedasonline.in)",
    version: 2,
    files: LINGASHTAKAM_AUDIO_FILES,
    audioPublished: true,
  },
  "arunachala-audio": {
    id: "arunachala-audio",
    title: "Arunachala Ashtakam audio",
    titleTe: "అరుణాచలాష్టక శ్రవణం",
    description: "11 verses — one track per section",
    version: 1,
    files: ARUNACHALA_AUDIO_FILES,
    audioPublished: false,
  },
  "chandrasekhara-audio": {
    id: "chandrasekhara-audio",
    title: "Chandrasekhara Ashtakam audio",
    titleTe: "చంద్రశేఖరాష్టక శ్రవణం",
    description: "8 slokas and phala shruti — one track per section",
    version: 1,
    files: CHANDRASEKHARA_AUDIO_FILES,
    audioPublished: false,
  },
  "jyotirlinga-audio": {
    id: "jyotirlinga-audio",
    title: "Dvadasa Jyotirlinga Stotram audio",
    titleTe: "ద్వాదశ జ్యోతిర్లింగ శ్రవణం",
    description: "12 jyotirlingas and phala shruti — one track per section",
    version: 1,
    files: JYOTIRLINGA_AUDIO_FILES,
    audioPublished: false,
  },
  "sankat-mochana-hanuman-audio": {
    id: "sankat-mochana-hanuman-audio",
    title: "Sankat Mochana Hanuman Ashtakam audio",
    titleTe: "సంకటమోచన హనుమదష్టక శ్రవణం",
    description: "8 slokas and phala shruti — one track per section",
    version: 1,
    files: SANKAT_MOCHANA_HANUMAN_ASHTAKAM_AUDIO_FILES,
    audioPublished: false,
  },
  "hanuman-chalisa-audio": {
    id: "hanuman-chalisa-audio",
    title: "Hanuman Chalisa audio",
    titleTe: "హనుమాన్ చాలీసా శ్రవణం",
    description: "Dohas and 40 chaupais — one track per section",
    version: 1,
    files: HANUMAN_CHALISA_AUDIO_FILES,
    audioPublished: false,
  },
  "hanumad-ashtakam-audio": {
    id: "hanumad-ashtakam-audio",
    title: "Hanumad Ashtakam audio",
    titleTe: "హనుమదష్టక శ్రవణం",
    description: "8 slokas and phala shruti — one track per section",
    version: 1,
    files: HANUMAD_ASHTAKAM_AUDIO_FILES,
    audioPublished: false,
  },
  "ganesha-pancharatnam-audio": {
    id: "ganesha-pancharatnam-audio",
    title: "Ganesha Pancharatnam audio",
    titleTe: "గణేశ పంచరత్న శ్రవణం",
    description: "5 ratnas and phala shruti — one track per section",
    version: 1,
    files: GANESHA_PANCHARATNAM_AUDIO_FILES,
    audioPublished: false,
  },
  "gananayaka-ashtakam-audio": {
    id: "gananayaka-ashtakam-audio",
    title: "Gananayaka Ashtakam audio",
    titleTe: "గణనాయకాష్టక శ్రవణం",
    description: "8 slokas and phala shruti — one track per section",
    version: 1,
    files: GANANAYAKA_ASHTAKAM_AUDIO_FILES,
    audioPublished: false,
  },
  "govinda-namalu-audio": {
    id: "govinda-namalu-audio",
    title: "Govinda Namalu audio",
    titleTe: "గోవింద నామాల శ్రవణం",
    description: "38 verses — Tirumala Govinda Namalu",
    version: 1,
    files: GOVINDA_NAMALU_AUDIO_FILES,
    audioPublished: false,
  },
  "venkatesha-ashtakam-audio": {
    id: "venkatesha-ashtakam-audio",
    title: "Venkatesha Ashtakam audio",
    titleTe: "వేంకటేశ అష్టక శ్రవణం",
    description: "8 slokas, phala shruti and mangalam — one track per section",
    version: 1,
    files: VENKATESHA_ASHTAKAM_AUDIO_FILES,
    audioPublished: false,
  },
  "vishnu-sahasranamam-audio": {
    id: "vishnu-sahasranamam-audio",
    title: "Vishnu Sahasranamam audio",
    titleTe: "విష్ణు సహస్రనామ శ్రవణం",
    description: "Poorvapeetika, 107 shlokas and phala shruti — one track per section",
    version: 1,
    files: VISHNU_SAHASRANAMAM_AUDIO_FILES,
    audioPublished: false,
  },
  "subrahmanya-ashtakam-audio": {
    id: "subrahmanya-ashtakam-audio",
    title: "Subrahmanya Ashtakam audio",
    titleTe: "సుబ్రహ్మణ్య అష్టక శ్రవణం",
    description: "Karavalamba stotram — one track per section",
    version: 1,
    files: SUBRAHMANYA_ASHTAKAM_AUDIO_FILES,
    audioPublished: false,
  },
};

export const CONTENT_PACK_LIST = Object.values(CONTENT_PACKS);

export const PUBLISHED_AUDIO_PACK_LIST = CONTENT_PACK_LIST.filter(
  (pack) => pack.audioPublished
);

export function isAudioPackPublished(
  packId: ContentPackId | undefined
): boolean {
  if (!packId) return false;
  return CONTENT_PACKS[packId]?.audioPublished ?? false;
}

export function getContentPack(id: ContentPackId): ContentPack {
  return CONTENT_PACKS[id];
}
