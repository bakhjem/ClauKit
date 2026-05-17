#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const selector = args.selector;
  const value = args.value ?? '';
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const clear = args.clear !== 'false' && args.clear !== false;

  if (!selector) {
    outputError(new Error('--selector is required'));
    return;
  }

  try {
    await withBrowser(args, async (page) => {
      await page.waitForSelector(selector, { timeout });
      if (clear) {
        await page.$eval(selector, (el) => {
          if ('value' in el) el.value = '';
        });
      }
      await page.type(selector, String(value));
      outputJSON({
        success: true,
        selector,
        valueLength: String(value).length,
        url: page.url(),
      });
    });
  } catch (err) {
    outputError(err, { selector });
  }
}

main();
