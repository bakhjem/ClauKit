# ClauKit

**Version**: 1.2.1
**Last Updated**: 2026-05-22
**Repository**: https://github.com/trungdo9/ClauKit

A development template for building AI-powered applications with Claude Code. Built on ClaudeKit Engineer foundation, it provides a standardized foundation for AI-assisted development with pre-configured agents, commands, skills, and workflows.

## Quick Start

### Prerequisites

- [Claude Code](https://code.claude.com) installed and configured
- Git for version control
- Node.js 18.0.0 or higher

### Installation

> **Note**: ClauKit is not published on the npm registry yet. All install methods below pull directly from the GitHub repository, so a git URL (or `github:` shorthand) is required.

#### Option 1: Install via Git (Recommended)

```bash
# Install globally from GitHub
npm install -g https://github.com/trungdo9/ClauKit.git

# Initialize in your project
cd /path/to/your-project
ck init

# Later, pull the latest version
ck update
```

#### Option 2: Run without installation

```bash
# Initialize directly using npx (no global install)
npx github:trungdo9/ClauKit init
```

#### Option 3: Clone and customize

```bash
# Clone this repository
git clone https://github.com/trungdo9/ClauKit.git your-project-name
cd your-project-name

# Start Claude Code
claude
```

#### Option 4: GitHub MCP Integration (Optional)

For GitHub integration via MCP:

```bash
# Copy environment template
cp .claude/.env.example .claude/.env

# Add your GitHub Personal Access Token
# Get token at: https://github.com/settings/tokens/new?scopes=repo
# Edit .claude/.env and set GITHUB_TOKEN=ghp_xxx...

# Restart Claude Code to activate MCP
```

### CLI Commands

```bash
ck init              # Copy .claude folder to current directory
ck init --force      # Overwrite existing files (use after backing up local changes)
ck update            # Check GitHub for the latest version and update the global install
ck help              # Show help information
```

> `ck init` only copies `.claude/`. Other assets shipped in the package (`.opencode/`, `AGENTS.md`, `docs/`, `CLAUDE.md`) are only available via Option 3 (clone-as-template).

## Project Structure

```
claukit/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized agent definitions (21 agents)
│   ├── commands/               # Slash command implementations (22 commands)
│   ├── hooks/                  # Git hooks and scripts
│   ├── skills/                 # Specialized skills library (78 skills)
│   ├── workflows/              # Development workflow definitions
│   ├── settings.json           # Claude Code settings
│   ├── metadata.json           # Project metadata
│   ├── .env.example            # Environment template
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
├── plans/                      # Implementation plans and reports
├── scripts/                    # Setup and utility scripts
├── CLAUDE.md                   # Project instructions for Claude
├── README.md                   # This file
├── package.json                # Node.js dependencies
├── .releaserc.json             # Semantic release configuration
├── .commitlintrc.json          # Commit linting rules
├── CHANGELOG.md                # Version history
└── LICENSE                     # MIT License
```

## Core Features

### AI Agent System

**21 Specialized Agents**:

| Category | Agents |
|----------|--------|
| Planning | `planner`, `researcher`, `brainstormer` |
| Development | `frontend-developer`, `backend-developer` |
| Quality | `tester`, `code-reviewer`, `debugger`, `performance-agent`, `security-auditor` |
| Documentation | `docs-manager`, `journal-writer` |
| Operations | `git-manager`, `project-manager`, `database-admin`, `mcp-manager`, `integration-agent` |
| Implementation | `scout`, `scout-external`, `ui-ux-designer` |
| Specialized | `copywriter` |

### Slash Commands (22)

All dispatcher commands use **positional args** (no dash prefix) for mode selection. Only `/ck:fix` uses `--flags` for combinable modifiers.

| Command | Modes / Usage |
|---------|---------------|
| `/ck:ask` | `<question>` |
| `/ck:bootstrap` | `[auto\|fast]` |
| `/ck:brainstorm` | `<topic>` |
| `/ck:content` | `[fast\|good\|enhance\|cro] <request>` |
| `/ck:cook` | `[task or plan-path] [--fast\|--auto\|--from-plan\|--no-test]` |
| `/ck:debug` | `<issue>` |
| `/ck:design` | `[fast\|good\|3d\|screenshot\|describe\|ui-ux-pro-max] <request>` |
| `/ck:docs` | `[init\|update\|summarize]` |
| `/ck:fix` | `[ci\|logs\|test\|types\|ui] [--auto] [--review] [--quick] [--parallel] <issue>` |
| `/ck:git` | `[cm\|cp\|pr\|merge]` |
| `/ck:sepay` | SePay payment integration |
| `/ck:journal` | `<entry>` |
| `/ck:plan` | `[fast\|hard\|two\|ci\|cro] <task>` |
| `/ck:review` | `[tasks-or-prompt]` |
| `/ck:scout` | `<prompt> [scale] [-ext]` |
| `/ck:seo` | `[audit\|keywords\|schema] <target>` |
| `/ck:cc-skill` | `[add\|create\|optimize\|fix-logs] <args>` |
| `/ck:team` | `<task>` |
| `/ck:test` | `<scope>` |
| `/ck:use-mcp` | MCP server management |
| `/ck:watzup` | Project status overview |
| `/ck:xia` | `<github-url> [feature] [--improve\|--compare]` |

### Workflows

- **Primary Workflow** (`primary-workflow.md`) - Implementation cycle
- **Development Rules** (`development-rules.md`) - Coding standards
- **Orchestration Protocols** (`orchestration-protocol.md`) - Agent coordination
- **Documentation Management** (`documentation-management.md`) - Doc maintenance

## Development Principles

- **YANGI** - You Aren't Gonna Need It
- **KISS** - Keep It Simple, Stupid
- **DRY** - Don't Repeat Yourself
- Files under 200 lines for optimal context management
- Try-catch error handling
- Security-first development

## Configuration

### Claude Code Settings

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "BeforeBash": [{
      "type": "command",
      "command": "node ${CLAUDE_PROJECT_DIR}/.claude/hooks/scout-block.js"
    }]
  }
}
```

### Environment Variables

Copy `.claude/.env.example` to `.claude/.env` and configure:

- `ANTHROPIC_API_KEY` - Anthropic API key
- `GEMINI_API_KEY` - Google Gemini API key (optional)

## Documentation

All documentation is maintained in `./docs`:

- [Project Overview & PDR](./docs/project-overview-pdr.md)
- [Codebase Summary](./docs/codebase-summary.md)
- [Code Standards](./docs/code-standards.md)
- [System Architecture](./docs/system-architecture.md)
- [Project Roadmap](./docs/project-roadmap.md)
- [Design Guidelines](./docs/design-guidelines.md)
- [Deployment Guide](./docs/deployment-guide.md)

## Dependencies

**Development**:
- `@commitlint/cli` ^18.4.3
- `@semantic-release/*` packages
- `husky` ^8.0.3
- `semantic-release` ^22.0.12

## License

MIT License - see LICENSE file for details.

## Support

- GitHub Issues: https://github.com/trungdo9/ClauKit/issues
- Repository: https://github.com/trungdo9/ClauKit
