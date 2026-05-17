# Decoupling Deploy from Release · Feature Flags

**Source pattern**: industry practice; canonical writeup at https://martinfowler.com/articles/feature-toggles.html

## The distinction

- **Deploy** = code is on production hardware.
- **Release** = code is reachable by users.

Tying them together makes cook stage 5 a one-way door. Decoupling with feature flags makes it reversible.

## How it changes cook stage 5

Without flags:
> Stage 5: merge → CI → prod. If broken, hot-fix or rollback.

With flags:
> Stage 5a: deploy code with feature flag OFF — verify infra.
> Stage 5b: enable flag for 1% — observe metrics.
> Stage 5c: ramp 10% → 50% → 100% as signals stay green.
> Stage 5d (optional): remove flag, cleanup. **Schedule this** — flags rot.

Recovery becomes: flip flag off. No rollback deploy needed.

## Flag types

- **Release toggles** — short-lived; remove within weeks of full rollout.
- **Ops toggles** — kill switches for risky subsystems. Long-lived.
- **Experiment toggles** — A/B; remove when experiment concludes.
- **Permission toggles** — entitlements; long-lived but ideally managed by an entitlement service, not a toggle.

## Pitfalls

- **Flag debt**: dead flags everywhere. Add an expiry date to every flag at creation; CI fails on expired flags.
- **Untested OFF state**: shipping code that only works with the flag ON. Run tests in both states.
- **Distributed-system flag inconsistency**: flag service unreachable mid-flip leaves some hosts ON and some OFF. Cache flag values per request, not per process boot.

## Why authoritative

Martin Fowler's article is the most-cited reference; the pattern is standard at Google, Facebook, Etsy, and modern SaaS companies.
