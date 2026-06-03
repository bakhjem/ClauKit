# Orchestration Protocol

**IMPORTANT:** Analyze the skills catalog and activate the skills that are needed for the task during the process.

## Sequential Chaining

Chain subagents when tasks have dependencies or require outputs from previous steps:

- **Brainstorm → Planning → Review → Code**: Architectural/complex feature decisions (user-triggered via `/ck:brainstorm`)
- **Research → Design → Code → Documentation**: New system components
- **Research → Planning → Review**: Complex feature planning
- Each agent completes fully before the next begins
- Pass context and outputs between agents in the chain

## Plan-to-Code Handoff

When a task requires explicit plan approval before coding:

- Finish planning first and present the plan for user review
- After the user approves the plan, run `/clear` to start a fresh implementation context
- Begin coding from the approved plan only after the review → clear handoff is complete
- Preserve only the minimum required handoff context: goal, approved approach, plan path, constraints, unresolved questions

## Parallel Execution

Spawn multiple subagents simultaneously for independent tasks:

- **Code + Tests + Docs**: Separate, non-conflicting components
- **Multiple Feature Branches**: Different agents on isolated features
- **Cross-platform Development**: iOS and Android specific implementations
- **Careful Coordination**: No file conflicts or shared resource contention

## Parallel Patterns

### Fan-Out Pattern
```
Main Agent
    ├── Agent A (Task 1)
    ├── Agent B (Task 2)
    └── Agent C (Task 3)
    ↓
Combine Results
```

### Pipeline Pattern
```
Agent A → Agent B → Agent C → Agent D
```

## Controlled Workflow Orchestration

The 4th orchestration layer (above plain fan-out/pipeline): a **gated, inheritance-aware** re-creation of Claude Code's dynamic-workflow model, built on ClauKit primitives — markdown recipes + Agent-tool fan-out/pipeline over the 21 agents. Source of truth: the `dynamic-workflow` skill ([../skills/software/dynamic-workflow/SKILL.md](../skills/software/dynamic-workflow/SKILL.md)). Entry points: `/ck:flow <task>`, plus `/ck:fix --flow` and `/ck:review --flow` variants.

**It borrows the native feature's PATTERNS** (adversarial verify, judge panel, loop-until-dry, multi-modal sweep, completeness critic) — it does **NOT** call the native `Workflow` runtime or `ultracode`. ClauKit re-creates the model on primitives it fully controls.

**4-axis inheritance contract** (parent workflow → child agent stage → subagent):

1. **context/output** — all stages read/write shared `plans/<plan>/reports/`; a child reads the parent's handoff.
2. **persona** — a stage routes to one of the 21 agents via Agent `subagent_type`; zero new agent code.
3. **config/gate** — development-rules pre-flight + every parent gate apply to each stage; a child cannot silently skip a gate.
4. **model/budget** — a stage inherits or overrides the parent model; cost estimate shown pre-run, no hard cap (user decides).

**Control properties** — orchestrator runs in the main session; mandatory cost preview before fan-out; mid-run inspect/abort between phases. Bounded by control, so no native 1000-agent backstop is needed. See the skill's decision matrix for when to use this vs `/ck:team` vs plain subagent vs a markdown workflow.

## Agent Selection Guidelines

| Scenario | Agent(s) |
|-----------|----------|
| Brainstorm & architecture advisory | `brainstormer` |
| Research & discovery | `researcher`, `scout` |
| Planning | `planner` |
| Implementation | Main agent + domain skills |
| Testing | `tester` |
| Code review | `code-reviewer` |
| Debugging | `debugger` |
| Documentation | `docs-manager` |
| Project management | `project-manager` |
| Git operations | `git-manager` |

## Conflict Resolution

When multiple agents work in parallel:
1. Define clear boundaries - each agent owns specific files
2. Use unique file prefixes/namespaces
3. Define integration points before execution
4. Designate a "merge agent" to consolidate changes

## Context Preservation

- Pass essential context between agents in chain
- Use shared file system for large context (plans/, reports/)
- Keep handoff minimal but sufficient