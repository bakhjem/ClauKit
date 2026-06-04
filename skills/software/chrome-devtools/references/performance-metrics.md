# Performance Metrics

Reference for the Core Web Vitals tracked by `performance.js`. For diagnostics and fixes, see [performance-diagnostics.md](performance-diagnostics.md).

## FCP — First Contentful Paint

Time until the browser renders the first piece of DOM content (text, image, SVG, non-empty canvas).

| Rating | Threshold |
|---|---|
| Good | ≤ 1.8s |
| Needs work | 1.8s – 3.0s |
| Poor | > 3.0s |

**What drives it:**
- Server response time (TTFB)
- Render-blocking resources (CSS, sync JS in `<head>`)
- Font loading
- Long DOM tree

## LCP — Largest Contentful Paint

Time until the largest visible element (image, video poster, large text block) is rendered.

| Rating | Threshold |
|---|---|
| Good | ≤ 2.5s |
| Needs work | 2.5s – 4.0s |
| Poor | > 4.0s |

**What drives it:**
- Resource load time of the LCP element (usually a hero image)
- Render-blocking JS / CSS delaying first paint
- Client-side rendering pushing LCP to after hydration

## CLS — Cumulative Layout Shift

Sum of unexpected layout shifts during page lifespan. Unitless.

| Rating | Threshold |
|---|---|
| Good | ≤ 0.1 |
| Needs work | 0.1 – 0.25 |
| Poor | > 0.25 |

**What drives it:**
- Images / iframes without explicit `width`/`height`
- Ads, embeds, banners injected after load
- Web fonts causing FOUT/FOIT
- Animations using `top`/`left` instead of `transform`

## TTFB — Time to First Byte

Time from request start to when the first byte of the response arrives.

| Rating | Threshold |
|---|---|
| Good | ≤ 800ms |
| Needs work | 800ms – 1800ms |
| Poor | > 1800ms |

**What drives it:**
- Server processing time
- Database queries
- CDN distance
- Redirects

## FID — First Input Delay *(legacy)*

Time from first user interaction to when the browser can respond. Being replaced by **INP** in real-user metrics, but still emitted by `PerformanceObserver`.

| Rating | Threshold |
|---|---|
| Good | ≤ 100ms |
| Needs work | 100ms – 300ms |
| Poor | > 300ms |

## INP — Interaction to Next Paint *(modern)*

Worst interaction latency observed during the page's lifecycle. Captures keyboard, click, tap.

| Rating | Threshold |
|---|---|
| Good | ≤ 200ms |
| Needs work | 200ms – 500ms |
| Poor | > 500ms |

INP is not collected by default in `performance.js` since it requires real user interaction during the measurement window. To measure synthetically, script the interaction:

```bash
node navigate.js --url https://example.com
node evaluate.js --script "
  const obs = new PerformanceObserver(list => window.__inp = list.getEntries());
  obs.observe({ type: 'event', buffered: true, durationThreshold: 16 });
"
node click.js --selector "button"
node evaluate.js --script "
  Math.max(...(window.__inp || []).map(e => e.duration))
"
```

## Synthetic vs Field

What `performance.js` shows is **synthetic** (lab) data — one run, one network, one device. It catches regressions but doesn't reflect real user experience.

| Use synthetic for | Use field data (RUM) for |
|---|---|
| Regression detection in CI | Real user impact |
| Comparing two builds | 75th percentile (Google's threshold) |
| Local development | Geographic and device diversity |

For real-user data, integrate the `web-vitals` library or use CrUX (Chrome User Experience Report).

## Budgets

A practical CI budget for a content-heavy site:

```json
{
  "FCP": 1800,
  "LCP": 2500,
  "CLS": 0.1,
  "TTFB": 800
}
```

For SPAs / dashboards, LCP budgets often need to be higher (3–4s) because of hydration overhead. Measure your own baseline before setting limits.
