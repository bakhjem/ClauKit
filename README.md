# spark-dev

**Version**: 1.0.1
**Last Updated**: 2026-01-31
**Repository**: https://github.com/trungdo9/spark-dev

A development template for building AI-powered applications with Claude Code. Built on ClaudeKit Engineer foundation, it provides a standardized foundation for AI-assisted development with pre-configured agents, commands, skills, and workflows.

## Quick Start

### Prerequisites

- [Claude Code](https://code.claude.com) installed and configured
- Git for version control
- Node.js 18.0.0 or higher

### Installation

#### Option 1: Install via Git (Recommended)

```bash
# Install globally
npm install -g https://github.com/trungdo9/spark-dev.git

# Initialize in your project
ck init
```

#### Option 2: Run without installation

```bash
# Initialize directly using npx
npx https://github.com/trungdo9/spark-dev.git init
```

#### Option 3: Clone and customize

```bash
# Clone this repository
git clone https://github.com/trungdo9/spark-dev.git your-project-name
cd your-project-name

# Start Claude Code
claude
```

### CLI Commands

```bash
ck init              # Copy .claude folder to current directory
ck init --force      # Overwrite existing files
ck help              # Show help information
```

## Project Structure

```
spark-dev/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized agent definitions (19 agents)
│   ├── commands/               # Slash command implementations (65+ commands)
│   ├── hooks/                  # Git hooks and scripts
│   ├── skills/                 # Specialized skills library
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

**19 Specialized Agents**:

| Category | Agents |
|----------|--------|
| Planning | `planner`, `researcher`, `brainstormer` |
| Quality | `tester`, `code-reviewer`, `debugger`, `security-auditor` |
| Documentation | `docs-manager`, `copywriter`, `journal-writer` |
| Operations | `git-manager`, `project-manager`, `database-admin`, `mcp-manager` |
| Implementation | `scout`, `scout-external`, `ui-ux-designer`, `lovable-to-nextjs`, `csharp-expert` |
| Specialized | `seo-specialist` |

### Slash Commands (65+)

**Development**: `/plan`, `/cook`, `/test`, `/ask`, `/bootstrap`, `/brainstorm`, `/code`

**Debugging**: `/debug`, `/fix`, `/fix:fast`, `/fix:hard`, `/fix:ci`, `/fix:test`, `/fix:types`, `/fix:logs`, `/fix:ui`

**Design**: `/design:fast`, `/design:good`, `/design:3d`, `/design:screenshot`, `/design:video`, `/design:describe`, `/design:ui-ux-pro-max`

**Content**: `/content:fast`, `/content:good`, `/content:enhance`, `/content:cro`

**Documentation**: `/docs:init`, `/docs:update`, `/docs:summarize`

**SEO**: `/seo:audit`, `/seo:keywords`, `/seo:schema`

**Git Operations**: `/git:cm`, `/git:cp`, `/git:pr`

**Project Management**: `/watzup`, `/journal`, `/scout`, `/scout:ext`

**Skills**: `/skill:add`, `/skill:create`, `/skill:optimize`, `/skill:fix-logs`

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

- GitHub Issues: https://github.com/trungdo9/spark-dev/issues
- Repository: https://github.com/trungdo9/spark-dev
