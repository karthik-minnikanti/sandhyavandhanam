/**
 * శ్రీ లింగాష్టకం — Telugu (Adi Shankaracharya)
 * Source: https://stotranidhi.com/lingashtakam-in-telugu/
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";

export type { StotramSection };

export const lingashtakamOpening = `శ్రీ లింగాష్టకం\n\nశ్రీ ఆది శంకరాచార్య విరచితం ॥`;

export const lingashtakamSections: StotramSection[] = [
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `బ్రహ్మమురారి సురార్చిత లింగం నిర్మల భాసిత శోభిత లింగమ్ ।
జన్మజ దుఃఖ వినాశక లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 1 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `దేవముని ప్రవరార్చిత లింగం కామదహం కరుణాకర లింగమ్ ।
రావణ దర్ప వినాశన లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 2 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `సర్వ సుగంధ సులేపిత లింగం బుద్ధి వివర్ధన కారణ లింగమ్ ।
సిద్ధ సురాసుర వందిత లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 3 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `కనక మహామణి భూషిత లింగం ఫణిపతి వేష్టిత శోభిత లింగమ్ ।
దక్ష సుయజ్ఞ వినాశన లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 4 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `కుంకుమ చందన లేపిత లింగం పంకజ హార సుశోభిత లింగమ్ ।
సంచిత పాప వినాశన లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 5 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `దేవగణార్చిత సేవిత లింగం భావైర్భక్తిభిరేవ చ లింగమ్ ।
దినకర కోటి ప్రభాకర లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 6 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `అష్టదళోపరి వేష్టిత లింగం సర్వ సముద్భవ కారణ లింగమ్ ।
అష్టదరిద్ర వినాశన లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 7 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `సురగురు సురవర పూజిత లింగం సురవన పుష్ప సదార్చిత లింగమ్ ।
పరాత్పరం పరమాత్మక లింగం తత్ ప్రణమామి సదాశివ లింగమ్ ॥ 8 ॥`,
  },
  {
    titleTe: "ఫలశ్రుతి",
    titleEn: "Phala Shruti",
    mantra: `లింగాష్టకమిదం పుణ్యం యః పఠేచ్ఛివ సన్నిధౌ ।
శివలోకమవాప్నోతి శివేన సహ మోదతే ॥`,
  },
];

export function getLingashtakamReaderPages(): StotramReaderPage[] {
  return [
    {
      titleTe: "లింగాష్టకం",
      titleEn: "Lingashtakam",
      sections: lingashtakamSections,
    },
  ];
}
