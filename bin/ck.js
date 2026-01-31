#!/usr/bin/env node

/**
 * ClauKit CLI - Initialize Claude configuration in your project
 * 
 * Usage:
 *   npx @trungdo9/ClauKit init
 *   ck init
 *   claukit init
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Get package version
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// CLI configuration
const CLI_NAME = "ck";
const COMMANDS = {
  init: "Initialize Claude configuration in current project",
  help: "Show help information"
};

const args = process.argv.slice(2);
const command = args[0] || "help";

/**
 * Initialize Claude configuration
 */
function initCommand(options = {}) {
  const projectRoot = process.cwd();
  const sourceClauDir = path.join(__dirname, "..", ".claude");
  const targetClauDir = path.join(projectRoot, ".claude");
  
  console.log(`🚀 ClauKit v${packageJson.version}`);
  console.log(`📂 Project: ${projectRoot}\n`);
  
  // Check if source .claude exists
  if (!fs.existsSync(sourceClauDir)) {
    console.error("❌ Error: .claude folder not found in package");
    process.exit(1);
  }
  
  // Check if target already exists
  if (fs.existsSync(targetClauDir) && !options.force) {
    console.log("⚠️  .claude folder already exists in project!");
    console.log("   Use --force to overwrite.");
    console.log("\n   Options:");
    console.log("   --force    Overwrite existing files");
    console.log("   --path     Specify custom target path");
    return;
  }
  
  try {
    // Create target directory
    if (!fs.existsSync(targetClauDir)) {
      fs.mkdirSync(targetClauDir, { recursive: true });
    }
    
    // Copy .claude contents
    copyDirectory(sourceClauDir, targetClauDir);
    
    // Update metadata.json
    updateMetadata(targetClauDir);
    
    console.log("✅ Successfully initialized Claude configuration!");
    console.log(`📁 Created: ${targetClauDir}`);
    console.log("\nFiles copied:");
    listFiles(targetClauDir, "  ");
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Update metadata.json with project info
 */
function updateMetadata(clauDir) {
  const metadataPath = path.join(clauDir, "metadata.json");
  const metadata = {
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description,
    buildDate: new Date().toISOString(),
    setupDate: new Date().toISOString(),
    templateVersion: packageJson.version,
    installedFrom: packageJson.repository?.url || "unknown"
  };
  
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf8");
}

/**
 * Copy directory recursively
 */
function copyDirectory(source, target) {
  const files = fs.readdirSync(source);
  
  files.forEach(file => {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

/**
 * List files in directory
 */
function listFiles(dir, prefix = "") {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const icon = stat.isDirectory() ? "📁" : "📄";
    console.log(`${prefix}${icon} ${file}`);
    
    if (stat.isDirectory()) {
      listFiles(filePath, prefix + "  ");
    }
  });
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
ClauKit v${packageJson.version}
${packageJson.description}

Usage:
  npx @trungdo9/ClauKit <command>
  ck <command>
  claukit <command>

Commands:
  init    ${COMMANDS.init}
  help    ${COMMANDS.help}

Options:
  --force     Overwrite existing files
  --path      Specify custom target path (e.g., --path ./config/.claude)

Examples:
  # Initialize in current directory
  ck init
  
  # Force overwrite existing files
  ck init --force
  
  # Initialize in custom path
  ck init --path ./config/.claude
  
  # Run without installing
  npx @trungdo9/ClauKit init
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const options = { force: false, path: null };
  const commandArgs = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === "--force") {
      options.force = true;
    } else if (arg === "--path" && args[i + 1]) {
      options.path = args[i + 1];
      i++;
    } else if (arg.startsWith("-")) {
      console.warn(`⚠️  Unknown option: ${arg}`);
    } else {
      commandArgs.push(arg);
    }
  }
  
  return { options, commandArgs };
}

// Main execution
const { options, commandArgs } = parseArgs(args);
const cmd = commandArgs[0] || "help";

switch (cmd) {
  case "init":
    if (options.path) {
      console.log(`📂 Custom path: ${options.path}`);
      // TODO: Implement custom path support
    }
    initCommand(options);
    break;
    
  case "help":
  default:
    showHelp();
    break;
}
