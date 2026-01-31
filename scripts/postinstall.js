#!/usr/bin/env node

/**
 * postinstall.js
 * ----------------
 * Shows installation information and guidance for using ClauKit CLI
 */

const fs = require("fs");
const path = require("path");

(function main() {
  const projectRoot = process.cwd();
  const packageJsonPath = path.join(projectRoot, "package.json");
  
  try {
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ClauKit v${packageJson.version} installed successfully!                      ║
╚════════════════════════════════════════════════════════════╝

🚀 Quick start:

   # Initialize Claude configuration in your project
   npx @trungdo9/ClauKit init
   
   # Or if installed globally
   ck init
   claukit init

📚 Documentation:
   ${packageJson.homepage}

🐛 Issues:
   ${packageJson.bugs?.url || "N/A"}

✨ Happy coding!
`);
  } catch (err) {
    // Silently fail - don't break installation
  }
})();
