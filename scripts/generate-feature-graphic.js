/**
 * Generates a 1024x500 Google Play feature graphic for VedGayathri.
 * Requires: npm install sharp --save-dev
 *
 * Usage: node scripts/generate-feature-graphic.js
 */
const path = require("path");
const fs = require("fs");

const WIDTH = 1024;
const HEIGHT = 500;
const ASSETS = path.join(__dirname, "..", "assets");
const SRC = path.join(ASSETS, "gayatri-mata.jpg");
const OUT = path.join(ASSETS, "store", "play-feature-graphic.png");

// Right text panel — center all copy here
const PANEL = { x: 430, y: 36, width: 560, height: 428 };
const TEXT_CENTER_X = PANEL.x + PANEL.width / 2;

// Portrait frame — source image is 654×952; contain avoids cropping faces.
const IMG = { x: 72, y: 40, width: 268, height: 420 };

function backgroundSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f2e1e"/>
      <stop offset="100%" stop-color="#163d28"/>
    </linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a472a"/>
      <stop offset="100%" stop-color="#143a24"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="18" height="${HEIGHT}" fill="#245c38"/>
  <rect x="4" y="80" width="6" height="340" rx="2" fill="#c9a227" opacity="0.85"/>
  <rect x="${IMG.x - 12}" y="${IMG.y - 12}" width="${IMG.width + 24}" height="${IMG.height + 24}" rx="20" fill="url(#panel)" stroke="#c9a227" stroke-width="3"/>
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.width}" height="${PANEL.height}" rx="18" fill="#1a472a" opacity="0.55" stroke="#c9a227" stroke-width="2"/>
</svg>`);
}

function overlaySvg() {
  const lineHalf = 220;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect x="${IMG.x}" y="${IMG.y}" width="${IMG.width}" height="${IMG.height}" rx="14" fill="none" stroke="#e6c84c" stroke-width="2" opacity="0.9"/>
  <text x="${TEXT_CENTER_X}" y="148" font-size="72" text-anchor="middle" fill="#e6c84c" font-family="Devanagari MT, Noto Sans Devanagari, serif">&#2384;</text>
  <text x="${TEXT_CENTER_X}" y="228" font-size="58" text-anchor="middle" fill="#f5f0e6" font-family="Georgia, Times New Roman, serif" font-weight="bold">VedGayathri</text>
  <line x1="${TEXT_CENTER_X - lineHalf}" y1="252" x2="${TEXT_CENTER_X + lineHalf}" y2="252" stroke="#c9a227" stroke-width="2" opacity="0.8"/>
  <text x="${TEXT_CENTER_X}" y="302" font-size="30" text-anchor="middle" fill="#f5f0e6" font-family="Helvetica, Arial, sans-serif">Telugu prayers, rituals &amp; stotrams</text>
  <text x="${TEXT_CENTER_X}" y="358" font-size="24" text-anchor="middle" fill="#b8b0a0" font-family="Helvetica, Arial, sans-serif">Read  ·  Listen  ·  Practice daily</text>
  <text x="${TEXT_CENTER_X}" y="410" font-size="20" text-anchor="middle" fill="#c9a227" font-family="Helvetica, Arial, sans-serif" letter-spacing="1">Your devotional companion</text>
</svg>`);
}

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch (_) {
    console.error("Run: npm install sharp --save-dev");
    process.exit(1);
  }

  if (!fs.existsSync(SRC)) {
    console.error("Source image not found:", SRC);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });

  const padTop = 32;
  const padSide = 16;
  const padBottom = 14;
  const innerW = IMG.width - padSide * 2;
  const innerH = IMG.height - padTop - padBottom;
  const scale = 0.88;

  const photo = await sharp(SRC)
    .resize(
      Math.round(innerW * scale),
      Math.round(innerH * scale),
      { fit: "inside" }
    )
    .png()
    .toBuffer();

  const photoMeta = await sharp(photo).metadata();
  const photoLeft = IMG.x + padSide + Math.round((innerW - photoMeta.width) / 2);
  const photoTop = IMG.y + padTop;

  const background = await sharp(backgroundSvg()).png().toBuffer();
  const overlay = await sharp(overlaySvg()).png().toBuffer();

  await sharp(background)
    .composite([
      { input: photo, top: photoTop, left: photoLeft },
      { input: overlay, top: 0, left: 0 },
    ])
    .png()
    .toFile(OUT);

  const { width, height, size } = await sharp(OUT).metadata();
  console.log(`Written ${OUT} (${width}x${height}, ${Math.round(size / 1024)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
