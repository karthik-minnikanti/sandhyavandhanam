/**
 * గణనాయకాష్టకం — Telugu
 * Source: https://stotranidhi.com/gananayakashtakam-in-telugu/
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";

export type { StotramSection };

export const gananayakaAshtakamOpening = `గణనాయకాష్టకం ॥`;

export const gananayakaAshtakamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `ఏకదంతం మహాకాయం తప్తకాంచనసన్నిభమ్ | లంబోదరం విశాలాక్షం వందేఽహం గణనాయకమ్ || ౧ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `మౌంజీకృష్ణాజినధరం నాగయజ్ఞోపవీతినమ్ | బాలేందుసుకలామౌళిం వందేఽహం గణనాయకమ్ || ౨ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `అంబికాహృదయానందం మాతృభిఃపరివేష్టితమ్ | భక్తప్రియం మదోన్మత్తం వందేఽహం గణనాయకమ్ || ౩ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `చిత్రరత్నవిచిత్రాంగం చిత్రమాలావిభూషితమ్ | చిత్రరూపధరం దేవం వందేఽహం గణనాయకమ్ || ౪ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `గజవక్త్రం సురశ్రేష్ఠం కర్ణచామరభూషితమ్ | పాశాంకుశధరం దేవం వందేఽహం గణనాయకమ్ || ౫ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `మూషకోత్తమమారుహ్య దేవాసురమహాహవే | యోద్ధుకామం మహావీర్యం వందేఽహం గణనాయకమ్ || ౬ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `యక్షకిన్నరగంధర్వసిద్ధవిద్యాధరైః సదా | స్తూయమానం మహాబాహుం వందేఽహం గణనాయకమ్ || ౭ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `సర్వవిఘ్నహరం దేవం సర్వవిఘ్నవివర్జితమ్ | సర్వసిద్ధిప్రదాతారం వందేఽహం గణనాయకమ్ || ౮ ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి",
    titleEn: "Phala Shruti",
    mantra: `గణాష్టకమిదం పుణ్యం యః పఠేత్సతతం నరః | సిద్ధ్యంతి సర్వకార్యాణి విద్యావాన్ ధనవాన్ భవేత్ || ౯ ॥`,
  },
];

export function getGananayakaAshtakamReaderPages(): StotramReaderPage[] {
  return [
    {
      titleTe: "గణనాయకాష్టకం",
      titleEn: "Gananayaka Ashtakam",
      sections: gananayakaAshtakamSections,
    },
  ];
}
