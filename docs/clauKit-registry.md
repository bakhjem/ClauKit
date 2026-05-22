# ClauKit Registry

**Last Updated**: 2026-05-22
**Scope**: Single source of truth for every Skill, Agent, and Command in this project.
**Counts**: 78 skills (78 active + 0 scaffold) · 21 agents · 22 commands · **121 total entries**

Replaces previous `skills-catalog.md` (skills only). One file, all three resource types, with duplicate/overlap detection.

## Legend

| Symbol | Meaning |
|:---:|---|
| ✅ | Active — production-ready |
| 🟡 | Scaffold — stub awaiting fill |
| | Naming inconsistency — RESOLVED 2026-05-16 |
| 🔁 | Intentional cross-pool concept (skill ↔ agent ↔ command, complementary) |
| ❗ | Potential overlap / needs scope clarification |

## Resource-Type Rules

- **Skill** — auto-activated knowledge/methodology (lazy-loaded reference)
- **Agent** — persona + tool subset for delegated sub-context work
- **Command** — explicit user-typed `/<name>` trigger

→ **One concept = one primary entry point.** Skills here are pure knowledge; agents are personas; commands are workflows. Cross-pool overlap by name is allowed only when each role is distinct (e.g. `planning` skill = knowledge, `planner` agent = persona, `/plan` command = trigger).

---

## 1 · Skills (78)

### Global (1) — `.claude/skills/global/`

| Name | Status | Path | Notes |
|---|:---:|---|---|
| `docs-seeker` | ✅ | `global/docs-seeker/SKILL.md` | |

> Note: `global/common/` does NOT contain a SKILL.md (only `README.md` + `api_key_helper.py`). It is a shared utility folder, not a skill. Earlier catalog listed it incorrectly — removed.

### Marketing (2) — `.claude/skills/marketing/`

| Name | Status | Folder |
|---|:---:|---|
| `geo` | ✅ | `marketing/geo/` |
| `seo` | ✅ | `marketing/seo/` |

### Software · Top-level standalone (36)

All 36 are active as of 2026-05-16 (10 scaffolds filled in earlier batch; `predict` merged into `planning` and removed — see section 5; `chrome-devtools` added 2026-05-16; `ask` re-added 2026-05-16 as knowledge skill complementing the `/ask` command; `brainstorm` re-added 2026-05-16 as knowledge skill complementing the `/brainstorm` command + `brainstormer` agent).

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `agent-browser` | ✅ | `software/agent-browser/` | Token-efficient snapshot+refs browser automation for AI agents |
| `ask` 🔁 | ✅ | `software/ask/` | Technical/architectural consultation methodology — 4 advisor personas, grounded-context protocol, synthesis |
| `chrome-devtools` | ✅ | `software/chrome-devtools/` | Puppeteer CLI scripts with persistent sessions + JSON output |
| `agentize` | ✅ | `software/agentize/` | Convert codebase to CLI + MCP server for AI agents |
| `better-auth` | ✅ | `software/better-auth/` | |
| `brainstorm` 🔁 | ✅ | `software/brainstorm/` | Architecture/solution advisory methodology — 5 pillars, 7-phase process, YAGNI/KISS/DRY, brutally-honest alternatives debate |
| `ck-graphify` | ✅ | `software/ck-graphify/` | AST → queryable code graph (syntactic) |
| `code-review` 🔁 | ✅ | `software/code-review/` | 4 practices — pre-review edge-case scout, receiving feedback (no performative agreement), requesting code-reviewer subagent, verification gates (evidence before claims) |
| `coding-level` | ✅ | `software/coding-level/` | Developer proficiency (0-5) → output tuning |
| `context-engineering` | ✅ | `software/context-engineering/` | Curate token flow into AI agents (6-layer model) |
| `cook` 🔁 | ✅ | `software/cook/` | Feature lifecycle pipeline with gates — methodology source for `/cook` command |
| `csharp-expert` | ✅ | `software/development/csharp-expert/` | |
| `cti-expert` | ✅ | `software/cti-expert/` | |
| `debugging` 🔁 | ✅ | `software/debugging/` | |
| `find-skills` | ✅ | `software/find-skills/` | |
| `gkg` | ✅ | `software/gkg/` | Text → semantic knowledge graph (NLP) |
| `llms` | ✅ | `software/llms/` | |
| `markdown-novel-viewer` | ✅ | `software/markdown-novel-viewer/` | |
| `mintlify` | ✅ | `software/mintlify/` | |
| `payment-integration` | ✅ | `software/payment-integration/` | |
| `planning` 🔁 | ✅ | `software/planning/` | Now includes "Predictive planning" subsection (merged from removed `predict` scaffold) |
| `plans-kanban` | ✅ | `software/plans-kanban/` | Kanban methodology applied to plans/ folder |
| `preview` | ✅ | `software/preview/` | |
| `problem-solving` | ✅ | `software/problem-solving/` | |
| `project-organization` | ✅ | `software/project-organization/` | Repo layout / monorepo / naming patterns |
| `research` 🔁 | ✅ | `software/research/` | |
| `retro` | ✅ | `software/retro/` | Team retrospective facilitation |
| `scenario` | ✅ | `software/scenario/` | Test scenario design (tool-agnostic) |
| `sequential-thinking` | ✅ | `software/sequential-thinking/` | |
| `team` 🔁 | ✅ | `software/team/` | Parallel multi-session orchestration — spawns independent Claude Code teammates (templates: research/cook/review/debug); paired with `/team` command |
| `show-off` | ✅ | `software/show-off/` | |
| `skill-creator` | ✅ | `software/skill-creator/` | |
| `tech-graph` | ✅ | `software/tech-graph/` | |
| `template-skill` | ✅ | `software/template-skill/` | (still a 5-LOC stub — see open issue) |
| `web-testing` | ✅ | `software/web-testing/` (developer toolkit; Playwright deep-dive lives in `test-automation`) | |
| `xia` 🔁 | ✅ | `software/xia/` (port & refactor from GitHub) | |

### Software · Subcategorized

#### `software/ai/` (3)

| Name | Status |
|---|:---:|
| `ai-artist` | ✅ |
| `ai-multimodal` | ✅ |
| `remotion` | ✅ |

#### `software/database/` (2)

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `postgresql` | ✅ | `database/databases/` | PostgreSQL guide — SQL queries, schema design, performance, psql CLI, backups, replication |
| `supabase` | ✅ | `database/supabase/` | Complete Supabase skill — platform layer (Auth/RLS, SDK, Storage, Realtime, Edge Functions, CLI) + Postgres layer (query optimization, indexing, connection pooling, schema, locking, monitoring). Merged from `supabase-postgres-best-practices` 2026-05-22 |

#### `software/design/` (9)

| Name | Status |
|---|:---:|
| `aesthetic` | ✅ |
| `excalidraw` | ✅ |
| `frontend-design` | ✅ |
| `mermaidjs-v11` | ✅ |
| `stitch` | ✅ |
| `threejs` | ✅ |
| `ui-styling` | ✅ |
| `ui-ux-pro-max` | ✅ |
| `web-design-guidelines` | ✅ |

#### `software/development/` (11)

| Name (frontmatter) | Status | Folder |
|---|:---:|---|
| `backend-development` | ✅ | `development/backend-development/` |
| `bootstrap` 🔁 | ✅ | `development/bootstrap/` |
| `deploy` | ✅ | `development/deploy/` |
| `frontend-development` | ✅ | `development/frontend-development/` |
| `mobile-development` | ✅ | `development/mobile-development/` |
| `python-development` | ✅ | `development/python-development/` |
| `react-best-practices` | ✅ | `development/react-best-practices/` |
| `shopify` | ✅ | `development/shopify/` |
| `tanstack` | ✅ | `development/tanstack/` |
| `test-automation` | ✅ | `development/test-automation/` (QA engineering — Playwright canonical, BDD, mobile, API) |
| `web-frameworks` | ✅ | `development/web-frameworks/` |

#### `software/document-skills/` (4)

| Name | Status |
|---|:---:|
| `docx` | ✅ |
| `pdf` | ✅ |
| `pptx` | ✅ |
| `xlsx` | ✅ |

> `software/expo/` (12 sub-skills, 9515 LOC) **removed 2026-05-16** per user direction. Mobile Expo work now relies on `mobile-development` skill (decision/mindset level only) — note this trade-off: deep Expo SDK-55 implementation knowledge is no longer in the catalog. Re-add via `npx skills add expo/skills` (if upstream pkg exists) if needed.

#### `software/git/` (2) 🔁

| Name | Status | Path |
|---|:---:|---|
| `git` | ✅ | `software/git/SKILL.md` |
| `worktree` | ✅ | `software/git/worktree/SKILL.md` |

#### `software/react-native/` (5)

| Name | Status |
|---|:---:|
| `github` | ✅ |
| `github-actions` | ✅ |
| `react-native-best-practices` | ✅ |
| `react-native-brownfield-migration` | ✅ |
| `upgrading-react-native` | ✅ |

---

## 2 · Agents (21)

### `engineering/` (10)

| Name | Status | Model | File |
|---|:---:|---|---|
| `backend-developer` | ✅ | sonnet | `engineering/backend-developer.md` |
| `code-reviewer` 🔁 | ✅ | opus | `engineering/code-reviewer.md` |
| `debugger` 🔁 | ✅ | opus | `engineering/debugger.md` |
| `docs-manager` 🔁 | ✅ | sonnet | `engineering/docs-manager.md` |
| `frontend-developer` | ✅ | sonnet | `engineering/frontend-developer.md` |
| `journal-writer` 🔁 | ✅ | sonnet | `engineering/journal-writer.md` |
| `performance-agent` | ✅ | sonnet | `engineering/performance-agent.md` |
| `planner` 🔁 | ✅ | opus | `engineering/planner.md` |
| `project-manager` | ✅ | haiku | `engineering/project-manager.md` |
| `tester` 🔁 | ✅ | sonnet | `engineering/tester.md` |

### `specialists/` (4)

| Name | Status | Model |
|---|:---:|---|
| `copywriter` 🔁 | ✅ | sonnet |
| `database-admin` 🔁 | ✅ | sonnet |
| `security-auditor` 🔁 | ✅ | inherit |
| `ui-ux-designer` 🔁 | ✅ | inherit |

### `operations/` (3)

| Name | Status | Model |
|---|:---:|---|
| `git-manager` 🔁 | ✅ | haiku |
| `integration-agent` 🔁 | ✅ | sonnet |
| `mcp-manager` 🔁 | ✅ | haiku |

### `research/` (3)

| Name | Status | Model |
|---|:---:|---|
| `researcher` 🔁 | ✅ | haiku |
| `scout` 🔁 | ✅ | haiku |
| `scout-external` 🔁 | ✅ | haiku |

### Root (1)

| Name | Status | Model |
|---|:---:|---|
| `brainstormer` 🔁 | ✅ | opus |

---

## 3 · Commands (22)

All commands are ✅ active. Grouped by namespace. **Prefix `ck:` applied 2026-05-17** — every command lives under `.claude/commands/ck/`, invoked as `/ck:<name>` (e.g. `/ck:cook`, `/ck:fix ci`). **`/orchestrate` removed 2026-05-17** (superseded by `/ck:team`). **Flag-style variants applied 2026-05-17** — sibling variants of the same command (e.g. fast/hard/auto/good/ext) collapsed into flags rather than `:nested` namespace; namespaced commands now reserved for genuinely-distinct actions (e.g. `/ck:fix ci`, `/ck:plan two`).

### Top-level (16) — single-action + flagged-variant entrypoints

| Command | Description |
|---|---|
| `/ck:ask` | Answer technical and architectural questions |
| `/ck:bootstrap [auto\|fast]` 🔁 | Bootstrap a new project — default: step-by-step · `auto`: minimal Q&A · `fast`: low-interaction parallel |
| `/ck:brainstorm` 🔁 | Brainstorm a feature |
| `/ck:content [fast\|good\|enhance\|cro]` 🔁 | Write creative & smart copy — `fast`: copywriter only · `good`: researcher+planner+copywriter |
| `/ck:cook` 🔁 | Drive feature spec → production (full lifecycle: research, plan, code, test, review) |
| `/ck:debug` 🔁 | Debugging technical issues |
| `/ck:design [fast\|good] [3d\|screenshot\|describe\|ui-ux-pro-max]` 🔁 | Design UI/UX — workflow flags: `fast` (minimal) · `good` (research-driven). Output-type flags: `3d` · `screenshot` · `describe` · `ui-ux-pro-max` (Style Intelligence) |
| `/ck:fix [--auto] [--review] [--quick] [--parallel]` 🔁 | Analyze and fix issues — combinable flags: `--auto` · `--review` · `--quick` · `--parallel` |
| `/ck:journal` 🔁 | Write journal entries |
| `/ck:plan [fast\|hard\|two\|ci\|cro]` 🔁 | Intelligent plan creation — router (auto-detect) · `fast`: no research · `hard`: research-heavy |
| `/ck:scout [-ext]` 🔁 | Scout codebase — default: internal Explore subagents · `-ext`: external gemini/opencode |
| `/ck:team` 🔁 | Orchestrate parallel multi-session collaboration with independent Claude Code teammates (paired with `team` skill) |
| `/ck:test` 🔁 | Run tests locally, analyze report |
| `/ck:use-mcp` 🔁 | Utilize MCP server tools |
| `/ck:watzup` | Review recent changes, wrap up work |
| `/ck:xia` 🔁 | Port & refactor feature from public GitHub repo |

### `content` variants (2) 🔁 copywriter — specialized actions

| Command | Description |
|---|---|
| `/ck:content cro` | CRO content optimization |
| `/ck:content enhance` | Analyze + enhance copy |

### `docs` (dispatcher, 3) 🔁 docs-manager

| Command | Description |
|---|---|
| `/ck:docs init` | Create initial docs from scratch |
| `/ck:docs update [requests]` | Update existing docs |
| `/ck:docs summarize [topics] [scan?]` | Summary report (read-only) |

### `fix` variants (5) 🔁 tester / debugger — specialized inputs/agents

| Command | Description |
|---|---|
| `/ck:fix ci` | Fix CI/GitHub Actions issues |
| `/ck:fix logs` | Fix from log analysis |
| `/ck:fix test` | Run tests + fix |
| `/ck:fix types` | Fix type errors |
| `/ck:fix ui` | Fix UI issues |

### `git` (dispatcher, 4) 🔁 git-manager

| Command | Description |
|---|---|
| `/ck:git cm` | Stage + commit |
| `/ck:git cp` | Stage + commit + push |
| `/ck:git pr [to] [from]` | Create pull request |
| `/ck:git merge [pr#\|branch]` | Merge PR or branch (interactive) |

### `sepay` 🔁 integration-agent

| Command | Description |
|---|---|
| `/ck:sepay` | SePay.vn payment integration |

### `plan` variants (3) 🔁 planner — specialized planning shapes

| Command | Description |
|---|---|
| `/ck:plan ci` | Plan to fix CI issues |
| `/ck:plan cro` | CRO plan |
| `/ck:plan two` | Plan w/ 2 approaches |

### `review` 🔁 code-reviewer + security-auditor

| Command | Description |
|---|---|
| `/ck:review` | Scan + analyze codebase |

### `seo` (dispatcher, 3) 🔁 seo skill

| Command | Description |
|---|---|
| `/ck:seo audit <url>` | SEO audit URL |
| `/ck:seo keywords <topic>` | Keyword research |
| `/ck:seo schema <type>` | JSON-LD schema |

### `cc-skill` (dispatcher, 4) 🔁 skill-creator

| Invocation | Description |
|---|---|
| `/ck:cc-skill add` | Add files/scripts to a skill |
| `/ck:cc-skill create` | Create new skill |
| `/ck:cc-skill fix-logs` | Fix skill from logs |
| `/ck:cc-skill optimize` | Optimize existing skill (plan-first) |

---

## 4 · Duplicate / Overlap Detection

### 4a · True duplicates (same name in 2+ pools) — **none post-cleanup** ✅

The v2 dedupe (2026-05-16) removed 15 skill scaffolds that exactly duplicated existing command + agent names. After cleanup, no two pools contain the same exact name.

### 4b · Intentional cross-pool concepts (🔁) — complementary, not duplicates

These are the *intended* trios where Skill = knowledge, Agent = persona, Command = trigger.

**DRY pattern applied 2026-05-16 to 14 trios** — single-source-of-truth approach where the skill (or designated canonical doc) owns methodology; agents + commands retain only unique parts and reference the canonical source.

**Batch 1** (4 trios): `brainstorm`, `planning`, `code-review`, `debugging`
**Batch 2** (5 trios): `research`, `scout`/`scout-external`, `docs`, `bootstrap`, `payment-integration`
**Batch 3** (5 trios): `git`, `xia`, `journal`, `fix`, `ask`
**Batch 4** (1 trio): `seo` (dispatcher with 3 flags: `/ck:seo audit`, `/ck:seo keywords`, `/ck:seo schema`) — extracted detailed pipelines/templates from commands into `seo/references/{audit-checklist,keyword-research,schema-templates}.md`. Commands dropped 840→109 lines (−87%); single source of truth = skill + references. Collapsed from `seo:*` namespace to flag-style dispatcher 2026-05-18.
**Batch 5** (4 cleanups): `content/cro` + `plan/cro` (cross-command CRO duplicate), `design/3d` (plan-structure duplicate), `design/*` (skill-activation boilerplate), `skill/*` (input-handling boilerplate).
- **CRO framework** — 25-point Conversion Optimization Framework extracted to [.claude/workflows/cro-framework.md](../../.claude/workflows/cro-framework.md). Both `/ck:content cro` and `/ck:plan cro` reference it instead of duplicating.
- **`design/*`** — removed repeated `aesthetic`+`frontend-design` skill-activation block from 5 commands (`ui-ux-designer` agent already auto-activates these). `design/3d`, `design/screenshot`, `design/describe` now reference `planning` skill for plan structure.
- **`cc-skill`** — collapsed 4 subcommands (`/ck:cc-skill add|create|optimize|fix-logs`) into a single dispatcher `/ck:cc-skill` with positional action arg (mirrors `/ck:git` pattern). Skill-creator canonical; `optimize` references `planning` skill for plan structure.

Notable extensions:
- `bootstrap` skill extended with **"Canonical Bootstrap Workflow"** (10-phase pipeline) — `/ck:bootstrap`, `/ck:bootstrap auto`, `/ck:bootstrap fast` only document variant differences.
- `fix` family — no skill/agent existed → created [.claude/workflows/fix-pipeline.md](../../.claude/workflows/fix-pipeline.md) as canonical 7-stage pipeline; 8 commands (`/ck:fix`, `/ck:fix --quick`, `/ck:fix --review`, `/ck:fix logs`, `/ck:fix ci`, `/ck:fix test`, `/ck:fix types`, `/ck:fix ui`) reference it + document variant deltas.
- `scout-external` agent references `scout` agent as canonical methodology — variant-only differences (external Gemini/OpenCode vs internal Explore).
- `docs-manager` agent + `journal-writer` agent serve as canonical sources (no dedicated knowledge skill exists for those concepts).
- `git-manager` agent retains haiku-optimized 2-3 tool execution workflow as agent-specific knowledge (skill = conventional-commits methodology).

Other trios (`testing` → covered by `web-testing`/`chrome-devtools`, `design` → `frontend-design`, `mcp` → `use-mcp`, `skill-management` → `skill-creator`, `database` → `databases`, `content`, `seo`, `security`, `orchestrate`, `code`, `watchup`) may follow this pattern in future passes.

| Concept | Skill | Agent | Command |
|---|---|---|---|
| Planning | `planning` | `planner` | `/ck:plan` |
| Research / Scout | `research` | `researcher`, `scout`, `scout-external` | `/ck:scout`, `/ck:scout -ext` |
| Code review | `code-review` | `code-reviewer` | `/ck:review` |
| Debugging | `debugging` | `debugger` | `/ck:debug` |
| Testing | `web-testing` (developer toolkit), `test-automation` (QA/automation engineering) | `tester` | `/ck:test`, `/ck:fix test` |
| Docs | `mintlify`, `llms`, `markdown-novel-viewer`, `tech-graph`, `document-skills/*` | `docs-manager` | `/ck:docs [init\|update\|summarize]` |
| Design | 10 design skills | `ui-ux-designer` | `/ck:design` |
| Content | `show-off` | `copywriter` | `/ck:content` |
| SEO/GEO | `seo`, `geo` | – (agent removed 2026-05-17) | `/ck:seo [audit\|keywords\|schema]` |
| Git | `git`, `worktree` | `git-manager` | `/ck:git [cm\|cp\|pr\|merge]` |
| Bootstrap | `bootstrap` (knowledge) | – | `/ck:bootstrap` |
| Port & Refactor | `xia` | (uses `scout-external`, `code-reviewer`) | `/ck:xia` |
| Security | `security`, `cti-expert` | `security-auditor` | `/ck:review` |
| Payments | `payment-integration` | `integration-agent` | `/ck:sepay` |
| MCP | – | `mcp-manager` | `/ck:use-mcp` |
| Skill management | `skill-creator`, `find-skills`, `template-skill` | – | `/ck:cc-skill` |
| Database | `postgresql`, `supabase` | `database-admin` | – |
| Journal | – | `journal-writer` | `/ck:journal` |
| Brainstorm (7-phase advisory: Scout→Discovery→Research→Analysis→Debate→Consensus→Finalize→`planner`) | `brainstorm` (5-pillar methodology + 7-phase process) | `brainstormer` | `/ck:brainstorm` |
| Team (parallel multi-session) | `team` (templates: research/cook/review/debug) | – | `/ck:team` |
| Fix | – | (uses tester/debugger) | `/ck:fix` |
| Ask | `ask` (4-persona consultation methodology) | – | `/ck:ask` |
| Watchup | – | – | `/ck:watzup` |
| Cook (feature lifecycle) | `cook` (5-stage gated methodology) | (uses team) | `/ck:cook` |
| Problem-solving | `problem-solving` | – | – |
| Sequential thinking | `sequential-thinking` | – | – |
| Misc skills (knowledge only) | `better-auth`, `csharp-expert`, `preview`, `llms`, `markdown-novel-viewer`, `mintlify`, `tech-graph`, `cti-expert`, design subskills, `mobile-development` | – | – |
| Scaffold methodology (knowledge only, future) | 12 scaffolds | – | – |

### 4c · Naming inconsistencies — RESOLVED 2026-05-16

All 8 violations (spec requires `name:` lowercase+hyphen and == folder) fixed:

| Folder | Before → After | Strategy |
|---|---|---|
| `software/debugging/` | `Debugging` → `debugging` | edit `name:` |
| `software/problem-solving/` | `Problem-Solving Techniques` → `problem-solving` | edit `name:` |
| `software/expo/skills/expo-ui-jetpack-compose/` | `Expo UI Jetpack Compose` → `expo-ui-jetpack-compose` | edit `name:` |
| `software/expo/skills/expo-ui-swift-ui/` | `Expo UI SwiftUI` → `expo-ui-swift-ui` | edit `name:` |
| `software/development/frontend-development/` | `frontend-dev-guidelines` → `frontend-development` | edit `name:` |
| `marketing/geo/` | `geo-fundamentals` → `geo` (also updated `seo-specialist.md` agent ref) | edit `name:` + caller |
| `marketing/seo/` | `seo-fundamentals` → `seo` (also updated `seo-specialist.md` agent ref) | edit `name:` + caller |

Bonus: moved non-spec fields `version`/`languages` into `metadata:` map for `debugging` and `problem-solving` skills (spec only defines `metadata` as a freeform map for extra properties).

Verification: `for f in $(find .claude/skills -name SKILL.md); do …` returns zero mismatches.

### 4d · Potential scope overlap — RESOLVED 2026-05-16

| Pair | Concern | Resolution |
|---|---|---|
| `web-testing` ↔ `test-automation` | ~50% overlap on Playwright basics, page objects, wait strategies, CI/CD | **Clarified by audience**: `web-testing` = web-app developer toolkit (Vitest unit + Playwright overview + k6 load). `test-automation` = QA / automation engineer (Playwright deep-dive canonical, BDD/Cucumber, mobile Appium/Detox, API Supertest/Newman, credentials). Each SKILL.md now has a "Scope vs" section + cross-link. |

### 4e · Indirect overlaps (not flagged) — multiple knowledge skills feed one agent

- `ui-ux-designer` agent reads from 10 design skills — by design, not a bug.
- `docs-manager` agent reads from 5+ doc skills — by design.
- Security: `security` (OWASP 2025 scanner + mindset) + `cti-expert` (threat intel) feed `security-auditor` — distinct scopes.

---

## 5 · Removed (cumulative)

### v2 cleanup (2026-05-16, earlier batch)

15 scaffolds deleted because they duplicated existing command+agent pairs. Replacement entry points:

> **Note (2026-05-16, later in day):** `ask` skill was **re-added** as an active knowledge skill (`software/ask/`) — distinct from this earlier scaffold-removal. Current pairing follows the canonical trio pattern: `ask` skill (4-persona consultation methodology + grounded-context protocol) + `/ask` command (trigger). No agent. See section 4b.

| Removed skill | Replacement |
|---|---|
| `ask` (scaffold) | `/ask` (now also paired with re-added `ask` skill — see note above) |
| `brainstorm` (scaffold) | `/brainstorm` + `brainstormer` (now also paired with re-added `brainstorm` skill — 2026-05-16) |
| `plan` | `/plan*` + `planner` |
| `scout` | `/scout*` + `scout`, `scout-external` |
| `journal` | `/journal` + `journal-writer` |
| `watzup` | `/watzup` |
| `test` | `/test` + `tester` |
| `fix` | `/fix*` |
| `docs` | `/docs:*` + `docs-manager` |
| `copywriting` | `/content:*` + `copywriter` |
| `security` | `/review` + `security-auditor` |
| `use-mcp` | `/use-mcp` + `mcp-manager` |
| `project-management` | `project-manager` agent |
| `team` | `team` skill + `/team` (parallel multi-session) — `/orchestrate` command + `orchestrator` agent both removed 2026-05-17, superseded by `team` |
| `loop` | built-in `/loop` skill |

### Scaffold-fill batch (2026-05-16, this batch)

10 scaffolds filled to active; 1 merged + deleted:

| Action | Skill | Notes |
|---|---|---|
| Merged | `predict` → `[[planning]]` | High overlap with planning; "Predictive planning" subsection added to `planning/SKILL.md` + `references/forecasting-outcomes.md`; `software/predict/` folder removed. |

### Agent removal (2026-05-17)

| Action | Agent | Notes |
|---|---|---|
| Removed | `seo-specialist` | `marketing/` folder emptied + removed. `/seo audit`, `/seo keywords`, `/seo schema` commands now run directly with `seo` skill + references (no dedicated agent). Frontmatter had non-standard fields (`mode`, `temperature`, `skills`) — legacy from OpenCode/agentgateway. |

---

## 6 · Summary Counts

| Pool | Active | Scaffold | Total |
|---|---:|---:|---:|
| Skills · `global/` | 1 | 0 | 1 |
| Skills · `marketing/` | 2 | 0 | 2 |
| Skills · `software/` | 72 | 0 | 72 |
| **Skills total** | **75** | **0** | **75** |
| Agents | 22 | 0 | 22 |
| Commands | 55 | 0 | 55 |
| **Grand total entries** | | | **152** |

## 7 · Open Issues

1. ~~**`web-testing` vs `test-automation`** scope overlap~~ — **RESOLVED 2026-05-16** (audience-based clarification; see § 4d).
2. ~~**11 scaffolds** still need research-fill~~ — **RESOLVED 2026-05-16** (10 filled to active, `predict` merged into `planning`; see § 5).
3. **`global/common/`** folder has utility files (no SKILL.md) — fine to keep but should NOT be counted as a skill.
4. **Expo deep-knowledge gap** — `software/expo/` removed; `mobile-development` only covers decision-level. Re-add if implementation guidance needed.
5. **`template-skill/SKILL.md`** is a 5-LOC placeholder (`# Insert instructions below`). Should be expanded into a real reference template for new skill authors.

## 8 · How to Use This Registry

- **Add a skill** → create `.claude/skills/<group>/[<subcat>/]<name>/SKILL.md` and add a row to section 1.
- **Add an agent** → create `.claude/agents/<role>/<name>.md` and add a row to section 2.
- **Add a command** → create `.claude/commands/ck/[<ns>/]<name>.md` (always under `ck/` so it invokes as `/<name>` or `/<ns>:<name>`) and add a row to section 3.
- **Before adding** → search this file: if a row with the same name already exists in another pool, decide whether you're adding (a) knowledge/skill, (b) persona/agent, or (c) trigger/command. Avoid creating a fourth entry for the same concept.
- **On rename** → update both the SKILL/agent/command file frontmatter AND this registry in the same commit.
