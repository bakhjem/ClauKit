<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/05-slopsquatting.md (MIT) -->

---
id: SLOPSQUATTING
severity_max: CRITICAL
applies_to: all
---

# Slopsquatting (AI-Hallucinated Package Names)

## Intent
Detects package names in dependency files that may be AI-hallucinated, typosquatted, or non-existent on public registries. AI coding assistants sometimes suggest plausible-sounding but fake package names that could be registered by attackers with malicious code.

## Detection
- Look for: packages in `package.json` (dependencies, devDependencies), `requirements.txt`, `go.mod`, `Cargo.toml`, `composer.json`
- Look for: packages with names that are:
  - Slightly misspelled versions of popular packages (`lodsh`, `expres`, `requst`, `axois`)
  - Hyphen/underscore variants that don't exist (`express-util`, `lodash-helpers`, `react-utils-pro`)
  - Overly generic names unlikely to be real (`utils`, `helpers`, `common-lib`)
  - Unusual combinations for the ecosystem (e.g., npm package with Python-style naming)
- Cross-reference against known registries:
  - npm: https://registry.npmjs.org/<name>
  - PyPI: https://pypi.org/pypi/<name>/json
  - Go: https://pkg.go.dev/<module>
- Flag when: package does not appear to exist OR has zero downloads / very recent creation date (potential squatting)

## Severity assessment
- CRITICAL when: package name is a plausible typo of a very popular package AND the correct package is not in the file
- CRITICAL when: package cannot be found on the relevant registry
- HIGH when: package exists but has suspiciously low download count or was created very recently
- Downgrade when: package is a well-known private/internal package or a scoped package (`@company/package`)

## Remediation
1. Verify every AI-suggested package on the official registry before adding
2. Use scoped packages for internal code (`@org/package-name`)
3. Enable registry integrity checks (npm `--audit`, pip hash verification)
4. Use a private registry mirror with curated allowlists
5. Enable `npm audit` in CI/CD pipeline

## Example (vulnerable)
```json
// package.json — AI hallucinated package
{
  "dependencies": {
    "express-rate-limiter-utils": "^1.0.0",
    "lodash-string-helpers": "^2.1.0"
  }
}
```

## Example (safe)
```json
// package.json — verified, well-known packages
{
  "dependencies": {
    "express-rate-limit": "^7.0.0",
    "lodash": "^4.17.21"
  }
}
```
