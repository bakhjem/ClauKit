# Skill Anatomy

## Skill folder structure

```
~/.claude/skills/marketing/skills/my-custom-skill/
├── SKILL.md           # Documentation and metadata
├── skill.ts           # Core logic
├── tools/             # Tool integrations
│   └── api-client.ts
└── prompts/           # Prompt templates
    └── system.md
```

## SKILL.md template

```markdown
# My Custom Skill

## Metadata
- **Name**: my-custom-skill
- **Category**: marketing
- **Trigger**: /my-custom-skill

## Purpose
[What the skill does and why it's needed]

## Activation
Explicit: `/my-custom-skill [params]`
Implicit: Automatically when [condition]

## Tools Required
- [Required API/service]

## Output Format
[Output description]
```

## Register a custom skill

```json
// ~/.claude/skills/marketing/registry.json
{
  "skills": [
    {
      "name": "linkedin-content",
      "path": "./skills/linkedin-content",
      "trigger": "/linkedin-content",
      "description": "Generate LinkedIn posts"
    }
  ]
}
```
