# ClauKit

**Version**: 1.0.1  
**Last Updated**: 2026-01-31  
**Repository**: https://github.com/trungdo9/ClauKit

A CLI tool to initialize Claude agents configuration in your project. This template provides a complete development environment with AI agent orchestration, automated workflows, and intelligent project management.

## Quick Start

### Prerequisites

- [Claude Code](https://code.claude.com) installed and configured
- Git for version control
- Node.js 18.0.0 or higher

### Installation

#### Option 1: Install via Git (Recommended)

```bash
# Install globally
npm install -g https://github.com/trungdo9/ClauKit.git

# Initialize in your project
ck init
```

#### Option 2: Run without installation

```bash
# Initialize directly using npx
npx https://github.com/trungdo9/ClauKit.git init
```

#### Option 3: Clone and customize

```bash
# Clone this repository
git clone https://github.com/trungdo9/ClauKit.git your-project-name
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
claukit/
├── .claude/                    # Claude Code configuration
│   ├── agents/                 # Specialized agent definitions (19 agents)
│   ├── commands/               # Slash command implementations (60+ commands)
│   ├── hooks/                  # Git hooks and scripts
│   ├── skills/                 # Specialized skills library
│   ├── workflows/              # Development workflow definitions
│   ├── settings.json           # Claude Code settings
│   ├── metadata.json           # Project metadata
│   └── statusline.*            # Statusline scripts (sh, ps1, js)
├── .opencode/                  # OpenCode CLI configuration
│   ├── agent/                  # Agent definitions
│   └── command/                # Command definitions
├── docs/                       # Project documentation
├── plans/                      # Implementation plans and reports
├── scripts/                    # Setup and utility scripts
├── bin/                        # CLI entry point
│   └── ck.js                   # ClauKit CLI
├── CLAUDE.md                   # Project instructions for Claude
├── README.md                   # This file
├── package.json                # Node.js dependencies
└── CHANGELOG.md                # Version history
```

## Core Features

### AI Agent System

**19 Specialized Agents**:
- **planner** - Technical planning and architecture
- **researcher** - Research and analysis
- **tester** - Testing and validation
- **debugger** - Issue analysis and debugging
- **code-reviewer** - Code quality assessment
- **docs-manager** - Documentation management
- **git-manager** - Version control operations
- **project-manager** - Project tracking
- **scout** / **scout-external** - Codebase exploration
- **ui-ux-designer** - Design creation
- **database-admin** - Database operations
- **copywriter** - Content creation
- **brainstormer** - Solution ideation
- **journal-writer** - Development journaling
- **mcp-manager** - MCP server management
- **csharp-expert** - C#/.NET development
- **security-auditor** - Security analysis
- **seo-specialist** - SEO optimization

### Slash Commands (65+)

**Development**: `/plan`, `/cook`, `/test`, `/ask`, `/bootstrap`, `/brainstorm`, `/code`

**Debugging**: `/debug`, `/fix`, `/fix:fast`, `/fix:hard`, `/fix:ci`, `/fix:test`, `/fix:types`, `/fix:logs`, `/fix:ui`

**Design**: `/design:fast`, `/design:good`, `/design:3d`, `/design:screenshot`, `/design:video`, `/design:describe`, `/design:ui-ux-pro-max`

**Documentation**: `/docs:init`, `/docs:update`, `/docs:summarize`

**SEO**: `/seo:audit`, `/seo:keywords`, `/seo:schema`

**Git Operations**: `/git:cm`, `/git:cp`, `/git:pr`

**Project Management**: `/watzup`, `/journal`, `/scout`, `/scout:ext`

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
