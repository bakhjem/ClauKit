#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const realSkills = path.join(repoRoot, "skills");
const isWin = process.platform === "win32";

// Phase 4: .agent/skills added alongside .claude/skills
const targets = [
  path.join(repoRoot, ".claude", "skills"),
  path.join(repoRoot, ".agent", "skills"),
];

function linkOne(target) {
  const linkDir = path.dirname(target);
  const relTarget = path.relative(linkDir, realSkills); // "../skills"

  // already correct?
  try {
    const st = fs.lstatSync(target);
    if (st.isSymbolicLink()) {
      const cur = fs.readlinkSync(target);
      if (path.resolve(linkDir, cur) === realSkills) {
        console.log(`OK  ${target}`);
        return;
      }
    }
    // stale (text file from win git, wrong link, or real copy) -> remove
    fs.rmSync(target, { recursive: true, force: true });
  } catch (_) { /* ENOENT: nothing to remove */ }

  if (!fs.existsSync(realSkills)) {
    console.error(`MISSING source: ${realSkills}`);
    process.exit(1);
  }
  fs.mkdirSync(linkDir, { recursive: true });

  try {
    if (isWin) {
      fs.symlinkSync(realSkills, target, "junction"); // absolute, no admin
    } else {
      fs.symlinkSync(relTarget, target, "dir"); // relative
    }
    console.log(`LINK ${target} -> ${isWin ? realSkills : relTarget}`);
  } catch (e) {
    fs.cpSync(realSkills, target, { recursive: true });
    console.warn(`COPY ${target} (link failed: ${e.code}). Real files copied; re-run after enabling Dev Mode for a live link.`);
  }
}

targets.forEach(linkOne);
