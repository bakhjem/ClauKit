---
description: ⚡⚡ Analyze and fix small issues [AUTO DETECT COMPLEXITY]
argument-hint: [issues]
---

If there is an existing markdown implementation plan, use `/code <path-to-plan>` to implement it.

Otherwise, follow the **Fix Pipeline** ([.claude/workflows/fix-pipeline.md](.claude/workflows/fix-pipeline.md)) as router:

1. Analyze the issues; ask for more details if needed.
2. Auto-detect complexity → route to `/fix:fast` (simple) or `/fix:hard` (complex).
3. Execute `/fix:fast <enhanced-prompt>` or `/fix:hard <enhanced-prompt>` — pass a detailed-instructions prompt enhanced from the user's issue description.

## Variant: router
Distinct from siblings — this is the auto-dispatch entry point. For other variants:
- `/fix:fast` · `/fix:hard` · `/fix:logs` · `/fix:ci` · `/fix:test` · `/fix:types` · `/fix:ui`
