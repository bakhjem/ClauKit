# Testsigma · Test Scenario Guide

**Source**: https://testsigma.com/guides/test-scenario/

## Best-practice checklist

- **Each scenario has one clear objective** — if you can't summarize it in a sentence, split it.
- **Scenarios are independent** — order should not matter; otherwise you're testing the order.
- **Positive and negative pair** — for any new positive scenario, write at least one matching negative.
- **Role coverage** — list every persona; mark which scenarios apply to which.
- **Data-driven where possible** — one scenario template + parameter table beats 20 near-duplicate scenarios.
- **Traceability** — link each scenario back to the requirement or ticket it validates.

## Positive vs negative paths

| Aspect | Positive | Negative |
|---|---|---|
| Input | Valid | Invalid, missing, malicious |
| Expected | Success outcome | Specific error + safe state |
| Coverage rule | Every requirement | Every input boundary + every external dependency |

The most-skipped category is **boundary negatives**: max-length strings, off-by-one numerics, expired-but-just-now tokens.

## Maintenance discipline

Scenarios rot when implementation moves. Two practices keep them fresh:

1. **Quarterly scenario review** — owners walk through scenarios with current product owner; flag stale ones.
2. **Link scenarios to features** — when a feature is removed, its scenarios are removed in the same PR.

## Why authoritative

Testsigma is a low-code test automation platform; their guides emphasize maintainable scenario design over execution mechanics — the exact angle this skill needs.
