<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/language-detection.md (MIT) -->

# Language Detection

## Algorithm
1. Filter out non-code paths: node_modules, vendor, dist, build, .next, .nuxt, target, .venv, __pycache__, .git, security-reports
2. Count files by extension
3. Primary language = any language ≥30% of total code files

## Supported languages with specialized rules
- `go` — .go files
- `php` — .php files
- `python` — .py files
- `typescript` — .js, .ts, .jsx, .tsx files (grouped)

## Multi-language repos
If 2+ languages each ≥30% → load overlays for ALL qualifying languages.
Example: Go backend + Vue frontend → load both go/ and typescript/ overlays.

## Polyglot repos
No single language ≥30% → only generic rules apply.

## Framework sub-classification (TypeScript)
Detect via package.json: React, Vue, Next.js, Express, NestJS → refine rule reasoning for framework-specific patterns.

## Extension map
| Extensions | Language |
|---|---|
| .go | go |
| .py | python |
| .php | php |
| .js .ts .jsx .tsx | typescript |
| .rb | ruby (generic only) |
| .java | java (generic only) |
| .rs | rust (generic only) |
| .cs | csharp (generic only) |
