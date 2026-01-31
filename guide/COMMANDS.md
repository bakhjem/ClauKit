# ClauKit Commands Reference

A comprehensive guide to all available slash commands in ClauKit.

## Table of Contents

- [Introduction](#introduction)
- [Core Development Commands](#core-development-commands)
- [Content Creation Commands](#content-creation-commands)
- [Design Commands](#design-commands)
- [Documentation Commands](#documentation-commands)
- [Fix & Debug Commands](#fix--debug-commands)
- [Git Commands](#git-commands)
- [Planning Commands](#planning-commands)
- [Integration Commands](#integration-commands)

---

## Introduction

### What are Slash Commands?

Slash commands are powerful shortcuts that trigger specialized AI agents and workflows in ClauKit. They follow the simple syntax:

```bash
/<command-name> [arguments]
```

Commands are stored in `.claude/commands/` directory and can be customized for your project needs.

### Benefits

- **Instant Agent Orchestration**: Trigger specialized agents with a single command
- **Consistent Workflows**: Standardized processes across your team
- **Time Savings**: Automate complex multi-step operations
- **Context Preservation**: Maintain project context across agent handoffs

---

## Core Development Commands

### `/ask`

**Description**: Answer technical and architectural questions with expert consultation.

**Usage**:
```bash
/ask [technical-question]
```

**Examples**:
```bash
/ask "Should we use Redis or Memcached for our caching layer?"
/ask "How can we scale our database to handle 1M concurrent users?"
```

---

### `/bootstrap`

**Description**: Bootstrap a new project from scratch with complete setup.

**Usage**:
```bash
/bootstrap
```

**Workflow**:
1. Git Initialization
2. Requirements Gathering
3. Research (multiple agents)
4. Tech Stack Selection
5. Wireframe & Design
6. Implementation
7. Testing
8. Code Review
9. Documentation

---

### `/brainstorm`

**Description**: Brainstorm solutions for features or technical challenges.

**Usage**:
```bash
/brainstorm [feature-or-question]
```

**Examples**:
```bash
/brainstorm "How should we implement user authentication?"
/brainstorm "Best way to handle file uploads for large files?"
```

---

### `/cook`

**Description**: Implement a feature following a structured workflow.

**Usage**:
```bash
/cook [tasks-description]
```

**Workflow**:
1. Planning (planner + researcher)
2. Implementation
3. Type checking
4. Test writing
5. Test execution
6. Debugging (if needed)
7. Code review
8. Documentation update
9. Git commit

**Examples**:
```bash
/cook "add user profile page with avatar upload"
/cook "implement OAuth2 authentication with Google"
```

---

### `/debug`

**Description**: Analyze and debug technical issues without implementing fixes.

**Usage**:
```bash
/debug [issue-description]
```

**Examples**:
```bash
/debug "Memory leak in user service"
/debug "API responses are slow after deployment"
```

**Note**: Use `/fix:*` commands to implement fixes.

---

### `/journal`

**Description**: Write journal entries about recent development work.

**Usage**:
```bash
/journal
```

---

### `/plan`

**Description**: Research, analyze, and create implementation plan without coding.

**Usage**:
```bash
/plan [task-description]
```

**Examples**:
```bash
/plan "implement WebSocket real-time notifications"
/plan "add multi-language support with i18n"
```

---

### `/scout`

**Description**: Fast codebase search to find files needed for a task.

**Usage**:
```bash
/scout [user-prompt] [scale]
```

**Arguments**:
- `$1`: What you're looking for
- `$2`: Number of agents (default: 3)

**Examples**:
```bash
/scout "authentication related files" 3
/scout "database models and migrations" 5
```

---

### `/test`

**Description**: Run tests and analyze results without implementing fixes.

**Usage**:
```bash
/test
```

---

### `/watzup`

**Description**: Review recent changes and wrap up work session.

**Usage**:
```bash
/watzup
```

---

## Content Creation Commands

### `/content:enhance`

**Description**: Analyze and enhance existing copy based on reported issues.

**Usage**:
```bash
/content:enhance [issues-description]
```

---

### `/content:fast`

**Description**: Write creative & smart copy quickly.

**Usage**:
```bash
/content:fast [user-request]
```

**Examples**:
```bash
/content:fast "Write hero section for SaaS landing page"
/content:fast "Create compelling CTA button text"
```

---

### `/content:good`

**Description**: Write high-quality creative & smart copy with research.

**Usage**:
```bash
/content:good [user-request]
```

---

## Design Commands

### `/design:fast`

**Description**: Create a quick design implementation.

**Usage**:
```bash
/design:fast [design-requirements]
```

---

### `/design:good`

**Description**: Create immersive, award-winning quality design.

**Usage**:
```bash
/design:good [design-requirements]
```

---

### `/design:3d`

**Description**: Create immersive interactive 3D designs with Three.js.

**Usage**:
```bash
/design:3d [3d-design-requirements]
```

---

### `/design:screenshot`

**Description**: Create design based on a screenshot.

**Usage**:
```bash
/design:screenshot [screenshot-path-or-url]
```

---

### `/design:video`

**Description**: Create design based on a video reference.

**Usage**:
```bash
/design:video [video-path-or-url]
```

---

### `/design:describe`

**Description**: Describe a design from screenshot/video without implementing.

**Usage**:
```bash
/design:describe [screenshot-or-video]
```

---

## Documentation Commands

### `/docs:init`

**Description**: Analyze codebase and create initial documentation.

**Usage**:
```bash
/docs:init
```

---

### `/docs:summarize`

**Description**: Update codebase summary documentation.

**Usage**:
```bash
/docs:summarize
```

---

### `/docs:update`

**Description**: Comprehensively update all documentation.

**Usage**:
```bash
/docs:update [additional-requests]
```

---

## Fix & Debug Commands

### `/fix:ci`

**Description**: Analyze GitHub Actions logs and fix CI/CD issues.

**Usage**:
```bash
/fix:ci [github-actions-url]
```

---

### `/fix:fast`

**Description**: Quickly analyze and fix issues.

**Usage**:
```bash
/fix:fast [issue-description]
```

---

### `/fix:hard`

**Description**: Plan and fix hard issues with full workflow.

**Usage**:
```bash
/fix:hard [complex-issue-description]
```

---

### `/fix:logs`

**Description**: Analyze logs file and fix issues.

**Usage**:
```bash
/fix:logs [issue-context]
```

**Requirement**: Must have `./logs.txt` file.

---

### `/fix:test`

**Description**: Run test suite and fix all failures.

**Usage**:
```bash
/fix:test [issue-context]
```

---

### `/fix:types`

**Description**: Fix TypeScript type errors.

**Usage**:
```bash
/fix:types
```

---

## Git Commands

### `/git:cm`

**Description**: Stage all files and create a commit.

**Usage**:
```bash
/git:cm
```

---

### `/git:cp`

**Description**: Stage, commit, and push all changes.

**Usage**:
```bash
/git:cp
```

---

## Planning Commands

### `/plan:ci`

**Description**: Analyze GitHub Actions and provide fix plan (no implementation).

**Usage**:
```bash
/plan:ci [github-actions-url]
```

---

### `/plan:two`

**Description**: Create implementation plan with 2+ approaches.

**Usage**:
```bash
/plan:two [task-description]
```

---

## Integration Commands

### `/integrate:polar`

**Description**: Implement payment integration with Polar.sh.

**Usage**:
```bash
/integrate:polar [requirements]
```

---

### `/integrate:sepay`

**Description**: Implement payment integration with SePay (Vietnamese payment gateway).

**Usage**:
```bash
/integrate:sepay [requirements]
```

---

## Best Practices

### Choosing the Right Command

**For Planning**:
- `/plan` - Single approach
- `/plan:two` - Compare approaches
- `/brainstorm` - Exploratory discussion
- `/ask` - Architectural consultation

**For Implementation**:
- `/cook` - General features
- `/bootstrap` - New projects
- `/design:*` - UI/UX work
- `/integrate:*` - Third-party services

**For Fixing Issues**:
- `/fix:fast` - Simple bugs
- `/fix:hard` - Complex issues
- `/fix:types` - TypeScript errors
- `/fix:test` - Test failures

---

## CLI Commands

ClauKit also provides a CLI tool:

```bash
# Install globally
npm install -g https://github.com/trungdo9/ClauKit.git

# Initialize .claude in your project
ck init
ck init --force    # Overwrite existing

# Show help
ck help
```

---

**Last Updated**: 2026-01-31

Repository: https://github.com/trungdo9/ClauKit
