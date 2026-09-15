#!/usr/bin/env node
/**
 * retract-report.mjs — take a published report down before it expires.
 *
 *   node scripts/retract-report.mjs <uid|url> --key <edit key>
 *   KATLA_REPORT_KEY=… node scripts/retract-report.mjs <uid|url>
 *
 * Published in error, superseded, or simply not something the publisher wants standing any
 * more. A report names a real company's compliance failures; whoever put it up should be able
 * to take it down without waiting out the week.
 *
 * The row goes with it, summary included. Keeping the numbers after being asked to remove the
 * report would be the wrong way to honour the request.
 *
 * Zero dependencies. Node 18+.
 */

import { API, die, explain, keyFrom, toUid } from './lib/report-key.mjs';

const fail = (msg) => die('retract-report', msg);

const argv = process.argv.slice(2);
let target = null;
let key = null;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--key') key = argv[++i];
  else if (a.startsWith('--key=')) key = a.slice('--key='.length);
  else if (a === '-h' || a === '--help') {
    console.log('usage: retract-report.mjs <uid|url> --key <edit key>');
    process.exit(0);
  } else if (a.startsWith('-')) fail(`unknown flag ${a}`);
  else if (!target) target = a;
  else fail(`unexpected argument ${a}`);
}

const uid = toUid(target);
if (!uid) fail('missing <uid|url> — pass the report id or the link it was published at');

key = keyFrom(key);
if (!key) fail('missing --key — the edit key was printed once, when the report was published');

const response = await fetch(`${API}/reports/${uid}`, {
  method: 'DELETE',
  headers: { authorization: `Bearer ${key}` },
}).catch((e) => fail(`could not reach ${API}: ${e.message}`));

if (!response.ok) fail(`retraction refused: ${await explain(response)}`);

console.log(`✓ Report ${uid} retracted.`);
console.log('  The link now reads as expired. Tell anyone you sent it to.');
