/**
 * Generates src/content/vishnuSahasranamam.ts from Vaidika Vignanam text export.
 * Usage: node scripts/generate-vishnu-sahasranamam.js
 */
const fs = require("fs");
const path = require("path");

const SOURCE = path.join(
  process.env.HOME || "",
  ".cursor/projects/Users-karthikminnikanti-code-sandhyavandanam/agent-tools/a7ac3158-8c15-4bd5-a71b-e4e45bb88778.txt"
);
const OUT = path.join(__dirname, "../src/content/vishnuSahasranamam.ts");

const raw = fs.readFileSync(SOURCE, "utf8");
const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

const verseRe = /॥\s*(\d+)\s*॥/;

function extractVerse(line) {
  const m = line.match(verseRe);
  if (!m) return null;
  return { num: Number(m[1]), text: line };
}

const stotramIdx = lines.findIndex((l) => l === "స్తోత్రం");
const poorvaLines = lines.slice(0, stotramIdx);
const bodyLines = lines.slice(stotramIdx + 2); // skip స్తోత్రం, హరిః ఓం

const mainVerses = [];
const phalaVerses = [];
let inPhala = false;

for (const line of bodyLines) {
  if (line.startsWith("ఉత్తర పీఠికా") || line.startsWith("ఫలశ్రుతిః")) {
    inPhala = true;
    if (line.startsWith("ఫలశ్రుతిః")) {
      const v = extractVerse(line.replace(/^ఫలశ్రుతిః\s*/, ""));
      if (v) phalaVerses.push(v);
    }
    continue;
  }
  if (line.startsWith("ఇతి శ్రీ")) break;
  if (line.startsWith("శ్రీ ") && line.includes("ఓం నమ ఇతి")) continue;
  if (line.startsWith("- ")) break;
  if (line.includes("Collection of Spiritual")) break;

  const v = extractVerse(line);
  if (!v) continue;
  if (inPhala) phalaVerses.push(v);
  else if (v.num <= 107) mainVerses.push(v);
}

function chunk(arr, size, titleFn) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size);
    const first = chunk[0].num;
    const last = chunk[chunk.length - 1].num;
    out.push({
      titleTe: titleFn(first, last),
      titleEn: first === last ? `Verse ${first}` : `Verses ${first}–${last}`,
      mantra: chunk.map((v) => v.text).join("\n\n"),
    });
  }
  return out;
}

const poorvaText = poorvaLines
  .filter((l) => !l.startsWith("Sree Vishnu") && !l.startsWith("Collection"))
  .filter((l) => l !== "శ్రీ విష్ణు సహస్ర నామ స్తోత్రం")
  .filter((l) => !l.startsWith("This document"))
  .filter((l) => !l.startsWith("View this"))
  .join("\n\n");

const sections = [
  {
    titleTe: "పూర్వ పీఠికా",
    titleEn: "Poorvapeetika",
    mantra: poorvaText,
  },
  ...chunk(mainVerses, 10, (a, b) =>
    a === b ? `శ్లోకం ॥ ${a} ॥` : `శ్లోకాలు ॥ ${a}–${b} ॥`
  ),
  ...chunk(phalaVerses, 5, (a, b) =>
    a === b ? `ఫలశ్రుతి ॥ ${a} ॥` : `ఫలశ్రుతి ॥ ${a}–${b} ॥`
  ),
];

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

const body = sections
  .map(
    (s) => `  {
    titleTe: ${JSON.stringify(s.titleTe)},
    titleEn: ${JSON.stringify(s.titleEn)},
    mantra: \`${esc(s.mantra)}\`,
  }`
  )
  .join(",\n");

const ts = `/**
 * శ్రీ విష్ణు సహస్ర నామ స్తోత్రం — Telugu
 * Source: https://vignanam.org/telugu/sree-vishnu-sahasra-nama-stotram.html
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";
import { buildStotramReaderPages } from "./stotramTypes";

export type { StotramSection };

export const vishnuSahasranamamOpening = \`శ్రీ విష్ణు సహస్ర నామ స్తోత్రం\\n\\nఓం ॥\`;

export const vishnuSahasranamamSections: StotramSection[] = [
${body}
];

export function getVishnuSahasranamamReaderPages(): StotramReaderPage[] {
  return buildStotramReaderPages(vishnuSahasranamamSections, 1, {
    leadingSectionAlone: false,
  });
}
`;

fs.writeFileSync(OUT, ts);
console.log(
  `Wrote ${OUT} — ${sections.length} sections (${mainVerses.length} main shlokas, ${phalaVerses.length} phala)`
);
