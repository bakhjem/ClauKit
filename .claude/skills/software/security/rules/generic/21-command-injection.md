<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/21-command-injection.md (MIT) -->

---
id: COMMAND-INJECTION
severity_max: CRITICAL
applies_to: all
---

# Command Injection

## Intent
Detects user-controlled input flowing into shell command execution without sanitization, allowing attackers to append shell metacharacters (`; | && || $()`) to execute arbitrary operating system commands with the server process's privileges.

## Detection
- Look for: `exec(userInput)`, `system(userInput)`, `popen(userInput)` where userInput is L1
- Look for: Node.js — `child_process.exec(cmd)` where `cmd` contains L1 data, especially with template literals
- Look for: Python — `subprocess.call(cmd, shell=True)`, `os.system(cmd)`, `os.popen(cmd)` where `cmd` includes L1
- Look for: Go — `exec.Command("sh", "-c", userInput)` — shell=true equivalent in Go
- Look for: PHP — `shell_exec($input)`, `exec($input)`, `passthru($input)`, `system($input)` with `$_GET`/`$_POST`
- Look for: string concatenation building shell commands — `"convert " + filename + " output.png"` where filename is L1
- Trace: L1 → shell execution sink, with or without string construction

## Severity assessment
- CRITICAL when: L1 data directly in shell command (exec, system, popen) without sanitization
- CRITICAL when: L1 data in command string with `shell=True` or shell=true equivalent
- HIGH when: L1 data in exec with array args (no shell expansion) but path/argument position exploitable
- Downgrade to MEDIUM when: input validated against strict allowlist before shell use
- Skip when: exec called with argument array (no shell interpolation) — `exec('convert', [filename, 'out.png'])` with filename validated against allowlist

## Remediation
1. Never use shell=True with user input — always use argument array form
2. Validate input against strict allowlist before any shell use (alphanumeric + specific safe chars only)
3. Use language-native APIs instead of shell — image processing libraries instead of ImageMagick shell call
4. Escape shell arguments with `shlex.quote()` (Python) or `shellescape` (Node.js) as last resort
5. Run processes under minimal-privilege OS user

## Example (vulnerable)
```python
# Flask — command injection via filename
@app.route('/convert')
def convert():
    filename = request.args.get('file')  # L1
    os.system(f"convert uploads/{filename} output.png")  # CRITICAL: ; rm -rf /
```

```javascript
// Node.js — command injection
const { exec } = require('child_process');
app.post('/ping', (req, res) => {
  exec(`ping -c 1 ${req.body.host}`, (err, stdout) => {  // L1 in shell command
    res.send(stdout);
  });
});
```

```php
// PHP — shell injection via GET param
$filename = $_GET['file'];
shell_exec("convert " . $filename . " output.png");  // CRITICAL
```

## Example (safe)
```python
import subprocess, re

@app.route('/convert')
def convert():
    filename = request.args.get('file')
    # Strict allowlist validation
    if not re.match(r'^[\w\-]+\.(jpg|jpeg|png|gif)$', filename):
        abort(400)
    # Argument array — no shell expansion
    subprocess.run(['convert', f'uploads/{filename}', 'output.png'],
                   shell=False, check=True, timeout=30)
```

```javascript
const { execFile } = require('child_process');  // not exec
app.post('/ping', (req, res) => {
  const host = req.body.host;
  if (!/^[\w.\-]+$/.test(host)) return res.status(400).send('Invalid host');
  execFile('ping', ['-c', '1', host], (err, stdout) => {  // array args, no shell
    res.send(stdout);
  });
});
```
