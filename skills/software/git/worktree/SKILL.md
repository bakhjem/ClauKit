---
name: worktree
description: Git worktree isolation for parallel development
category: Git & Version Control
status: active
---

# Git Worktree for Parallel Development

## Purpose

Leverage `git worktree` to maintain multiple isolated working trees from a single repository, enabling simultaneous work on different branches without stashing/context-switching overhead.

## When to Use

- Working on parallel features/fixes without stashing current work
- Emergency hotfixes while mid-refactor on main branch
- Running tests/builds on multiple branches concurrently
- Long-lived experimental branches in isolated directories
- Maintaining separate worktrees for CI/build artifacts
- CI/CD pipelines that need parallel checkouts on same repo

**Do NOT use when**: Simple branch switching (use `git checkout`), small single-file edits, or when storage space is critical (each worktree duplicates repo size).

## Workflow

1. **Create New Worktree** — `git worktree add [-b <new-branch>] <path> [<commit-ish>]`
   - Creates directory at `<path>` with linked checkout
   - Optionally creates new branch (`-b`) from specified commit

2. **Switch to Worktree** — Navigate to worktree directory and work normally (Git commands, builds, tests all work as usual).

3. **Commit Changes** — Stage, commit, and push from worktree (changes are tracked in main repository).

4. **List Worktrees** — `git worktree list` to see all active worktrees and their branches.

5. **Remove Worktree** — `git worktree remove <path>` after merging/deleting the branch.

6. **Clean Stale Entries** — `git worktree prune` removes entries referencing deleted directories.

## Key Concepts

### Worktree Isolation
Each worktree maintains its own:
- `HEAD` pointer and checked-out branch
- Working directory state and staged changes
- Per-worktree configuration (via `git config --worktree`)

Shared across worktrees:
- Object database (`.git/objects`) — avoids duplication
- Ref database (branches/tags) — synchronized
- Configuration (unless per-worktree override)

### Locking & Protection
Prevent accidental removal (e.g., portable drives):
```bash
git worktree lock <path> --reason "external hard drive"
git worktree remove -f <path>  # Requires --force for locked
```

### Per-Worktree Configuration
```bash
git config --worktree core.fileMode false  # Only applies to this worktree
git config --worktree --list                # View worktree-specific config
```

### Moving Worktrees
Relocate worktree safely:
```bash
git worktree move <current-path> <new-path>
# Manual move requires: git worktree repair
```

## Example

```bash
# Main branch: long refactoring session
$ git worktree add -b hotfix ../hotfix origin/main
# Creates ../hotfix/ worktree on new 'hotfix' branch from origin/main

$ cd ../hotfix
$ git log --oneline -2  # Verify correct base
$ echo "fix" > bug.txt
$ git add bug.txt && git commit -m "fix(critical): patch production bug"
$ git push -u origin hotfix

# Return to main worktree
$ cd ../project
$ git worktree list
path                     branch
/home/user/project       refs/heads/main
/home/user/hotfix        refs/heads/hotfix

# Cleanup after PR merged
$ cd ../project
$ git worktree remove ../hotfix
$ git worktree prune  # Remove stale entries
```

## Common Pitfalls

- **Checking out same branch in multiple worktrees**: Git prevents this — one branch can only be checked out once. Use `git worktree add -d --detach` for experimental detached heads.
- **Forgetting to remove worktrees**: Accumulates disk usage. Use `git worktree list` regularly and `git worktree remove` after merging.
- **Moving worktrees manually**: Breaks internal links. Always use `git worktree move` or `git worktree repair` if moved manually.
- **Locking without documentation**: Other developers won't know why locked. Always provide `--reason` for locked worktrees.
- **Stale entries after external deletion**: Directory deleted but Git entry remains. Fix with `git worktree prune` or `git worktree repair`.

## References

- [Git Worktree Documentation](https://git-scm.com/docs/git-worktree) — Official git-scm reference with all commands and options
- [Atlassian: Git Worktree Guide](https://www.atlassian.com/git/tutorials/monorepos/git-worktree) — Practical use cases and workflow patterns for parallel development
- [Pro Git Book: Chapter 10 (Git Internals)](https://git-scm.com/book/en/v2/Git-Internals-The-Refspec) — Understanding repository structure and worktree mechanics
