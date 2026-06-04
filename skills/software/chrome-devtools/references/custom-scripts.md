# Custom Scripts

For complex automation that doesn't fit a single CLI invocation, write custom scripts using the shared `lib/browser.js` helpers.

## Template

```bash
mkdir -p .claude/chrome-devtools/tmp

cat > .claude/chrome-devtools/tmp/login-test.js << 'EOF'
import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../scripts/lib/browser.js';

async function loginTest() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.goto('https://example.com/login');
  await page.type('#email', 'user@example.com');
  await page.type('#password', 'secret');
  await page.click('button[type=submit]');
  await page.waitForNavigation();

  outputJSON({
    success: true,
    url: page.url(),
    title: await page.title()
  });

  await disconnectBrowser();
}

loginTest();
EOF

node .claude/chrome-devtools/tmp/login-test.js
```

## Available Helpers (`lib/browser.js`)

| Helper | Purpose |
|---|---|
| `getBrowser()` | Connect to existing session or launch new browser |
| `getPage(browser)` | Get the active page (or open a new one) |
| `disconnectBrowser()` | Disconnect but keep browser alive (default cleanup) |
| `closeBrowser()` | Fully close browser and remove session file |
| `outputJSON(data)` | Print structured JSON to stdout |

## Principles

1. **Single-purpose** — one script, one task. Don't bundle unrelated steps.
2. **Always `disconnectBrowser()` at end** — keeps browser alive for the next script.
3. **`closeBrowser()` only at the end of a full session** — when nothing else will reuse the browser.
4. **Output JSON** — use `outputJSON()` so callers can `jq` the result.
5. **Plain JavaScript inside `page.evaluate()`** — no Node.js modules in page context.

## Workflow Loop

Browser automation is iterative:

1. **Execute** focused script
2. **Observe** JSON output
3. **Assess** completion state
4. **Decide** next action
5. **Repeat**

Incremental beats monolithic — easier to debug, easier to recover, easier to compose.

## Custom Script Patterns

### Conditional flow based on page state

```javascript
import { getBrowser, getPage, disconnectBrowser, outputJSON } from '../scripts/lib/browser.js';

async function ensureLoggedIn() {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await page.goto('https://app.example.com');
  const isLoggedIn = await page.evaluate(() => !!document.querySelector('.user-avatar'));

  if (!isLoggedIn) {
    await page.goto('https://app.example.com/login');
    // ... login steps
  }

  outputJSON({ loggedIn: true, url: page.url() });
  await disconnectBrowser();
}

ensureLoggedIn();
```

### Retry with backoff

```javascript
async function waitForElement(page, selector, maxAttempts = 5) {
  for (let i = 0; i < maxAttempts; i++) {
    const found = await page.$(selector);
    if (found) return found;
    await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
  }
  throw new Error(`Element ${selector} not found after ${maxAttempts} attempts`);
}
```

### Capture data across navigation

```javascript
const collected = [];
page.on('response', async (res) => {
  if (res.url().includes('/api/')) {
    collected.push({ url: res.url(), status: res.status() });
  }
});

await page.goto('https://app.example.com');
await page.click('.load-more');
await new Promise(r => setTimeout(r, 2000));

outputJSON({ apiCalls: collected });
```
