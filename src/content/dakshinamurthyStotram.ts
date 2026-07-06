/**
 * శ్రీ దక్షిణామూర్తి స్తోత్రం — Telugu (Adi Shankaracharya)
 * Source: https://stotranidhi.com/dakshinamurthy-ashtakam-in-telugu/
 */
export type StotramSection = {
  titleTe: string;
  titleEn?: string;
  mantra: string;
};

export const dakshinamurthyOpening = `శ్రీ దక్షిణామూర్తి స్తోత్రం\n\nశ్రీ ఆది శంకరాచార్య విరచితం ॥`;

export const DAKSHINAMURTHY_SLOKAS_PER_PAGE = 3;

export type DakshinamurthyReaderPage = {
  titleTe: string;
  titleEn?: string;
  sections: StotramSection[];
};

/** Cover is page 0; reader pages follow (dhyanam alone, then 3 slokas per page). */
export function getDakshinamurthyReaderPages(): DakshinamurthyReaderPage[] {
  const [dhyanam, ...slokas] = dakshinamurthyStotramSections;
  const pages: DakshinamurthyReaderPage[] = [
    { titleTe: dhyanam.titleTe, titleEn: dhyanam.titleEn, sections: [dhyanam] },
  ];

  for (let i = 0; i < slokas.length; i += DAKSHINAMURTHY_SLOKAS_PER_PAGE) {
    const chunk = slokas.slice(i, i + DAKSHINAMURTHY_SLOKAS_PER_PAGE);
    const first = i + 1;
    const last = i + chunk.length;
    pages.push({
      titleTe:
        first === last
          ? chunk[0].titleTe
          : `శ్లోకాలు ॥ ${first}–${last} ॥`,
      titleEn:
        first === last ? chunk[0].titleEn : `Verses ${first}–${last}`,
      sections: chunk,
    });
  }

  return pages;
}

export const dakshinamurthyStotramSections: StotramSection[] = [
  {
    titleTe: "ధ్యానం",
    titleEn: "Dhyanam",
    mantra: `మౌనవ్యాఖ్యా ప్రకటిత పరబ్రహ్మతత్త్వం యువానం
వర్షిష్ఠాంతే వసదృషిగణైరావృతం బ్రహ్మనిష్ఠైః ।
ఆచార్యేంద్రం కరకలిత చిన్ముద్రమానందమూర్తిం
స్వాత్మారామం ముదితవదనం దక్షిణామూర్తిమీడే ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 1 ॥",
    titleEn: "Verse 1",
    mantra: `విశ్వం దర్పణదృశ్యమాననగరీతుల్యం నిజాంతర్గతం
పశ్యన్నాత్మని మాయయా బహిరివోద్భూతం యథా నిద్రయా ।
యః సాక్షాత్ కురుతే ప్రబోధసమయే స్వాత్మానమేవాద్వయం
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 1 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 2 ॥",
    titleEn: "Verse 2",
    mantra: `బీజస్యాంతరివాంకురో జగదిదం ప్రాఙ్నిర్వికల్పం పునర్మాయాకల్పితదేశకాలకలనావైచిత్ర్యచిత్రీకృతమ్ ।
మాయావీవ విజృంభయత్యపి మహాయోగీవ యః స్వేచ్ఛయా
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 2 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 3 ॥",
    titleEn: "Verse 3",
    mantra: `యస్యైవ స్ఫురణం సదాత్మకమసత్ కల్పార్థగం భాసతే
సాక్షాత్ తత్త్వమసీతి వేదవచసా యో బోధయత్యాశ్రితాన్ ।
యత్ సాక్షాత్కరణాద్భవేన్న పునరావృత్తిర్భవాంభోనిధౌ
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 3 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 4 ॥",
    titleEn: "Verse 4",
    mantra: `నానాచ్ఛిద్రఘటోదరస్థితమహాదీపప్రభాభాస్వరం
జ్ఞానం యస్య తు చక్షురాదికరణద్వారా బహిః స్పందతే ।
జానామీతి తమేవ భాంతమనుభాత్యేతత్ సమస్తం జగత్
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 4 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 5 ॥",
    titleEn: "Verse 5",
    mantra: `దేహం ప్రాణమపీంద్రియాణ్యపి చలాం బుద్ధిం చ శూన్యం విదుః
స్త్రీబాలాంధజడోపమాస్త్వహమితి భ్రాంతా భృశం వాదినః ।
మాయాశక్తివిలాసకల్పితమహావ్యామోహసంహారిణే
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 5 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 6 ॥",
    titleEn: "Verse 6",
    mantra: `రాహుగ్రస్తదివాకరేందుసదృశో మాయాసమాచ్ఛాదనాత్
సన్మాత్రః కరణోపసంహరణతో యోఽభూత్ సుషుప్తః పుమాన్ ।
ప్రాగస్వాప్సమితి ప్రబోధసమయే యః ప్రత్యభిజ్ఞాయతే
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 6 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 7 ॥",
    titleEn: "Verse 7",
    mantra: `బాల్యాదిష్వపి జాగ్రదాదిషు తథా సర్వాస్వవస్థాస్వపి
వ్యావృత్తాస్వనువర్తమానమహమిత్యంతః స్ఫురంతం సదా ।
స్వాత్మానం ప్రకటీకరోతి భజతాం యో ముద్రయా భద్రయా
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 7 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 8 ॥",
    titleEn: "Verse 8",
    mantra: `విశ్వం పశ్యతి కార్యకారణతయా స్వస్వామిసంబంధతః
శిష్యాచార్యతయా తథైవ పితృపుత్రాద్యాత్మనా భేదతః ।
స్వప్నే జాగ్రతి వా య ఏష పురుషో మాయాపరిభ్రామితః
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 8 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 9 ॥",
    titleEn: "Verse 9",
    mantra: `భూరంభాంస్యనలోఽనిలోఽంబరమహర్నాథో హిమాంశుః పుమాన్
ఇత్యాభాతి చరాచరాత్మకమిదం యస్యైవ మూర్త్యష్టకమ్ ।
నాన్యత్ కించన విద్యతే విమృశతాం యస్మాత్ పరస్మాద్విభోః
తస్మై శ్రీగురుమూర్తయే నమ ఇదం శ్రీదక్షిణామూర్తయే ॥ 9 ॥`,
  },
  {
    titleTe: "శ్లోకం ॥ 10 ॥",
    titleEn: "Verse 10",
    mantra: `సర్వాత్మత్వమితి స్ఫుటీకృతమిదం యస్మాదముష్మింస్తవే
తేనాస్య శ్రవణాత్ తదర్థమననాద్ధ్యానాచ్చ సంకీర్తనాత్ ।
సర్వాత్మత్వమహావిభూతిసహితం స్యాదీశ్వరత్వం స్వతః
సిద్ధ్యేత్ తత్ పునరష్టధా పరిణతం చైశ్వర్యమవ్యాహతమ్ ॥ 10 ॥

ఇతి శ్రీమత్పరమహంసపరివ్రాజకాచార్యస్య శ్రీగోవిందభగవత్పూజ్యపాదశిష్యస్య శ్రీమచ్ఛంకరభగవతః కృతౌ శ్రీ దక్షిణామూర్తి స్తోత్రమ్ సమాప్తమ్ ॥`,
  },
];
