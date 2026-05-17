# GeeksforGeeks · Scenario Testing

**Source**: https://www.geeksforgeeks.org/software-testing-scenario-testing/

## Definition

Scenario testing validates **end-to-end business workflows** rather than isolated functions. A scenario describes a complete usage path: who starts it, what they do, what the system must produce, and how it cleans up.

## Canonical scenario types

- **System scenarios** — broad: validate that all components integrate to deliver a user-visible outcome.
- **Use-case scenarios** — narrower: validate one specific user goal (place an order, reset a password).
- **Real-life scenarios** — simulate actual usage patterns observed from production logs or user research.
- **Negative scenarios** — explicit failure injection (wrong input, missing field, expired token).
- **Recovery scenarios** — fail then recover (network drops, server restart, partial save).

## Strengths

- Catches integration bugs invisible to unit tests.
- Validates that requirements actually map to user-perceivable outcomes.
- Forms the basis of acceptance and UAT suites.

## Weaknesses

- Expensive to author and maintain.
- Slow to execute (full integration).
- Brittle if implementation details leak into scenario steps.

Mitigation: write scenarios at **intent level** ("submit checkout"), not **UI level** ("click button id=checkout-btn"). Let the executor bind intent → UI separately.

## Why authoritative

GeeksforGeeks's QA articles are widely used as practical introductions; this page covers the standard taxonomy used in QA textbooks.
