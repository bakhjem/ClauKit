# Chrome DevTools Skill — Scripts

Puppeteer CLI scripts. All scripts share `lib/browser.js` for session persistence and JSON output.

## Setup

```bash
npm install
./install-deps.sh   # Linux/WSL only
```

## Scripts

| Script | Required flags | Notable options |
|---|---|---|
| `navigate.js` | — | `--url`, `--wait-until`, `--timeout`, `--close` |
| `screenshot.js` | `--output` | `--url`, `--selector`, `--full-page`, `--max-size`, `--no-compress` |
| `click.js` | `--selector` | `--button`, `--click-count` |
| `fill.js` | `--selector` | `--value`, `--clear` |
| `evaluate.js` | `--script` | `--url` |
| `snapshot.js` | — | `--url`, `--output` |
| `aria-snapshot.js` | — | `--url`, `--output` (writes `.yaml` + `.refs.json`) |
| `select-ref.js` | `--ref` or `--role` | `--name`, `--action`, `--value`, `--live`, `--output`, `--refs-file` |
| `console.js` | — | `--url`, `--duration`, `--types` |
| `network.js` | — | `--url`, `--duration`, `--type` |
| `performance.js` | — | `--url` |
| `ws-debug.js` | — | `--url`, `--duration` |
| `ws-full-debug.js` | — | `--url`, `--duration`, `--max-payload`, `--max-payload-sent`, `--max-payload-received` |

## Common options (every script)

- `--headless true|false` — override auto-detection
- `--close true` — close browser after script (default: disconnect, keep alive)
- `--timeout 30000` — page operation timeout in ms
- `--wait-until load|domcontentloaded|networkidle0|networkidle2`

## Session model

A WebSocket endpoint is stored in `.browser-session.json` in the current working directory. Scripts:
1. Try to connect to that endpoint
2. Fall back to launching a fresh browser if the endpoint is dead
3. Disconnect (default) or close (`--close true`) when done

Delete `.browser-session.json` to force a fresh launch.

## Custom scripts

Use the helpers from `lib/browser.js`:

```js
import { getBrowser, getPage, disconnectBrowser, outputJSON } from './lib/browser.js';

const browser = await getBrowser();
const page = await getPage(browser);
await page.goto('https://example.com');
outputJSON({ title: await page.title() });
await disconnectBrowser(browser);
```

See [../references/custom-scripts.md](../references/custom-scripts.md) for patterns.

## Integration test

```bash
bash test/integration.sh
TARGET=https://example.org bash test/integration.sh
KEEP_ARTIFACTS=1 bash test/integration.sh    # preserve tmp/ output
```

Runs the full workflow (navigate → snapshot → aria-snapshot → performance → evaluate → console → network → screenshot → select-ref live → close) against a real target and asserts each script returns `success: true`. Useful as a regression check after editing scripts.
