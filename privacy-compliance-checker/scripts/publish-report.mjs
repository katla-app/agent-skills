#!/usr/bin/env node
/**
 * publish-report.mjs — hand a findings.json to Katla and get a shareable link back.
 *
 *   node scripts/publish-report.mjs findings.json
 *   node scripts/publish-report.mjs findings.json --no-open
 *
 * Uploads the findings document — never a rendered file. Katla renders the report itself from
 * the data, which is what makes the published page provably its own: this skill is MIT
 * licensed, so any key it carried would be public and a signed upload would prove nothing.
 * Sending data instead of markup also means nothing from an audit is ever served as HTML from
 * a domain that holds somebody's session.
 *
 * Reports are kept for seven days and then deleted.
 *
 * Zero dependencies. Node 18+.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

const API = (process.env.KATLA_API_URL || 'https://api.katla.app').replace(/\/+$/, '');

const die = (msg) => {
  console.error(`publish-report: ${msg}`);
  process.exit(1);
};

const argv = process.argv.slice(2);
let input = null;
let shouldOpen = true;

for (const a of argv) {
  if (a === '--no-open') shouldOpen = false;
  else if (a === '-h' || a === '--help') {
    console.log('usage: publish-report.mjs <findings.json> [--no-open]');
    process.exit(0);
  } else if (a.startsWith('-')) die(`unknown flag ${a}`);
  else input = a;
}

if (!input) die('missing <findings.json>');

let findings;
try {
  findings = JSON.parse(readFileSync(resolve(input), 'utf8'));
} catch (e) {
  die(`could not read findings at ${input}: ${e.message}`);
}

/* Opening a browser is a convenience, not the deliverable — the link is printed either way,
   and a headless or locked-down machine should not turn a successful upload into an error. */
function openInBrowser(url) {
  const cmd = platform() === 'darwin' ? 'open' : platform() === 'win32' ? 'start' : 'xdg-open';
  try {
    const child = spawn(cmd, [url], { stdio: 'ignore', detached: true, shell: platform() === 'win32' });
    child.on('error', () => {});
    child.unref();
  } catch {
    /* printed above; nothing else to do */
  }
}

const response = await fetch(`${API}/reports`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(findings),
}).catch((e) => die(`could not reach ${API}: ${e.message}`));

if (response.status === 429) {
  die('rate limited — that is a lot of reports from this address. Try again in an hour.');
}

if (response.status === 413) {
  die('findings.json is too large to publish (the limit is 256 KB). Trim the cookie or third-party tables.');
}

if (!response.ok) {
  let detail = `HTTP ${response.status}`;
  try {
    const body = await response.json();
    if (body?.error) detail = body.error;
  } catch {
    /* keep the status */
  }
  die(`upload refused: ${detail}`);
}

const { uid, url, expiresAt, editKey } = await response.json();
const days = Math.max(0, Math.round((new Date(expiresAt) - Date.now()) / 86_400_000));

console.log(`✓ ${url}`);
console.log(`  Kept for ${days} days, then deleted. Anyone with the link can read it.`);
console.log('  Open it and print to PDF (A4, no margins, background graphics on) for a file.');

/* The key is printed once and never retrievable again — the server keeps only its hash. It is
   scoped to this one report and dies with it in seven days, so it is worth far less than it
   looks; it is still a credential, and it is on stdout because the caller has nowhere else to
   put it. Keep it in the session, not in a file somebody might commit. */
if (editKey) {
  console.log('');
  console.log(`  uid:      ${uid}`);
  console.log(`  edit key: ${editKey}`);
  console.log('  Shown once. Keep it to revise or retract this report:');
  console.log(`    node scripts/revise-report.mjs  ${uid} findings.json --key ${editKey}`);
  console.log(`    node scripts/retract-report.mjs ${uid} --key ${editKey}`);
}

if (shouldOpen) openInBrowser(url);
