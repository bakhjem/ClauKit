#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const script = args.script;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  if (!script) {
    outputError(new Error('--script is required'));
    return;
  }

  try {
    await withBrowser(args, async (page) => {
      if (url) await page.goto(url, { timeout, waitUntil });
      const wrapped = `(async () => { return (${script}); })()`;
      const result = await page.evaluate(wrapped);
      outputJSON({
        success: true,
        result,
        url: page.url(),
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
