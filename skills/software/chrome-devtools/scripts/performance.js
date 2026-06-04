#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';

async function collectVitals(page) {
  return await page.evaluate(() => {
    return new Promise((resolve) => {
      const result = { FCP: null, LCP: null, CLS: 0, TTFB: null, FID: null };
      const nav = performance.getEntriesByType('navigation')[0];
      if (nav) result.TTFB = nav.responseStart - nav.requestStart;

      const paintEntries = performance.getEntriesByType('paint');
      for (const e of paintEntries) {
        if (e.name === 'first-contentful-paint') result.FCP = e.startTime;
      }

      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) result.LCP = last.startTime;
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) result.CLS += entry.value;
          }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            result.FID = entry.processingStart - entry.startTime;
            break;
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch {}

      setTimeout(() => resolve(result), 3000);
    });
  });
}

async function main() {
  const args = parseArgs();
  const url = args.url;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      if (url) await page.goto(url, { timeout, waitUntil });
      const vitals = await collectVitals(page);

      const memory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          };
        }
        return null;
      });

      outputJSON({
        success: true,
        url: page.url(),
        vitals,
        memory,
      });
    });
  } catch (err) {
    outputError(err);
  }
}

main();
