# Kanban Guide for Scrum Teams

**Source**: https://www.scrum.org/resources/kanban-guide-scrum-teams

## Principles that port to a folder kanban

The official guide distills Kanban to four practices:

1. **Visualize the workflow** — every work item visible, every state distinct.
2. **Limit work in progress (WIP)** — caps prevent multitasking and force completion before starting new.
3. **Manage flow** — measure cycle time (start → done); reduce it.
4. **Make policies explicit** — what does "done" mean? Who reviews? Write it down.

In `plans-kanban`, folder names provide visualization, frontmatter + grep provides limits and flow measurement, and the skill itself is the explicit policy.

## WIP limits — picking the right cap

- **Per individual**: 1–3 active items. Beyond 3, context switching dominates.
- **Per state**: cap the review column smaller than in-progress. Otherwise items pile up waiting for review and flow stalls.
- **Per team**: derived from individual caps × team size, with a buffer.

Caps are upper bounds, not targets. A team finishing items has them well under the cap.

## Pull vs push

Kanban is **pull-based**: when capacity opens, the worker pulls the next item from upstream. The opposite (push: assigning items into queues) creates idle queues and lost context. In `plans-kanban` the move is `git mv`; the act of moving is the pull.

## Why authoritative

Published by Scrum.org, co-authors include David Anderson (who codified Kanban for software in 2010). The most-cited adaptation of Kanban to software teams.
