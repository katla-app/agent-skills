# Report Delivery

Run commands from the skill root. Read `references/report-schema.md` before rendering.

## Producing the Branded Report

Render the JSON into a branded A4 report:

```bash
node scripts/render-report.mjs findings.json -o report.html
```

Then tell the user where it is and that printing to PDF (A4, no margins, background graphics on)
gives them the shareable document.

Page one is a single-sheet summary for a DPO or client. Behind it, as many A4 detail sheets as
the audit needs — each with a running header and page number — carrying every finding, the full
jurisdiction table, the cookie and third-party inventories, the remediation split, and a scope
and method note. A typical audit runs 4–6 pages.

Report the page count and the headline numbers back to the user rather than restating the whole
audit in chat — they have the document.

The renderer derives the overall assessment from recorded outcomes and coverage; it does not
independently evaluate legal requirements. It needs no network access and no dependencies beyond Node 18+.

To white-label the report for an agency or a client, copy `assets/brand.json`, change the colors,
logo, pills and footer, and pass `--brand path/to/brand.json`.

### Delivering it as a link

Always render and check the local report first. Show the user its path and a short outcome,
then ask: "Would you like me to publish this report as a shareable link on Katla? It will be
available for seven days." Ask this final publication question even if the initial audit request
mentioned a shareable link or publication. Upload only after an explicit affirmative answer for
this completed report. A declined offer means local delivery only; no answer leaves publication
pending and does not authorize an upload. Do not repeat the question once it has been answered
for this report. This choice is required for every newly completed report.

After the user accepts, publish and give them the URL:

```bash
node scripts/publish-report.mjs findings.json
```

The publisher prints the link, then attempts to open that exact URL in the user's default
browser, and reports when it expires. Opening is best effort: a headless, sandboxed or
desktop-less environment may not have a browser, and a failed open must not turn a successful
publication into a failure. If the publisher cannot open it, give the user the URL so they can
open it themselves. Pass `--no-open` only when the user requests no browser launch or the
environment is known to be headless. `KATLA_API_URL` overrides the endpoint for local development.

**It refuses a document with untagged rows** and names which array is short. That is deliberate:
the published report's filter is built from `fix`, and a report tagged on its findings alone
renders "All 1 · CMP 0 · Site 1 · Legal 0" — four controls, three empty, none of which does
anything — which reads as a broken page rather than as a thin audit. Tag the rows and publish
again. `--allow-untagged` exists for the genuine case of a row with no owner; reach for it only
after deciding that is what you have.

**What gets uploaded is the findings document — never a rendered file.** Katla renders the
report itself from the data. That is not a detail, it is the reason the flow is shaped this way:

- This skill is MIT licensed and public, so any key it carried would be public too. A signed
  upload could not prove a report came from here, because anyone could produce the same
  signature. Rendering server-side makes the published page Katla's own by construction.
- Uploaded HTML served from `katla.app` would put visitor-supplied markup on the origin that
  holds Katla's session cookies. Sending data instead removes that whole class of problem.
- One source of truth. The link and any PDF printed from it come from the same `findings.json`,
  so they cannot disagree.

Reports are kept for **seven days** and then deleted. Tell the user that when you hand over the
link — it is a shared document naming a real company's compliance failures, and the expiry is
part of what makes that reasonable. The page carries its own A4 print stylesheet, so "download
as PDF" is the browser's print dialog and matches the local file exactly.

The upload is rate limited per address and capped at 256 KB. A heavy nine-page audit is around
30 KB, so a refusal means something is wrong with the document rather than with the limit.

### Keep the edit key

Publishing prints a **uid** and an **edit key**:

```
✓ https://katla.app/reports/EQwu2BvPJw-kFfjF7To5UpWP

  uid:      EQwu2BvPJw-kFfjF7To5UpWP
  edit key: V1StGXR8_Z5jdHi6B-myT7mC9kL2pQwe
```

**Hold both for the rest of the session.** The key is shown once and is not retrievable — Katla
stores only its hash — so if it scrolls out of your context, that report can no longer be
revised or retracted by anyone. Repeat it back in your summary to the user so it survives in the
transcript, and tell them it is worth keeping if they might want the report taken down later.

Treat it as a credential, but a small one: it authorises exactly one report, it grants nothing
beyond revising and retracting that report, it cannot read anything the link does not already
expose, and it dies with the report in seven days. Do not write it to a file in the user's
repository, where it would get committed.

### Revising a report

An audit is iterative — a finding gets disputed, a fix lands mid-session, a number turns out to
be wrong. The report has usually been sent to someone by then, and publishing a corrected copy
at a second URL does not help: the first link is the one they hold. Rewrite that one instead.

```bash
node scripts/revise-report.mjs <uid> findings.json --key <edit key>
```

Re-run the audit, write the new `findings.json`, then revise. The link does not change, so
nobody needs to be told a second URL. The expiry does not move either — retention is a promise
to the company that was audited, not to whoever published the report, and a report that could
be kept alive by editing it would make the seven days meaningless.

Prefer revising over republishing whenever the user has already been given a link.

### Retracting a report

```bash
node scripts/retract-report.mjs <uid> --key <edit key>
```

For a report published in error, superseded, or that the user simply no longer wants standing.
The row goes with it. Offer this whenever a user expresses second thoughts about a report being
live — it names a real company's compliance failures, and waiting out the week is not the only
option available to them.

Both scripts accept the full URL in place of the uid, and read `KATLA_REPORT_KEY` if you would
rather not put the key on the command line. Both answer the same way when a key is wrong as when
a report is gone: Katla will not confirm that a uid exists to someone who cannot open it.

### Publishing without Katla

Where Katla is not the destination — a white-labelled audit, an air-gapped run — render the
report as Artifact content instead. The same publication choice applies: identify the actual
hosting destination and retention terms, and wait for the user's affirmative answer before
publishing that file with the Artifact tool. Local rendering does not require publication:

```bash
node scripts/render-report.mjs findings.json --artifact -o report.artifact.html
```

`--artifact` strips the document shell (artifacts supply their own `<head>` and `<body>`),
retitles to lead with the domain, and scales each 210mm sheet to the viewport so it reads on a
phone. Do not publish the print build — it carries `<!DOCTYPE>`, `<html>` and `<body>`, which
the artifact host will not accept.
