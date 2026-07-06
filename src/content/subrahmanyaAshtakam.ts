/**
 * శ్రీ సుబ్రహ్మణ్య అష్టకం (కరావలంబ స్తోత్రం) — Telugu (Adi Shankaracharya)
 * Source: https://stotranidhi.com/subrahmanya-ashtakam-in-telugu/
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";

export type { StotramSection };

export const subrahmanyaAshtakamOpening =
  `శ్రీ సుబ్రహ్మణ్య అష్టకం\n\nకరావలంబ స్తోత్రం — శ్రీ ఆది శంకరాచార్య విరచితం ॥`;

export const subrahmanyaAshtakamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `హే స్వామినాథ కరుణాకర దీనబంధో శ్రీపార్వతీశముఖపంకజపద్మబంధో | శ్రీశాదిదేవగణపూజితపాదపద్మ వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౧ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `దేవాదిదేవసుత దేవగణాధినాథ దేవేంద్రవంద్య మృదుపంకజమంజుపాద | దేవర్షినారదమునీంద్రసుగీతకీర్తే వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౨ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `నిత్యాన్నదాననిరతాఖిలరోగహారిన్ తస్మాత్ప్రదానపరిపూరితభక్తకామ | శ్రుత్యాగమప్రణవవాచ్యనిజస్వరూప వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౩ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `క్రౌంచాసురేంద్రపరిఖండనశక్తిశూలపాశాదిశస్త్రపరిమండితదివ్యపాణే | శ్రీకుండలీశధరతుండశిఖీంద్రవాహ వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౪ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `దేవాదిదేవ రథమండలమధ్యవేద్య దేవేంద్రపీఠనగరం దృఢచాపహస్తమ్ | శూరం నిహత్య సురకోటిభిరీడ్యమాన వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౫ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `హీరాదిరత్నమణియుక్తకిరీటహారకేయూరకుండలలసత్కవచాభిరామమ్ | హే వీర తారక జయాఽమరబృందవంద్య వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౬ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `పంచాక్షరాదిమనుమంత్రితగాంగతోయైః పంచామృతైః ప్రముదితేంద్రముఖైర్మునీంద్రైః | పట్టాభిషిక్త హరియుక్త పరాసనాథ వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౭ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `శ్రీకార్తికేయ కరుణామృతపూర్ణదృష్ట్యా కామాదిరోగకలుషీకృతదుష్టచిత్తమ్ | సిక్త్వా తు మామవకళాధర కాంతికాంత్యా వల్లీశనాథ మమ దేహి కరావలంబమ్ || ౮ ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి ॥ 1 ॥",
    titleEn: "Phala Shruti 1",
    mantra: `సుబ్రహ్మణ్యాష్టకం పుణ్యం యే పఠంతి ద్విజోత్తమాః | తే సర్వే ముక్తిమాయాంతి సుబ్రహ్మణ్య ప్రసాదతః || ౯ ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి ॥ 2 ॥",
    titleEn: "Phala Shruti 2",
    mantra: `సుబ్రహ్మణ్యాష్టకమిదం ప్రాతరుత్థాయ యః పఠేత్ | కోటిజన్మకృతం పాపం తత్క్షణాదేవ నశ్యతి || ౧౦ ॥`,
  },
];

export function getSubrahmanyaAshtakamReaderPages(): StotramReaderPage[] {
  return [
    {
      titleTe: "సుబ్రహ్మణ్య అష్టకం",
      titleEn: "Subrahmanya Ashtakam",
      sections: subrahmanyaAshtakamSections,
    },
  ];
}
