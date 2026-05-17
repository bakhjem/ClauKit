#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

async function extractInteractiveElements(page) {
  return await page.evaluate(() => {
    const selectors = [
      'a[href]',
      'button',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="link"]',
      '[role="textbox"]',
      '[role="checkbox"]',
      '[role="radio"]',
      '[tabindex]:not([tabindex="-1"])',
    ];
    const elements = document.querySelectorAll(selectors.join(','));
    const result = [];
    let idx = 1;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      const text = (el.innerText || el.value || el.placeholder || el.getAttribute('aria-label') || '')
        .trim()
        .slice(0, 100);
      result.push({
        ref: `e${idx++}`,
        tag: el.tagName.toLowerCase(),
        type: el.type || el.getAttribute('role') || null,
        text,
        href: el.href || null,
        name: el.name || null,
        id: el.id || null,
        disabled: el.disabled || false,
        checked: el.checked || false,
        bbox: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      });
    }
    return result;
  });
}

async function main() {
  const args = parseArgs();
  const url = args.url;
  const output = args.output ? resolve(args.output) : null;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      if (url) await page.goto(url, { timeout, waitUntil });
      const elements = await extractInteractiveElements(page);
      const result = {
        success: true,
        url: page.url(),
        title: await page.title(),
        count: elements.length,
        elements,
      };
      if (output) {
        const dir = dirname(output);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(output, JSON.stringify(result, null, 2));
        outputJSON({ success: true, path: output, count: elements.length });
      } else {
        outputJSON(result);
      }
    });
  } catch (err) {
    outputError(err);
  }
}

main();
