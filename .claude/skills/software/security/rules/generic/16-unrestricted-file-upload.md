<!-- Adapted from https://github.com/tanviet12/vbsec@main:skills/vbs-scan-security/rules/generic/16-unrestricted-file-upload.md (MIT) -->

---
id: UNRESTRICTED-FILE-UPLOAD
severity_max: CRITICAL
applies_to: all
---

# Unrestricted File Upload

## Intent
Detects file upload handlers that save files without validating type, extension, content, or size, allowing attackers to upload web shells, malicious scripts, or oversized files that can lead to Remote Code Execution, stored XSS, or denial of service.

## Detection
- Look for: file save operations without extension whitelist check — `fs.writeFile(uploadPath, file.buffer)` without extension validation
- Look for: MIME type taken from `Content-Type` header (user-controlled) without server-side verification — `file.mimetype` from multer is user-supplied
- Look for: file saved with original filename from user — `req.file.originalname` used as storage name
- Look for: uploaded file served from web-accessible directory without content-type enforcement
- Look for: no size limit on upload — missing `limits: { fileSize: N }` in multer or equivalent
- Trace: L1 file content/name → file system write without validation pipeline

## Severity assessment
- CRITICAL when: no extension validation + files saved to web-accessible path (direct web shell execution risk)
- CRITICAL when: no MIME type or magic byte validation + executable extensions permitted
- HIGH when: extension validated but MIME type not verified (double extension bypass possible: `shell.php.jpg`)
- Downgrade to MEDIUM when: files not directly web-accessible but content still unvalidated
- Skip when: extension allowlist enforced + server-side MIME verification + file renamed to UUID + served via streaming not filesystem

## Remediation
1. Validate file extension against allowlist (`['jpg', 'png', 'gif', 'pdf']`)
2. Verify magic bytes server-side (not Content-Type header) — use `file-type` library
3. Rename uploaded files to UUID — never use original filename
4. Store uploads outside web root or use cloud storage (S3, GCS)
5. Set file size limits
6. Serve files with forced Content-Type headers (not inferred from extension)
7. Scan uploads with antivirus for high-security applications

## Example (vulnerable)
```javascript
// Express + multer — no validation
const upload = multer({ dest: 'public/uploads/' });  // web-accessible!

app.post('/upload', upload.single('file'), (req, res) => {
  // req.file.originalname could be 'shell.php' or 'xss.svg'
  // req.file.mimetype is user-supplied, can be spoofed
  res.json({ path: `/uploads/${req.file.originalname}` });
});
```

## Example (safe)
```javascript
const { v4: uuidv4 } = require('uuid');
const fileType = require('file-type');

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'pdf']);
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'application/pdf']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB limit
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(ext)) return res.status(400).json({ error: 'Invalid file type' });

  // Verify actual content via magic bytes
  const detected = await fileType.fromBuffer(req.file.buffer);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    return res.status(400).json({ error: 'File content does not match extension' });
  }

  const safeFilename = `${uuidv4()}.${ext}`;
  await s3.upload({ Bucket: 'uploads', Key: safeFilename, Body: req.file.buffer }).promise();
  res.json({ path: safeFilename });
});
```
