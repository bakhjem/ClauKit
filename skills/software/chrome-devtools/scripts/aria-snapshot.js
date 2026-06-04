#!/usr/bin/env node
import { withBrowser, parseArgs, outputJSON, outputError } from './lib/browser.js';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const INTERACTIVE_ROLES = new Set([
  'button', 'link', 'textbox', 'checkbox', 'radio', 'combobox', 'listbox',
  'menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'searchbox',
  'slider', 'spinbutton', 'switch', 'tab', 'treeitem',
]);

const STATE_KEYS = ['checked', 'disabled', 'expanded', 'selected', 'pressed', 'focused'];

function escapeYaml(s) {
  if (s === null || s === undefined) return '""';
  const str = String(s).replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
  return `"${str.slice(0, 200)}"`;
}

function nodeToYaml(node, refMap, depth = 0) {
  if (!node) return '';
  const indent = '  '.repeat(depth);
  const role = node.role || 'generic';
  const name = node.name || '';

  if (['none', 'presentation', 'InlineTextBox', 'StaticText'].includes(role)) {
    if (name && role === 'StaticText') {
      return `${indent}- text: ${escapeYaml(name)}\n`;
    }
    let out = '';
    if (node.children) {
      for (const child of node.children) {
        out += nodeToYaml(child, refMap, depth);
      }
    }
    return out;
  }

  let line = `${indent}- ${role}`;
  if (name) line += ` ${escapeYaml(name)}`;

  if (INTERACTIVE_ROLES.has(role)) {
    const ref = `e${refMap.counter++}`;
    refMap.byRef.set(ref, node);
    line += ` [ref=${ref}]`;
  }

  const states = [];
  for (const key of STATE_KEYS) {
    if (node[key]) states.push(key);
  }
  if (states.length) line += ` [${states.join('] [')}]`;

  line += '\n';

  const attrs = [];
  if (node.value) attrs.push(`${indent}  /value: ${escapeYaml(node.value)}`);
  if (node.placeholder) attrs.push(`${indent}  /placeholder: ${escapeYaml(node.placeholder)}`);
  if (node.url) attrs.push(`${indent}  /url: ${node.url}`);
  if (node.description) attrs.push(`${indent}  /description: ${escapeYaml(node.description)}`);

  let out = line;
  for (const a of attrs) out += a + '\n';
  if (node.children) {
    for (const child of node.children) {
      out += nodeToYaml(child, refMap, depth + 1);
    }
  }
  return out;
}

async function getAccessibilityTree(page) {
  const snapshot = await page.accessibility.snapshot({ interestingOnly: false });
  return snapshot;
}

async function main() {
  const args = parseArgs();
  const url = args.url;
  const output = args.output ? resolve(args.output) : null;
  const timeout = args.timeout ? parseInt(args.timeout, 10) : 30000;
  const waitUntil = args['wait-until'] || 'load';

  try {
    await withBrowser(args, async (page) => {
      if (url) await page.goto(url, { timeout, waitUntil });
      const tree = await getAccessibilityTree(page);
      const refMap = { counter: 1, byRef: new Map() };
      const yaml = nodeToYaml(tree, refMap, 0);

      const refMapObj = {};
      for (const [ref, node] of refMap.byRef) {
        refMapObj[ref] = { role: node.role, name: node.name || null };
      }

      if (output) {
        const dir = dirname(output);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(output, yaml);
        const refsPath = output.replace(/\.ya?ml$/, '.refs.json');
        writeFileSync(refsPath, JSON.stringify(refMapObj, null, 2));
        outputJSON({
          success: true,
          path: output,
          refsPath,
          refCount: refMap.byRef.size,
        });
      } else {
        process.stdout.write(yaml);
        process.stderr.write(`\n# ${refMap.byRef.size} interactive refs captured\n`);
      }
    });
  } catch (err) {
    outputError(err);
  }
}

main();
