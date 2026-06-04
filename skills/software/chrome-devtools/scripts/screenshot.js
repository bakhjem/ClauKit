#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';
import { statSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

async function compressIfNeeded(filePath, maxSizeMB, noCompress) {
  if (noCompress) return { compressed: false };
  const stats = statSync(filePath);
  const sizeMB = stats.size / (1024 * 1024);
  if (sizeMB <= maxSizeMB) return { compressed: false, sizeMB };

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    return { compressed: false, sizeMB, note: 'sharp not installed; skipping compression' };
  }

  const buf = readFileSync(filePath);
  let quality = 80;
  let output = await sharp(buf).png({ quality, compressionLevel: 9 }).toBuffer();
  while (output.length / (1024 * 1024) > maxSizeMB && quality > 30) {
    quality -= 10;
    output = await sharp(buf).png({ quality, compressionLevel: 9 }).toBuffer();
  }
  writeFileSync(filePath, output);
  return {
    compressed: true,
    originalSizeMB: sizeMB,
    newSizeMB: output.length / (1024 * 1024),
    quality,
  };
}

async function main() {
  const args = parseArgs();
  const url = args.url;
  const output = args.output ? resolve(args.output) : null;
  const fullPage = args['full-page'] === 'true' || args['full-page'] === true;
  const selector = args.selector;
  const maxSize = args['max-size'] ? parseFloat(args['max-size']) : 5;
  const noCompress = args['no-compress'] === true || args['no-compress'] === 'true';
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  if (!output) {
    outputError(new Error('--output is required'));
    return;
  }

  const outputDir = dirname(output);
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  try {
    await withBrowser(args, async (page) => {
      if (url) await page.goto(url, { timeout, waitUntil });

      if (selector) {
        const el = await page.$(selector);
        if (!el) throw new Error(`Element not found: ${selector}`);
        await el.screenshot({ path: output });
      } else {
        await page.screenshot({ path: output, fullPage });
      }

      const compression = await compressIfNeeded(output, maxSize, noCompress);
      const finalStats = statSync(output);

      outputJSON({
        success: true,
        path: output,
        sizeMB: finalStats.size / (1024 * 1024),
        fullPage,
        selector: selector ?? null,
        compression,
      });
    });
  } catch (err) {
    outputError(err, { output });
  }
}

main();
