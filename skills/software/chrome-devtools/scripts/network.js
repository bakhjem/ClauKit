#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function main() {
  const args = parseArgs();
  const url = args.url;
  const duration = args.duration ? parseInt(args.duration, 10) : 0;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';
  const filterType = args.type;

  try {
    await withBrowser(args, async (page) => {
      const requests = new Map();

      page.on('request', (req) => {
        if (filterType && req.resourceType() !== filterType) return;
        requests.set(req, {
          url: req.url(),
          method: req.method(),
          resourceType: req.resourceType(),
          headers: req.headers(),
          postData: req.postData() || null,
          startTime: Date.now(),
        });
      });

      page.on('response', (res) => {
        const req = res.request();
        const entry = requests.get(req);
        if (!entry) return;
        entry.response = {
          status: res.status(),
          statusText: res.statusText(),
          headers: res.headers(),
          fromCache: res.fromCache(),
        };
        entry.endTime = Date.now();
        entry.durationMs = entry.endTime - entry.startTime;
      });

      page.on('requestfailed', (req) => {
        const entry = requests.get(req);
        if (!entry) return;
        entry.failed = true;
        entry.failure = req.failure()?.errorText || 'unknown';
        entry.endTime = Date.now();
      });

      if (url) await page.goto(url, { timeout, waitUntil });
      if (duration > 0) await new Promise((r) => setTimeout(r, duration));

      const list = Array.from(requests.values());
      outputJSON({
        success: true,
        url: page.url(),
        count: list.length,
        requests: list,
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
