# ClauKit Registry

**Last Updated**: 2026-05-17
**Scope**: Single source of truth for every Skill, Agent, and Command in this project.
**Counts**: 75 skills (75 active + 0 scaffold) · 22 agents · 55 commands · **152 total entries**

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

## 1 · Skills (73)

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
| `code-review` 🔁 | ✅ | `software/code-review/` | |
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
| `show-off` | ✅ | `software/show-off/` | |
| `skill-creator` | ✅ | `software/skill-creator/` | |
| `tech-graph` | ✅ | `software/tech-graph/` | |
| `template-skill` | ✅ | `software/template-skill/` | (still a 5-LOC stub — see open issue) |
| `vulnerability-scanner` 🔁 | ✅ | `software/vulnerability-scanner/` | |
| `web-testing` | ✅ | `software/web-testing/` (developer toolkit; Playwright deep-dive lives in `test-automation`) | |
| `xia` 🔁 | ✅ | `software/xia/` (port & refactor from GitHub) | |

### Software · Subcategorized

#### `software/ai/` (3)

| Name | Status |
|---|:---:|
| `ai-artist` | ✅ |
| `ai-multimodal` | ✅ |
| `remotion` | ✅ |

#### `software/database/` (3)

| Name | Status | Folder | Scope |
|---|:---:|---|---|
| `databases` | ✅ | `database/databases/` | |
| `supabase` 🔁 | ✅ | `database/supabase/` | Supabase platform (Auth+RLS app-layer, Client SDK, Storage, Realtime, Edge Functions, CLI migrations) — added 2026-05-16. Complements `supabase-postgres-best-practices` |
| `supabase-postgres-best-practices` | ✅ | `database/supabase-postgres-best-practices/` | Postgres performance + RLS at the SQL level |

#### `software/design/` (10)

| Name | Status |
|---|:---:|
| `aesthetic` | ✅ |
| `excalidraw` | ✅ |
| `frontend-design` | ✅ |
| `mermaidjs-v11` | ✅ |
| `shader` | ✅ |
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

## 2 · Agents (22)

### `engineering/` (11)

| Name | Status | Model | File |
|---|:---:|---|---|
| `backend-developer` | ✅ | sonnet | `engineering/backend-developer.md` |
| `code-reviewer` 🔁 | ✅ | opus | `engineering/code-reviewer.md` |
| `debugger` 🔁 | ✅ | opus | `engineering/debugger.md` |
| `docs-manager` 🔁 | ✅ | sonnet | `engineering/docs-manager.md` |
| `frontend-developer` | ✅ | sonnet | `engineering/frontend-developer.md` |
| `journal-writer` 🔁 | ✅ | sonnet | `engineering/journal-writer.md` |
| `orchestrator` 🔁 | ✅ | sonnet | `engineering/orchestrator.md` |
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

## 3 · Commands (55)

All commands are ✅ active. Grouped by namespace.

### Top-level (15)

| Command | Description |
|---|---|
| `/ask` | Answer technical and architectural questions |
| `/bootstrap` 🔁 | Bootstrap a new project step by step (⚡⚡⚡⚡⚡) |
| `/brainstorm` 🔁 | Brainstorm a feature |
| `/code` | Start coding & testing an existing plan (kept as backup — equivalent to `/cook <plan> --from-plan`) |
| `/cook` 🔁 | Drive feature spec → production (full lifecycle: research, plan, code, test, review) |
| `/debug` 🔁 | Debugging technical issues |
| `/fix` 🔁 | Analyze and fix small issues (auto-detect) |
| `/journal` 🔁 | Write journal entries |
| `/orchestrate` 🔁 | Delegate tasks to team agents |
| `/plan` 🔁 | Intelligent plan creation with prompt enhancement |
| `/scout` 🔁 | Scout directories on user request |
| `/test` 🔁 | Run tests locally, analyze report |
| `/use-mcp` 🔁 | Utilize MCP server tools |
| `/watzup` | Review recent changes, wrap up work |
| `/xia` 🔁 | Port & refactor feature from public GitHub repo |

### `bootstrap:*` (2)

| Command | Description |
|---|---|
| `/bootstrap:auto` | Auto-bootstrap a new project |
| `/bootstrap:auto:fast` | Quick auto-bootstrap |

### `content:*` (4) 🔁 copywriter

| Command | Description |
|---|---|
| `/content:cro` | CRO content optimization |
| `/content:enhance` | Analyze + enhance copy |
| `/content:fast` | Write creative copy (fast) |
| `/content:good` | Write creative copy (good) |

### `design:*` (6) 🔁 ui-ux-designer

| Command | Description |
|---|---|
| `/design:3d` | Interactive 3D designs (Three.js) |
| `/design:describe` | Describe a design from screenshot/video |
| `/design:fast` | Quick design |
| `/design:good` | Immersive design |
| `/design:screenshot` | Design from screenshot |
| `/design:ui-ux-pro-max` | Advanced UI/UX (style toolkit) |

### `docs:*` (3) 🔁 docs-manager

| Command | Description |
|---|---|
| `/docs:init` | Create initial docs |
| `/docs:summarize` | Summarize codebase docs |
| `/docs:update` | Update docs |

### `fix:*` (7) 🔁 tester / debugger

| Command | Description |
|---|---|
| `/fix:ci` | Fix CI/GitHub Actions issues |
| `/fix:fast` | Fast fix small issues |
| `/fix:hard` | Subagent-driven hard fixes |
| `/fix:logs` | Fix from log analysis |
| `/fix:test` | Run tests + fix |
| `/fix:types` | Fix type errors |
| `/fix:ui` | Fix UI issues |

### `git:*` (3) 🔁 git-manager

| Command | Description |
|---|---|
| `/git:cm` | Stage + commit |
| `/git:cp` | Stage + commit + push |
| `/git:pr` | Create pull request |

### `integrate:*` (1) 🔁 integration-agent

| Command | Description |
|---|---|
| `/integrate:sepay` | SePay.vn payment integration |

### `plan:*` (5) 🔁 planner

| Command | Description |
|---|---|
| `/plan:ci` | Plan to fix CI issues |
| `/plan:cro` | CRO plan |
| `/plan:fast` | Plan w/o research |
| `/plan:hard` | Research + plan |
| `/plan:two` | Plan w/ 2 approaches |

### `review:*` (1) 🔁 code-reviewer + security-auditor

| Command | Description |
|---|---|
| `/review:codebase` | Scan + analyze codebase |

### `scout:*` (1) 🔁 scout-external

| Command | Description |
|---|---|
| `/scout:ext` | Scout w/ external agentic tools |

### `seo:*` (3) 🔁 seo skill

| Command | Description |
|---|---|
| `/seo:audit` | SEO audit URL |
| `/seo:keywords` | Keyword research |
| `/seo:schema` | JSON-LD schema |

### `skill:*` (4) 🔁 skill-creator

| Command | Description |
|---|---|
| `/skill:add` | Add files/scripts to a skill |
| `/skill:create` | Create new skill |
| `/skill:fix-logs` | Fix skill from logs |
| `/skill:optimize` | Optimize existing skill |

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
**Batch 4** (1 trio): `seo` (3 commands: `/seo:audit`, `/seo:keywords`, `/seo:schema`) — extracted detailed pipelines/templates from commands into `seo/references/{audit-checklist,keyword-research,schema-templates}.md`. Commands dropped 840→109 lines (−87%); single source of truth = skill + references.
**Batch 5** (4 cleanups): `content/cro` + `plan/cro` (cross-command CRO duplicate), `design/3d` (plan-structure duplicate), `design/*` (skill-activation boilerplate), `skill/*` (input-handling boilerplate).
- **CRO framework** — 25-point Conversion Optimization Framework extracted to [.claude/workflows/cro-framework.md](../../.claude/workflows/cro-framework.md). Both `/content:cro` and `/plan:cro` reference it instead of duplicating.
- **`design/*`** — removed repeated `aesthetic`+`frontend-design` skill-activation block from 5 commands (`ui-ux-designer` agent already auto-activates these). `design/3d`, `design/screenshot`, `design/describe` now reference `planning` skill for plan structure.
- **`skill/*`** — 4 commands now reference `skill-creator` skill canonically; `/skill:optimize` references `planning` skill for plan structure.

Notable extensions:
- `bootstrap` skill extended with **"Canonical Bootstrap Workflow"** (10-phase pipeline) — `/bootstrap`, `/bootstrap:auto`, `/bootstrap:auto:fast` only document variant differences.
- `fix` family — no skill/agent existed → created [.claude/workflows/fix-pipeline.md](../../.claude/workflows/fix-pipeline.md) as canonical 7-stage pipeline; 8 commands (`/fix`, `/fix:fast`, `/fix:hard`, `/fix:logs`, `/fix:ci`, `/fix:test`, `/fix:types`, `/fix:ui`) reference it + document variant deltas.
- `scout-external` agent references `scout` agent as canonical methodology — variant-only differences (external Gemini/OpenCode vs internal Explore).
- `docs-manager` agent + `journal-writer` agent serve as canonical sources (no dedicated knowledge skill exists for those concepts).
- `git-manager` agent retains haiku-optimized 2-3 tool execution workflow as agent-specific knowledge (skill = conventional-commits methodology).

Other trios (`testing` → covered by `web-testing`/`chrome-devtools`, `design` → `frontend-design`, `mcp` → `use-mcp`, `skill-management` → `skill-creator`, `database` → `databases`, `content`, `seo`, `security`, `orchestrate`, `code`, `watchup`) may follow this pattern in future passes.

| Concept | Skill | Agent | Command |
|---|---|---|---|
| Planning | `planning` | `planner` | `/plan`, `/plan:*` |
| Research / Scout | `research` | `researcher`, `scout`, `scout-external` | `/scout`, `/scout:ext` |
| Code review | `code-review` | `code-reviewer` | `/review:codebase` |
| Debugging | `debugging` | `debugger` | `/debug` |
| Testing | `web-testing` (developer toolkit), `test-automation` (QA/automation engineering) | `tester` | `/test`, `/fix:test` |
| Docs | `mintlify`, `llms`, `markdown-novel-viewer`, `tech-graph`, `document-skills/*` | `docs-manager` | `/docs:*` |
| Design | 10 design skills | `ui-ux-designer` | `/design:*` |
| Content | `show-off` | `copywriter` | `/content:*` |
| SEO/GEO | `seo`, `geo` | – (agent removed 2026-05-17) | `/seo:*` |
| Git | `git`, `worktree` | `git-manager` | `/git:*` |
| Bootstrap | `bootstrap` (knowledge) | – | `/bootstrap`, `/bootstrap:auto*` |
| Port & Refactor | `xia` | (uses `scout-external`, `code-reviewer`) | `/xia` |
| Security | `vulnerability-scanner`, `cti-expert` | `security-auditor` | `/review:codebase` |
| Payments | `payment-integration` | `integration-agent` | `/integrate:*` |
| MCP | – | `mcp-manager` | `/use-mcp` |
| Skill management | `skill-creator`, `find-skills`, `template-skill` | – | `/skill:*` |
| Database | `databases`, `supabase-postgres-best-practices` | `database-admin` | – |
| Journal | – | `journal-writer` | `/journal` |
| Brainstorm (7-phase advisory: Scout→Discovery→Research→Analysis→Debate→Consensus→Finalize→`planner`) | `brainstorm` (5-pillar methodology + 7-phase process) | `brainstormer` | `/brainstorm` |
| Orchestrate | – | `orchestrator` | `/orchestrate` |
| Fix | – | (uses tester/debugger) | `/fix`, `/fix:*` |
| Ask | `ask` (4-persona consultation methodology) | – | `/ask` |
| Watchup | – | – | `/watzup` |
| Code (backup) | – | (uses team) | `/code` (= `/cook <plan> --from-plan`, kept for fallback) |
| Cook (feature lifecycle) | `cook` (5-stage gated methodology) | (uses team) | `/cook` |
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
| `software/database/supabase-postgres/` → `software/database/supabase-postgres-best-practices/` | `name:` kept (upstream `skills-lock.json`) | **rename folder** |
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
- Security: `vulnerability-scanner` (SAST) + `cti-expert` (threat intel) feed `security-auditor` — distinct scopes.

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
| `security` | `/review:codebase` + `security-auditor` |
| `use-mcp` | `/use-mcp` + `mcp-manager` |
| `project-management` | `project-manager` agent |
| `team` | `/orchestrate` + `orchestrator` |
| `loop` | built-in `/loop` skill |

### Scaffold-fill batch (2026-05-16, this batch)

10 scaffolds filled to active; 1 merged + deleted:

| Action | Skill | Notes |
|---|---|---|
| Merged | `predict` → `[[planning]]` | High overlap with planning; "Predictive planning" subsection added to `planning/SKILL.md` + `references/forecasting-outcomes.md`; `software/predict/` folder removed. |

### Agent removal (2026-05-17)

| Action | Agent | Notes |
|---|---|---|
| Removed | `seo-specialist` | `marketing/` folder emptied + removed. `/seo:audit`, `/seo:keywords`, `/seo:schema` commands now run directly with `seo` skill + references (no dedicated agent). Frontmatter had non-standard fields (`mode`, `temperature`, `skills`) — legacy from OpenCode/agentgateway. |

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
- **Add a command** → create `.claude/commands/[<ns>/]<name>.md` and add a row to section 3.
- **Before adding** → search this file: if a row with the same name already exists in another pool, decide whether you're adding (a) knowledge/skill, (b) persona/agent, or (c) trigger/command. Avoid creating a fourth entry for the same concept.
- **On rename** → update both the SKILL/agent/command file frontmatter AND this registry in the same commit.
