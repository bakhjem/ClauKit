<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/20-outdated-dependency.md (MIT) -->

---
id: OUTDATED-DEPENDENCY
severity_max: HIGH
applies_to: all
---

# Outdated Dependency (Known CVE)

## Intent
Detects dependencies with known published CVEs in package manifests, enabling attackers to exploit publicly documented vulnerabilities in unpatched libraries used by the application.

## Detection
- Look for: `package.json` dependencies/devDependencies with pinned versions
- Look for: `requirements.txt`, `Pipfile`, `pyproject.toml` with version constraints
- Look for: `go.mod` with specific module versions
- Look for: `Cargo.toml`, `composer.json`, `Gemfile.lock` with version pinning
- Cross-reference against known vulnerability databases:
  - npm: run `npm audit` or check https://security.snyk.io/vuln?packageManager=npm
  - PyPI: check https://osv.dev, `pip-audit`, `safety check`
  - Go: check https://pkg.go.dev/vuln, `govulncheck`
- Flag packages with CVE severity ≥HIGH that have a patched version available
- Flag packages that are abandoned (no releases in 3+ years, archived repo)

## Severity assessment
- HIGH when: dependency has a CVE ≥7.0 CVSS and a patched version is available
- HIGH when: CVE is CRITICAL (≥9.0) regardless of availability of patch
- Downgrade to MEDIUM when: CVE is for functionality not used by the application (e.g., a CLI tool CVE in a library-only usage)
- Downgrade to LOW when: CVE requires specific configuration not present in this codebase
- Skip when: version used is known-patched, or dependency is a devDependency with no production impact

## Remediation
1. Run `npm audit fix` / `pip-audit --fix` / `govulncheck ./...` to identify and patch
2. Update to patched version specified in CVE advisory
3. If no patch available: evaluate workaround, isolate usage, or replace library
4. Add `npm audit` / `pip-audit` to CI/CD pipeline as a blocking check
5. Set up Dependabot or Renovate for automated dependency update PRs

## Example (vulnerable)
```json
// package.json — lodash 4.17.15 has CVE-2021-23337 (prototype pollution)
{
  "dependencies": {
    "lodash": "4.17.15",
    "axios": "0.19.0"
  }
}
```

```txt
# requirements.txt — Pillow < 9.0.0 has multiple CVEs
Pillow==8.2.0
Django==3.1.0
```

## Example (safe)
```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "axios": "^1.6.0"
  }
}
```

```txt
Pillow>=9.3.0
Django>=4.2.0
```
