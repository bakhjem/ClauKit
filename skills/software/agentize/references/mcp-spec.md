# Model Context Protocol (MCP) Specification

**Source**: https://spec.modelcontextprotocol.io/ · https://github.com/modelcontextprotocol

## What MCP is

A JSON-RPC-based protocol for AI applications to expose **tools**, **resources**, and **prompts** to language models in a uniform way. Servers advertise capabilities; clients (Claude Desktop, IDEs, custom apps) consume them.

## Three primitive types

| Primitive | Purpose | Example |
|---|---|---|
| **Tool** | Model-callable function with side effects | `create_issue`, `run_query` |
| **Resource** | Read-only data with a URI | `file://...`, `db://table/...` |
| **Prompt** | Reusable templated instruction | `/code-review`, `/explain` |

Agentize most commonly produces **tools**, occasionally **resources** for paginated data.

## Tool definition shape

```json
{
  "name": "deploy_service",
  "description": "Deploy a service to the given environment. Requires confirm: true for prod.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "service": {"type": "string", "description": "Service name"},
      "env": {"type": "string", "enum": ["dev", "staging", "prod"]},
      "confirm": {"type": "boolean", "default": false}
    },
    "required": ["service", "env"]
  }
}
```

Descriptions are LLM-readable; spend effort on them — they replace docstrings.

## Transports

- **stdio** — local server launched per session; most common.
- **HTTP + SSE** — long-running server, multiple clients; needed for shared infra.

stdio is the right default for agentized internal tools.

## Why authoritative

MCP is the de-facto protocol for tool-bearing AI clients in 2025; the spec is maintained jointly by Anthropic and the broader community.
