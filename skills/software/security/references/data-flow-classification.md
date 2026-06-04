<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/references/data-flow-classification.md (MIT) -->

# Data Flow Classification — Trust Levels L1-L4

## Trust Level Table

| Level | Source | Trust | Action |
|---|---|---|---|
| L1 | User input (req.body, $_GET, params, query strings, headers, cookies) | NEVER trust | Always sanitize before use |
| L2 | Database / persistent storage (query results, file reads, cache) | Semi-trust | Safe within same class; not safe cross-class |
| L3 | Internal code / hardcoded config (constants, literals, internal logic) | Trust | Not a vulnerability source |
| L4 | System / env vars / framework constants (process.env, os.environ, framework internals) | Trust | Not a vulnerability source |

---

## L1 Sources — by Framework

### Node.js / Express
- `req.body`, `req.query`, `req.params`, `req.headers`, `req.cookies`
- `req.files` (multipart uploads)

### Next.js
- `searchParams`, `params` (in App Router)
- `req.query`, `req.body` (in Pages API routes)
- `useSearchParams()`, `useParams()` (client-side)

### Fastify
- `request.body`, `request.query`, `request.params`, `request.headers`

### NestJS
- `@Body()`, `@Query()`, `@Param()`, `@Headers()`, `@Req()`

### Flask
- `request.form`, `request.args`, `request.json`, `request.values`, `request.files`
- `request.cookies`, `request.headers`

### Django
- `request.POST`, `request.GET`, `request.data` (DRF), `request.FILES`
- `request.COOKIES`, `request.META` (headers)

### FastAPI
- Function parameters with `Query(...)`, `Body(...)`, `Path(...)`, `Header(...)`
- Pydantic model fields populated from request (if not validated — see worked example)

### Go net/http
- `r.URL.Query().Get(...)`, `r.FormValue(...)`, `r.PostFormValue(...)`
- `r.Body` (raw), `r.Header.Get(...)`

### Go Gin
- `c.Query(...)`, `c.PostForm(...)`, `c.Param(...)`, `c.GetHeader(...)`
- `c.ShouldBind(...)`, `c.BindJSON(...)` (struct fields)

### Go Echo
- `c.QueryParam(...)`, `c.FormValue(...)`, `c.Param(...)`, `c.Request().Header`

### Go Fiber
- `c.Query(...)`, `c.FormValue(...)`, `c.Params(...)`, `c.Body()`

### PHP (raw)
- `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `$_FILES`, `$_SERVER['HTTP_*']`

### Laravel
- `$request->input(...)`, `$request->query(...)`, `$request->file(...)`
- `$request->all()`, `$request->only(...)`, `$request->except(...)`

### Ruby / Rails
- `params[...]`, `request.body`, `request.headers`

### Spring (Java)
- `@RequestParam`, `@RequestBody`, `@PathVariable`, `@RequestHeader`
- `HttpServletRequest.getParameter(...)`

### CLI / scripts
- `os.Args`, `sys.argv`, `process.argv`, `flag.String(...)`

### Bot / messaging
- Telegram: `message.text`, `callback_query.data`
- Slack: `event.text`, `payload.actions`
- Discord: `interaction.data`, `message.content`

### File / streams
- File content read from user-specified paths
- CSV/JSON/XML parsed from uploaded files

### Network / external APIs
- HTTP response bodies from user-controlled URLs (SSRF context)
- WebSocket message payloads

---

## L2 Rules

- Data fetched from DB using a **safe parameterized query** = L2 (semi-trust)
- L2 data is safe to render in the **same class/layer** without re-sanitization
- L2 data passed to a **different class** (e.g., DB result → shell command) = treat as L1 again
- L2 data used in a **second query** without parameterization = SQL injection risk

---

## L3 Trusted Examples

- `const TABLE_NAME = "users"` — hardcoded string
- `const MAX_RETRIES = 3` — numeric constant
- Internal enum values, fixed route strings, compile-time constants

---

## L4 Trusted Examples

- `process.env.DATABASE_URL` — env var (set by operator, not user)
- `os.environ['SECRET_KEY']` — same
- Framework-injected values: `ctx.user.id` after verified JWT decode
- `__dirname`, `__filename` in Node.js

---

## 5-Step Data Flow Analysis Workflow

1. **Identify Sink** — What dangerous operation is happening? (SQL query, shell exec, file path, HTML output, HTTP request…)
2. **Identify Input** — What value is passed to that sink?
3. **Trace Backward** — Where does that value originate? (L1 / L2 / L3 / L4?)
4. **Check Sanitization** — Is there validation, parameterization, escaping, or allowlisting between source and sink?
5. **Verdict** — L1 + no sanitization + dangerous sink = vulnerability. L3/L4 = not a vulnerability.

---

## Worked Examples

### Example 1 — SQL Injection (CRITICAL)

```javascript
// Express
const id = req.query.id;  // L1 — user input
const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);  // L1 → SQL sink, no parameterization
```
Verdict: CRITICAL — SQL-INJECTION. L1 reaches SQL sink without parameterization.

Fix:
```javascript
const user = await db.query('SELECT * FROM users WHERE id = $1', [req.query.id]);
```

---

### Example 2 — Sprintf (Safe, NOT a finding)

```go
// Go
query := fmt.Sprintf("SELECT * FROM %s WHERE id = $1", tableName)  // tableName = L3 constant
rows, _ := db.Query(query, userID)  // userID passed as parameter
```
Verdict: PASS — tableName is L3 (hardcoded), userID is parameterized. No L1 in dangerous position.

---

### Example 3 — Stored XSS (HIGH)

```javascript
// DB result used in HTML without escaping
const comment = await db.query('SELECT body FROM comments WHERE id = $1', [req.params.id]);  // L2
res.send(`<div>${comment.rows[0].body}</div>`);  // L2 → HTML sink, unescaped
```
Verdict: HIGH — XSS. Even though L2, rendering into HTML without escaping allows stored XSS.
Note: L2 → HTML without escaping = HIGH (not CRITICAL), because attacker must first inject into DB.

---

### Example 4 — Command Injection (CRITICAL)

```python
# Flask
filename = request.args.get('file')  # L1
os.system(f"convert {filename} output.png")  # L1 → shell sink, no sanitization
```
Verdict: CRITICAL — COMMAND-INJECTION. L1 directly in shell command.

Fix:
```python
import subprocess, shlex
filename = request.args.get('file')
# Validate against allowlist first
allowed = re.match(r'^[\w\-]+\.(jpg|png|gif)$', filename)
if not allowed:
    abort(400)
subprocess.run(['convert', filename, 'output.png'], shell=False)
```

---

### Example 5 — Pydantic + Parameterized (Safe)

```python
# FastAPI
class SearchQuery(BaseModel):
    term: str = Field(..., max_length=100, pattern=r'^[\w\s]+$')

@app.get('/search')
async def search(q: SearchQuery = Depends()):
    results = await db.execute('SELECT * FROM items WHERE name LIKE $1', [f'%{q.term}%'])
    return results
```
Verdict: PASS — Pydantic validates and constrains the input; parameterized query used. No vulnerability.

---

## Summary Rule

**L1 + no sanitization + dangerous sink = vulnerability.**
**L3/L4 = not a vulnerability source.**
**L2 = safe in same layer; re-evaluate if crossing to new dangerous sink.**
