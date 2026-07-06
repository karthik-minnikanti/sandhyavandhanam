/** Split mantra text into display lines; joins hyphenated line breaks. */
export function splitMantraLines(mantra: string): string[] {
  const raw = mantra.split("\n").map((l) => l.trim()).filter(Boolean);
  const lines: string[] = [];

  for (const line of raw) {
    if (lines.length > 0 && lines[lines.length - 1].endsWith("-")) {
      lines[lines.length - 1] =
        lines[lines.length - 1].slice(0, -1) + line;
    } else {
      lines.push(line);
    }
  }

  return lines;
}
