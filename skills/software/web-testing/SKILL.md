---
name: web-testing
description: Web-app testing for developers — Vitest unit, Playwright E2E (overview), k6 load. Three layers on a web stack.
category: Testing & Debug
status: active
---

# Web Testing: Unit, E2E, & Load (Developer Toolkit)

## Purpose

Three-layer **web application** testing for the developer who ships the app: unit (Vitest), end-to-end (Playwright overview), load (k6). Web stack only.

## Scope vs `test-automation`

Use this skill when you are the **app developer** validating your own web app across unit/E2E/load layers.

Use the [`test-automation`](../development/test-automation/SKILL.md) skill when you are the **QA / automation engineer** building test infrastructure that spans web + mobile + API + BDD — or when you need deep Playwright configuration (page objects, config presets, CI matrix, debugging tools, credential management).

Canonical content split:
- **Playwright deep-dive** (configs, page objects, debugging, CI/CD) → `test-automation`
- **Vitest unit + k6 load** → here (this skill)
- **Brief Playwright E2E overview** for developers → here

## When to Use

- **Unit Testing**: Individual functions, components, utilities (Vitest)
- **Quick E2E**: Single critical user workflow on live browser (Playwright overview)
- **Load Testing**: Validate API/app performance under load (k6)
- **Regression**: Run full test suite after features/fixes
- **CI/CD gates**: Automated testing before deployment
- **Performance baselines**: Establish expected response times, throughput

**Do NOT use when**: Building cross-platform automation infra → `test-automation`. Testing legacy code without tests (refactor first). Testing third-party SaaS behavior.

## Workflow

### Unit Tests (Vitest)

1. **Configure Vitest** — `vitest.config.ts` defines environment (jsdom for browser APIs), coverage thresholds, reporters.

2. **Write Tests** — Create `.test.ts`/`.spec.ts` files colocated with source code.

3. **Run Suite** — `npm run test` executes all tests; `npm run test:watch` re-runs on file changes.

4. **Coverage Report** — `npm run test:coverage` generates HTML report at `coverage/index.html`.

### E2E Tests (Playwright — overview)

Quick developer-facing recipe. **For configs, page objects, debugging deep-dive, CI/CD setup, credential mgmt → see [`test-automation`](../development/test-automation/SKILL.md).**

1. `npx playwright install` — Chromium/Firefox/WebKit binaries.
2. `playwright.config.ts` — browsers, base URL, timeouts (defaults are fine for most apps).
3. Tests live in `tests/e2e/`. Use `data-testid` selectors.
4. `npm run test:e2e` headless; `--headed` opens browser; `--debug` Inspector; `--ui` watch viewer.
5. `--trace on` generates HAR + screenshots for flaky-test triage.

### Load Tests (k6)

1. **Write Script** — JavaScript file defining virtual users, request patterns, assertions (response time, status codes).

2. **Run Locally** — `k6 run script.js` simulates load; shows real-time metrics (throughput, p95 latency, error rate).

3. **Scale Testing** — Increase virtual users, ramp-up duration in script; use k6 Cloud for distributed load.

4. **Analyze Results** — k6 outputs summaries; integrate with Grafana for dashboards and SLA validation.

## Key Concepts

### Playwright basics

Page objects + wait strategies are **covered in depth in [`test-automation`](../development/test-automation/SKILL.md)**. One rule to remember for developers: never use `waitForTimeout(ms)` — use `waitForSelector` / `expect(...).toBeVisible()` so tests don't go flaky.

### k6 Load Test Structure
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,        // 10 virtual users
  duration: '30s', // 30 second test
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95th percentile < 500ms
    http_req_failed: ['rate<0.1'],     // < 10% error rate
  },
};

export default function () {
  const res = http.get('https://api.example.com/data');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

### Vitest Smart Watch
Intelligently re-runs only affected tests when files change. Configuration:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    watch: false,  // Default; enable with --watch CLI flag
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts'],
    },
  },
});
```

## Example

```bash
# Unit tests: run all, watch mode
npm run test:watch

# E2E: run specific test with headed browser
npx playwright test tests/e2e/login.spec.ts --headed

# E2E: debug with Inspector
npx playwright test tests/e2e/checkout.spec.ts --debug

# Load test: 50 users, 5min ramp-up
k6 run -e USERS=50 -e RAMP_UP=5m load-test.js

# Generate Playwright trace
npx playwright test --trace on
```

## Common Pitfalls

- **Flaky E2E tests**: Non-deterministic waits, network timing assumptions. Use explicit waits for elements, not sleeps.
- **Over-testing in E2E**: Tests should cover user workflows, not implementation. Avoid testing every button click; use unit tests.
- **Load test spikes**: Too few ramp-up users → unrealistic traffic. Gradually increase VUs: start low, monitor metrics, scale methodically.
- **Ignoring test failure context**: "Test failed" without logs is useless. Always capture screenshots, HAR files, console logs.
- **No baseline metrics**: Can't detect performance regression without baseline. Run load tests regularly; establish SLAs.
- **Brittle selectors**: CSS/XPath selectors break on layout changes. Use `data-testid` attributes, stable selectors.

## References

- [Playwright Documentation](https://playwright.dev/docs/intro) — E2E framework (deep-dive in `test-automation` skill)
- [Vitest Documentation](https://vitest.dev/) — Unit testing, Jest-compatible, TypeScript-native, smart watch
- [Grafana k6 Documentation](https://grafana.com/docs/k6/latest/) — Load testing, distributed runs, SLA validation
- [`test-automation` skill](../development/test-automation/SKILL.md) — Playwright deep-dive + BDD + mobile + API automation
