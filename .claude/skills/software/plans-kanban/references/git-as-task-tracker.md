# Git as the Audit Log for Plan Movement

**Source pattern**: standard practice; reference https://git-scm.com/book/en/v2

## Why git history beats a database

The audit log of who moved which plan when, with what rationale, is built into git for free:

```bash
# everyone who has ever touched plan X
git log --all --oneline plans/**/plan-x.md

# why was this plan moved to archived?
git log --all -p --diff-filter=R plans/90-archived/plan-x.md
```

The `--diff-filter=R` flag shows rename commits — exactly the state transitions. Commit messages capture the reasoning.

## Rename, don't copy

`git mv` preserves history through state transitions. Copy-then-delete loses it.

Recommended commit messages on transitions:

```
chore(plans): move feature-x to in-progress

Starting implementation this sprint per the prioritization
discussion in retro 2026-03-12.
```

## Drift detection

Status field in frontmatter and parent folder must agree. Sanity check (runs in CI or as a pre-push hook):

```bash
for p in plans/*/*.md; do
  folder=$(dirname "$p" | awk -F/ '{print $NF}')
  status=$(grep '^status:' "$p" | awk '{print $2}')
  case "$folder" in
    00-backlog) want="backlog";;
    10-in-progress) want="in-progress";;
    20-review) want="review";;
    30-done) want="done";;
    90-archived) want="archived";;
  esac
  [ "$status" != "$want" ] && echo "DRIFT: $p folder=$folder status=$status"
done
```

A non-empty output means someone moved a file without updating frontmatter.

## Why authoritative

The Git book is the canonical reference; the `mv` / `log --diff-filter=R` workflow is the standard idiom for using git as a state-transition log.
