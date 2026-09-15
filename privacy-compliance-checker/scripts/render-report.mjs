#!/usr/bin/env node
/**
 * render-report.mjs — turn a privacy audit findings.json into a branded,
 * self-contained A4 HTML report.
 *
 *   node scripts/render-report.mjs findings.json
 *   node scripts/render-report.mjs findings.json -o ~/Desktop/report.html
 *   node scripts/render-report.mjs findings.json --brand ./my-brand.json
 *   node scripts/render-report.mjs findings.json --artifact -o report.artifact.html
 *
 * Zero dependencies. Node 18+. Output is one HTML file; open it and print to
 * PDF (A4, margins none, background graphics on).
 *
 * --artifact emits the same report as publishable Artifact content instead of a
 * standalone document: no doctype/html/head/body wrapper, a domain-led <title>,
 * and a scaler that fits each 210mm sheet to the viewport (standing down around
 * print, so printing from the published page still yields correct A4).
 *
 * This file is only the command line. The report itself is built by
 * `lib/render.mjs`, which is pure and is vendored into Katla's server so an
 * uploaded findings.json renders identically at /reports/<uid>.
 *
 * The schema is documented in references/report-schema.md. Everything the
 * report shows is either in the JSON or derived by the renderer — neither makes
 * a compliance judgement of its own.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ReportInputError, renderReport } from './lib/render.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(HERE, '..');

const die = (msg) => {
  console.error(`render-report: ${msg}`);
  process.exit(1);
};

/* ------------------------------------------------------------------- args */

const argv = process.argv.slice(2);
let input = null;
let output = null;
let artifactMode = false;
let brandPath = join(SKILL_ROOT, 'assets', 'brand.json');

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '-o' || a === '--output') output = argv[++i];
  else if (a === '--brand') brandPath = argv[++i];
  else if (a === '--artifact') artifactMode = true;
  else if (a === '-h' || a === '--help') {
    console.log(
      'usage: render-report.mjs <findings.json> [-o out.html] [--brand brand.json] [--artifact]'
    );
    process.exit(0);
  } else if (a.startsWith('-')) die(`unknown flag ${a}`);
  else input = a;
}

if (!input) die('missing <findings.json> — see references/report-schema.md');

const readJson = (p, what) => {
  try {
    return JSON.parse(readFileSync(resolve(p), 'utf8'));
  } catch (e) {
    die(`could not read ${what} at ${p}: ${e.message}`);
  }
};

const data = readJson(input, 'findings');
const brand = readJson(brandPath, 'brand tokens');

/* The renderer reads no files, so the wordmark is loaded here and handed over. A missing or
   unreadable logo is not worth failing a report for — the renderer falls back to type. */
let logoSvg;
try {
  logoSvg = readFileSync(resolve(dirname(resolve(brandPath)), brand.logo), 'utf8');
} catch {
  logoSvg = undefined;
}

/* ----------------------------------------------------------------- render */

let html;
let summary;
try {
  ({ html, summary } = renderReport(data, brand, { artifact: artifactMode, logoSvg }));
} catch (error) {
  if (error instanceof ReportInputError) die(error.message);
  throw error;
}

const defaultName = `compliance-report-${summary.domain.replace(/[^a-z0-9.-]/gi, '-')}${
  artifactMode ? '.artifact' : ''
}.html`;
const outPath = resolve(output || defaultName);
writeFileSync(outPath, html, 'utf8');

console.log(`✓ ${outPath}`);
console.log(
  `  ${summary.domain} · ${summary.statusLabel} · ${summary.cookies} cookies ` +
    `(${summary.preConsentCookies} pre-consent) · ` +
    `${summary.jurisdictionsPassing}/${summary.jurisdictions} jurisdictions passing · ` +
    `${summary.critical} critical findings`
);
console.log(
  artifactMode
    ? '  Artifact-ready: publish this file with the Artifact tool to get a shareable link.'
    : '  Open in a browser and print to PDF (A4, no margins, background graphics on).'
);
