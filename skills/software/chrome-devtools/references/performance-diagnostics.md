# Performance Diagnostics

How `performance.js` collects metrics, the diagnostic workflow, common fixes, and CI integration. For metric definitions see [performance-metrics.md](performance-metrics.md).

## How `performance.js` Collects Metrics

```js
// Inside page.evaluate
const lcpObserver = new PerformanceObserver((list) => {
  const last = list.getEntries().pop();
  result.LCP = last.startTime;
});
lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
```

**Key detail**: `buffered: true` returns entries observed *before* the observer was registered — necessary because the page is already partially loaded by the time the script connects.

The script waits 3 seconds after page load to let LCP/CLS stabilize, then returns the snapshot.

## Diagnostics Workflow

### Step 1: Get a baseline

```bash
node performance.js --url https://example.com | jq '.vitals'
```

### Step 2: Identify the bottleneck

If **LCP is poor**:

```bash
# Find the LCP element
node evaluate.js --url https://example.com --script "
  new Promise(r => {
    new PerformanceObserver(list => {
      const e = list.getEntries().pop();
      r({ element: e.element?.tagName, url: e.url, size: e.size, time: e.startTime });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  })
"
```

If **CLS is poor**:

```bash
# List shifts and their sources
node evaluate.js --url https://example.com --script "
  new Promise(r => {
    const shifts = [];
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        shifts.push({ value: e.value, sources: (e.sources || []).map(s => s.node?.tagName) });
      }
      r(shifts);
    }).observe({ type: 'layout-shift', buffered: true });
    setTimeout(() => r(shifts), 3000);
  })
"
```

If **TTFB is poor**:

```bash
# Inspect server-timing and resource timing
node evaluate.js --url https://example.com --script "
  const nav = performance.getEntriesByType('navigation')[0];
  ({
    dns: nav.domainLookupEnd - nav.domainLookupStart,
    tcp: nav.connectEnd - nav.connectStart,
    tls: nav.secureConnectionStart > 0 ? nav.connectEnd - nav.secureConnectionStart : 0,
    request: nav.responseStart - nav.requestStart,
    serverTiming: nav.serverTiming
  })
"
```

### Step 3: Profile heavy resources

```bash
node network.js --url https://example.com | jq '
  .requests
  | sort_by(.durationMs)
  | reverse
  | .[0:10]
  | map({ url, durationMs, resourceType, status: .response.status })
'
```

## Common Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| LCP > 4s with image hero | Large unoptimized image | Convert to WebP/AVIF; serve responsive `srcset`; add `fetchpriority="high"` |
| LCP > 4s with text hero | Render-blocking JS/CSS | Defer non-critical JS; inline critical CSS; preload web fonts |
| CLS > 0.25 from images | Missing dimensions | Add explicit `width` + `height` (browsers infer aspect ratio) |
| CLS > 0.25 from ads | Late-injected content | Reserve space with `min-height`; use `aspect-ratio` |
| CLS from fonts | FOUT swap | Use `font-display: optional`; preload critical fonts |
| FID/INP poor | Long JS tasks | Break tasks with `scheduler.yield()`, web workers, code-split |
| TTFB > 1.8s | Slow server / cold start | CDN, edge functions, DB query optimization, response caching |
| FCP poor but TTFB good | Render-blocking head | Move scripts to body or add `defer`; inline critical CSS |

## CI Integration

```bash
#!/usr/bin/env bash
set -e

VITALS=$(node performance.js --url "$STAGING_URL" | jq -c '.vitals')
LCP=$(echo "$VITALS" | jq '.LCP')
CLS=$(echo "$VITALS" | jq '.CLS')

if (( $(echo "$LCP > 2500" | bc -l) )); then
  echo "LCP regression: ${LCP}ms (budget 2500ms)"
  exit 1
fi

if (( $(echo "$CLS > 0.1" | bc -l) )); then
  echo "CLS regression: ${CLS} (budget 0.1)"
  exit 1
fi

echo "Performance check passed: $VITALS"
```
