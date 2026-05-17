---
name: git
description: Git operations with conventional commits (cm, cp, pr, merge)
category: Git & Version Control
status: active
---

# Git Operations & Conventional Commits

## Purpose

Master Git workflows with conventional commit semantics. Provides structured guidance for staging, committing, pushing, creating PRs, and merging code using industry-standard commit message conventions.

## When to Use

- Staging and committing code changes with semantic commit messages
- Creating pull requests on GitHub/GitLab with proper descriptions
- Merging feature branches and managing release workflows
- Squashing, rebasing, or amending commits
- Implementing pre-commit hooks for code quality (linting, tests)
- Resolving merge conflicts and maintaining clean history
- Automating version bumps based on commit types

**Do NOT use when**: Cherry-picking individual commits from history, reverting multi-commit PRs, or managing submodules (use separate workflow).

## Workflow

1. **Stage Changes** — Use `git add <files>` to stage specific modifications. Avoid `git add .` unless intentional. Review with `git diff --cached`.

2. **Commit with Conventional Format** — Write commits as `<type>(<scope>): <subject>` followed by blank line and body.
   - `feat(auth): add JWT token refresh` (new feature)
   - `fix(database): resolve connection pooling leak` (bug fix)
   - `docs(readme): update installation steps` (documentation)
   - `style(config): format eslint rules` (formatting, no code changes)
   - `refactor(api): consolidate handlers` (restructure without behavior change)
   - `test(unit): add coverage for auth module` (tests only)
   - `chore(deps): bump typescript to 5.0` (maintenance)

3. **Validate with Pre-Commit Hooks** — Hooks automatically check formatting, run linters, and verify tests before commits succeed.

4. **Push to Remote** — Use `git push origin <branch>` to sync local commits. Use `-u` flag on first push for new branches.

5. **Create Pull Request** — Use `git pull-request` CLI or GitHub web UI. Include:
   - Clear title (under 70 chars)
   - Detailed description referencing related issues
   - Screenshot/video for UI changes
   - Checklist of tested scenarios

6. **Merge After Review** — Rebase before merge to maintain clean history. Use `git merge --ff-only` or squash strategy for cleanup.

## Key Concepts

### Conventional Commits
Specification (conventionalcommits.org) standardizes commit messages for:
- Semantic versioning (auto-increment patch/minor/major)
- Changelog generation (parse commits to extract features/fixes)
- Better code review context (type signals intent immediately)

Format: `<type>(<optional-scope>): <description>` + optional body + footer.

**Types**:
- `feat`: New feature (bumps minor version)
- `fix`: Bug fix (bumps patch version)
- `breaking`: Breaking change (bumps major version) — mark in footer `BREAKING CHANGE: <description>` or with `!` after scope
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code restructuring without behavior change
- `test`: Test additions or updates
- `chore`: Dependency, config, tooling changes
- `perf`: Performance optimization
- `ci`: CI/CD changes

### Staging Strategy
- **Granular commits**: One logical change per commit (easier to revert/bisect)
- **Interactive staging**: Use `git add -p` to stage hunks, avoiding noisy commits
- **Review before push**: Always `git diff HEAD` before `git push` to verify correctness

### Merge Strategies
- **Fast-forward**: Linear history (preferred for small features)
- **Squash & merge**: Single commit per PR (clean history, loses individual commits)
- **Rebase & merge**: Replayed commits on target branch (linear without merge commit)

## Example

```bash
# Stage specific files
git add src/auth.js tests/auth.test.js

# Review staged changes
git diff --cached

# Commit with semantic message
git commit -m "feat(auth): implement JWT token refresh

- Add refresh token endpoint (GET /api/refresh)
- Implement 7-day rotation policy
- Add secure cookie storage

Closes #1234"

# Push and track remote
git push -u origin feature/jwt-refresh

# View commit before push (if using pre-commit hooks)
git log -1 --stat
```

## Common Pitfalls

- **Ambiguous commit messages**: "fix stuff" → unclear intent. Use specific: "fix(api): handle null request body in POST /users"
- **Large monolithic commits**: Mix of unrelated changes → hard to review/revert. Use `git add -p` to split logically.
- **Merge commits pollute history**: Use rebase or squash merge to keep linear history.
- **Ignoring pre-commit hooks**: Bypassing checks with `--no-verify` → breaks CI. Fix issues first.
- **Not syncing before merge**: Working on outdated base → merge conflicts. Always `git pull --rebase origin main` first.

## References

- [Conventional Commits](https://www.conventionalcommits.org/) — Specification and best practices for semantic commit messages
- [Pro Git Book: Chapter 2 (Git Basics)](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) — Comprehensive staging, committing, and history management
- [Pro Git Book: Chapter 3 (Branching & Merging)](https://git-scm.com/book/en/v2/Git-Branching-Branch-Management) — Merge strategies, rebasing, and workflow patterns
