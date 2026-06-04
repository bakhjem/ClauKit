# Performance Guide (index)

How `performance.js` collects metrics, what each means, and how to fix regressions.

Split across focused modules:

- [performance-metrics.md](performance-metrics.md) — the metrics: FCP, LCP, CLS, TTFB, FID, INP (thresholds + what drives each)
- [performance-diagnostics.md](performance-diagnostics.md) — how the script collects them, diagnostic workflow, common fixes, CI integration

## Quick map

| If you need to... | See |
|---|---|
| Understand what a metric means | [performance-metrics.md](performance-metrics.md) |
| Find which metric to budget against | [performance-metrics.md](performance-metrics.md) |
| Measure INP synthetically | [performance-metrics.md#inp](performance-metrics.md#inp--interaction-to-next-paint-modern) |
| Diagnose a poor LCP | [performance-diagnostics.md#step-2-identify-the-bottleneck](performance-diagnostics.md#step-2-identify-the-bottleneck) |
| See common fixes by symptom | [performance-diagnostics.md#common-fixes](performance-diagnostics.md#common-fixes) |
| Add a CI budget check | [performance-diagnostics.md#ci-integration](performance-diagnostics.md#ci-integration) |

## References

- web.dev Core Web Vitals: <https://web.dev/vitals/>
- Lighthouse scoring: <https://developer.chrome.com/docs/lighthouse/performance/performance-scoring>
- `web-vitals` library (RUM): <https://github.com/GoogleChrome/web-vitals>
- INP migration: <https://web.dev/inp/>
