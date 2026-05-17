#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function loadRefMap(refsFile) {
  if (refsFile && existsSync(refsFile)) {
    return JSON.parse(readFileSync(refsFile, 'utf8'));
  }
  return null;
}

const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'listbox',
  'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'searchbox',
  'slider', 'spinbutton', 'switch', 'tab', 'treeitem',
]);

async function buildLiveRefMap(page) {
  const tree = await page.accessibility.snapshot({ interestingOnly: false });
  const map = new Map();
  let counter = 1;
  function walk(node) {
    if (!node) return;
    if (INTERACTIVE_ROLES.has(node.role)) {
      map.set(`e${counter++}`, { role: node.role, name: node.name || null });
    }
    if (node.children) for (const c of node.children) walk(c);
  }
  walk(tree);
  return Object.fromEntries(map);
}

async function findByAccessibility(page, role, name) {
  return await page.evaluateHandle(
    ({ role, name }) => {
      const normalize = (s) => (s || '').trim().toLowerCase();
      const target = normalize(name);
      const all = document.querySelectorAll('*');
      for (const el of all) {
        const elRole = el.getAttribute('role') || el.tagName.toLowerCase();
        const elName = normalize(
          el.getAttribute('aria-label') ||
            el.innerText ||
            el.value ||
            el.placeholder ||
            ''
        );
        if (target && elName === target) return el;
        if (!target && elRole === role) return el;
      }
      return null;
    },
    { role, name }
  );
}

async function main() {
  const args = parseArgs();
  const ref = args.ref;
  const role = args.role;
  const name = args.name;
  const action = args.action || 'text';
  const value = args.value;
  const output = args.output ? resolve(args.output) : null;
  const refsFile = args['refs-file']
    ? resolve(args['refs-file'])
    : resolve(process.cwd(), '.claude/chrome-devtools/snapshots/page.refs.json');
  const live = args.live === true || args.live === 'true';

  if (!ref && !role) {
    outputError(new Error('--ref or --role is required (use --role + optional --name for direct ARIA lookup)'));
    return;
  }

  try {
    await withBrowser(args, async (page) => {
      let resolvedRole = role;
      let resolvedName = name;
      let resolvedRef = ref;

      if (ref) {
        let refMap = null;
        if (!live) refMap = loadRefMap(refsFile);
        if (!refMap) refMap = await buildLiveRefMap(page);
        if (!refMap[ref]) {
          throw new Error(
            `Ref ${ref} not found. ${live ? 'Live tree' : `refs file ${refsFile}`} has ${Object.keys(refMap).length} refs. ` +
            `Re-run aria-snapshot.js or pass --live true.`
          );
        }
        resolvedRole = refMap[ref].role;
        resolvedName = refMap[ref].name;
      }

      const handle = await findByAccessibility(page, resolvedRole, resolvedName);
      const el = handle.asElement();
      if (!el) {
        throw new Error(
          `Could not resolve element on the current page (role=${resolvedRole}, name=${resolvedName ?? '<any>'})`
        );
      }

      const result = {
        success: true,
        ref: resolvedRef ?? null,
        role: resolvedRole,
        name: resolvedName,
        action,
      };

      switch (action) {
        case 'click':
          await el.click();
          break;
        case 'hover':
          await el.hover();
          break;
        case 'focus':
          await el.focus();
          break;
        case 'fill':
          if (value === undefined) throw new Error('--value required for fill');
          await el.evaluate((node) => {
            if ('value' in node) node.value = '';
          });
          await el.type(String(value));
          result.value = String(value);
          break;
        case 'text': {
          const text = await el.evaluate((node) => node.innerText || node.value || '');
          result.text = text;
          break;
        }
        case 'screenshot': {
          if (!output) throw new Error('--output required for screenshot');
          const dir = dirname(output);
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          await el.screenshot({ path: output });
          result.path = output;
          break;
        }
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      outputJSON(result);
    });
  } catch (err) {
    outputError(err, { ref, role, name });
  }
}

main();
