#!/usr/bin/env node
/**
 * wp-auth-header.js — build a WordPress REST Basic-auth header from env.
 *
 * Reads WP_USER + WP_APP_PASSWORD from the environment and prints:
 *   Authorization: Basic <base64(user:password)>
 *
 * The password is NEVER printed in plaintext. Use with curl, e.g.:
 *   curl -H "$(node wp-auth-header.js)" "$WP_SITE_URL/wp-json/wp/v2/posts"
 *
 * Exit codes: 0 ok · 1 missing env.
 */

"use strict";

const user = process.env.WP_USER;
const pass = process.env.WP_APP_PASSWORD;

if (!user || !pass) {
  process.stderr.write(
    "error: missing WP_USER and/or WP_APP_PASSWORD env vars\n"
  );
  process.exit(1);
}

const token = Buffer.from(`${user}:${pass}`).toString("base64");
// Print only the header line. Never echo the raw password.
process.stdout.write(`Authorization: Basic ${token}`);
