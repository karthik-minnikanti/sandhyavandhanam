/**
 * Generates placeholder deity icons. Gayatri and Lalitha use photos in assets/deities/.
 * Usage: node scripts/generate-deity-icons.js
 */
const path = require("path");
const fs = require("fs");

const OUT_DIR = path.join(__dirname, "..", "assets", "deities");
const SIZE = 512;

function circleIcon({ bg, border, label, labelColor = "#e6c84c", fontSize = 200 }) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <clipPath id="clip"><circle cx="256" cy="256" r="238"/></clipPath>
  </defs>
  <circle cx="256" cy="256" r="250" fill="${border}"/>
  <circle cx="256" cy="256" r="238" fill="${bg}"/>
  <text x="256" y="300" font-size="${fontSize}" text-anchor="middle" fill="${labelColor}" font-family="Noto Sans Telugu, Apple Color Emoji, sans-serif">${label}</text>
</svg>`);
}

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.error("Run: npm install sharp --save-dev");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const icons = [
    {
      file: "shiva.jpg",
      svg: circleIcon({
        bg: "#2a3a4a",
        border: "#c9a227",
        label: "శ",
        fontSize: 220,
      }),
    },
    {
      file: "vidhi.jpg",
      svg: circleIcon({
        bg: "#1a472a",
        border: "#e6c84c",
        label: "వ",
        fontSize: 220,
      }),
    },
  ];

  for (const { file, svg } of icons) {
    const outPath = path.join(OUT_DIR, file);
    await sharp(svg).jpeg({ quality: 92 }).toFile(outPath);
    console.log("Created:", outPath);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
