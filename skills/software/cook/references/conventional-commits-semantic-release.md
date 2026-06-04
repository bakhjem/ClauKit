# Conventional Commits + Semantic Release

**Sources**:
- https://www.conventionalcommits.org/
- https://github.com/semantic-release/semantic-release

## Why this pairs with cook

Cook stage 5 (deploy) needs an unambiguous version bump and changelog. Conventional Commits + semantic-release automate both from commit messages.

## Commit grammar (relevant subset)

```
feat:        → minor bump
fix:         → patch bump
feat!: or
BREAKING CHANGE: in body
             → major bump
docs: / refactor: / test: / chore:
             → no bump (or patch, configurable)
```

Cook's stage 4 (docs) and stage 2 (code) produce commits with the right prefix; the deploy stage then runs semantic-release which reads them.

## Semantic-release pipeline

On push to `main`:
1. Analyze commits since last tag.
2. Determine version bump.
3. Generate CHANGELOG entry.
4. Create git tag + GitHub release.
5. Publish artifact (npm / Docker / etc.).

This means cook's deploy stage is largely "merge to main"; semantic-release does the rest.

## Pitfalls

- **Mixed-style commits**: half conventional, half free-form. Run `commitlint` in CI to enforce.
- **Squash-merge eating commit grammar**: ensure the squash message preserves the conventional prefix; many teams require PR title to be conventional.
- **`chore:` commits hiding `feat:`**: contributors mislabel; review the PR title before merging.

## Why authoritative

Both are widely adopted across npm, GitHub, and major open-source projects; the official sites are the canonical specifications.
