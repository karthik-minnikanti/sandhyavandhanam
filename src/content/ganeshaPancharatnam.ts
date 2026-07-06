/**
 * శ్రీ గణేశ పంచరత్నం — Telugu (Adi Shankaracharya)
 * Source: https://stotranidhi.com/ganesha-pancharatnam-in-telugu/
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";

export type { StotramSection };

export const ganeshaPancharatnamOpening =
  `శ్రీ గణేశ పంచరత్నం\n\nశ్రీ ఆది శంకరాచార్య విరచితం ॥`;

export const ganeshaPancharatnamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `ముదా కరాత్తమోదకం సదా విముక్తిసాధకం కళాధరావతంసకం విలాసిలోకరక్షకమ్ | అనాయకైకనాయకం వినాశితేభదైత్యకం నతాశుభాశునాశకం నమామి తం వినాయకమ్ || ౧ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `నతేతరాతిభీకరం నవోదితార్కభాస్వరం నమత్సురారినిర్జరం నతాధికాపదుద్ధరమ్ | సురేశ్వరం నిధీశ్వరం గజేశ్వరం గణేశ్వరం మహేశ్వరం తమాశ్రయే పరాత్పరం నిరంతరమ్ || ౨ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `సమస్తలోకశంకరం నిరస్తదైత్యకుంజరం దరేతరోదరం వరం వరేభవక్త్రమక్షరమ్ | కృపాకరం క్షమాకరం ముదాకరం యశస్కరం మనస్కరం నమస్కృతాం నమస్కరోమి భాస్వరమ్ || ౩ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `అకించనార్తిమార్జనం చిరంతనోక్తిభాజనం పురారిపూర్వనందనం సురారిగర్వచర్వణమ్ | ప్రపంచనాశభీషణం ధనంజయాదిభూషణం కపోలదానవారణం భజే పురాణవారణమ్ || ౪ ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `నితాంతకాంతదంతకాంతిమంతకాంతకాత్మజం అచింత్యరూపమంతహీనమంతరాయకృంతనమ్ | హృదంతరే నిరంతరం వసంతమేవ యోగినాం తమేకదంతమేవ తం విచింతయామి సంతతమ్ || ౫ ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి",
    titleEn: "Phala Shruti",
    mantra: `మహాగణేశపంచరత్నమాదరేణ యోఽన్వహం ప్రజల్పతి ప్రభాతకే హృది స్మరన్గణేశ్వరమ్ | అరోగతామదోషతాం సుసాహితీం సుపుత్రతాం సమాహితాయురష్టభూతిమభ్యుపైతి సోఽచిరాత్ || ౬ ॥`,
  },
];

export function getGaneshaPancharatnamReaderPages(): StotramReaderPage[] {
  return [
    {
      titleTe: "గణేశ పంచరత్నం",
      titleEn: "Ganesha Pancharatnam",
      sections: ganeshaPancharatnamSections,
    },
  ];
}
