<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/02-sql-injection.md (MIT) -->

---
id: SQL-INJECTION
severity_max: CRITICAL
applies_to: all
---

# SQL Injection

## Intent
Detects user-controlled input flowing into SQL query construction via string concatenation or interpolation, allowing attackers to manipulate query logic, extract data, or execute administrative operations.

## Detection
- Look for: string concatenation in SQL — `"SELECT ... " + variable`, `"WHERE id = " + req.params.id`
- Look for: template literals/f-strings with SQL keywords — `` `SELECT * FROM ${table} WHERE id = ${id}` ``, `f"SELECT * FROM users WHERE name = '{name}'"`
- Look for: `.format()` or `%` string formatting with SQL — `"SELECT * FROM %s" % table_name`
- Look for: ORM raw query with interpolation — `db.raw(\`SELECT * WHERE id = ${id}\`)`, `Model.query(f"WHERE id = {id}")`
- Trace: variable in SQL string construction must be L1 (user input) to flag
- L3/L4 values in SQL (hardcoded table names, enum values) are NOT vulnerabilities

## Severity assessment
- CRITICAL when: L1 data directly in SQL string via concatenation or interpolation
- HIGH when: L2 data (from DB) used in a second query without parameterization
- Downgrade to MEDIUM when: input is validated against a strict allowlist before use (e.g., table name checked against enum)
- Skip when: parameterized query / prepared statement used, or ORM query builder with bound params

## Remediation
1. Use parameterized queries / prepared statements exclusively
2. Use ORM query builders (never `.raw()` with user input)
3. Validate and allowlist dynamic structural elements (table/column names)
4. Apply least-privilege DB accounts (no DROP, no schema access)

## Example (vulnerable)
```javascript
// Express + pg
const id = req.params.id;  // L1
const result = await db.query(`SELECT * FROM users WHERE id = ${id}`);
```

```python
# Flask + psycopg2
name = request.args.get('name')  # L1
cursor.execute("SELECT * FROM users WHERE name = '" + name + "'")
```

## Example (safe)
```javascript
const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
```

```python
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```
