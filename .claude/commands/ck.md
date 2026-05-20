---
description: ClauKit command namespace dispatcher
argument-hint: <subcommand>
---

Use `/ck:<subcommand>` (or `/ck:<group>:<subcommand>`) to access ClauKit commands.

## Top-level commands

`ask`, `bootstrap`, `brainstorm`, `content`, `cook`, `debug`, `design`, `docs`, `fix`, `git`, `journal`, `plan`, `scout`, `seo`, `skill`, `team`, `test`, `use-mcp`, `watzup`, `xia`

## Grouped subcommands (standalone files)

| Group | Subcommand |
|---|---|
| `integrate` | `sepay` |
| `review` | `codebase` |

> Dispatcher commands (`fix`, `docs`, `plan`, `content`, `git`) use positional args — e.g. `/ck:fix ci`, `/ck:docs init`, `/ck:plan two`.

Examples: `/ck:cook`, `/ck:fix ci`, `/ck:docs init`, `/ck:integrate:sepay`.
