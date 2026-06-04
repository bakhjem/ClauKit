#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const duration = args.duration ? parseInt(args.duration, 10) : 5000;
  const types = args.types
    ? String(args.types).split(',').map((s) => s.trim())
    : null;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      const messages = [];

      page.on('console', (msg) => {
        const type = msg.type();
        if (types && !types.includes(type)) return;
        messages.push({
          type,
          text: msg.text(),
          location: msg.location(),
          timestamp: Date.now(),
        });
      });

      page.on('pageerror', (err) => {
        if (types && !types.includes('pageerror')) return;
        messages.push({
          type: 'pageerror',
          text: err.message,
          stack: err.stack,
          timestamp: Date.now(),
        });
      });

      if (url) await page.goto(url, { timeout, waitUntil });

      await new Promise((r) => setTimeout(r, duration));

      outputJSON({
        success: true,
        url: page.url(),
        duration,
        types: types || 'all',
        count: messages.length,
        messages,
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
