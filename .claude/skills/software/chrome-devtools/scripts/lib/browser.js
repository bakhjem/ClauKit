import puppeteer from 'puppeteer';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { platform } from 'node:os';

const SESSION_FILE = resolve(process.cwd(), '.browser-session.json');

function detectHeadless() {
  if (process.env.CI || process.env.GITHUB_ACTIONS) return true;
  const p = platform();
  if (p === 'linux') {
    if (process.env.WSL_DISTRO_NAME || existsSync('/proc/sys/fs/binfmt_misc/WSLInterop')) return true;
    if (!process.env.DISPLAY) return true;
    return true;
  }
  return false;
}

function parseHeadlessFlag(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  const s = String(value).toLowerCase();
  if (['true', '1', 'yes', 'new'].includes(s)) return true;
  if (['false', '0', 'no'].includes(s)) return false;
  return null;
}

function readSession() {
  if (!existsSync(SESSION_FILE)) return null;
  try {
    return JSON.parse(readFileSync(SESSION_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function writeSession(data) {
  writeFileSync(SESSION_FILE, JSON.stringify(data, null, 2));
}

function removeSession() {
  if (existsSync(SESSION_FILE)) unlinkSync(SESSION_FILE);
}

export async function getBrowser(opts = {}) {
  const headlessOverride = parseHeadlessFlag(opts.headless);
  const headless = headlessOverride !== null ? headlessOverride : detectHeadless();

  const existing = readSession();
  if (existing?.wsEndpoint) {
    try {
      const browser = await puppeteer.connect({
        browserWSEndpoint: existing.wsEndpoint,
        defaultViewport: null,
      });
      return browser;
    } catch {
      removeSession();
    }
  }

  const browser = await puppeteer.launch({
    headless,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  writeSession({
    wsEndpoint: browser.wsEndpoint(),
    pid: browser.process()?.pid ?? null,
    startedAt: new Date().toISOString(),
  });

  return browser;
}

export async function getPage(browser) {
  const pages = await browser.pages();
  for (const p of pages) {
    const url = p.url();
    if (url && url !== 'about:blank') return p;
  }
  if (pages.length > 0) return pages[0];
  return await browser.newPage();
}

export async function disconnectBrowser(browser) {
  if (!browser) return;
  try {
    browser.disconnect();
  } catch {}
}

export async function closeBrowser(browser) {
  if (!browser) return;
  try {
    await browser.close();
  } catch {}
  removeSession();
}

export function outputJSON(data) {
  process.stdout.write(JSON.stringify(data, null, 2) + '\n');
}

export function outputError(err, extra = {}) {
  outputJSON({
    success: false,
    error: err?.message || String(err),
    ...extra,
  });
  process.exitCode = 1;
}

export async function withBrowser(opts, fn) {
  const browser = await getBrowser(opts);
  try {
    const page = await getPage(browser);
    const result = await fn(page, browser);
    if (opts.close === true || opts.close === 'true') {
      await closeBrowser(browser);
    } else {
      await disconnectBrowser(browser);
    }
    // Puppeteer can leave pending IO handles after disconnect — force exit
    // so CLI scripts complete deterministically.
    setImmediate(() => process.exit(process.exitCode || 0));
    return result;
  } catch (err) {
    await disconnectBrowser(browser);
    setImmediate(() => process.exit(1));
    throw err;
  }
}

export function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}
