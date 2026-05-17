# Puppeteer — Advanced Patterns

Beyond the core API. For lifecycle/navigation/selectors/interaction see [puppeteer-api.md](puppeteer-api.md).

## Evaluation (page context)

```js
const title = await page.evaluate(() => document.title);

// Pass args (serializable only)
const result = await page.evaluate((threshold) => {
  return document.querySelectorAll('img').length > threshold;
}, 10);

// ElementHandle.evaluate
const button = await page.$('button');
await button.evaluate((el) => el.scrollIntoView());
```

**Constraints:**
- Code runs in the browser; no access to Node modules
- Arguments must be serializable (no functions, DOM nodes, classes)
- Return values must be serializable

## Request Interception

```js
await page.setRequestInterception(true);

page.on('request', (req) => {
  // Block analytics
  if (req.url().includes('google-analytics.com')) return req.abort();
  // Mock an API
  if (req.url().endsWith('/api/user')) {
    return req.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 1, name: 'Test' }),
    });
  }
  req.continue();
});
```

## Emulation

```js
// Built-in device profiles
import { KnownDevices } from 'puppeteer';
await page.emulate(KnownDevices['iPhone 13']);

// Custom viewport
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

// Geolocation
await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });

// User agent
await page.setUserAgent('Mozilla/5.0 ...');

// Timezone / locale via emulation
await page.emulateTimezone('America/Los_Angeles');
```

## Cookies

```js
await page.setCookie({
  name: 'session',
  value: 'abc123',
  domain: '.example.com',
  path: '/',
  httpOnly: true,
  secure: true,
});

const cookies = await page.cookies();
```

## Event Listeners

```js
page.on('console', (msg) => console.log('PAGE:', msg.text()));
page.on('pageerror', (err) => console.error('PAGE ERROR:', err));
page.on('request', (req) => { /* ... */ });
page.on('response', (res) => { /* ... */ });
page.on('requestfailed', (req) => { /* ... */ });
page.on('dialog', async (dialog) => {
  console.log(dialog.message());
  await dialog.accept();
});
```

## Common Patterns

### Wait for a condition that's hard to selector

```js
await page.waitForFunction(
  () => window.dataLayer?.find((e) => e.event === 'purchase_complete'),
  { timeout: 30000 }
);
```

### Retry with backoff

```js
async function clickWithRetry(page, selector, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await page.click(selector, { timeout: 5000 });
      return;
    } catch (err) {
      if (i === maxAttempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** i));
    }
  }
}
```

### Scroll to load lazy content

```js
await page.evaluate(async () => {
  const distance = 100;
  const delay = 100;
  while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
    document.scrollingElement.scrollBy(0, distance);
    await new Promise((r) => setTimeout(r, delay));
  }
});
```

### Capture all in-page console

```js
const logs = [];
page.on('console', (msg) => logs.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', (err) => logs.push({ type: 'pageerror', text: err.message }));
```

## Pitfalls

- **`page.evaluate` and closures**: the function body runs in the browser. You cannot reference Node variables unless passed as args.
- **`waitForNavigation` race**: must be awaited *before* the action that triggers nav:
  ```js
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]'),
  ]);
  ```
- **Cross-origin iframes**: behave like separate pages. Use `frame.click()`, not `page.click()` with frame selector.
- **Headless detection**: some sites block headless. Use `--disable-blink-features=AutomationControlled` (set in `lib/browser.js`) and consider stealth plugins.
- **Memory leaks in long sessions**: dispose ElementHandles you don't need (`handle.dispose()`).
