#!/usr/bin/env node
/**
 * wp-media-upload.js — upload a local file to the WordPress media library.
 *
 * Usage:
 *   node wp-media-upload.js <file-path> [mime-type]
 *
 * Env (required): WP_SITE_URL, WP_USER, WP_APP_PASSWORD
 * Prints JSON: { id, source_url, mime_type } on success.
 *
 * Uses raw binary + Content-Disposition (the wp/v2/media contract).
 * No external deps — Node 18+ global fetch. Password never logged.
 *
 * Exit codes: 0 ok · 1 bad args/env · 2 upload error.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const MIME_BY_EXT = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

async function main() {
  const file = process.argv[2];
  const mimeArg = process.argv[3];

  if (!file) {
    process.stderr.write("usage: node wp-media-upload.js <file-path> [mime-type]\n");
    process.exit(1);
  }
  const { WP_SITE_URL, WP_USER, WP_APP_PASSWORD } = process.env;
  if (!WP_SITE_URL || !WP_USER || !WP_APP_PASSWORD) {
    process.stderr.write("error: missing WP_SITE_URL / WP_USER / WP_APP_PASSWORD env\n");
    process.exit(1);
  }
  if (!fs.existsSync(file)) {
    process.stderr.write(`error: file not found: ${file}\n`);
    process.exit(1);
  }

  const filename = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  const mime = mimeArg || MIME_BY_EXT[ext] || "application/octet-stream";
  const body = fs.readFileSync(file);
  const auth = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

  let res;
  try {
    res = await fetch(`${WP_SITE_URL.replace(/\/$/, "")}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type": mime,
      },
      body,
    });
  } catch (e) {
    process.stderr.write(`error: request failed: ${e.message}\n`);
    process.exit(2);
  }

  const text = await res.text();
  if (!res.ok) {
    // Surface WP's JSON error; never echo the auth header.
    process.stderr.write(`error: ${res.status} ${text}\n`);
    process.exit(2);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    process.stderr.write(`error: non-JSON response: ${text.slice(0, 200)}\n`);
    process.exit(2);
  }
  process.stdout.write(
    JSON.stringify({ id: json.id, source_url: json.source_url, mime_type: json.mime_type }) + "\n"
  );
}

main();
