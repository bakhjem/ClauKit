<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/10-path-traversal.md (MIT) -->

---
id: PATH-TRAVERSAL
severity_max: HIGH
applies_to: all
---

# Path Traversal

## Intent
Detects user-controlled input used in file system path operations without sanitization, allowing attackers to use `../` sequences to escape intended directories and access arbitrary files on the server (config files, private keys, /etc/passwd, source code).

## Detection
- Look for: `fs.readFile(req.params.file, ...)`, `open(request.args['filename'])`, `File.read(params[:path])`
- Look for: `path.join(baseDir, userInput)` where userInput is L1 — even with path.join, traversal is possible if userInput starts with `/` or contains `..`
- Look for: `os.path.join(base, filename)` from user input
- Look for: file serving routes where filename comes from request — `res.sendFile(req.query.file)`
- Look for: template/include with user-supplied path
- Trace: L1 path segment → file system read/write/include operation

## Severity assessment
- HIGH when: L1 path used in file read without `..` prevention and path canonicalization
- HIGH when: `path.join()` used but result not verified to start with intended base directory
- Downgrade to MEDIUM when: some filtering exists but incomplete (e.g., only removes `../` once — bypass with `....//`)
- Skip when: path properly canonicalized with `path.resolve()` and verified to start with allowed base, OR input validated against strict filename allowlist (alphanumeric + extension only)

## Remediation
1. Resolve the full path and verify it starts with the intended base directory
2. Allowlist filenames — only permit alphanumeric chars, hyphens, underscores, and expected extensions
3. Never pass raw user input to file system APIs
4. Use `path.resolve()` and compare with `startsWith(allowedBase)`

## Example (vulnerable)
```javascript
// Express — path traversal via filename param
app.get('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  // GET /files/../../etc/passwd → reads /etc/passwd
  res.sendFile(filePath);
});
```

```python
# Flask — traversal via query param
@app.route('/download')
def download():
    filename = request.args.get('file')  # L1
    return send_file(os.path.join('uploads', filename))  # traversal possible
```

## Example (safe)
```javascript
app.get('/files/:filename', (req, res) => {
  const baseDir = path.resolve(__dirname, 'uploads');
  const requestedPath = path.resolve(baseDir, req.params.filename);

  // Verify the resolved path is within the allowed directory
  if (!requestedPath.startsWith(baseDir + path.sep)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.sendFile(requestedPath);
});
```

```python
import os

BASE_DIR = os.path.abspath('uploads')

@app.route('/download')
def download():
    filename = request.args.get('file')
    safe_path = os.path.abspath(os.path.join(BASE_DIR, filename))
    if not safe_path.startswith(BASE_DIR + os.sep):
        abort(403)
    return send_file(safe_path)
```
