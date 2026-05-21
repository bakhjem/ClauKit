<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/08-insecure-deserialization.md (MIT) -->

---
id: INSECURE-DESERIALIZATION
severity_max: CRITICAL
applies_to: all
---

# Insecure Deserialization

## Intent
Detects deserialization of untrusted data using unsafe formats or functions that can execute arbitrary code or instantiate unexpected object types, potentially leading to Remote Code Execution (RCE), authentication bypass, or privilege escalation.

## Detection
- Look for: Python `pickle.loads(data)`, `pickle.load(f)`, `cPickle.loads(data)` where data traces to L1
- Look for: Python `yaml.load(data)` without `Loader=yaml.SafeLoader` — unsafe by default
- Look for: PHP `unserialize($data)` where `$data` comes from `$_GET`, `$_POST`, `$_COOKIE`
- Look for: Java `ObjectInputStream.readObject()` with untrusted stream
- Look for: Ruby `Marshal.load(data)` with user input
- Look for: Node.js — `node-serialize` or similar libraries deserializing user input
- Look for: `eval()` used to parse JSON (instead of `JSON.parse()`)
- Trace: deserialization sink must receive L1 data to flag

## Severity assessment
- CRITICAL when: L1 data reaches pickle/unserialize/Marshal/ObjectInputStream without integrity check
- HIGH when: yaml.load used (without SafeLoader) but data source is less direct (L2)
- Downgrade to MEDIUM when: deserialized data is wrapped in try/except but type not validated
- Skip when: safe alternatives used — `pickle` with HMAC signature verification, `yaml.safe_load()`, JSON.parse (safe), validated schema after deserialization

## Remediation
1. Replace `pickle` with JSON, MessagePack, or Protocol Buffers for data exchange
2. Use `yaml.safe_load()` exclusively — never bare `yaml.load()`
3. For PHP, avoid `unserialize()` on user input; use JSON instead
4. If deserialization is required, verify HMAC signature before deserializing
5. Run deserialization in isolated sandbox with no network/filesystem access

## Example (vulnerable)
```python
# Flask — pickle deserialization from cookie
import pickle, base64

@app.route('/load')
def load_session():
    data = base64.b64decode(request.cookies.get('session'))  # L1
    obj = pickle.loads(data)  # CRITICAL — RCE possible
    return jsonify(obj)
```

```python
# Unsafe YAML load
import yaml
config = yaml.load(request.data)  # L1, no SafeLoader — code execution possible
```

## Example (safe)
```python
import json

@app.route('/load')
def load_session():
    data = request.cookies.get('session')
    obj = json.loads(data)  # safe — JSON cannot execute code
    return jsonify(obj)

# Safe YAML
config = yaml.safe_load(request.data)
```
