# Language-Specific Rule Overrides

Rules in `languages/<lang>/` override the matching generic rule (same `id` field) for that language.

## Supported languages
- `go/` — GORM patterns, slog, Colly scraper
- `php/` — mysqli/PDO, $_GET/$_POST, eval/include, Laravel CSRF
- `python/` — SQLAlchemy, pickle/yaml, subprocess, Django/FastAPI
- `typescript/` — ORM injection, React XSS, Express/NestJS/Next.js patterns

## Adding a new language
1. Create `languages/<lang>/` directory
2. Create `<rule-id>.md` files for rules that need language-specific detection
3. Use same `id` field as generic rule — it will automatically override

## Override behavior
Language rule REPLACES generic for that language/rule combination. All other generic rules still apply.
