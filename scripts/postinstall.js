#!/usr/bin/env node

/**
 * postinstall.js
 * ----------------
 * Runs after npm install to install spark-dev via git and copy template files to target project
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

(function main() {
  const projectRoot = process.cwd();
  const packageJsonPath = path.join(projectRoot, "package.json");
  
  try {
    if (!fs.existsSync(packageJsonPath)) {
      console.log("✓ package.json not found, skipping setup");
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    
    console.log(`🚀 Setting up spark-dev ${packageJson.version} template...`);
    
    // Install spark-dev package via git
    console.log("📦 Installing spark-dev package via git...");
    let gitInstallSuccess = false;
    try {
      execSync("npm install https://github.com/trungdo9/spark-dev.git", { 
        stdio: 'pipe', // Changed from 'inherit' to 'pipe' to better handle errors
        cwd: projectRoot 
      });
      console.log("✓ spark-dev package installed via git");
      gitInstallSuccess = true;
    } catch (installError) {
      console.error("⚠ Git install encountered issues (this is common on Windows):");
      console.error("   Error:", installError.message);
      console.log("🔄 Continuing with file copying from current directory...");
      // Continue with file copying even if install fails
    }
    
    // Get the spark-dev package location
    // First try node_modules, then fallback to current directory (for development)
    let sparkDevPath = path.join(projectRoot, "node_modules", "spark-dev");
    
    // If not in node_modules, use current directory (assuming we're in spark-dev repo)
    if (!fs.existsSync(sparkDevPath)) {
      console.log("📁 Using current project directory as spark-dev source");
      sparkDevPath = projectRoot;
    }
    
    // Source directories and files to copy
    const sourceItems = [
      { name: '.claude', type: 'dir', description: 'Claude agents and commands' },
      { name: 'docs', type: 'dir', description: 'Documentation files' },
      { name: 'plans', type: 'dir', description: 'Project plans' },
      { name: 'CLAUDE.md', type: 'file', description: 'Claude configuration file' }
    ];

    // Copy each essential directory/file
    sourceItems.forEach(item => {
      let sourcePath = path.join(sparkDevPath, item.name);
      const targetPath = path.join(projectRoot, item.name);
      
      // Special handling for plans directory - check for 'plan' if 'plans' doesn't exist
      if (item.name === 'plans' && !fs.existsSync(sourcePath)) {
        const planPath = path.join(sparkDevPath, 'plan');
        if (fs.existsSync(planPath)) {
          sourcePath = planPath;
          console.log(`📁 Found 'plan' directory, will copy as 'plans'`);
        }
      }
      
      if (fs.existsSync(sourcePath)) {
        if (item.type === 'dir') {
          // Create target directory if it doesn't exist
          if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath, { recursive: true });
          }
          
          // Copy directory contents recursively
          copyDirectory(sourcePath, targetPath);
          console.log(`✓ Copied ${item.name}/ (${item.description})`);
        } else if (item.type === 'file') {
          // Copy file
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✓ Copied ${item.name} (${item.description})`);
        }
      } else {
        console.log(`⚠ Source ${item.type} ${item.name} not found in package`);
      }
    });

    // Create metadata.json in .claude directory
    const claudeDir = path.join(projectRoot, ".claude");
    const metadataPath = path.join(claudeDir, "metadata.json");

    if (fs.existsSync(claudeDir)) {
      const metadata = {
        version: packageJson.version || "unknown",
        name: packageJson.name || "spark-dev",
        description: packageJson.description || "A development template for building AI agents using Claude.",
        buildDate: new Date().toISOString(),
        repository: packageJson.repository || {},
        setupDate: new Date().toISOString(),
        templateVersion: packageJson.version,
        installedFrom: "https://github.com/trungdo9/spark-dev.git"
      };

      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf8");
      console.log(`✓ Metadata created at ${metadataPath}`);
    }

    console.log(`🎉 spark-dev template setup completed successfully!`);
    console.log(`📁 Check the following directories/files in your project:`);
    sourceItems.forEach(item => {
      const icon = item.type === 'dir' ? '📁' : '📄';
      console.log(`   ${icon} ${item.name} (${item.description})`);
    });

  } catch (err) {
    console.error(`✗ Postinstall failed: ${err.message}`);
    // Don't exit with error code to avoid breaking installation
  }
})();

/**
 * Copy directory contents recursively
 * @param {string} source - Source directory path
 * @param {string} target - Target directory path
 */
function copyDirectory(source, target) {
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      // Create subdirectory and copy recursively
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      copyDirectory(sourcePath, targetPath);
    } else {
      // Copy file
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}
