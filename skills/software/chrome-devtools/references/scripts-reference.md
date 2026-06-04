# Scripts Reference

Detailed usage for every script in `scripts/`. All output structured JSON.

## Navigation — `navigate.js`

```bash
node navigate.js --url https://example.com
node navigate.js --url https://example.com --close true
node navigate.js --url https://slow-site.com --timeout 60000
node navigate.js --url https://example.com --wait-until networkidle2
```

`--wait-until` strategies: `load`, `domcontentloaded`, `networkidle0`, `networkidle2`.

## Screenshots — `screenshot.js`

```bash
node screenshot.js --url https://example.com --output ./screenshot.png
node screenshot.js --url https://example.com --output ./full.png --full-page true
node screenshot.js --url https://example.com --selector ".main-content" --output ./element.png
node screenshot.js --output ./current.png   # current page, no navigation
```

**Auto-compression**: screenshots >5MB compressed via Sharp (4–5× faster than ImageMagick).

```bash
node screenshot.js --url https://example.com --output ./screenshot.png --max-size 3   # 3MB threshold
node screenshot.js --url https://example.com --output ./screenshot.png --no-compress  # disable
```

Recommended output dir: `.claude/chrome-devtools/screenshots/`.

## Element Discovery — `aria-snapshot.js`

```bash
node aria-snapshot.js --url https://example.com
node aria-snapshot.js --url https://example.com --output ./.claude/chrome-devtools/snapshots/page.yaml
```

Output (YAML):

```yaml
- banner:
  - link "Hacker News" [ref=e1]
    /url: https://news.ycombinator.com
  - navigation:
    - link "new" [ref=e2]
    - link "past" [ref=e3]
- main:
  - list:
    - listitem:
      - link "Show HN: My new project" [ref=e8]
      - text: "128 points by user 3 hours ago"
```

ARIA notation:
- `[ref=eN]` — stable identifier for interactive elements
- `[checked]`, `[disabled]`, `[expanded]` — element state
- `/url:`, `/placeholder:` — attribute values

## Ref Interaction — `select-ref.js`

Two lookup modes:

**Refs-file mode** (default) — uses the `.refs.json` written by `aria-snapshot.js`:

```bash
node select-ref.js --ref e5 --action click
node select-ref.js --ref e10 --action fill --value "search query"
node select-ref.js --ref e8 --action text
node select-ref.js --ref e1 --action screenshot --output ./logo.png
```

**Live mode** — rebuilds the ARIA tree on the current page, no precomputed refs needed:

```bash
node select-ref.js --ref e5 --action click --live true
```

**Direct mode** — skip refs entirely, target by role + name:

```bash
node select-ref.js --role button --name "Sign In" --action click
node select-ref.js --role link --name "Learn more" --action text
```

Actions: `click`, `fill`, `text`, `screenshot`, `hover`, `focus`.

Flags:
- `--ref e<N>` — ref id (requires either refs file or `--live true`)
- `--role <role>` — direct ARIA role lookup
- `--name <name>` — element accessible name (used with `--role` or to disambiguate)
- `--live true` — rebuild ref map from current page state
- `--refs-file <path>` — override default refs file path

## Form Automation — `fill.js` & `click.js`

```bash
node fill.js --selector "#email" --value "user@example.com"
node click.js --selector "button[type=submit]"
```

## JavaScript Execution — `evaluate.js`

```bash
node evaluate.js --url https://example.com --script "document.title"

# Extract structured data
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('.item')).map(el => ({
    title: el.querySelector('h2')?.textContent,
    link: el.querySelector('a')?.href
  }))
" | jq '.result'

# Wait for async
node evaluate.js --script "await new Promise(r => setTimeout(r, 2000))"
```

Constraint: scripts run in page context — no Node.js modules available.

## Console Monitoring — `console.js`

```bash
node console.js --url https://example.com --duration 10000
node console.js --url https://example.com --types error,warn --duration 5000
```

Types: `log`, `info`, `warn`, `error`, `debug`, `pageerror`.

Save and filter:

```bash
SESSION="$(date +%Y%m%d-%H%M%S)"
mkdir -p .claude/chrome-devtools/logs/$SESSION
node console.js --url https://example.com --duration 10000 \
  > .claude/chrome-devtools/logs/$SESSION/console.json
jq '.messages[] | select(.type=="error")' .claude/chrome-devtools/logs/$SESSION/console.json
```

## Network Monitoring — `network.js`

```bash
node network.js --url https://example.com

# Failed requests
node network.js --url https://example.com | jq '.requests[] | select(.response.status >= 400)'

# API calls only
node network.js --url https://app.example.com | jq '.requests[] | select(.url | contains("/api/"))'
```

## Performance — `performance.js`

```bash
node performance.js --url https://example.com | jq '.vitals'
```

Returns Core Web Vitals: FCP, LCP, CLS, TTFB.

## WebSocket Debug — `ws-debug.js`, `ws-full-debug.js`

- `ws-debug.js` — basic connection events
- `ws-full-debug.js` — full event stream with frame payloads

```bash
node ws-debug.js --url wss://example.com --duration 10000

node ws-full-debug.js --url https://chat.example.com --duration 15000

# Per-direction payload truncation
node ws-full-debug.js \
  --url https://chat.example.com \
  --max-payload-sent 500 \
  --max-payload-received 5000
```

`ws-full-debug.js` flags:
- `--max-payload <N>` — default truncation for both directions (default 2000)
- `--max-payload-sent <N>` — override for client → server frames
- `--max-payload-received <N>` — override for server → client frames

## Common Options (all scripts)

- `--headless false` — show browser window
- `--close true` — close browser entirely (default: keep alive)
- `--timeout 30000` — timeout in milliseconds
- `--wait-until <strategy>` — page load strategy
