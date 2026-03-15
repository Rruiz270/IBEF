#!/usr/bin/env node

/**
 * Generate PWA icons from the SVG source.
 * Usage: node scripts/generate-pwa-icons.mjs
 * Requires: npm install --save-dev sharp
 */

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ICONS_DIR = join(ROOT, 'public', 'icons');
const SVG_PATH = join(ICONS_DIR, 'icon.svg');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function main() {
  await mkdir(ICONS_DIR, { recursive: true });

  for (const size of SIZES) {
    const outPath = join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(SVG_PATH)
      .resize(size, size)
      .png()
      .toFile(outPath);
    console.log(`  ✓ ${outPath}`);
  }

  // Maskable icon: same image with extra safe-zone padding (10% inset)
  const maskableSize = 512;
  const innerSize = Math.round(maskableSize * 0.8);
  const offset = Math.round((maskableSize - innerSize) / 2);

  const innerBuf = await sharp(SVG_PATH)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  const maskablePath = join(ICONS_DIR, `icon-maskable-${maskableSize}x${maskableSize}.png`);
  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: { r: 10, g: 36, b: 99, alpha: 1 }, // #0A2463
    },
  })
    .composite([{ input: innerBuf, left: offset, top: offset }])
    .png()
    .toFile(maskablePath);

  console.log(`  ✓ ${maskablePath} (maskable)`);
  console.log('\nDone! All PWA icons generated.');
}

main().catch((err) => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
