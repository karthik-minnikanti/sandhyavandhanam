/**
 * శ్రీ అరుణాచలాష్టకం — Telugu
 * Source: https://stotranidhi.com/arunachala-ashtakam-in-telugu/
 */
import {
  singleStotramReaderPage,
  type StotramReaderPage,
  type StotramSection,
} from "./stotramTypes";

export type { StotramSection };

export const arunachalaAshtakamOpening = `శ్రీ అరుణాచలాష్టకం ॥`;

export const arunachalaAshtakamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `దర్శనాదభ్రసదసి జననాత్ కమలాలయే ।
కాశ్యాం తు మరణాన్ముక్తిః స్మరణాదరుణాచలే ॥ 1 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `కరుణాపూరితాపాంగం శరణాగతవత్సలమ్ ।
తరుణేందుజటామౌలిం స్మరణాదరుణాచలమ్ ॥ 2 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `సమస్తజగదాధారం సచ్చిదానందవిగ్రహమ్ ।
సహస్రరథసోపేతం స్మరణాదరుణాచలమ్ ॥ 3 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `కాంచనప్రతిమాభాసం వాంఛితార్థఫలప్రదమ్ ।
మాం చ రక్ష సురాధ్యక్షం స్మరణాదరుణాచలమ్ ॥ 4 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `బద్ధచంద్రజటాజూటమర్ధనారీకలేబరమ్ ।
వర్ధమానదయాంభోధిం స్మరణాదరుణాచలమ్ ॥ 5 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `కాంచనప్రతిమాభాసం సూర్యకోటిసమప్రభమ్ ।
బద్ధవ్యాఘ్రపురీధ్యానం స్మరణాదరుణాచలమ్ ॥ 6 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `శిక్షయాఖిలదేవారి భక్షితక్ష్వేలకంధరమ్ ।
రక్షయాఖిలభక్తానాం స్మరణాదరుణాచలమ్ ॥ 7 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `అష్టభూతిసమాయుక్తమిష్టకామఫలప్రదమ్ ।
శిష్టభక్తిసమాయుక్తాన్ స్మరణాదరుణాచలమ్ ॥ 8 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 9 ॥",
    titleEn: "Verse 9",
    mantra: `వినాయకసురాధ్యక్షం విష్ణుబ్రహ్మేంద్రసేవితమ్ ।
విమలారుణపాదాబ్జం స్మరణాదరుణాచలమ్ ॥ 9 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 10 ॥",
    titleEn: "Verse 10",
    mantra: `మందారమల్లికాజాతికుందచంపకపంకజైః ।
ఇంద్రాదిపూజితాం దేవీం స్మరణాదరుణాచలమ్ ॥ 10 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 11 ॥",
    titleEn: "Verse 11",
    mantra: `సంపత్కరం పార్వతీశం సూర్యచంద్రాగ్నిలోచనమ్ ।
మందస్మితముఖాంభోజం స్మరణాదరుణాచలమ్ ॥ 11 ॥

ఇతి శ్రీఅరుణాచలాష్టకమ్ ॥`,
  },
];

export function getArunachalaAshtakamReaderPages(): StotramReaderPage[] {
  return singleStotramReaderPage(
    "అరుణాచలాష్టకం",
    arunachalaAshtakamSections,
    "Arunachala Ashtakam"
  );
}
