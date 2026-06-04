# GitHub Actions · Deployment Workflows

**Source**: https://docs.github.com/en/actions/deployment

## Stage modeling in Actions

GitHub Actions models the cook stages cleanly with **jobs** + **needs** + **environments**:

```yaml
jobs:
  plan:    # produces a build artifact
  code:    # lint, typecheck — needs: plan
  test:    # needs: code
  docs:    # needs: code (parallel to test)
  deploy:  # needs: [test, docs]; environment: production
```

`needs:` enforces order — the cook gate semantics map directly. `environment:` adds manual approval gates for sensitive stages.

## Useful actions

- `actions/checkout@v4` — every job needs source.
- `actions/cache@v4` — cache `node_modules`/`~/.cache/pip` between jobs; halves CI time.
- `actions/upload-artifact@v4` — pass build output between jobs without rebuilding.
- `dorny/paths-filter` — skip irrelevant jobs (e.g. skip backend tests on docs-only PRs).

## Smoke testing in CI

Post-deploy smoke checks belong in the deploy job, not in a separate workflow:

```yaml
- run: curl -fsS https://api.example.com/health
- run: npm run smoke:e2e
```

If smoke fails, the action exits non-zero and the deploy is recorded as failed — matching cook's stage-5 verification gate.

## Why authoritative

Official GitHub documentation; reflects the platform's intended deployment patterns.
