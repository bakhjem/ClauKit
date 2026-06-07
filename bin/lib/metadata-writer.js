/**
 * Metadata management for ClauKit installs.
 *
 * Writes .claude/metadata.json with package version, install date, and kit info.
 */

const fs = require("fs");
const path = require("path");

/**
 * Write metadata.json to the project's .claude/ folder.
 * @param {string} projectRoot - absolute path to project root
 * @param {object} packageJson - parsed package.json
 * @param {object} kit - resolved kit { name, manifest }
 */
function writeMetadata(projectRoot, packageJson, kit) {
  const metadataPath = path.join(projectRoot, ".claude", "metadata.json");
  const metadata = {
    version: packageJson.version,
    name: packageJson.name,
    description: packageJson.description,
    buildDate: new Date().toISOString(),
    setupDate: new Date().toISOString(),
    templateVersion: packageJson.version,
    installedFrom: packageJson.repository?.url || "unknown",
    kit: {
      name: kit.name,
      version: kit.manifest.version || "unknown",
      description: kit.manifest.description || ""
    }
  };

  fs.mkdirSync(path.dirname(metadataPath), { recursive: true });
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), "utf8");
}

module.exports = { writeMetadata };
