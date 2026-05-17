# Real-World Examples

## Testing Local HTML Files

**Never use `file://`** — it blocks CORS, ES modules, fetch API, and service workers. Always serve through a local server.

```bash
# Option 1: npx serve (recommended)
npx serve ./dist -p 3000 &
node navigate.js --url http://localhost:3000
node screenshot.js --output ./test.png

# Option 2: Python http.server
python -m http.server 3000 --directory ./dist &
node navigate.js --url http://localhost:3000
```

## Automated Login Flow

```bash
node navigate.js --url https://app.example.com/login
node fill.js --selector "#email" --value "test@example.com"
node fill.js --selector "#password" --value "testpass123"
node click.js --selector "button[type=submit]"
node screenshot.js --output ./dashboard.png
node navigate.js --url about:blank --close true
```

## Debug Unknown Page Structure

```bash
# Step 1: discover with ARIA snapshot
node aria-snapshot.js --url https://example.com

# Step 2: identify target ref (e.g. [ref=e5] from output)

# Step 3: interact by ref
node select-ref.js --ref e5 --action click

# Step 4: verify
node screenshot.js --output ./result.png
```

## Capture Error Logs (Console + Network)

```bash
SESSION="$(date +%Y%m%d-%H%M%S)"
mkdir -p .claude/chrome-devtools/logs/$SESSION

# Console errors
node console.js --url https://broken-site.com --types error,pageerror --duration 5000 \
  > .claude/chrome-devtools/logs/$SESSION/console.json

# Network failures
node network.js --url https://broken-site.com \
  > .claude/chrome-devtools/logs/$SESSION/network.json

# Analyze
jq '.messages[] | select(.type=="error") | .text' \
  .claude/chrome-devtools/logs/$SESSION/console.json
jq '.requests[] | select(.response.status >= 400)' \
  .claude/chrome-devtools/logs/$SESSION/network.json
```

## Performance Audit

```bash
node performance.js --url https://example.com | jq '.vitals'
```

Sample output:

```json
{
  "FCP": 1200,
  "LCP": 2400,
  "CLS": 0.05,
  "TTFB": 300
}
```

## Web Scraping

```bash
node navigate.js --url https://news.ycombinator.com
node evaluate.js --script "
  Array.from(document.querySelectorAll('.athing')).slice(0, 10).map(el => ({
    title: el.querySelector('.titleline a')?.textContent,
    link: el.querySelector('.titleline a')?.href,
    score: el.nextElementSibling?.querySelector('.score')?.textContent
  }))
" | jq '.result'
```

## Multi-Step Session Workflow

The whole point of session persistence — login once, then run many follow-ups.

```bash
# Initial: login and save session
node navigate.js --url https://app.example.com/login
node fill.js --selector "#email" --value "user@example.com"
node fill.js --selector "#password" --value "$PASSWORD"
node click.js --selector "button[type=submit]"

# Browser is still alive — subsequent scripts reuse the auth
node navigate.js --url https://app.example.com/dashboard
node screenshot.js --output ./dashboard.png

node navigate.js --url https://app.example.com/settings
node aria-snapshot.js --output ./settings.yaml

# Done — close
node navigate.js --url about:blank --close true
```
