# System Architecture

**Last Updated**: 2026-01-31
**Version**: 1.0.1
**Project**: spark-dev

## Overview

spark-dev implements a multi-agent AI orchestration architecture where specialized agents collaborate through a file-based communication protocol. Built on top of ClaudeKit Engineer, it enables developers to leverage AI assistance throughout the entire software development lifecycle.

## Architectural Pattern

### Pattern Classification
**Primary Pattern**: Microservices-inspired Agent Architecture
**Secondary Patterns**:
- Command Pattern (slash commands)
- Observer Pattern (agent communication)
- Strategy Pattern (workflow selection)
- Template Method Pattern (agent workflows)

### Design Philosophy
- **Decoupled Agents**: Each agent is independent and specialized
- **File-Based Communication**: Agents communicate via markdown reports
- **Workflow Orchestration**: Coordinated agent execution (sequential/parallel)
- **Configuration-Driven**: Agents and commands defined in markdown
- **AI-First Development**: Leverage AI at every stage of SDLC

## System Components

### 1. Core Layer

#### 1.1 CLI Interface
**Location**: Claude Code CLI
**Responsibility**: User interaction and command routing
**Key Functions**:
- Parse slash commands
- Route to appropriate agent workflows
- Display results to users
- Manage conversation context

**Technology**: Anthropic Claude Code CLI

#### 1.2 Command Parser
**Location**: Built into CLI
**Responsibility**: Command interpretation and argument extraction
**Input**: Slash command with arguments (`/command arg1 arg2`)
**Output**: Parsed command and argument values
**Argument Variables**:
- `$ARGUMENTS` - All arguments as single string
- `$1, $2, $3...` - Individual positional arguments

#### 1.3 Configuration Manager
**Location**: `.claude/` and `.opencode/` directories
**Responsibility**: Load agent and command definitions
**File Types**:
- Agent definitions (`.md` with YAML frontmatter)
- Command definitions (`.md` with embedded agent calls)
- Skill modules (knowledge bases)
- Workflow templates

### 2. Agent Layer

#### 2.1 Agent Types

**19 Specialized Agents**:

| Category | Agent | Purpose |
|----------|-------|---------|
| Planning | `planner` | Technical planning and architecture |
| Planning | `researcher` | Research and analysis |
| Planning | `brainstormer` | Solution ideation |
| Quality | `tester` | Test creation and execution |
| Quality | `code-reviewer` | Code quality assessment |
| Quality | `debugger` | Issue analysis and debugging |
| Quality | `security-auditor` | Security analysis |
| Documentation | `docs-manager` | Documentation maintenance |
| Documentation | `copywriter` | Content creation |
| Documentation | `journal-writer` | Development journaling |
| Operations | `git-manager` | Version control operations |
| Operations | `project-manager` | Progress tracking |
| Operations | `database-admin` | Database operations |
| Operations | `mcp-manager` | MCP server management |
| Implementation | `scout` | Codebase exploration |
| Implementation | `scout-external` | External tool exploration |
| Implementation | `ui-ux-designer` | Design creation |
| Implementation | `lovable-to-nextjs` | Lovable to Next.js conversion |
| Implementation | `csharp-expert` | C#/.NET development |

#### 2.2 Agent Definition Structure

```yaml
---
name: agent-name
description: Agent purpose and use cases
mode: subagent | all
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
---

# Agent instructions in markdown
## Core Responsibilities
## Workflow Process
## Output Requirements
## Quality Standards
```

**Agent Modes**:
- `subagent`: Spawned by other agents, runs independently
- `all`: Can be invoked as main or sub agent

**Model Selection**:
- `claude-sonnet-4-20250514` - Fast, efficient (most agents)
- `claude-opus-4-1-20250805` - Advanced reasoning (complex planning)
- `google/gemini-2.5-flash` - Cost-effective (docs-manager)
- `grok-code` - Specialized (git-manager)

#### 2.3 Agent Communication Protocol

**Communication Medium**: File system (markdown files)
**Report Location**: `./plans/<plan-name>/reports/`
**Naming Convention**: `YYMMDD-from-[source]-to-[dest]-[task]-report.md`

**Report Structure**:
```markdown
# Task Report: [Task Name]

**From**: [Source Agent]
**To**: [Destination Agent]
**Date**: YYYY-MM-DD
**Status**: [Complete|In Progress|Blocked]

## Summary
Brief overview of findings/results

## Details
Comprehensive information

## Recommendations
Actionable next steps

## Concerns
Issues, blockers, or questions
```

**Communication Patterns**:
1. **Request-Response**: Agent A requests, Agent B responds
2. **Broadcast**: Agent publishes report for multiple consumers
3. **Chain**: Sequential handoffs (A -> B -> C)
4. **Fan-Out**: Parallel execution (A spawns B, C, D)
5. **Fan-In**: Collect results from parallel agents

### 3. Command Layer

#### 3.1 Command Categories

**65+ Slash Commands**:

| Category | Commands |
|----------|----------|
| Development | `/plan`, `/cook`, `/test`, `/ask`, `/bootstrap`, `/brainstorm` |
| Debugging | `/debug`, `/fix`, `/fix --quick`, `/fix --review`, `/fix ci`, `/fix test`, `/fix types`, `/fix logs`, `/fix ui` |
| Design | `/design fast`, `/design good`, `/design 3d`, `/design screenshot`, `/design video`, `/design describe`, `/design ui-ux-pro-max` |
| Content | `/content fast`, `/content good`, `/content enhance`, `/content cro` |
| Documentation | `/docs -init`, `/docs -update`, `/docs -summarize` (aliases: `/docs init`, `/docs update`, `/docs summarize`) |
| SEO | `/seo audit`, `/seo keywords`, `/seo schema` |
| Git Operations | `/git cm`, `/git cp`, `/git pr`, `/git merge` |
| Planning | `/plan fast`, `/plan hard`, `/plan two`, `/plan ci`, `/plan cro` |
| Project Management | `/watzup`, `/journal`, `/scout`, `/scout -ext` |
| Skills | `/skill:add`, `/skill:create`, `/skill:optimize`, `/skill:fix-logs` |
| Integration | `/sepay`, `/use-mcp` |
| Code Review | `/review` |

#### 3.2 Command Workflow Pattern

```
User Input: /command [args]
    ↓
Command Parser
    ↓
Load Command Definition
    ↓
Substitute Arguments
    ↓
Execute Agent Workflow
    ↓
Sequential or Parallel Execution
    ↓
Collect Results
    ↓
Present to User
```

### 4. Workflow Layer

#### 4.1 Orchestration Patterns

**Sequential Chaining**:
```
Planner → Researcher → Planner → Main Agent → Tester → Code Reviewer → Docs Manager → Git Manager
```
Use when tasks have dependencies

**Parallel Execution**:
```
            ┌─→ Researcher (Auth) ─┐
Planner ────┼─→ Researcher (DB) ───┼─→ Planner (Synthesize)
            └─→ Researcher (UI) ───┘
```
Use for independent research tasks

**Query Fan-Out**:
```
Main Agent → Planner → [Multiple Researchers in Parallel] → Planner → Main Agent
```
Explore different approaches simultaneously

#### 4.2 Standard Workflows

**Feature Development Workflow**:
1. User: `/cook "add user authentication"`
2. Planner: Create implementation plan
3. Researchers: Explore auth solutions (parallel)
4. Planner: Synthesize research, create detailed plan
5. Main Agent: Implement code
6. Main Agent: Run type checking/compilation
7. Tester: Write and run tests
8. (If tests fail): Debugger analyzes, loop to step 5
9. Code Reviewer: Review implementation
10. Docs Manager: Update documentation
11. Git Manager: Commit with conventional message

**Bug Fix Workflow**:
1. User: `/debug "API timeout errors"`
2. Debugger: Analyze logs and system
3. Debugger: Identify root cause
4. Planner: Create fix plan
5. Main Agent: Implement solution
6. Tester: Validate fix
7. Code Reviewer: Review changes
8. Git Manager: Commit fix

**Documentation Update Workflow**:
1. User: `/docs -update` (alias: `/docs update`)
2. Docs Manager: Check doc freshness
3. (If >1 day old): Run `repomix` for codebase summary
4. Docs Manager: Analyze codebase changes
5. Docs Manager: Update affected documentation
6. Docs Manager: Validate naming conventions
7. Docs Manager: Create update report

### 5. Skills Layer

#### 5.1 Skill Architecture

**Purpose**: Reusable knowledge modules for specific technologies

**Structure**:
```
.claude/skills/
└── [skill-name]/
    ├── SKILL.md           # Main skill definition
    └── references/        # Supporting documentation
        ├── api-ref.md
        └── examples.md
```

**Skill Categories**:
- **DevOps**: Cloudflare, Docker, Google Cloud
- **Databases**: MongoDB, PostgreSQL
- **Web Frameworks**: Next.js, Turborepo
- **UI Styling**: shadcn/ui, Tailwind CSS
- **Individual Skills**: chrome-devtools, debugging, docs-seeker, document-skills, ffmpeg, imagemagick, gemini-audio, gemini-video-understanding, mcp-builder, problem-solving, shopify
- **Specialized**: csharp-expert, security-audit, seo

#### 5.2 Skill Invocation

**Invocation**: `Skill` tool in CLI
**Usage**: Agents invoke skills to access specialized knowledge

### 6. Integration Layer

#### 6.1 Hook System

**Scout Block Hook** (Cross-Platform):
- **Architecture**: Node.js dispatcher with platform-specific implementations
- **Windows**: PowerShell implementation (via Node.js)
- **Unix (Linux/macOS/WSL)**: Bash implementation
- **Platform Detection**: Automatic via `process.platform` in dispatcher
- **Configuration**: Zero-config - automatic platform selection

**Functionality**:
- Blocks access to heavy directories (node_modules, __pycache__, .git/, dist/, build/)
- Input validation (JSON structure, command presence)
- Error handling with exit codes (0 = allow, 2 = block/error)
- Security features: sanitized error messages, input validation

**Testing**:
- Cross-platform test suites
- Comprehensive test coverage
- Validates blocked/allowed patterns, error handling, edge cases

**Hook Configuration** (`.claude/settings.json`):
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

#### 6.2 MCP (Model Context Protocol) Integration

**Available MCP Servers**:
- **context7**: Read latest documentation
- **sequential-thinking**: Structured thinking process
- **SearchAPI**: Google and YouTube search
- **review-website**: Web content extraction
- **VidCap**: Video transcript analysis

**Skills Integration**:
- **ai-multimodal**: Visual analysis (images, videos, documents)
- **docs-seeker**: Documentation reading
- **sequential-thinking**: Problem decomposition
- **imagemagick**: Image processing

#### 6.3 External Service Integration

**GitHub**:
- Actions (CI/CD automation)
- Releases (semantic versioning)
- Issues and PRs (project management)

**Discord**:
- Webhook notifications
- Project updates
- Team communication

**NPM**:
- Package publishing
- Version management

### 7. Data Layer

#### 7.1 File-Based Storage

**Configuration Data**:
- `.claude/` - Claude Code config
- `.opencode/` - OpenCode config
- `.gitignore` - Git exclusions
- `package.json` - Node.js config
- `.releaserc.json` - Release config

**Runtime Data**:
- `plans/` - Implementation plans
- `plans/<plan-name>/reports/` - Agent communication
- `plans/<plan-name>/research/` - Research reports
- `docs/` - Project documentation
- `repomix-output.xml` - Codebase compaction

**Version Control**:
- `.git/` - Git repository
- `CHANGELOG.md` - Version history
- Git tags - Release versions

#### 7.2 Data Flow

```
User Input
    ↓
Command Parsing
    ↓
Agent Execution
    ↓
File System (Reports/Plans)
    ↓
Agent Reading
    ↓
Processing
    ↓
File System (Updated Docs/Code)
    ↓
Version Control (Git)
    ↓
Remote Repository (GitHub)
```

## Component Interactions

### Typical Interaction Flow: Feature Implementation

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ /cook "add auth"
       ↓
┌─────────────────────┐
│   Command Parser    │
└──────┬──────────────┘
       │ Parse command + args
       ↓
┌─────────────────────┐
│  Planner Agent      │
└──────┬──────────────┘
       │ Spawn researchers
       ↓
┌──────────────────────────────────┐
│  Researchers (Parallel)          │
│  - Auth strategies               │
│  - Security best practices       │
│  - Integration patterns          │
└──────┬───────────────────────────┘
       │ Reports to planner
       ↓
┌─────────────────────┐
│  Planner Agent      │
└──────┬──────────────┘
       │ Create plan
       │ Save to ./plans/
       ↓
┌─────────────────────┐
│   Main Agent        │
└──────┬──────────────┘
       │ Read plan
       │ Implement code
       ↓
┌─────────────────────┐
│  Tester Agent       │
└──────┬──────────────┘
       │ Write & run tests
       ↓
┌─────────────────────┐
│ Code Reviewer Agent │
└──────┬──────────────┘
       │ Review quality
       ↓
┌─────────────────────┐
│ Docs Manager Agent  │
└──────┬──────────────┘
       │ Update docs
       ↓
┌─────────────────────┐
│  Git Manager Agent  │
└──────┬──────────────┘
       │ Commit & push
       ↓
┌─────────────────────┐
│   User (Result)     │
└─────────────────────┘
```

## Technology Stack

### Core Technologies

**Runtime Environment**:
- Node.js >= 18.0.0
- Bash scripting (hooks)
- PowerShell (Windows hooks)

**AI Platforms**:
- Anthropic Claude (Sonnet 4, Opus 4)
- Google Gemini 2.5 Flash
- Grok Code

**Development Tools**:
- Semantic Release (versioning)
- Commitlint (commit standards)
- Husky (git hooks)
- Repomix (codebase compaction)

**CI/CD**:
- GitHub Actions
- Conventional Commits
- Semantic Versioning

## Security Architecture

### Security Layers

**Layer 1: Pre-Commit Security**
- Secret scanning (git-manager agent)
- Credential detection
- .gitignore validation
- Environment file exclusion

**Layer 2: Code Security**
- Input validation enforcement
- SQL injection prevention
- XSS protection patterns
- OWASP Top 10 awareness

**Layer 3: Agent Security**
- No logging of sensitive data
- Sanitized error messages
- Secure credential handling
- API key protection

**Layer 4: Communication Security**
- File system permissions
- Report sanitization
- Context isolation
- Clean handoffs

### Secret Management

**Environment Variables**:
```
.env (local, gitignored)
.env.example (template, committed)
```

**API Keys**:
- Never hardcoded
- Environment variable injection
- Secure storage systems in production

## Scalability Considerations

### Horizontal Scalability

**Parallel Agent Execution**:
- Independent researchers run simultaneously
- No shared state between agents
- File-based coordination
- Scalable to N agents

**Workflow Parallelization**:
- Multiple feature branches
- Concurrent issue resolution
- Parallel test execution
- Independent documentation updates

### Vertical Scalability

**Context Management**:
- Repomix for code compaction
- Selective context loading
- Chunked file processing
- Efficient token usage

**Performance Optimization**:
- Lazy loading of skills
- Cached MCP responses
- Incremental documentation updates
- Optimized file I/O

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Claude Code CLI
├── .claude/ (configuration)
├── .opencode/ (configuration)
├── Git repository
└── Node.js runtime
```

### CI/CD Pipeline

```
GitHub Repository
    ↓ Push to main
GitHub Actions
    ↓
Run Tests
    ↓
Semantic Release
    ├─→ Version Bump
    ├─→ Changelog Generation
    ├─→ GitHub Release
    └─→ (Optional) NPM Publish
```

### Production Usage

```
User Project
├── .claude/ (from template)
├── .opencode/ (from template)
├── docs/ (generated)
├── plans/ (generated)
├── src/ (user code)
└── tests/ (user tests)
```

## Monitoring & Observability

### Agent Activity Tracking

**Logs**:
- Agent invocations
- Command executions
- Workflow progress
- Error occurrences

**Reports**:
- Agent communication files
- Implementation plans
- Research findings
- Test results

**Metrics**:
- Command execution time
- Agent success rates
- Test pass/fail ratios
- Documentation coverage

### Quality Metrics

**Code Quality**:
- Test coverage percentage
- Type safety compliance
- Linting pass rate
- Security scan results

**Process Metrics**:
- Planning to implementation time
- Code review turnaround
- Documentation freshness
- Commit message compliance

## Failure Handling

### Error Recovery Strategies

**Agent Failures**:
- Graceful degradation
- Error reporting to user
- Rollback mechanisms
- Retry logic for transient errors

**Workflow Failures**:
- Checkpoint saving
- Partial progress preservation
- Clear failure messages
- Recovery suggestions

**Communication Failures**:
- File write retries
- Report validation
- Missing report detection
- Timeout handling

## Extension Points

### Adding New Agents

1. Create agent definition file: `.claude/agents/my-agent.md`
2. Define YAML frontmatter (name, description, mode, model)
3. Write agent instructions and workflows
4. Reference in commands or other agents

### Adding New Commands

1. Create command file: `.claude/commands/my-command.md`
2. Define YAML frontmatter
3. Write command workflow with agent invocations
4. Use `$ARGUMENTS` or `$1, $2` for parameters

### Adding New Skills

1. Create skill directory: `.claude/skills/my-skill/`
2. Write `SKILL.md` with knowledge content
3. Add references and examples
4. Reference in agent definitions

### Custom Workflows

1. Define workflow in `.claude/workflows/`
2. Document orchestration patterns
3. Specify agent handoffs
4. Provide examples

## Performance Considerations

### Optimization Strategies

**Token Efficiency**:
- Repomix for codebase compaction
- Selective context inclusion
- Efficient prompt engineering
- Response caching where possible

**Execution Speed**:
- Parallel agent spawning
- Async file operations
- Lazy skill loading
- Minimal context switching

**Resource Usage**:
- File system efficiency
- Memory management for large files
- Cleanup of temporary files
- Optimized git operations

## References

### Internal Documentation
- [Project Overview PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)

### External Resources
- [Claude Code Documentation](https://docs.claude.com/)
- [Open Code Documentation](https://opencode.ai/docs)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Semantic Versioning](https://semver.org/)
