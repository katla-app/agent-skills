#!/usr/bin/env node
/**
 * render-report.mjs — turn a privacy audit findings.json into a branded,
 * self-contained A4 HTML report.
 *
 *   node scripts/render-report.mjs findings.json
 *   node scripts/render-report.mjs findings.json -o ~/Desktop/report.html
 *   node scripts/render-report.mjs findings.json --brand ./my-brand.json
 *
 * Zero dependencies. Node 18+. Output is one HTML file; open it and print to
 * PDF (A4, margins none, background graphics on).
 *
 * The schema is documented in references/report-schema.md. Everything the
 * report shows is either in the JSON or derived here — the renderer makes no
 * compliance judgements of its own.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = resolve(HERE, '..');

/* ---------------------------------------------------------------- helpers */

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const die = (msg) => {
  console.error(`render-report: ${msg}`);
  process.exit(1);
};

const pct = (n, total) => (total > 0 ? `${Math.round((n / total) * 100)}%` : '0%');

const titleCase = (s) =>
  String(s || '').replace(/(^|[\s-])([a-z])/g, (_, p, c) => p + c.toUpperCase());

/* Page one is a summary sheet; the appendix carries every finding in full, so
   clipping a long detail here loses nothing. */
const clip = (s, max) => {
  const str = String(s || '');
  if (str.length <= max) return str;
  const cut = str.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 16)).trimEnd() + '…';
};

/* ------------------------------------------------------------------- args */

const argv = process.argv.slice(2);
let input = null;
let output = null;
let brandPath = join(SKILL_ROOT, 'assets', 'brand.json');

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '-o' || a === '--output') output = argv[++i];
  else if (a === '--brand') brandPath = argv[++i];
  else if (a === '-h' || a === '--help') {
    console.log(
      'usage: render-report.mjs <findings.json> [-o out.html] [--brand brand.json]'
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
const C = brand.color;

/* --------------------------------------------------------------- validate */

if (!data.url && !data.domain) die('findings.json needs at least `url` or `domain`');

const domain =
  data.domain ||
  (() => {
    try {
      return new URL(data.url).hostname;
    } catch {
      return String(data.url).replace(/^https?:\/\//, '').split('/')[0];
    }
  })();

const cookies = Array.isArray(data.cookies) ? data.cookies : [];
const thirdParties = Array.isArray(data.thirdParties) ? data.thirdParties : [];
const jurisdictions = Array.isArray(data.jurisdictions) ? data.jurisdictions : [];
const findings = Array.isArray(data.findings) ? data.findings : [];
const notVerifiable = Array.isArray(data.notVerifiable) ? data.notVerifiable : [];
const passed = Array.isArray(data.passed) ? data.passed : [];
const mech = data.consentMechanism || {};
const mechChecks = Array.isArray(mech.checks) ? mech.checks : [];

/* -------------------------------------------------------------- derivation */

const checkedAt = data.checkedAt ? new Date(data.checkedAt) : new Date();
if (Number.isNaN(checkedAt.getTime())) die(`checkedAt is not a valid date: ${data.checkedAt}`);

const fmtDate = (d) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtStamp = (d) =>
  `${fmtDate(d)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;

// Stable per-URL report id when the caller did not supply one.
const reportId =
  data.reportId ||
  (() => {
    let h = 0;
    for (const ch of `${data.url || domain}${checkedAt.toISOString().slice(0, 10)}`)
      h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const y = checkedAt.getFullYear();
    const m = String(checkedAt.getMonth() + 1).padStart(2, '0');
    return `RPT-${y}-${m}-${String(h % 10000).padStart(4, '0')}`;
  })();

const ESSENTIAL = new Set(['necessary', 'essential', 'functional', 'security']);
const normCat = (c) => String(c || 'unknown').toLowerCase();

const preConsentCookies = cookies.filter((c) => c.preConsent && !ESSENTIAL.has(normCat(c.category)));
const essentialCookies = cookies.filter((c) => ESSENTIAL.has(normCat(c.category)));
const withheldCount = Math.max(0, cookies.length - essentialCookies.length - preConsentCookies.length);
const thirdPartyCookieCount = cookies.filter((c) => c.thirdParty).length;
const unclassifiedCount = cookies.filter((c) => /^(unknown|unclassified)$/.test(normCat(c.category))).length;

const VERDICT = {
  pass: { label: 'Pass', color: C.success },
  review: { label: 'Review', color: C.warning },
  partial: { label: 'Review', color: C.warning },
  fail: { label: 'Fail', color: C.danger },
  readiness: { label: 'Readiness', color: C.brand },
  na: { label: 'N/A', color: C.caption },
};
const verdictOf = (v) => VERDICT[String(v || 'na').toLowerCase()] || VERDICT.na;

const regsPassing = jurisdictions.filter((j) => String(j.verdict).toLowerCase() === 'pass').length;
const regsReview = jurisdictions.filter((j) =>
  /^(review|partial)$/.test(String(j.verdict).toLowerCase())
).length;

const criticals = findings.filter((f) => String(f.severity).toLowerCase() === 'critical');
const warnings = findings.filter((f) => String(f.severity).toLowerCase() === 'warning');
const readiness = findings.filter((f) => String(f.severity).toLowerCase() === 'readiness');

const status =
  data.status ||
  (criticals.length || jurisdictions.some((j) => String(j.verdict).toLowerCase() === 'fail')
    ? 'noncompliant'
    : warnings.length || regsReview
      ? 'attention'
      : 'compliant');

/* 32pt is the design size and fits a typical hostname on one line; long ones
   step down rather than pushing the rest of the sheet off the page. */
const domainSize = domain.length <= 22 ? '32pt' : domain.length <= 32 ? '25pt' : '19pt';

const STATUS_LABEL = {
  compliant: 'Compliant',
  attention: 'Needs attention',
  noncompliant: 'Non-compliant',
};

// Category rollup for the inventory bars, in a fixed reading order.
const CAT_ORDER = [
  'necessary',
  'essential',
  'functional',
  'security',
  'personalization',
  'analytics',
  'marketing',
  'unknown',
  'unclassified',
];
const catCounts = new Map();
for (const c of cookies) {
  const k = normCat(c.category);
  catCounts.set(k, (catCounts.get(k) || 0) + 1);
}
const categories = [...catCounts.entries()]
  .sort((a, b) => {
    const ia = CAT_ORDER.indexOf(a[0]);
    const ib = CAT_ORDER.indexOf(b[0]);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  })
  .map(([name, count]) => ({
    name: titleCase(name),
    count,
    pct: pct(count, cookies.length),
    color: brand.categoryColor[name] || C.brand400,
  }));

/* KPI colours stay calm when the number is benign and escalate when it is not —
   the design keeps status semantics out of the masthead, not out of the data. */
const kpis = [
  {
    value: String(cookies.length),
    label: 'Cookies found',
    sub: `${thirdPartyCookieCount} third-party · ${thirdParties.length} domains`,
    color: C.ink,
  },
  {
    value: String(preConsentCookies.length),
    label: 'Set before consent',
    sub: 'non-essential cookies',
    color: preConsentCookies.length ? C.warning : C.ink,
  },
  {
    value: jurisdictions.length ? `${regsPassing}/${jurisdictions.length}` : '—',
    label: 'Jurisdictions passing',
    sub: regsReview ? `${regsReview} under review` : `${jurisdictions.length} in scope`,
    color: C.brand,
  },
  {
    value: String(criticals.length),
    label: 'Critical findings',
    sub: `${warnings.length} warnings · ${readiness.length} forward-looking`,
    color: criticals.length ? C.danger : C.ink,
  },
];

const CHECK_COLOR = {
  pass: C.success,
  fail: C.danger,
  warn: C.warning,
  warning: C.warning,
  na: C.caption,
  info: C.ink,
};

/* ------------------------------------------------------------------- logo */

let logoMarkup = '';
try {
  const svg = readFileSync(resolve(dirname(resolve(brandPath)), brand.logo), 'utf8');
  logoMarkup = svg
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<svg /, `<svg style="height:${brand.logoHeight};width:auto;display:block;" `)
    .trim();
} catch {
  logoMarkup = `<span style="font-weight:800;font-size:16pt;letter-spacing:-0.03em;color:#fff;">${esc(brand.name)}</span>`;
}

/* --------------------------------------------------------------- partials */

const sectionHeading = (title, caption) => `
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
          <span data-block-title style="font-weight:800;font-size:12pt;letter-spacing:-0.02em;">${esc(title)}</span>
          ${caption ? `<span style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.caption};letter-spacing:0.04em;">${esc(caption)}</span>` : ''}
        </div>`;

const PAGE1_REGS = 7;
const PAGE1_FINDINGS = 3;

// Findings are ranked so the three that reach page one are the three that matter.
const SEV_RANK = { critical: 0, warning: 1, readiness: 2 };
const rankedFindings = [...findings].sort(
  (a, b) =>
    (SEV_RANK[String(a.severity).toLowerCase()] ?? 9) -
    (SEV_RANK[String(b.severity).toLowerCase()] ?? 9)
);

const findingCards = rankedFindings.slice(0, PAGE1_FINDINGS).map(
  (f, i) => `
          <div style="font-size:8.5pt;line-height:1.5;">
            <div style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.brand};margin-bottom:4px;">${String(i + 1).padStart(2, '0')}</div>
            <div style="font-weight:600;margin-bottom:2px;">${esc(clip(f.title, 60))}</div>
            <div data-fit-clamp style="color:${C.muted};">${esc(clip(f.detail, 135))}</div>
          </div>`
);

const noFindings = `
          <div style="font-size:8.5pt;line-height:1.5;">
            <div style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.brand};margin-bottom:4px;">00</div>
            <div style="font-weight:600;">No open findings</div>
            <div style="color:${C.muted};">Every check in scope passed.</div>
          </div>`;

const consentBar = () => {
  const total = cookies.length || 1;
  const seg = (n, color) =>
    n > 0 ? `<div style="width:${pct(n, total)};background:${color};"></div>` : '';
  return `
        <div style="display:flex;height:10px;border-radius:999px;overflow:hidden;gap:2px;">
          ${seg(withheldCount, C.brand)}${seg(essentialCookies.length, C.brand200)}${seg(preConsentCookies.length, C.danger)}
        </div>
        <div style="display:flex;gap:16px;margin-top:8px;font-size:8pt;color:${C.muted};">
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;background:${C.brand};border-radius:50%;display:inline-block;"></span>Withheld ${withheldCount}</span>
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;background:${C.brand200};border-radius:50%;display:inline-block;"></span>Essential ${essentialCookies.length}</span>
          <span style="display:flex;align-items:center;gap:5px;"><span style="width:7px;height:7px;background:${C.danger};border-radius:50%;display:inline-block;"></span>Pre-consent ${preConsentCookies.length}</span>
        </div>`;
};

/* ------------------------------------------------------------- appendix UI */

const table = (headers, rows) =>
  rows.length
    ? `
      <table style="width:100%;border-collapse:collapse;font-size:8.5pt;margin-top:4px;">
        <thead style="display:table-header-group;">
          <tr>${headers
            .map(
              (h) =>
                `<th style="text-align:left;font-weight:600;font-size:7.5pt;text-transform:uppercase;letter-spacing:0.06em;color:${C.caption};border-bottom:1px solid ${C.ink};padding:0 10px 6px 0;">${esc(h)}</th>`
            )
            .join('')}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (r) =>
                `<tr style="break-inside:avoid;">${r
                  .map(
                    (cell) =>
                      `<td style="border-top:1px solid ${C.hairline};padding:6px 10px 6px 0;vertical-align:top;color:${C.text};">${cell}</td>`
                  )
                  .join('')}</tr>`
            )
            .join('')}
        </tbody>
      </table>`
    : `<div style="font-size:8.5pt;color:${C.caption};margin-top:4px;">None detected.</div>`;

const mono = (s) => `<span style="font-family:${brand.font.mono};font-size:8pt;">${esc(s)}</span>`;
const flag = (on, yes = 'Yes', no = 'No') =>
  `<span style="color:${on ? C.danger : C.success};font-weight:600;">${on ? yes : no}</span>`;

/* An essential cookie set before consent is lawful, not a finding — flagging it
   red would put three false alarms at the top of every cookie table. */
const preConsentFlag = (c) => {
  if (!c.preConsent) return `<span style="color:${C.success};font-weight:600;">No</span>`;
  if (ESSENTIAL.has(normCat(c.category)))
    return `<span style="color:${C.caption};">Yes <span style="font-size:7.5pt;">· exempt</span></span>`;
  return `<span style="color:${C.danger};font-weight:600;">Yes</span>`;
};

const appendixBlock = (title, body) => `
      <div data-block style="margin-bottom:28px;">
        ${sectionHeading(title)}
        ${body}
      </div>`;

const appendixSections = [];

if (rankedFindings.length) {
  const SEV = {
    critical: { label: 'Critical', color: C.danger },
    warning: { label: 'Warning', color: C.warning },
    readiness: { label: 'Forward-looking', color: C.brand },
  };
  appendixSections.push(
    appendixBlock(
      'Findings in full',
      `<div data-split style="display:flex;flex-direction:column;">${rankedFindings
        .map((f, i) => {
          const s = SEV[String(f.severity).toLowerCase()] || { label: 'Note', color: C.caption };
          const juris = Array.isArray(f.jurisdictions) ? f.jurisdictions.join(', ') : '';
          return `
          <div style="border-top:1px solid ${C.hairline};padding:10px 0;break-inside:avoid;">
            <div style="display:grid;grid-template-columns:34px 1fr auto;gap:12px;align-items:baseline;">
              <span style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.brand};">${String(i + 1).padStart(2, '0')}</span>
              <span style="font-weight:600;font-size:9pt;">${esc(f.title)}</span>
              <span style="font-size:7.5pt;font-weight:600;text-transform:uppercase;letter-spacing:0.02em;color:${s.color};">${s.label}</span>
            </div>
            <div style="margin-left:46px;font-size:8.5pt;color:${C.muted};line-height:1.55;">${esc(f.detail || '')}</div>
            ${
              juris || f.evidence
                ? `<div style="margin-left:46px;margin-top:4px;font-family:${brand.font.mono};font-size:7.5pt;color:${C.caption};">${
                    juris ? esc(juris) : ''
                  }${juris && f.evidence ? ' · ' : ''}${f.evidence ? esc(f.evidence) : ''}</div>`
                : ''
            }
          </div>`;
        })
        .join('')}</div>`
    )
  );
}

if (jurisdictions.length) {
  appendixSections.push(
    appendixBlock(
      'Regulatory coverage in full',
      `<div data-split style="display:flex;flex-direction:column;">${jurisdictions
        .map((r) => {
          const v = verdictOf(r.verdict);
          return `
          <div style="display:grid;grid-template-columns:130px 1fr 90px;align-items:center;gap:16px;border-top:1px solid ${C.hairline};padding:7px 0;font-size:8.5pt;break-inside:avoid;">
            <span><span style="background:${C.pill};border-radius:999px;padding:2px 9px;font-size:7.5pt;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;white-space:nowrap;">${esc(r.law || r.code)}</span></span>
            <span style="color:${C.text};">${esc(r.check || '')} <span style="color:${C.caption};">· ${esc(r.scope || r.code || '')}</span></span>
            <span style="display:flex;align-items:center;justify-content:flex-end;gap:6px;font-weight:600;font-size:8pt;color:${v.color};"><span style="width:7px;height:7px;border-radius:50%;background:${v.color};display:inline-block;"></span>${v.label}</span>
          </div>`;
        })
        .join('')}</div>`
    )
  );
}

if (cookies.length) {
  appendixSections.push(
    appendixBlock(
      'Cookie inventory',
      table(
        ['Cookie', 'Domain', 'Category', 'Purpose', 'Before consent'],
        cookies.map((c) => [
          mono(c.name),
          `<span style="color:${C.caption};">${esc(c.domain || '')}</span>`,
          titleCase(normCat(c.category)),
          esc(c.purpose || ''),
          preConsentFlag(c),
        ])
      )
    )
  );
}

if (thirdParties.length) {
  appendixSections.push(
    appendixBlock(
      'Third-party scripts and hosts',
      table(
        ['Host', 'Type', 'Before consent'],
        thirdParties.map((t) => [
          mono(t.host),
          esc(t.type || ''),
          flag(!!t.preConsent, 'Loaded', 'Blocked'),
        ])
      )
    )
  );
}

const fixable = findings.filter((f) => f.katlaResolves === true);
const notFixable = findings.filter((f) => f.katlaResolves === false);

/* The remediation split only appears when there is something to remediate —
   a passing site does not get a product pitch appended to its report. */
if (status !== 'compliant' && (fixable.length || notFixable.length)) {
  const list = (items, empty) =>
    items.length
      ? `<ul style="margin:6px 0 0;padding-left:16px;font-size:8.5pt;color:${C.text};line-height:1.6;">${items
          .map((f) => `<li style="margin-bottom:3px;">${esc(f.title)}</li>`)
          .join('')}</ul>`
      : `<div style="font-size:8.5pt;color:${C.caption};margin-top:6px;">${esc(empty)}</div>`;

  appendixSections.push(
    appendixBlock(
      'Getting compliant',
      `<div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;">
        <div>
          <div style="font-weight:600;font-size:9pt;margin-bottom:2px;">Fixable with a consent platform</div>
          ${list(fixable, 'Nothing in this audit falls to a consent platform.')}
          ${
            fixable.length
              ? `<div style="font-size:8.5pt;color:${C.muted};margin-top:10px;line-height:1.6;">${esc(brand.remediation.blurb)} <a href="${esc(brand.remediation.productUrl)}" style="color:${C.brand};text-decoration:none;font-weight:600;">${esc(brand.remediation.productName)}</a> covers this class of issue.</div>`
              : ''
          }
        </div>
        <div>
          <div style="font-weight:600;font-size:9pt;margin-bottom:2px;">Needs separate work</div>
          ${list(notFixable, 'No findings outside the consent layer.')}
          ${
            notFixable.length
              ? `<div style="font-size:8.5pt;color:${C.muted};margin-top:10px;line-height:1.6;">These need legal drafting or organisational action. No consent tool resolves them.</div>`
              : ''
          }
        </div>
      </div>`
    )
  );
}

if (notVerifiable.length) {
  appendixSections.push(
    appendixBlock(
      'Not verifiable from the browser',
      `<div style="font-size:8.5pt;color:${C.muted};line-height:1.6;">These obligations exist but cannot be observed from a page load. Confirm them internally.</div>
       <ul style="margin:8px 0 0;padding-left:16px;font-size:8.5pt;color:${C.text};line-height:1.6;">${notVerifiable
         .map((s) => `<li style="margin-bottom:3px;">${esc(s)}</li>`)
         .join('')}</ul>`
    )
  );
}

if (passed.length) {
  appendixSections.push(
    appendixBlock(
      'Checks passed',
      `<ul style="margin:4px 0 0;padding-left:16px;font-size:8.5pt;color:${C.text};line-height:1.6;columns:2;column-gap:40px;">${passed
        .map((s) => `<li style="margin-bottom:3px;break-inside:avoid;">${esc(s)}</li>`)
        .join('')}</ul>`
    )
  );
}

const scopeBasis = data.scope?.basis || 'inferred from page signals';
const markets = data.scope?.markets?.length ? data.scope.markets.join(', ') : 'not stated';

appendixSections.push(
  appendixBlock(
    'Scope and method',
    `<div style="font-size:8.5pt;color:${C.muted};line-height:1.65;max-width:62ch;">
      <p style="margin:0 0 8px;"><strong style="color:${C.text};">Markets in scope:</strong> ${esc(markets)} (${esc(scopeBasis)}).</p>
      <p style="margin:0 0 8px;">Findings come from an automated browser audit of <span style="font-family:${brand.font.mono};font-size:8pt;color:${C.text};">${esc(data.url || domain)}</span> on ${esc(fmtDate(checkedAt))}: page load before any interaction, the reject flow, the accept flow, and the linked privacy policy.</p>
      <p style="margin:0 0 8px;">This is a surface-level technical audit, not a legal compliance certification. It observes one page on one load from one location; consent behaviour can vary by geography, device and session. Organisational obligations — breach procedures, records of processing, DPO appointment, processor contracts — are outside its reach and listed separately above.</p>
      <p style="margin:0;">Obligations not yet in force are reported as dated readiness gaps, never as current violations. Consult a privacy lawyer before acting on anything here.</p>
    </div>`
  )
);

/* ------------------------------------------------------------------- HTML */

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Compliance report · ${esc(domain)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${esc(brand.font.webfontHref)}" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:${C.canvas}; }
  body {
    font-family:${brand.font.sans};
    color:${C.ink};
    -webkit-font-smoothing:antialiased;
  }
  .sheet {
    box-sizing:border-box;
    width:210mm;
    background:${C.page};
    margin:0 auto;
    font-size:9.5pt;
    line-height:1.5;
    display:flex;
    flex-direction:column;
  }
  .sheet--fixed, .sheet--cont { height:297mm; overflow:hidden; }
  .sheet--cont { padding:0 48px; }
  .cont-body { flex:1; min-height:0; overflow:hidden; }
  /* Fallback for a viewer with scripting off: one flowing sheet, no per-page chrome. */
  .sheet--flow  { min-height:297mm; height:auto; padding:0 48px 40px; }
  @media screen {
    body { padding:24px 0; }
    .sheet { box-shadow:0 1px 3px rgba(0,0,0,.10), 0 12px 32px rgba(0,0,0,.08); margin-bottom:24px; }
  }
  @page { size:A4; margin:0; }
  @media print {
    html, body { background:${C.page}; }
    body { padding:0; }
    .sheet { box-shadow:none; margin:0; }
    .sheet--fixed { break-after:page; }
    thead { display:table-header-group; }
    tr, li { break-inside:avoid; }
  }
  a { color:${C.brand}; text-decoration:none; }
</style>
</head>
<body>

<!-- ============================ page 1 — the report ======================= -->
<section class="sheet sheet--fixed">

  <div style="padding:20px 40px 18px;display:flex;justify-content:space-between;align-items:center;background:${C.brand};color:#ffffff;">
    ${logoMarkup}
    <div style="display:flex;gap:6px;">
      ${(brand.pills || [])
        .map(
          (p) =>
            `<span style="background:rgba(255,255,255,0.16);color:#ffffff;border-radius:999px;padding:4px 11px;font-size:7.5pt;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;">${esc(p)}</span>`
        )
        .join('')}
    </div>
  </div>

  <div data-fit-body style="padding:34px 48px 0;display:flex;flex-direction:column;gap:30px;flex:1;">

    <div style="display:grid;grid-template-columns:1fr auto;gap:32px;align-items:end;">
      <div>
        <div style="font-family:${brand.font.mono};font-size:7.5pt;letter-spacing:0.14em;text-transform:uppercase;color:${C.brand};margin-bottom:10px;">Automated audit · ${esc(fmtDate(checkedAt))}</div>
        <div style="font-weight:800;font-size:${domainSize};line-height:1.04;letter-spacing:-0.035em;word-break:break-word;">${esc(domain)}</div>
        <div style="font-weight:800;font-size:32pt;line-height:1;letter-spacing:-0.035em;color:${C.brand};">${esc(STATUS_LABEL[status] || STATUS_LABEL.attention)}</div>
      </div>
      <div style="display:grid;grid-template-columns:auto auto;gap:4px 16px;font-size:8pt;color:${C.caption};text-align:right;line-height:1.4;">
        <span>Report</span><span style="font-family:${brand.font.mono};color:${C.ink};">${esc(reportId)}</span>
        <span>Generated</span><span style="color:${C.ink};">${esc(fmtStamp(checkedAt))}</span>
        <span>Prepared for</span><span style="color:${C.ink};">${esc(data.preparedFor || 'Data Protection Officer')}</span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid ${C.ink};border-bottom:1px solid ${C.rule};">
      ${kpis
        .map(
          (k) => `
      <div style="padding:16px 16px 16px 0;">
        <div style="font-weight:800;font-size:26pt;letter-spacing:-0.04em;line-height:1;color:${k.color};">${esc(k.value)}</div>
        <div style="font-size:8.5pt;font-weight:600;margin-top:8px;">${esc(k.label)}</div>
        <div style="font-size:8pt;color:${C.caption};">${esc(k.sub)}</div>
      </div>`
        )
        .join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;">
      <div>
        ${sectionHeading('Cookie inventory', cookies.length ? `${cookies.length} COOKIES` : 'NO COOKIES')}
        <div style="display:flex;flex-direction:column;gap:9px;">
          ${
            categories.length
              ? categories
                  .map(
                    (c) => `
          <div style="display:grid;grid-template-columns:82px 1fr 26px;align-items:center;gap:12px;font-size:8.5pt;">
            <span style="color:${C.text};">${esc(c.name)}</span>
            <div style="height:6px;background:${C.hairline};border-radius:999px;overflow:hidden;"><div style="height:100%;width:${c.pct};background:${c.color};border-radius:999px;"></div></div>
            <span style="font-family:${brand.font.mono};text-align:right;font-size:8pt;">${c.count}</span>
          </div>`
                  )
                  .join('')
              : `<div style="font-size:8.5pt;color:${C.caption};">No cookies observed on this page.</div>`
          }
        </div>
        <div style="margin-top:14px;font-size:8.5pt;color:${C.caption};">${thirdParties.length} third-party domains · ${unclassifiedCount} unclassified · <span style="color:${preConsentCookies.length ? C.warning : C.success};font-weight:600;">${preConsentCookies.length} set before consent</span></div>
      </div>
      <div>
        ${sectionHeading('Consent mechanism', mech.bannerPresent === false ? 'NO BANNER' : 'PRE-CONSENT LOAD')}
        ${consentBar()}
        <div style="margin-top:12px;display:flex;flex-direction:column;font-size:8.5pt;">
          ${
            mechChecks.length
              ? mechChecks
                  .slice(0, 4)
                  .map(
                    (c) => `
          <div style="display:flex;justify-content:space-between;gap:12px;border-top:1px solid ${C.hairline};padding:6px 0;">
            <span style="color:${C.text};">${esc(c.label)}</span>
            <span style="font-family:${brand.font.mono};font-size:8pt;color:${CHECK_COLOR[String(c.status || 'info').toLowerCase()] || C.ink};white-space:nowrap;">${esc(c.value)}</span>
          </div>`
                  )
                  .join('')
              : `<div style="font-size:8.5pt;color:${C.caption};padding-top:6px;">No consent mechanism checks recorded.</div>`
          }
        </div>
      </div>
    </div>

    <div>
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
        <span style="font-weight:800;font-size:12pt;letter-spacing:-0.02em;">Regulatory coverage</span>
        <span style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.caption};letter-spacing:0.04em;">${regsPassing} OF ${jurisdictions.length} PASSING</span>
      </div>
      <div style="display:flex;flex-direction:column;">
        ${
          jurisdictions.length
            ? jurisdictions
                .slice(0, PAGE1_REGS)
                .map((r) => {
                  const v = verdictOf(r.verdict);
                  return `
        <div data-fit-reg style="display:grid;grid-template-columns:130px 1fr 90px;align-items:center;gap:16px;border-top:1px solid ${C.hairline};padding:7px 0;font-size:8.5pt;">
          <span><span style="background:${C.pill};border-radius:999px;padding:2px 9px;font-size:7.5pt;font-weight:600;letter-spacing:0.02em;text-transform:uppercase;white-space:nowrap;">${esc(r.law || r.code)}</span></span>
          <span style="color:${C.text};">${esc(r.check || '')} <span style="color:${C.caption};">· ${esc(r.scope || r.code || '')}</span></span>
          <span style="display:flex;align-items:center;justify-content:flex-end;gap:6px;font-weight:600;font-size:8pt;color:${v.color};"><span style="width:7px;height:7px;border-radius:50%;background:${v.color};display:inline-block;"></span>${v.label}</span>
        </div>`;
                })
                .join('')
            : `<div style="font-size:8.5pt;color:${C.caption};border-top:1px solid ${C.hairline};padding-top:7px;">No jurisdictions scoped.</div>`
        }
      </div>
      <div data-fit-regnote data-overflow="${Math.max(0, jurisdictions.length - PAGE1_REGS)}" style="margin-top:8px;font-size:8pt;color:${C.caption};font-family:${brand.font.mono};letter-spacing:0.04em;${jurisdictions.length > PAGE1_REGS ? '' : 'display:none;'}">+ ${Math.max(0, jurisdictions.length - PAGE1_REGS)} MORE OVERLEAF</div>
    </div>

    <div>
      <div style="font-weight:800;font-size:12pt;letter-spacing:-0.02em;margin-bottom:10px;">Findings requiring action</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
        ${findingCards.length ? findingCards.join('') : noFindings}
      </div>
      ${
        rankedFindings.length > PAGE1_FINDINGS
          ? `<div style="margin-top:12px;font-size:8pt;color:${C.caption};font-family:${brand.font.mono};letter-spacing:0.04em;">+ ${rankedFindings.length - PAGE1_FINDINGS} MORE — SEE FINDINGS IN FULL OVERLEAF</div>`
          : ''
      }
    </div>

  </div>

  <div style="margin-top:auto;padding:14px 48px 20px;display:flex;justify-content:space-between;font-size:7.5pt;color:${C.caption};font-family:${brand.font.mono};letter-spacing:0.04em;">
    <span>${esc(brand.footer.left)}</span>
    <span data-page-num>${esc(brand.footer.right)}</span>
  </div>
</section>

<!-- ===================== detail sheets (paginated at load) ================ -->
<section id="appendix-src" class="sheet sheet--flow">
  <div style="display:flex;justify-content:space-between;align-items:baseline;padding:26px 0 12px;border-bottom:2px solid ${C.brand};margin-bottom:28px;">
    <span style="font-weight:800;font-size:11pt;letter-spacing:-0.02em;">${esc(domain)} <span style="color:${C.caption};font-weight:600;">· detail</span></span>
    <span style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.caption};letter-spacing:0.04em;">${esc(reportId)}</span>
  </div>
  <div id="appendix-blocks">
${appendixSections.join('\n')}
  </div>
  <div style="margin-top:auto;padding-top:20px;border-top:1px solid ${C.hairline};display:flex;justify-content:space-between;font-size:7.5pt;color:${C.caption};font-family:${brand.font.mono};letter-spacing:0.04em;">
    <span>${esc(brand.footer.left)}</span>
    <span>${esc(brand.footer.right)}</span>
  </div>
</section>
<div id="appendix-out"></div>

<template id="cont-template">
  <section class="sheet sheet--cont">
    <div style="display:flex;justify-content:space-between;align-items:baseline;padding:26px 0 12px;border-bottom:2px solid ${C.brand};margin-bottom:26px;flex:none;">
      <span style="font-weight:800;font-size:11pt;letter-spacing:-0.02em;">${esc(domain)} <span style="color:${C.caption};font-weight:600;">· detail</span></span>
      <span style="font-family:${brand.font.mono};font-size:7.5pt;color:${C.caption};letter-spacing:0.04em;">${esc(reportId)}</span>
    </div>
    <div class="cont-body" data-cont-body></div>
    <div style="flex:none;padding:16px 0 20px;border-top:1px solid ${C.hairline};display:flex;justify-content:space-between;font-size:7.5pt;color:${C.caption};font-family:${brand.font.mono};letter-spacing:0.04em;">
      <span>${esc(brand.footer.left)}</span>
      <span data-page-num></span>
    </div>
  </section>
</template>

<script>
/* Page one is the designed summary sheet, so it is nudged rather than crushed:
   a little section rhythm, then regulation rows move overleaf, and only a
   pathological page reaches the clamp. Everything the summary sheds is
   reproduced in full on the detail sheets — nothing is lost, only moved. */
(function () {
  function fit() {
    var page = document.querySelector('.sheet--fixed');
    if (!page) return;
    var over = function () { return page.scrollHeight > page.clientHeight + 1; };
    if (!over()) return;

    var body = page.querySelector('[data-fit-body]');
    for (var g = 28; g >= 24 && over(); g -= 2) body.style.gap = g + 'px';

    var rows = Array.prototype.slice.call(page.querySelectorAll('[data-fit-reg]'));
    var note = page.querySelector('[data-fit-regnote]');
    var moved = note ? parseInt(note.dataset.overflow, 10) || 0 : 0;
    while (over() && rows.length > 3) {
      rows.pop().style.display = 'none';
      moved++;
      if (note) {
        note.style.display = '';
        note.textContent = '+ ' + moved + ' MORE OVERLEAF';
      }
    }

    if (over()) {
      Array.prototype.forEach.call(page.querySelectorAll('[data-fit-clamp]'), function (el) {
        el.style.display = '-webkit-box';
        el.style.webkitBoxOrient = 'vertical';
        el.style.overflow = 'hidden';
        el.style.webkitLineClamp = '3';
      });
    }
  }
  /* The detail sheets are real A4 pages, not a spill. Pack the appendix blocks
     into sheets that each carry the running header and footer, splitting a long
     table or list across sheets by moving trailing rows rather than letting the
     printer cut one mid-row. If anything here throws, the un-paginated flowing
     sheet is left in place — a readable report either way. */
  function paginate() {
    window.__pag = { iters: 0, splits: 0, ms: 0 };
    var src = document.getElementById('appendix-src');
    var out = document.getElementById('appendix-out');
    var tpl = document.getElementById('cont-template');
    var blocks = document.getElementById('appendix-blocks');
    if (!src || !out || !tpl || !blocks) return;

    var queue = Array.prototype.slice.call(blocks.children);
    if (!queue.length) { src.remove(); return; }

    var body = null;
    function newSheet() {
      var sheet = tpl.content.firstElementChild.cloneNode(true);
      out.appendChild(sheet);
      body = sheet.querySelector('[data-cont-body]');
    }
    function overflows() { return body.scrollHeight > body.clientHeight + 1; }

    /* Move trailing rows of the block's one repeating container into a copy of
       the block, so the heading repeats above the continued rows. */
    function splitTail(block) {
      var cont =
        block.querySelector('[data-split]') || block.querySelector('tbody') || block.querySelector('ul');
      if (!cont || cont.children.length < 2) return null;
      var moved = [];
      // Remove as we measure — reading lastElementChild without detaching it
      // leaves the height unchanged and the loop never terminates.
      var spin = 0;
      while (cont.children.length > 1 && spin++ < 2000 && overflows()) {
        moved.unshift(cont.removeChild(cont.lastElementChild));
      }
      if (!moved.length) return null;

      var rest = block.cloneNode(true);
      var restCont =
        rest.querySelector('[data-split]') || rest.querySelector('tbody') || rest.querySelector('ul');
      while (restCont.firstChild) restCont.removeChild(restCont.firstChild);
      moved.forEach(function (r) { restCont.appendChild(r); });
      var heading = rest.querySelector('[data-block-title]');
      if (heading && !/continued/.test(heading.textContent)) heading.textContent += ' (continued)';
      return rest;
    }

    src.remove();
    newSheet();
    var guard = 0;
    var t0 = Date.now();
    while (queue.length && guard++ < 400 && Date.now() - t0 < 3000) {
      var block = queue.shift();
      body.appendChild(block);
      if (!overflows()) continue;

      if (body.children.length > 1) {
        body.removeChild(block);
        newSheet();
        body.appendChild(block);
        if (!overflows()) continue;
      }
      window.__pag.splits++;
      var rest = splitTail(block);
      if (rest) {
        queue.unshift(rest);
      } else {
        // Unsplittable and taller than a sheet: let this one sheet grow rather
        // than clip it, then start a fresh sheet for what follows.
        body.parentElement.style.height = 'auto';
        if (queue.length) newSheet();
      }
    }

    // If a bound cut the packing short, flush the remainder onto a final sheet
    // that is allowed to grow. Content is never dropped.
    if (queue.length) {
      newSheet();
      body.parentElement.style.height = 'auto';
      while (queue.length) body.appendChild(queue.shift());
    }
    window.__pag.iters = guard;
    window.__pag.ms = Date.now() - t0;

    var sheets = document.querySelectorAll('.sheet');
    var right = ${JSON.stringify(brand.footer.right || '')};
    Array.prototype.forEach.call(sheets, function (sheet, i) {
      var slot = sheet.querySelector('[data-page-num]');
      if (!slot) return;
      var num = 'Page ' + (i + 1) + ' of ' + sheets.length;
      slot.textContent = right ? right + ' · ' + num : num;
    });
  }

  function run() {
    fit();
    try { paginate(); } catch (e) { /* keep the flowing fallback */ }
  }
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run);
  window.addEventListener('beforeprint', fit);
})();
</script>

</body>
</html>
`;

const outPath = resolve(output || `compliance-report-${domain.replace(/[^a-z0-9.-]/gi, '-')}.html`);
writeFileSync(outPath, html, 'utf8');

console.log(`✓ ${outPath}`);
console.log(
  `  ${domain} · ${STATUS_LABEL[status]} · ${cookies.length} cookies (${preConsentCookies.length} pre-consent) · ` +
    `${regsPassing}/${jurisdictions.length} jurisdictions passing · ${criticals.length} critical findings`
);
console.log('  Open in a browser and print to PDF (A4, no margins, background graphics on).');
