/**
 * శ్రీ సంకటమోచన హనుమదష్టకం — Telugu (Tulsidas)
 * Source: https://stotranidhi.com/sri-sankata-mochana-hanumath-ashtakam-tulsidas-krutam-in-telugu/
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";

export type { StotramSection };

export const sankatMochanaHanumanAshtakamOpening =
  `శ్రీ సంకటమోచన హనుమదష్టకం\n\nశ్రీ గోస్వామి తులసీదాస కృతం ॥`;

export const sankatMochanaHanumanAshtakamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `తతోఽహం తులసీదాసః స్మరామి రఘుందనమ్ | హనూమంతం తత్పురస్తాద్రక్షార్థే భక్తరక్షకమ్ || ౧ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `హనూమన్నంజనాసూనో వాయుపుత్ర మహాబల | మహాలాంగూలనిక్షేపనిహతాఖిలరాక్షస || ౨ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `అక్షవక్షోవినిక్షేపకులిశాగ్రనఖాంచిత | శ్రీరామహృదయానంద విపత్తౌ శరణం భవ || ౩ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `ఉల్లంఘ్య సాగరం యేన ఛాయాగ్రాహీ నిపాతితా | సింహనాదహతామిత్ర విపత్తౌ శరణం భవ || ౪ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `లక్ష్మణే నిహతే భూమావానీయ హ్యచలం తతః | యయా జీవితవానద్య తాం శక్తిం ప్రకటీ కురు || ౫ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `యేన లంకేశ్వరో వీరో నిఃశంకం విజితః స్వయమ్ | దుర్నిరీక్ష్యోఽపి దేవానాం తద్బలం దర్శయాధునా || ౬ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `యయా లంకాం ప్రవిశ్య త్వం జ్ఞాతవాన్ జానకీం స్వయమ్ | రావణాంతఃపురేఽత్యుగ్రే తాం బుద్ధిం ప్రకటీ కురు || ౭ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `రుద్రావతార భక్తార్తివిమోచన మహాభుజ | కపిరాజ ప్రపన్నస్త్వాం శరణం భవ రక్ష మామ్ || ౮ ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి",
    titleEn: "Phala Shruti",
    mantra: `ఇత్యష్టకం హనుమతో యః పఠేచ్ఛ్రద్ధయాన్వితః | సర్వకష్టవినిర్ముక్తో లభతే వాంఛితం ఫలమ్ || ౯ ॥`,
  },
];

export function getSankatMochanaHanumanAshtakamReaderPages(): StotramReaderPage[] {
  return [
    {
      titleTe: "సంకటమోచన హనుమదష్టకం",
      titleEn: "Sankat Mochana Hanuman Ashtakam",
      sections: sankatMochanaHanumanAshtakamSections,
    },
  ];
}
