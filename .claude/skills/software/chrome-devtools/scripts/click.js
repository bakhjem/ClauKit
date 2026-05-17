#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const selector = args.selector;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const button = args.button || 'left';
  const clickCount = args['click-count'] ? parseInt(args['click-count'], 10) : 1;

  if (!selector) {
    outputError(new Error('--selector is required'));
    return;
  }

  try {
    await withBrowser(args, async (page) => {
      await page.waitForSelector(selector, { timeout });
      await page.click(selector, { button, clickCount });
      outputJSON({
        success: true,
        selector,
        button,
        clickCount,
        url: page.url(),
      });
    });
  } catch (err) {
    outputError(err, { selector });
  }
}

main();
