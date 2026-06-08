/**
 * File and directory copying with symlink dereferencing.
 *
 * Ensures `ck init` consumers get real skills/files even when the dev
 * repo uses symlinks (e.g., .claude/skills → ../skills).
 */

const fs = require("fs");
const path = require("path");

const PACKAGE_ROOT = path.join(__dirname, "..", "..");

/**
 * Recursive copy. Dereferences symlinked dirs → real files.
 * Skips broken symlinks with a warning.
 */
function copyDirectory(source, target) {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const lstat = fs.lstatSync(sourcePath);

    if (lstat.isSymbolicLink()) {
      let real;
      try {
        real = fs.realpathSync(sourcePath);
      } catch (e) {
        console.warn(`   ⚠️  Skipping broken symlink: ${path.relative(PACKAGE_ROOT, sourcePath)}`);
        return;
      }
      const realStat = fs.statSync(real);
      if (realStat.isDirectory()) {
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
        copyDirectory(real, targetPath);
      } else {
        fs.copyFileSync(real, targetPath);
      }
      return;
    }

    if (lstat.isDirectory()) {
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
      copyDirectory(sourcePath, targetPath);
    } else {
      try {
        copyFileSafe(sourcePath, targetPath);
      } catch (e) {
        if (e.code === "ENOENT") {
          console.warn(`   ⚠️  Skipping missing file: ${path.relative(PACKAGE_ROOT, sourcePath)}`);
        } else {
          throw e;
        }
      }
    }
  });
}

/**
 * Stream-based file copy. More reliable than fs.copyFileSync on Windows
 * for paths with `\.` segments (which can trigger ENOENT in copyFileSync).
 */
function streamCopy(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  return new Promise((resolve, reject) => {
    const r = fs.createReadStream(src);
    const w = fs.createWriteStream(dst);
    r.on("error", reject);
    w.on("error", reject);
    w.on("close", resolve);
    r.pipe(w);
  });
}

/**
 * Synchronous stream copy using fs.readFileSync/writeFileSync fallback.
 * Used in places where we need sync (e.g., copyPath entry point).
 */
function copyFileSafe(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const buf = fs.readFileSync(src);
  fs.writeFileSync(dst, buf);
}

/**
 * Copy a single path (file or directory).
 * Returns: "copied" | "skipped" | "warned"
 *   - copied: freshly written
 *   - skipped: target already exists and !force
 *   - warned: same as skipped (reserved for future explicit warn state)
 */
function copyPath(src, dst, options = {}) {
  if (!fs.existsSync(src)) return "skipped";

  const relSrc = path.relative(PACKAGE_ROOT, src);

  if (fs.existsSync(dst)) {
    if (options.force) {
      fs.rmSync(dst, { recursive: true, force: true });
    } else {
      console.log(`   ⚠️  SKIP (exists): ${relSrc}`);
      return "skipped";
    }
  }

  const stat = fs.lstatSync(src);
  if (stat.isDirectory()) {
    copyDirectory(src, dst);
  } else {
    copyFileSafe(src, dst);
  }
  console.log(`   ✅ ${relSrc}`);
  return "copied";
}

/**
 * Print file tree of a directory.
 */
function listFiles(dir, prefix = "") {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const icon = stat.isDirectory() ? "📁" : "📄";
    console.log(`${prefix}${icon} ${file}`);
    if (stat.isDirectory()) listFiles(filePath, prefix + "  ");
  });
}

module.exports = { copyDirectory, copyPath, listFiles, streamCopy, copyFileSafe };
