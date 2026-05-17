# Puppeteer — Core API

Core Puppeteer surface used by every script in this skill.

## Lifecycle

### Launch vs Connect

```js
// Launch a fresh browser
const browser = await puppeteer.launch({ headless: true });

// Connect to an existing browser via WebSocket
const browser = await puppeteer.connect({ browserWSEndpoint: '...' });
```

The skill uses **launch + persisted endpoint + reconnect on next run** — see `lib/browser.js`.

### Pages

```js
const pages = await browser.pages();   // all open tabs
const page = await browser.newPage();  // open a new tab
```

`getPage()` in `lib/browser.js` prefers an existing non-blank tab so sessions feel continuous.

### Clean shutdown

```js
browser.disconnect();   // keep browser alive, drop the client
await browser.close();  // kill browser
```

## Navigation

```js
await page.goto(url, {
  waitUntil: 'load',           // also: domcontentloaded, networkidle0, networkidle2
  timeout: 30000,
});

await page.waitForNavigation({ waitUntil: 'networkidle2' });
await page.waitForURL(/dashboard/);
await page.reload();
await page.goBack();
await page.goForward();
```

### Wait-until strategies

| Strategy | When it resolves |
|---|---|
| `load` | `window.onload` fired |
| `domcontentloaded` | HTML parsed (faster, but resources still loading) |
| `networkidle0` | No network activity for 500ms |
| `networkidle2` | ≤2 connections active for 500ms (good default for SPAs) |

## Selectors

```js
const el = await page.$('button.primary');         // first match or null
const all = await page.$$('a.product-link');       // all matches
const text = await page.$eval('h1', (el) => el.innerText);
const links = await page.$$eval('a', (els) => els.map((e) => e.href));
```

### Wait for elements

```js
await page.waitForSelector('.dashboard', { timeout: 30000, visible: true });
await page.waitForFunction(() => document.readyState === 'complete');
await page.waitForResponse((res) => res.url().includes('/api/data'));
```

## Interaction

```js
await page.click('button[type=submit]');
await page.type('#email', 'user@example.com', { delay: 20 });
await page.select('#country', 'US');
await page.hover('.menu-trigger');
await page.focus('#search');
await page.keyboard.press('Enter');
await page.keyboard.down('Shift');
await page.keyboard.type('Hello');
await page.keyboard.up('Shift');
```

### Mouse

```js
await page.mouse.move(100, 200);
await page.mouse.down();
await page.mouse.move(300, 400);
await page.mouse.up();
await page.mouse.wheel({ deltaY: 500 });
```

## Screenshots

```js
await page.screenshot({ path: 'page.png' });
await page.screenshot({ path: 'full.png', fullPage: true });
await page.screenshot({ clip: { x: 0, y: 0, width: 800, height: 600 } });

const el = await page.$('.card');
await el.screenshot({ path: 'card.png' });

// As buffer
const buffer = await page.screenshot({ encoding: 'binary' });
```

## Forms

```js
// File upload
const input = await page.$('input[type=file]');
await input.uploadFile('./resume.pdf');

// Clear and refill
await page.$eval('#email', (el) => { el.value = ''; });
await page.type('#email', 'new@example.com');
```

## Frames

```js
const frame = page.frames().find((f) => f.url().includes('checkout'));
await frame.click('.pay-button');

// Or by selector
const frameElement = await page.$('iframe#checkout');
const frame = await frameElement.contentFrame();
```

## Element Handles

```js
const button = await page.$('button.submit');
await button.click();
await button.hover();
const text = await button.evaluate((el) => el.innerText);
const isVisible = await button.isIntersectingViewport();
await button.dispose();   // free memory in long-running scripts
```

## Tracing

```js
await page.tracing.start({ path: 'trace.json', screenshots: true });
await page.goto('https://example.com');
await page.tracing.stop();
// Open trace.json in chrome://tracing or DevTools Performance panel
```

For evaluation, interception, emulation, and patterns see [puppeteer-advanced.md](puppeteer-advanced.md).
