/**
 * Generates a 1024x1024 adaptive icon with the source image centered and scaled
 * to fit Android's safe zone (~66% of the canvas) so the icon is not truncated.
 * Requires: npm install sharp --save-dev
 */
const path = require("path");
const fs = require("fs");

const ASSETS = path.join(__dirname, "..", "assets");
const SRC = path.join(ASSETS, "gayatri-mata.jpg");
const OUT = path.join(ASSETS, "icon-adaptive.png");
const SIZE = 1024;
const SAFE_ZONE = 0.66; // Android safe zone: inner 66% always visible
const BG_COLOR = { r: 26, g: 71, b: 42 }; // #1a472a

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

  const innerSize = Math.round(SIZE * SAFE_ZONE);
  const padding = Math.round((SIZE - innerSize) / 2);

  const resized = await sharp(SRC)
    .resize(innerSize, innerSize, { fit: "contain", background: BG_COLOR })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 3,
      background: BG_COLOR,
    },
  })
    .composite([{ input: resized, top: padding, left: padding }])
    .png()
    .toFile(OUT);

  console.log("Created:", OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
