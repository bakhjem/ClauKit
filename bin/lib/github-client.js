/**
 * GitHub API client for the `ck update` command.
 *
 * Fetches latest release/tag from GitHub and compares to current version.
 */

const https = require("https");

/**
 * Fetch latest version from GitHub releases → tags fallback.
 * Returns version string (e.g., "1.4.0") or null.
 */
async function fetchLatestVersion(repo) {
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
    // fall through to tags
  }

  console.log(`   ℹ️  No releases found, checking tags...`);
  try {
    const tagVersion = await fetchTagsFromGitHub(repo);
    if (tagVersion) {
      console.log(`   ✅ Found tag: v${tagVersion}`);
      return tagVersion;
    }
  } catch (e) {
    // fall through
  }

  return null;
}

/**
 * GET request to GitHub API, returns parsed JSON or null on 404.
 */
function fetchFromGitHubAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ClauKit-CLI" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 404) return resolve(null);
        try {
          const release = JSON.parse(data);
          resolve(release.tag_name ? release.tag_name.replace("v", "") : null);
        } catch (e) {
          reject(new Error("Failed to parse GitHub response"));
        }
      });
    }).on("error", (e) => reject(new Error(`Network error: ${e.message}`)));
  });
}

/**
 * GET latest tag from GitHub.
 */
function fetchTagsFromGitHub(repo) {
  return new Promise((resolve, reject) => {
    const url = `https://api.github.com/repos/${repo}/tags?per_page=1`;
    https.get(url, { headers: { "User-Agent": "ClauKit-CLI" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        if (res.statusCode === 404) return resolve(null);
        try {
          const tags = JSON.parse(data);
          resolve(tags && tags.length > 0 && tags[0].name ? tags[0].name.replace("v", "") : null);
        } catch (e) {
          reject(new Error("Failed to parse GitHub response"));
        }
      });
    }).on("error", (e) => reject(new Error(`Network error: ${e.message}`)));
  });
}

/**
 * Compare two semver strings: returns -1, 0, 1.
 */
function compareVersions(current, latest) {
  const c = current.split(".").map(Number);
  const l = latest.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    const cv = c[i] || 0, lv = l[i] || 0;
    if (cv < lv) return -1;
    if (cv > lv) return 1;
  }
  return 0;
}

module.exports = { fetchLatestVersion, compareVersions };
