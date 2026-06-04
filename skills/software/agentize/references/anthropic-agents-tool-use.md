# Anthropic · Tool Use Best Practices

**Source**: https://docs.claude.com/en/docs/agents-and-tools/tool-use/

## Designing tools for Claude

- **Names**: action_object verbs work best (`create_ticket`, `list_users`). Avoid abbreviations the model may misread.
- **Descriptions**: 1–3 sentences. Lead with the action, then conditions and side effects. Claude reads descriptions to choose tools; vague descriptions cause wrong-tool selection.
- **Parameter docs**: every property gets a `description`. Include format hints ("ISO 8601 timestamp", "RFC-1123 hostname").
- **Errors**: return structured errors with a `code` and a `recoverable` boolean. Claude retries `recoverable: true` errors automatically.

## Tool count guidance

Claude handles up to ~50 tools well; beyond that, schema noise outweighs capability. Strategies when you have more:

1. **Group by domain** — separate MCP servers, loaded per task.
2. **Hierarchical tools** — one `query` tool that takes a subcommand parameter, instead of 20 sibling tools.
3. **Deferred loading** — surface tool *names* only; load schemas on first reference.

## Idempotence and confirmation

Anthropic stresses: destructive tools should be opt-in. Use a `confirm: true` parameter or a dry-run mode. The model may call a tool twice during retries — design for that.

## Prompt caching

Tool definitions appear in every request. They're a prime caching target. Anthropic recommends keeping tool schemas stable across a session; changes invalidate the cache (5-min TTL).

## Why authoritative

Anthropic publishes this guidance as the canonical reference for Claude-compatible tool design.
