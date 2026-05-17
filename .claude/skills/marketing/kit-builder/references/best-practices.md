# Best Practices & Use Cases

## Best Practices

**1. Single Responsibility**
Each skill does one thing well. Compose complex skills from simpler ones.

**2. Fail Gracefully**
Handle errors and provide helpful messages. A poor skill is one where users don't know why it failed.

**3. Document Before Coding**
Write SKILL.md before implementing. If it's hard to describe, the skill design may need rethinking.

## Common Use Cases

### Use Case 1: Industry-Specific Content Skills
**Scenario**: A healthcare SaaS needs content skills that understand terminology and compliance.

**Solution**: Custom skill with domain knowledge baked into the system prompt + tools connecting to industry databases.

### Use Case 2: Internal Tool Integration
**Scenario**: A team uses a custom CRM and needs agents that can read/write CRM data.

**Solution**: Custom tools wrapping the CRM API, integrated into existing agents.

## Troubleshooting

**Issue**: Skill is not activated
**Solution**: Verify registration in registry.json. Check trigger pattern match.

**Issue**: Skill output is inconsistent
**Solution**: Refine the system prompt with more specific instructions and examples.
