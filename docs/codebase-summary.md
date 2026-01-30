# Codebase Summary

**Last Updated**: 2026-01-31
**Version**: 1.0.1
**Repository**: https://github.com/trungdo9/spark-dev

## Overview

spark-dev is a development template for building AI-powered applications with Claude Code. Built on top of ClaudeKit Engineer, it provides a standardized foundation for AI-assisted development with pre-configured agents, commands, skills, and workflows.

## Project Structure

```
spark-dev/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # 19 specialized agent definitions
│   ├── commands/               # 60+ slash command implementations
│   ├── hooks/                  # Git hooks and scripts
│   │   └── scout-block.js      # Scout Block Hook dispatcher
│   ├── skills/                 # Specialized skills library
│   ├── workflows/              # Development workflow definitions
│   ├── settings.json           # Claude Code settings
│   ├── metadata.json           # Project metadata
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Git exclusions
│   ├── .mcp.json.example       # MCP configuration template
│   ├── statusline.sh           # Bash statusline script
│   ├── statusline.ps1          # PowerShell statusline script
│   └── statusline.js           # Node.js statusline script
├── .opencode/                  # OpenCode CLI configuration
│   ├── agent/                  # Agent definitions
│   └── command/                # Command definitions
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD workflows
├── docs/                       # Project documentation
│   ├── project-overview-pdr.md
│   ├── codebase-summary.md
│   ├── code-standards.md
│   ├── system-architecture.md
│   └── project-roadmap.md
├── plans/                      # Implementation plans and reports
│   └── reports/                # Agent-to-agent communication
├── scripts/                    # Setup and utility scripts
│   └── postinstall.js          # Post-install setup script
├── CLAUDE.md                   # Project instructions for Claude
├── README.md                   # Project overview
├── package.json                # Node.js dependencies
├── .releaserc.json             # Semantic release configuration
├── .commitlintrc.json          # Commit linting rules
├── .gitignore                  # Git exclusions
├── .repomixignore              # Repomix exclusions
├── CHANGELOG.md                # Version history
└── LICENSE                     # MIT License
```

## Core Technologies

### Runtime & Dependencies
- **Node.js**: >=18.0.0
- **Package Manager**: npm
- **License**: MIT

### Production Dependencies
- `next-engineer` - GitHub package for AI-powered development

### Development Dependencies
- `@commitlint/cli`: ^18.4.3
- `@commitlint/config-conventional`: ^18.4.3
- `@semantic-release/changelog`: ^6.0.3
- `@semantic-release/commit-analyzer`: ^11.1.0
- `@semantic-release/exec`: ^6.0.3
- `@semantic-release/git`: ^10.0.1
- `@semantic-release/github`: ^9.2.6
- `@semantic-release/npm`: ^11.0.2
- `@semantic-release/release-notes-generator`: ^12.1.0
- `conventional-changelog-conventionalcommits`: ^7.0.2
- `husky`: ^8.0.3
- `semantic-release`: ^22.0.12

### Development Tools
- **Semantic Release**: Automated versioning and changelog
- **Commitlint**: Conventional commit enforcement
- **Husky**: Git hooks automation
- **Repomix**: Codebase compaction for AI consumption

### CI/CD
- **GitHub Actions**: Automated release workflow
- **Semantic Versioning**: Automated version management
- **Conventional Commits**: Structured commit messages

## Key Components

### 1. Agent Orchestration System

**Claude Code Agents** (`.claude/agents/` - 16 agents):

| Category | Agents |
|----------|--------|
| Planning | `planner`, `researcher`, `brainstormer` |
| Quality | `tester`, `code-reviewer`, `debugger`, `security-auditor` |
| Documentation | `docs-manager`, `copywriter`, `journal-writer` |
| Operations | `git-manager`, `project-manager`, `database-admin`, `mcp-manager` |
| Implementation | `scout`, `scout-external`, `ui-ux-designer`, `lovable-to-nextjs`, `csharp-expert` |
| Specialized | `seo-specialist` |

**OpenCode Agents** (`.opencode/agent/`):
- Similar agent definitions optimized for OpenCode CLI

### 2. Slash Commands System

**Categories** (65+ commands):

| Category | Commands |
|----------|----------|
| Development | `/plan`, `/cook`, `/test`, `/ask`, `/bootstrap`, `/brainstorm`, `/code` |
| Debugging | `/debug`, `/fix`, `/fix:fast`, `/fix:hard`, `/fix:ci`, `/fix:test`, `/fix:types`, `/fix:logs`, `/fix:ui` |
| Design | `/design:fast`, `/design:good`, `/design:3d`, `/design:screenshot`, `/design:video`, `/design:describe`, `/design:ui-ux-pro-max` |
| Content | `/content:fast`, `/content:good`, `/content:enhance`, `/content:cro` |
| Documentation | `/docs:init`, `/docs:update`, `/docs:summarize` |
| SEO | `/seo:audit`, `/seo:keywords`, `/seo:schema` |
| Git Operations | `/git:cm`, `/git:cp`, `/git:pr` |
| Planning | `/plan:fast`, `/plan:hard`, `/plan:two`, `/plan:ci`, `/plan:cro` |
| Project Management | `/watzup`, `/journal`, `/scout`, `/scout:ext` |
| Skills | `/skill:add`, `/skill:create`, `/skill:optimize`, `/skill:fix-logs` |
| Integration | `/integrate:polar`, `/integrate:sepay`, `/use-mcp` |
| Code Review | `/review:codebase` |

### 3. Skills Library

**Skills Organization** (`.claude/skills/`):

Skills are organized into the following categories:
- **DevOps**: Cloudflare, Docker, Google Cloud
- **Databases**: MongoDB, PostgreSQL
- **Web Frameworks**: Next.js, Turborepo
- **UI Styling**: shadcn/ui, Tailwind CSS
- **Individual Skills**: better-auth, chrome-devtools, debugging, docs-seeker, document-skills, ffmpeg, imagemagick, gemini-audio, gemini-video-understanding, mcp-builder, problem-solving, shopify

### 4. Workflows

**Primary Workflows** (`.claude/workflows/`):

1. **primary-workflow.md**: Core development cycle
   - Code implementation
   - Testing
   - Code quality
   - Integration
   - Debugging

2. **development-rules.md**: Development standards
   - File size management (<200 lines)
   - YANGI, KISS, DRY principles
   - Code quality guidelines
   - Pre-commit/push rules

3. **orchestration-protocol.md**: Agent coordination patterns
   - Sequential chaining
   - Parallel execution

4. **documentation-management.md**: Documentation maintenance
   - Roadmap and changelog updates
   - Automatic update triggers
   - Documentation protocols

### 5. Hooks System

**Scout Block Hook** (`.claude/hooks/scout-block.js`):
- Cross-platform hook for blocking heavy directories
- Automatic platform detection (Windows/Unix/WSL)
- Blocks: node_modules, __pycache__, .git/, dist/, build/
- Improves AI agent response time and token efficiency

### 6. Statusline Scripts

Three implementations for cross-platform statusline:
- `statusline.sh` - Bash (Unix/Linux/WSL)
- `statusline.ps1` - PowerShell (Windows)
- `statusline.js` - Node.js (universal fallback)

## Entry Points

### For Users
- **README.md**: Project overview and quick start
- **CLAUDE.md**: Development instructions and workflows

### For Developers
- **package.json**: Dependencies and scripts
- **.releaserc.json**: Semantic release configuration
- **.commitlintrc.json**: Commit message linting rules
- **.gitignore**: Version control exclusions

### For Agents
- **CLAUDE.md**: Primary agent instructions
- **.claude/workflows/**: Workflow definitions
- **plans/templates/**: Implementation plan templates

## Development Principles

### YANGI (You Aren't Gonna Need It)
Avoid over-engineering and unnecessary features

### KISS (Keep It Simple, Stupid)
Prefer simple, straightforward solutions

### DRY (Don't Repeat Yourself)
Eliminate code duplication

### File Size Management
- Keep files under 200 lines for optimal context management
- Split large files into focused components
- Extract utilities into separate modules

### Security First
- Try-catch error handling
- Security standards coverage
- No secrets in commits
- Confidential info protection

## Agent Communication Protocol

**Report Format**: Markdown files in `./plans/<plan-name>/reports/`
**Naming Convention**: `YYMMDD-from-[agent]-to-[agent]-[task]-report.md`

**Communication Patterns**:
- Sequential: Task dependencies require ordered execution
- Parallel: Independent tasks run simultaneously
- Query Fan-Out: Multiple researchers explore different approaches

## Git Workflow

**Commit Message Format**: Conventional Commits
```
type(scope): description
```

**Types**:
- `feat:` - Features (minor bump)
- `fix:` - Bug fixes (patch bump)
- `docs:` - Documentation (patch bump)
- `refactor:` - Code refactoring (patch bump)
- `test:` - Tests (patch bump)
- `ci:` - CI changes (patch bump)
- `BREAKING CHANGE:` - Major version bump

**Automated Release**:
- Every push to `main` triggers release check
- Semantic versioning (MAJOR.MINOR.PATCH)
- Automated changelog generation
- GitHub releases with generated notes

## Documentation Standards

**Required Docs** (`./docs/`):
- `project-overview-pdr.md` - Project overview and PDR
- `code-standards.md` - Coding standards and structure
- `codebase-summary.md` - This file
- `system-architecture.md` - Architecture documentation
- `project-roadmap.md` - Development roadmap

**Documentation Triggers**:
- Feature implementation completion
- Major milestone achievements
- Bug fixes
- Security updates
- Weekly reviews

## File Statistics

**Repository Statistics**:
- Total Files: 468 files (in repomix output)
- Total Tokens: 1,022,780 tokens
- Total Characters: 4,297,314 chars

**Project-Specific Files**:
- Configuration files: 15+
- Agent definitions: 19
- Command definitions: 65+
- Workflow files: 4+
- Documentation files: 6+

## Integration Capabilities

### Discord Notifications
Script: `.claude/hooks/send-discord.sh`
Purpose: Send project updates to Discord channels

### GitHub Actions
Workflow: `.github/workflows/release.yml`
Features: Automated releases, changelog generation

### MCP Servers
Configuration: `.claude/.mcp.json.example`
Supports: context7, sequential-thinking, SearchAPI, and more

## Critical Files

### Configuration
- `/package.json` - Node.js config
- `/.releaserc.json` - Release config
- `/.commitlintrc.json` - Commit linting
- `/.gitignore` - Git exclusions
- `/.repomixignore` - Repomix exclusions

### Documentation
- `/README.md` - Main project docs
- `/CLAUDE.md` - Agent instructions
- `/CHANGELOG.md` - Version history

### Workflows
- `/.claude/workflows/primary-workflow.md`
- `/.claude/workflows/development-rules.md`
- `/.claude/workflows/orchestration-protocol.md`
- `/.claude/workflows/documentation-management.md`

## Version History

**Current**: v1.0.1
**License**: MIT
**Author**: Trung Dev
**Repository**: https://github.com/trungdo9/spark-dev

## Unresolved Questions

None identified. All core components are well-documented and functional.
