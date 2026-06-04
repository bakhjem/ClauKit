<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/03-xss.md (MIT) -->

---
id: XSS
severity_max: HIGH
applies_to: all
---

# Cross-Site Scripting (XSS)

## Intent
Detects user-controlled data rendered into HTML output without proper escaping, enabling attackers to inject malicious scripts that execute in victims' browsers to steal sessions, credentials, or perform actions on behalf of users.

## Detection
- Look for: `dangerouslySetInnerHTML={{ __html: variable }}` where variable traces to L1 or unescaped L2
- Look for: `.innerHTML = variable`, `.outerHTML = variable` where variable is user-controlled
- Look for: `document.write(variable)`, `document.writeln(variable)` with L1 input
- Look for: template literals or string concatenation in HTML context — `res.send('<div>' + req.query.name + '</div>')`
- Look for: server-side rendering without escaping — `{{{variable}}}` in Handlebars/Mustache, `{{ variable | safe }}` in Jinja2, `<%= variable %>` in EJS (unescaped)
- Look for: `eval()`, `setTimeout(string)`, `setInterval(string)` with user input (DOM-based XSS)
- Trace: L1 → HTML rendering sink without escaping function in between

## Severity assessment
- HIGH when: L1 data reaches HTML sink without escaping (reflected XSS)
- HIGH when: L2 data (stored user content) rendered without escaping (stored XSS)
- Downgrade to MEDIUM when: output is in an attribute context with partial escaping
- Skip when: proper escaping applied — `he.encode()`, `DOMPurify.sanitize()`, auto-escaped template engine (React JSX, Vue template, Django `{{ }}`), `textContent` (not `innerHTML`)

## Remediation
1. Use framework auto-escaping (React JSX `{}`, Vue `{{ }}`, Django `{{ }}` — all escape by default)
2. Never use `dangerouslySetInnerHTML` without `DOMPurify.sanitize()` on the value
3. Use `element.textContent` instead of `element.innerHTML`
4. Apply Content-Security-Policy header to limit script execution
5. Sanitize rich text with allowlist-based library (DOMPurify, bleach)

## Example (vulnerable)
```javascript
// Express — reflected XSS
app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${req.query.q}</h1>`);  // L1 → HTML sink
});

// React — dangerous
function Comment({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;  // unescaped
}
```

## Example (safe)
```javascript
// Express — use a template engine with auto-escaping
app.get('/search', (req, res) => {
  res.render('search', { query: req.query.q });  // template escapes automatically
});

// React — safe rendering
function Comment({ text }) {
  return <div>{text}</div>;  // JSX auto-escapes
}

// React — when HTML needed, sanitize first
import DOMPurify from 'dompurify';
function RichComment({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
```
