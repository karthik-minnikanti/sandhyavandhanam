/**
 * Captures Google Play store screenshots (phone, 7" tablet, 10" tablet).
 *
 * Prereq: npm install playwright --save-dev && npx playwright install chromium
 *
 * Usage:
 *   npm run capture:screenshots
 */
const { chromium } = require("playwright");
const sharp = require("sharp");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets", "store", "screenshots");
const PORT = process.env.SCREENSHOT_PORT || "8082";
const BASE_URL = process.env.SCREENSHOT_URL || `http://localhost:${PORT}`;
const START_SERVER = process.env.SCREENSHOT_URL == null;

// Logical viewport (what RN sees) × deviceScaleFactor → PNG pixel size for Play Store.
const FORM_FACTORS = [
  {
    // ~6" phone (18:9) — logical 360×720 @3x → 1080×2160
    id: "phone",
    width: 360,
    height: 720,
    deviceScaleFactor: 3,
    outWidth: 1080,
    outHeight: 2160,
    isMobile: true,
  },
  {
    id: "tablet-7",
    width: 600,
    height: 960,
    deviceScaleFactor: 2,
    outWidth: 1200,
    outHeight: 1920,
    isMobile: false,
  },
  {
    id: "tablet-10",
    width: 800,
    height: 1280,
    deviceScaleFactor: 2,
    outWidth: 1600,
    outHeight: 2560,
    isMobile: false,
  },
];

const SCREENS = [
  { file: "01-book-cover", path: "/", waitFor: "సంధ్యావందనం" },
  { file: "02-contents", path: "/toc", waitFor: "Contents" },
  { file: "03-sandhyavandanam", path: "/sandhyavandanam/4", waitFor: "Contents" },
  { file: "04-lalitha-sahasranamam", path: "/lalitha/4", waitFor: "Contents" },
  { file: "05-preferences", path: "/preferences", waitFor: "Preferences" },
];

function waitForServer(url, timeoutMs = 120000) {
  const { hostname, port } = new URL(url);
  const started = Date.now();

  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.request(
        { hostname, port, path: "/", method: "GET", timeout: 3000 },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on("error", () => {
        if (Date.now() - started > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }
        setTimeout(tick, 1500);
      });
      req.end();
    };
    tick();
  });
}

function startExpoWeb() {
  return spawn("npx", ["expo", "start", "--web", "--port", PORT], {
    cwd: ROOT,
    env: {
      ...process.env,
      EXPO_PUBLIC_SCREENSHOT_MODE: "1",
      CI: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
}

async function applyViewport(page, formFactor) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: formFactor.width,
    height: formFactor.height,
    deviceScaleFactor: formFactor.deviceScaleFactor,
    mobile: formFactor.isMobile,
    screenWidth: formFactor.width,
    screenHeight: formFactor.height,
  });

  await page.setViewportSize({
    width: formFactor.width,
    height: formFactor.height,
  });
}

async function injectFullScreenStyles(page, formFactor) {
  await page.addStyleTag({
    content: `
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: ${formFactor.width}px !important;
        height: ${formFactor.height}px !important;
        overflow: hidden !important;
        background: #0f2e1e !important;
      }
      #root {
        width: ${formFactor.width}px !important;
        height: ${formFactor.height}px !important;
        max-width: none !important;
        max-height: none !important;
        flex: 1 !important;
        display: flex !important;
      }
    `,
  });
}

async function waitForAppReady(page, waitFor) {
  await page.waitForFunction(
    () => document.getElementById("root")?.childElementCount > 0,
    { timeout: 45000 }
  );
  if (waitFor) {
    await page.locator(`text=${waitFor}`).first().waitFor({
      state: "visible",
      timeout: 45000,
    });
  }
  await page.evaluate(() => window.dispatchEvent(new Event("resize")));
  await page.waitForTimeout(600);
}

async function saveScreenshot(buffer, outPath, formFactor) {
  let pipeline = sharp(buffer).flatten({ background: "#0f2e1e" });
  const meta = await pipeline.metadata();
  if (meta.width !== formFactor.outWidth || meta.height !== formFactor.outHeight) {
    pipeline = pipeline.resize(formFactor.outWidth, formFactor.outHeight, { fit: "fill" });
  }
  await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
}

async function captureScreen(page, formFactor, screen, dir) {
  const url = `${BASE_URL}${screen.path}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await injectFullScreenStyles(page, formFactor);
  await waitForAppReady(page, screen.waitFor);

  const dims = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    rootWidth: document.getElementById("root")?.clientWidth,
    rootHeight: document.getElementById("root")?.clientHeight,
  }));
  console.log(
    `  ${screen.file}: window ${dims.innerWidth}x${dims.innerHeight}, root ${dims.rootWidth}x${dims.rootHeight}`
  );

  const shot = await page.screenshot({
    type: "png",
    fullPage: false,
    scale: "device",
  });
  const outPath = path.join(dir, `${screen.file}.png`);
  await saveScreenshot(shot, outPath, formFactor);
  console.log(`  ✓ ${screen.file}.png → ${formFactor.outWidth}x${formFactor.outHeight}`);
}

async function captureAll() {
  let expoProcess = null;

  if (START_SERVER) {
    console.log("Starting Expo web (screenshot mode)...");
    expoProcess = startExpoWeb();
    expoProcess.stdout?.on("data", (d) => process.stdout.write(d));
    expoProcess.stderr?.on("data", (d) => process.stderr.write(d));
    await waitForServer(BASE_URL);
    await new Promise((r) => setTimeout(r, 8000));
  }

  const browser = await chromium.launch({ headless: true });

  try {
    for (const formFactor of FORM_FACTORS) {
      const dir = path.join(OUT_DIR, formFactor.id);
      fs.mkdirSync(dir, { recursive: true });
      console.log(
        `\n${formFactor.id}: logical ${formFactor.width}x${formFactor.height} @${formFactor.deviceScaleFactor}x → ${formFactor.outWidth}x${formFactor.outHeight}`
      );

      const context = await browser.newContext({
        viewport: {
          width: formFactor.width,
          height: formFactor.height,
        },
        deviceScaleFactor: formFactor.deviceScaleFactor,
        isMobile: formFactor.isMobile,
        hasTouch: true,
        colorScheme: "dark",
        locale: "en-US",
        screen: {
          width: formFactor.width,
          height: formFactor.height,
        },
      });

      await context.addInitScript((w, h) => {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute(
            "content",
            `width=${w}, height=${h}, initial-scale=1, maximum-scale=1, user-scalable=no`
          );
        }
      }, formFactor.width, formFactor.height);

      const page = await context.newPage();
      await applyViewport(page, formFactor);

      for (const screen of SCREENS) {
        await captureScreen(page, formFactor, screen, dir);
      }

      await context.close();
    }
  } finally {
    await browser.close();
    if (expoProcess) {
      expoProcess.kill("SIGTERM");
    }
  }

  console.log(`\nDone. Screenshots saved under ${OUT_DIR}`);
}

captureAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
