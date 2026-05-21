# Slash Commands Reference

Comprehensive catalog of Claude Code slash commands for development workflows.

## What Are Slash Commands?

Slash commands are user-defined operations that:
- Start with `/` (e.g., `/ck:cook`, `/ck:test`)
- Expand to full prompts when executed
- Accept arguments
- Located in `.claude/commands/`
- Can be project-specific or global

## Development Commands

### /ck:cook [task]
Implement features step by step.

```bash
/ck:cook implement user authentication with JWT
/ck:cook add payment integration with Stripe
```

**When to use**: Feature implementation with iterative development

### /ck:plan [task]
Research, analyze, and create implementation plans.

```bash
/ck:plan implement OAuth2 authentication
/ck:plan migrate from SQLite to PostgreSQL
```

**When to use**: Before starting complex implementations

### /ck:debug [issue]
Debug technical issues and provide solutions.

```bash
/ck:debug the API returns 500 errors intermittently
/ck:debug authentication flow not working
```

**When to use**: Investigating and diagnosing problems

### /ck:test
Run test suite.

```bash
/ck:test
```

**When to use**: Validate implementations, check for regressions

### /refactor [target]
Improve code quality.

```bash
/refactor the authentication module
/refactor for better performance
```

**When to use**: Code quality improvements

## Fix Commands

### /ck:fix --quick [issue]
Quick fixes for small issues.

```bash
/ck:fix --quick the login button is not working
/ck:fix --quick typo in error message
```

**When to use**: Simple, straightforward fixes

### /ck:fix --review [issue]
Complex issues requiring planning and subagents.

```bash
/ck:fix --review database connection pooling issues
/ck:fix --review race condition in payment processing
```

**When to use**: Complex bugs requiring deep investigation

### /ck:fix types
Fix TypeScript type errors.

```bash
/ck:fix types
```

**When to use**: TypeScript compilation errors

### /ck:fix test [issue]
Fix test failures.

```bash
/ck:fix test the user service tests are failing
/ck:fix test integration tests timing out
```

**When to use**: Test suite failures

### /ck:fix ui [issue]
Fix UI issues.

```bash
/ck:fix ui button alignment on mobile
/ck:fix ui dark mode colors inconsistent
```

**When to use**: Visual or interaction issues

### /ck:fix ci [url]
Analyze GitHub Actions logs and fix CI/CD issues.

```bash
/ck:fix ci https://github.com/owner/repo/actions/runs/123456
```

**When to use**: Build or deployment failures

### /ck:fix logs [issue]
Analyze logs and fix issues.

```bash
/ck:fix logs server error logs showing memory leaks
```

**When to use**: Production issues with log evidence

## Documentation Commands

Dispatcher: `/ck:docs` with flags `-init` · `-update` · `-summarize`. Subcommand aliases (`/ck:docs init`, `/ck:docs update`, `/ck:docs summarize`) remain supported.

### /ck:docs -init (alias: /ck:docs init)
Create initial documentation structure.

```bash
/ck:docs -init
# or: /ck:docs init
```

**When to use**: New projects needing documentation

### /ck:docs -update (alias: /ck:docs update)
Update existing documentation based on code changes.

```bash
/ck:docs -update
/ck:docs -update "focus on the new auth module"
# or: /ck:docs update
```

**When to use**: After significant code changes

### /ck:docs -summarize (alias: /ck:docs summarize)
Summarize codebase and create overview.

```bash
/ck:docs -summarize
/ck:docs -summarize "auth, payments" true
# or: /ck:docs summarize
```

**When to use**: Generate project summaries

## Git Commands

### /ck:git cm
Stage all files and create commit (no push).

```bash
/ck:git cm
```

**When to use**: Commit changes with automatic message

### /ck:git cp
Stage, commit, and push all code in current branch.

```bash
/ck:git cp
```

**When to use**: Commit and push in one command

### /ck:git pr [branch] [from-branch]
Create pull request.

```bash
/ck:git pr feature-branch main
/ck:git pr bugfix-auth develop
```

**When to use**: Creating PRs with automatic descriptions

### /ck:git merge [pr-number|target-branch]
Merge PR or local branch (interactive — prompts for strategy).

```bash
/ck:git merge          # merge PR of current branch (or local)
/ck:git merge 123      # merge PR #123
/ck:git merge develop  # merge current branch into develop
```

**When to use**: Finalizing a PR or branch merge with user-chosen strategy

## Planning Commands

### /ck:plan two [task]
Create implementation plan with 2 alternative approaches.

```bash
/ck:plan two implement caching layer
```

**When to use**: Need to evaluate multiple approaches

### /ck:plan ci [url]
Analyze GitHub Actions logs and create fix plan.

```bash
/ck:plan ci https://github.com/owner/repo/actions/runs/123456
```

**When to use**: CI/CD failure analysis

### /ck:plan cro [issue]
Create conversion rate optimization plan.

```bash
/ck:plan cro landing page conversion improvement
```

**When to use**: Marketing/conversion optimization

## Content Commands

### /ck:content fast [request]
Quick copy writing.

```bash
/ck:content fast write product description for new feature
```

**When to use**: Fast content generation

### /ck:content good [request]
High-quality, conversion-focused copy.

```bash
/ck:content good write landing page hero section
```

**When to use**: Marketing copy requiring polish

### /ck:content enhance [issue]
Enhance existing content.

```bash
/ck:content enhance improve clarity of pricing page
```

**When to use**: Improving existing copy

### /ck:content cro [issue]
Conversion rate optimization for content.

```bash
/ck:content cro optimize email campaign copy
```

**When to use**: Conversion-focused content improvements

## Design Commands

### /ck:design fast [task]
Quick design implementation.

```bash
/ck:design fast create dashboard layout
```

**When to use**: Rapid prototyping

### /ck:design good [task]
High-quality, polished design.

```bash
/ck:design good create landing page for SaaS product
```

**When to use**: Production-ready designs

### /ck:design 3d [task]
Create 3D designs with Three.js.

```bash
/ck:design 3d create interactive 3D product viewer
```

**When to use**: 3D visualization needs

### /ck:design screenshot [path]
Create design based on screenshot.

```bash
/ck:design screenshot screenshot.png
```

**When to use**: Recreating designs from images

## Deployment Commands

### /deploy
Deploy using deployment tool.

```bash
/deploy
```

**When to use**: Production deployments

### /deploy-check
Check deployment readiness.

```bash
/deploy-check
```

**When to use**: Pre-deployment validation

## Integration Commands

### /ck:sepay [tasks]
Implement payment integration with SePay.vn.

```bash
/ck:sepay add Vietnamese payment gateway
```

**When to use**: SePay payment integration

## Other Commands

### /ck:brainstorm [question]
Brainstorm features and ideas.

```bash
/ck:brainstorm how to improve user onboarding
```

**When to use**: Ideation and exploration

### /ck:ask [question]
Answer technical and architectural questions.

```bash
/ck:ask what's the best way to handle websocket connections
```

**When to use**: Technical guidance

### /ck:scout [prompt] [scale]
Scout directories to respond to requests.

```bash
/ck:scout find authentication code
```

**When to use**: Code exploration

### /ck:watzup
Review recent changes and wrap up work.

```bash
/ck:watzup
```

**When to use**: End of session summary

### /ck:bootstrap [requirements]
Bootstrap new project step by step.

```bash
/ck:bootstrap create React app with TypeScript and Tailwind
```

**When to use**: New project setup

### /ck:bootstrap auto [requirements]
Bootstrap new project automatically.

```bash
/ck:bootstrap auto create Next.js app
```

**When to use**: Automated project setup

### /ck:journal
Write journal entries for development log.

```bash
/ck:journal
```

**When to use**: Development documentation

### /ck:review [prompt]
Scan and analyze codebase.

```bash
/ck:review analyze architecture patterns
```

**When to use**: Codebase analysis

### /ck:skill:create [prompt]
Create new agent skill.

```bash
/ck:skill:create create skill for API testing
```

**When to use**: Extending Claude with custom skills

## Creating Custom Slash Commands

### Command File Structure
```
.claude/commands/
└── my-command.md
```

### Example Command File
```markdown
# File: .claude/commands/my-command.md

Create comprehensive test suite for {{feature}}.

Include:
- Unit tests
- Integration tests
- Edge cases
- Mocking examples
```

### Usage
```bash
/my-command authentication
# Expands to: "Create comprehensive test suite for authentication..."
```

### Best Practices

**Clear prompts**: Write specific, actionable prompts
**Use variables**: `{{variable}}` for dynamic content
**Document usage**: Add comments explaining the command
**Test thoroughly**: Verify commands work as expected

## Command Arguments

### Single Argument
```bash
/ck:cook implement user auth
# Argument: "implement user auth"
```

### Multiple Arguments
```bash
/ck:git pr feature-branch main
# Arguments: "feature-branch", "main"
```

### Optional Arguments
Some commands work with or without arguments:
```bash
/ck:test              # Run all tests
/ck:test user.test.js # Run specific test
```

## See Also

- Creating custom commands: `references/hooks-and-plugins.md`
- Command automation: `references/configuration.md`
- Best practices: `references/best-practices.md`
