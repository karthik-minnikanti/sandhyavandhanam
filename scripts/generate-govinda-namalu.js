/**
 * Generates src/content/govindaNamalu.ts from Vaidika Vignanam text export.
 * Usage: node scripts/generate-govinda-namalu.js
 */
const fs = require("fs");
const path = require("path");

const SOURCE = path.join(
  process.env.HOME || "",
  ".cursor/projects/Users-karthikminnikanti-code-sandhyavandanam/agent-tools/d56adfb6-1963-4365-a06c-88c5d6b78e9f.txt"
);
const OUT = path.join(__dirname, "../src/content/govindaNamalu.ts");

const raw = fs.readFileSync(SOURCE, "utf8");
const lines = raw.split("\n").map((l) => l.trim());

const verseRe = /॥\s*(\d+)\s*॥/;

const verses = [];
for (const line of lines) {
  if (!line.includes("గోవిందా")) continue;
  const m = line.match(verseRe);
  if (!m) continue;
  const text = line
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  verses.push({ num: Number(m[1]), text });
}

const sections = verses.map((v) => ({
  titleTe: `నామం ॥ ${v.num} ॥`,
  titleEn: `Name ${v.num}`,
  mantra: v.text,
}));

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
 * శ్రీ గోవింద నామాలు — Telugu
 * Source: https://vignanam.org/telugu/govinda-namaavali.html
 */
import type { StotramReaderPage, StotramSection } from "./stotramTypes";
import { buildStotramReaderPages } from "./stotramTypes";

export type { StotramSection };

export const govindaNamaluOpening = \`శ్రీ గోవింద నామాలు\\n\\nఓం నమో వెంకటేశ్వరాయ ॥\`;

export const govindaNamaluSections: StotramSection[] = [
${body}
];

export function getGovindaNamaluReaderPages(): StotramReaderPage[] {
  return buildStotramReaderPages(govindaNamaluSections, 4);
}
`;

fs.writeFileSync(OUT, ts);
console.log(`Wrote ${OUT} — ${sections.length} verses`);
