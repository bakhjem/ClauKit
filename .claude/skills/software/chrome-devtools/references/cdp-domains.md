# Chrome DevTools Protocol (CDP) Domains

CDP is the wire protocol Puppeteer uses to drive the browser. Each "domain" groups related commands and events. Access raw CDP from a script via:

```js
const client = await page.target().createCDPSession();
await client.send('Network.enable');
client.on('Network.requestWillBeSent', (e) => { /* ... */ });
```

This reference covers the domains most useful for the scripts in this skill.

## `Network`

HTTP, WebSocket, and resource lifecycle events.

| Method / Event | Purpose |
|---|---|
| `Network.enable` | Required before any Network event fires |
| `Network.requestWillBeSent` | Fired when a request is about to leave the browser |
| `Network.responseReceived` | Fired when response headers arrive |
| `Network.loadingFinished` | Fired when the response body is fully received |
| `Network.loadingFailed` | Request failed (CORS, DNS, refused, etc.) |
| `Network.webSocketCreated` | New WebSocket opened |
| `Network.webSocketFrameSent` | Frame sent from page → server |
| `Network.webSocketFrameReceived` | Frame received from server → page |
| `Network.webSocketClosed` | Connection closed |
| `Network.setExtraHTTPHeaders` | Inject custom headers into every request |
| `Network.setUserAgentOverride` | Override the user agent |
| `Network.emulateNetworkConditions` | Throttle bandwidth, add latency, simulate offline |

Used by: `network.js`, `ws-debug.js`, `ws-full-debug.js`.

## `Page`

Page-level navigation, lifecycle, and DOM events.

| Method / Event | Purpose |
|---|---|
| `Page.enable` | Required before Page events fire |
| `Page.navigate` | Programmatic navigation (`page.goto` wraps this) |
| `Page.reload` | Reload current page |
| `Page.captureScreenshot` | Underlying primitive for `page.screenshot` |
| `Page.printToPDF` | Render page as PDF |
| `Page.frameAttached` / `Page.frameNavigated` | Track iframe lifecycle |
| `Page.javascriptDialogOpening` | Alert / confirm / prompt fired |
| `Page.handleJavaScriptDialog` | Accept or dismiss dialog |
| `Page.setBypassCSP` | Disable Content-Security-Policy (useful for evaluate.js) |

## `Runtime`

JavaScript execution in the page context.

| Method / Event | Purpose |
|---|---|
| `Runtime.evaluate` | Run JS string in the page (`page.evaluate` wraps this) |
| `Runtime.consoleAPICalled` | Fired on `console.log`, `console.error`, etc. |
| `Runtime.exceptionThrown` | Uncaught exception in the page |
| `Runtime.addBinding` | Expose a Node function to the page |

Used by: `console.js`, `evaluate.js`.

## `DOM`

DOM tree inspection and mutation.

| Method | Purpose |
|---|---|
| `DOM.getDocument` | Get the document root node |
| `DOM.querySelector` | Find first matching element |
| `DOM.querySelectorAll` | Find all matching elements |
| `DOM.getOuterHTML` | Get HTML string for a node |
| `DOM.setAttributeValue` | Set an attribute |

Most use cases are easier through `page.$`, `page.$$`, and `page.evaluate` — drop to raw `DOM` only when those are insufficient.

## `Accessibility`

Accessibility tree, the basis for ARIA-based interaction.

| Method | Purpose |
|---|---|
| `Accessibility.enable` | Required before queries |
| `Accessibility.getFullAXTree` | Full accessibility tree for current page |
| `Accessibility.getPartialAXTree` | Subtree rooted at a specific node |
| `Accessibility.queryAXTree` | Search by role + name |

Puppeteer wrapper: `page.accessibility.snapshot({ interestingOnly })`.

Used by: `aria-snapshot.js`, `select-ref.js`.

## `Performance`

Page performance metrics.

| Method | Purpose |
|---|---|
| `Performance.enable` | Required first |
| `Performance.getMetrics` | Returns counters: documents, frames, layouts, JSHeapUsedSize, etc. |

For Core Web Vitals (FCP, LCP, CLS, FID, INP), use `PerformanceObserver` inside `page.evaluate` — see [performance-guide.md](performance-guide.md).

## `Emulation`

Device, viewport, and network emulation.

| Method | Purpose |
|---|---|
| `Emulation.setDeviceMetricsOverride` | Override viewport, DPR, mobile flag |
| `Emulation.setUserAgentOverride` | Override user agent |
| `Emulation.setTouchEmulationEnabled` | Toggle touch events |
| `Emulation.setGeolocationOverride` | Override `navigator.geolocation` |
| `Emulation.setTimezoneOverride` | Override timezone for `Date` |
| `Emulation.setLocaleOverride` | Override locale |
| `Emulation.setCPUThrottlingRate` | Throttle CPU (rate 4 = 4× slower) |

Puppeteer wrappers: `page.emulate(device)`, `page.setViewport()`, `page.setUserAgent()`, `page.setGeolocation()`.

## `Input`

Mouse, keyboard, touch input.

| Method | Purpose |
|---|---|
| `Input.dispatchMouseEvent` | Synthesize mouse event |
| `Input.dispatchKeyEvent` | Synthesize key event |
| `Input.dispatchTouchEvent` | Synthesize touch event |
| `Input.insertText` | Type without per-key events (faster bulk input) |

Used implicitly via `page.click`, `page.type`, `page.mouse`, `page.keyboard`.

## `Storage`

Browser storage APIs.

| Method | Purpose |
|---|---|
| `Storage.clearDataForOrigin` | Clear cookies / localStorage / cache for an origin |
| `Storage.getCookies` | Get cookies for a URL |
| `Storage.setCookies` | Set cookies (used for auth injection) |

## `Target`

Browser-level target (page, worker, service worker) management.

| Method / Event | Purpose |
|---|---|
| `Target.getTargets` | List all targets |
| `Target.attachToTarget` | Attach a CDP session to a target |
| `Target.targetCreated` / `Target.targetDestroyed` | Track tabs and workers |

Used internally by `puppeteer.connect()` and `browser.pages()`.

## Useful Combinations

### Block resources to speed up tests

```js
await client.send('Network.setBlockedURLs', { urls: ['*://*.googletagmanager.com/*'] });
```

Or via Puppeteer's request interception:

```js
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (['image', 'font', 'media'].includes(req.resourceType())) req.abort();
  else req.continue();
});
```

### Capture all network as HAR

Listen to `Network.requestWillBeSent` + `Network.responseReceived` + `Network.loadingFinished`, then export. For full HAR, `puppeteer-har` package wraps this.

### Inject auth cookie before navigation

```js
await page.setCookie({ name: 'session', value: 'abc123', domain: '.example.com' });
await page.goto('https://app.example.com');
```

## When to Drop to Raw CDP

Use Puppeteer's high-level API by default. Drop to `createCDPSession()` only when:

- Capturing low-level events (WebSocket frames, raw network)
- Setting emulation values not exposed by Puppeteer
- Using domains not wrapped by Puppeteer (e.g. `Debugger`, `Heap*`, `Profiler`)
- Performance — raw CDP avoids Puppeteer's overhead in hot loops

## References

- Official CDP viewer: <https://chromedevtools.github.io/devtools-protocol/>
- Puppeteer ↔ CDP mapping: <https://pptr.dev/api>
