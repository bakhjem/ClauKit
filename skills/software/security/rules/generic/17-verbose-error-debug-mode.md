<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/17-verbose-error-debug-mode.md (MIT) -->

---
id: VERBOSE-ERROR-DEBUG-MODE
severity_max: HIGH
applies_to: all
---

# Verbose Error / Debug Mode

## Intent
Detects stack traces, internal error details, debug information, or development modes exposed to end users in production, giving attackers insight into technology stack, file paths, library versions, and application internals that aid further attacks.

## Detection
- Look for: `DEBUG=true` or `debug: true` in production config files or environment setup
- Look for: unhandled exceptions returning full stack trace in response — `res.json({ error: err.stack })`, `return JsonResponse({'error': str(e), 'traceback': traceback.format_exc()})`
- Look for: `app.use(errorHandler())` (express errorhandler in production) which sends full stack
- Look for: `NODE_ENV` not set to `production` in deployment config
- Look for: Flask `app.run(debug=True)` — enables debugger with PIN bypass vulnerability
- Look for: Django `DEBUG = True` in settings.py without environment override
- Look for: verbose logging to HTTP responses — internal IPs, database queries, config values in error messages
- Look for: development tools exposed in production — `/debug`, `/__debug__`, `/_profiler`, `/telescope` without auth

## Severity assessment
- HIGH when: `debug=True` in production framework (Flask debug mode = RCE via Werkzeug debugger)
- HIGH when: full stack trace returned to client in error responses
- HIGH when: internal endpoints (debugbar, profiler) accessible without authentication
- Downgrade to MEDIUM when: generic error message returned but error type leaks implementation details
- Skip when: errors handled with generic messages, debug mode gated behind authentication or disabled in production

## Remediation
1. Set `NODE_ENV=production` / `FLASK_ENV=production` / `DEBUG=False` in all production deployments
2. Use centralized error handler returning generic messages to client, full details to server logs only
3. Never expose stack traces, query details, or internal paths in API responses
4. Protect debug/profiler endpoints with auth + IP allowlist, or disable entirely in production
5. Use structured logging to external log aggregator (not HTTP responses)

## Example (vulnerable)
```python
# Flask — debug mode in production
app.run(debug=True, host='0.0.0.0')  # Werkzeug debugger = RCE

# Unhandled exception → stack trace to client
@app.errorhandler(Exception)
def handle_error(e):
    return jsonify({'error': str(e), 'traceback': traceback.format_exc()}), 500
```

```javascript
// Express — stack trace in response
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message, stack: err.stack });  // exposes internals
});
```

## Example (safe)
```python
# Flask — debug disabled, generic error response
app.run(debug=False)

@app.errorhandler(Exception)
def handle_error(e):
    app.logger.error(f"Unhandled exception: {e}", exc_info=True)  # log internally
    return jsonify({'error': 'Internal server error'}), 500  # generic to client
```

```javascript
// Express — generic error response, log internally
app.use((err, req, res, next) => {
  console.error(err);  // log to server
  res.status(500).json({ error: 'Internal server error' });  // generic to client
});
```
