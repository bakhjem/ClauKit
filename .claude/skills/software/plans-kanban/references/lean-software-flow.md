# Lean Software Development · Flow Optimization

**Source**: https://en.wikipedia.org/wiki/Lean_software_development

## Lean → software

Lean originates in Toyota Production System. Mary and Tom Poppendieck adapted it to software in 2003. Seven principles; three are central to `plans-kanban`:

### Eliminate waste

Anything that doesn't add value for the user. Examples relevant to a plans folder:

- **Partially done work** — plans in `in-progress` longer than two weeks.
- **Task switching** — owner toggling between three plans daily.
- **Waiting** — plans stuck in `review` because no one was assigned.

Each waste type is observable from the folder structure if you measure cycle time.

### Decide as late as possible

Don't commit to plan details before you must. In a folder kanban, this means the `00-backlog/` plans are intentionally light — title, rough scope, owner. Detail accrues as a plan moves to `10-in-progress/`.

### Deliver as fast as possible

Cycle time (`created` → `done` per frontmatter) is the metric. Shrinking it is the goal of WIP limits, not "do more at once".

## Measuring flow

```bash
# average cycle time of plans done this quarter
for p in plans/30-done/*.md; do
  c=$(grep '^created:' "$p" | awk '{print $2}')
  u=$(grep '^updated:' "$p" | awk '{print $2}')
  echo "$(( ( $(date -d "$u" +%s) - $(date -d "$c" +%s) ) / 86400 )) days"
done | awk '{sum+=$1; n++} END {print sum/n " days avg"}'
```

If this number is rising over quarters, flow is degrading — surface in the next `[[retro]]`.

## Why authoritative

The Wikipedia page consolidates the Poppendieck books and 20 years of practitioner refinement; the principles are the canonical software-Lean reference.
