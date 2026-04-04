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
const https = require("https");
const http = require("http");

// Get package version
const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

// CLI configuration
const CLI_NAME = "ck";
const COMMANDS = {
  init: "Initialize Claude configuration in current project",
  update: "Check and download latest version from GitHub",
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
 * Fetch latest version from GitHub releases or tags
 */
async function fetchLatestVersion() {
  const repo = packageJson.repository?.url?.replace("https://github.com/", "").replace(".git", "") || "trungdo9/ClauKit";
  
  console.log(`🔍 Checking GitHub for latest version...`);
  console.log(`   Repository: ${repo}`);
  
  // Try GitHub Releases API first
  try {
    const releaseVersion = await fetchFromGitHubAPI(`https://api.github.com/repos/${repo}/releases/latest`);
    if (releaseVersion) {
      console.log(`   ✅ Found release: v${releaseVersion}`);
      return releaseVersion;
    }
  } catch (e) {
    // Release not found, try tags
  }
  
  // Fallback: Try GitHub Tags API
  console.log(`   ℹ️  No releases found, checking tags...`);
  try {
    const tagVersion = await fetchTagsFromGitHub(repo);
    if (tagVersion) {
      console.log(`   ✅ Found tag: v${tagVersion}`);
      return tagVersion;
    }
  } catch (e) {
    // Tags not found
  }
  
  return null;
}

/**
 * Fetch data from GitHub API
 */
function fetchFromGitHubAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ClauKit-CLI" } }, (res) => {
      let data = "";
      
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 404) {
          resolve(null);
          return;
        }
        try {
          const release = JSON.parse(data);
          if (release.tag_name) {
            resolve(release.tag_name.replace("v", ""));
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(new Error("Failed to parse GitHub response"));
        }
      });
    }).on("error", (e) => {
      reject(new Error(`Network error: ${e.message}`));
    });
  });
}

/**
 * Fetch latest tag from GitHub
 */
function fetchTagsFromGitHub(repo) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${repo}/tags?per_page=1`;
    
    https.get(url, { headers: { "User-Agent": "ClauKit-CLI" } }, (res) => {
      let data = "";
      
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 404) {
          resolve(null);
          return;
        }
        try {
          const tags = JSON.parse(data);
          if (tags && tags.length > 0 && tags[0].name) {
            resolve(tags[0].name.replace("v", ""));
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(new Error("Failed to parse GitHub response"));
        }
      });
    }).on("error", (e) => {
      reject(new Error(`Network error: ${e.message}`));
    });
  });
}

/**
 * Compare semantic versions
 */
function compareVersions(current, latest) {
  const currentParts = current.split(".").map(Number);
  const latestParts = latest.split(".").map(Number);
  
  for (let i = 0; i < 3; i++) {
    const c = currentParts[i] || 0;
    const l = latestParts[i] || 0;
    if (c < l) return -1;
    if (c > l) return 1;
  }
  return 0;
}

/**
 * Update command - Check and download latest version
 */
async function updateCommand(options = {}) {
  console.log(`🚀 ClauKit Updater v${packageJson.version}`);
  console.log("");
  
  try {
    const latestVersion = await fetchLatestVersion();
    
    if (!latestVersion) {
      console.log("⚠️  Could not find latest version on GitHub");
      console.log("   Please check your internet connection");
      return;
    }
    
    console.log(`📦 Latest version: ${latestVersion}`);
    console.log(`📦 Current version: ${packageJson.version}`);
    
    const comparison = compareVersions(packageJson.version, latestVersion);
    
    if (comparison === 0) {
      console.log("\n✅ You are running the latest version!");
    } else if (comparison < 0) {
      console.log("\n🆕 A new version is available!");
      console.log("");
      console.log("   To update, run:");
      console.log(`   npm install -g ${packageJson.name}@latest`);
      console.log("");
      console.log("   Or use npx to run directly:");
      console.log(`   npx ${packageJson.name}@latest <command>`);
    } else {
      console.log("\n⚠️  You are running a newer version than released.");
      console.log("   This is a development version.");
    }
    
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    console.log("\n   Please check your internet connection and try again.");
  }
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
  update  ${COMMANDS.update}
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
  
  # Check for updates
  ck update
  
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
    
  case "update":
    updateCommand(options);
    break;
    
  case "help":
  default:
    showHelp();
    break;
}
