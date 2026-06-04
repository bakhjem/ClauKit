# Troubleshooting

## Missing Images in Screenshots

Images may be waiting for animation triggers or lazy-load.

### Scroll element into view

```bash
node evaluate.js --script "document.querySelector('.lazy-image').scrollIntoView()"
node evaluate.js --script "await new Promise(r => setTimeout(r, 1000))"
node screenshot.js --output ./result.png
```

### Intersection Observer animations

Scroll through the page to trigger them:

```bash
node evaluate.js --script "window.scrollTo(0, document.body.scrollHeight)"
node evaluate.js --script "await new Promise(r => setTimeout(r, 1500))"
node evaluate.js --script "window.scrollTo(0, 0)"
node screenshot.js --output ./full-loaded.png --full-page true
```

## Common Errors

| Error | Cause | Solution |
|---|---|---|
| `Cannot find package 'puppeteer'` | Dependencies not installed | Run `npm install` in scripts directory |
| `libnss3.so` missing (Linux) | Chrome system libs missing | Run `./install-deps.sh` |
| Element not found | Wrong selector | Use `aria-snapshot.js` to find correct selector/ref |
| Script hangs | Page never settles | Use `--timeout 60000` or `--wait-until load` |
| Screenshot >5MB | Auto-compresses by default | Use `--max-size 3` for stricter threshold |
| Stale session | `.browser-session.json` points to dead browser | Delete the file and retry |
| `Target closed` | Browser was killed externally | Delete `.browser-session.json`, restart |
| `Navigation timeout` | Slow site or wrong wait strategy | `--wait-until domcontentloaded` for SPAs |
| `Protocol error` | CDP connection lost | Retry; ensure browser process still running |

## Session Stuck

If session feels stuck or behaviors look strange:

```bash
# Inspect session file
cat .browser-session.json

# Nuke and restart
rm .browser-session.json
node navigate.js --url https://example.com
```

## CI / Headless Issues

In CI, force headless and disable sandbox if needed:

```bash
node navigate.js --url https://example.com --headless true
```

If you see sandbox errors on Linux, the install script should have handled it — re-run `./install-deps.sh`.

## Debugging a Failing Script

1. Run with visible browser: `--headless false`
2. Increase timeout: `--timeout 60000`
3. Capture console + network for the run:
   ```bash
   node console.js --duration 10000 &
   node network.js > network.json &
   # ... your failing script ...
   ```
4. Use `aria-snapshot.js` to confirm DOM state at failure point

## When to Restart vs Persist

- **Persist (default)** — sequential scripts in one logical workflow (login → navigate → screenshot)
- **Restart** — between independent tasks, or after a hard failure, or if state has diverged from expectations
