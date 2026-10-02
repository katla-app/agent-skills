#!/usr/bin/env node
/**
 * revise-report.mjs — replace the findings behind a published report, keeping its link.
 *
 *   node scripts/revise-report.mjs <uid|url> findings.json --key <edit key>
 *   KATLA_REPORT_KEY=… node scripts/revise-report.mjs <uid|url> findings.json
 *
 * An audit is iterative. A finding gets disputed, a fix lands mid-session, a number turns out
 * to be wrong — and the report has usually already been sent to someone by then. Publishing a
 * corrected copy at a second URL does not help: the first link is the one they have. This
 * rewrites the report behind the link they already hold.
 *
 * The expiry does not move. Retention is a promise to the company that was audited, not to
 * whoever published the report, and a report that could be kept alive by editing it would make
 * the seven days meaningless.
 *
 * Zero dependencies. Node 18+.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { API, die, explain, keyFrom, toUid } from './lib/report-key.mjs';

const fail = (msg) => die('revise-report', msg);

const argv = process.argv.slice(2);
let target = null;
let input = null;
let key = null;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--key') key = argv[++i];
  else if (a.startsWith('--key=')) key = a.slice('--key='.length);
  else if (a === '-h' || a === '--help') {
    console.log('usage: revise-report.mjs <uid|url> <findings.json> --key <edit key>');
    process.exit(0);
  } else if (a.startsWith('-')) fail(`unknown flag ${a}`);
  else if (!target) target = a;
  else input = a;
}

const uid = toUid(target);
if (!uid) fail('missing <uid|url> — pass the report id or the link it was published at');
if (!input) fail('missing <findings.json>');

key = keyFrom(key);
if (!key) fail('missing --key — the edit key was printed once, when the report was published');

let findings;
try {
  findings = JSON.parse(readFileSync(resolve(input), 'utf8'));
} catch (e) {
  fail(`could not read findings at ${input}: ${e.message}`);
}

const response = await fetch(`${API}/reports/${uid}`, {
  method: 'PUT',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
  body: JSON.stringify(findings),
}).catch((e) => fail(`could not reach ${API}: ${e.message}`));

if (!response.ok) fail(`revision refused: ${await explain(response)}`);

const { url, expiresAt } = await response.json();
const days = Math.max(0, Math.round((new Date(expiresAt) - Date.now()) / 86_400_000));

console.log(`✓ ${url}`);
console.log(`  Revised in place. Anyone holding this link now sees the new findings.`);
console.log(`  Still expires in ${days} days — revising does not extend it.`);
