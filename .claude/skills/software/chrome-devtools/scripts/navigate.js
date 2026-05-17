#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      if (url) {
        const response = await page.goto(url, { timeout, waitUntil });
        outputJSON({
          success: true,
          url: page.url(),
          title: await page.title(),
          status: response?.status() ?? null,
        });
      } else {
        outputJSON({
          success: true,
          url: page.url(),
          title: await page.title(),
        });
      }
    });
  } catch (err) {
    outputError(err, { url });
  }
}

main();
