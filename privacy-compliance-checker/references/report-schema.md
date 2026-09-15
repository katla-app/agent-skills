# Branded report — findings schema

The audit produces a `findings.json`; `scripts/render-report.mjs` turns it into a
branded A4 HTML report. The renderer makes **no compliance judgements of its own** — it
lays out what you give it and derives only arithmetic (counts, percentages, verdict
tallies). If a fact is not in the JSON it will not appear in the report.

```bash
node scripts/render-report.mjs findings.json -o report.html
```

| Flag | Default | Purpose |
|---|---|---|
| `-o`, `--output` | `compliance-report-<domain>.html` | Output path |
| `--brand` | `assets/brand.json` | Brand tokens — swap to white-label |

## Top level

| Field | Type | Required | Notes |
|---|---|---|---|
| `url` | string | yes¹ | Full URL audited |
| `domain` | string | no | Derived from `url` if absent |
| `checkedAt` | ISO 8601 string | no | Defaults to now |
| `preparedFor` | string | no | Defaults to `Data Protection Officer` |
| `reportId` | string | no | Derived stably from url + date if absent |
| `status` | `compliant` \| `attention` \| `noncompliant` | no | **Derived if absent — prefer letting it derive** |
| `scope` | object | recommended | `{ markets: string[], basis: string }` |
| `consentMechanism` | object | recommended | See below |
| `cookies` | array | recommended | See below |
| `thirdParties` | array | no | See below |
| `jurisdictions` | array | recommended | See below |
| `findings` | array | recommended | See below |
| `passed` | string[] | no | Checks that passed, for the appendix |
| `notVerifiable` | string[] | no | Obligations invisible from the browser |

¹ `url` or `domain` — at least one.

`status` derivation: any critical finding or any `fail` verdict → `noncompliant`; else any
warning or `review` verdict → `attention`; else `compliant`. Override it only when you have
a reason the data does not carry.

## `cookies[]`

| Field | Type | Notes |
|---|---|---|
| `name` | string | Cookie name |
| `domain` | string | Setting domain |
| `category` | string | `functional` `personalization` `analytics` `marketing` `security` `unknown` — `necessary`/`essential`/`unclassified` also accepted |
| `thirdParty` | boolean | |
| `preConsent` | boolean | Present before any consent interaction |
| `purpose` | string | One short line |
| `lifetime` | string | Human-readable, e.g. `90 days`, `session`, `400 days` — from the jar's `expires` |
| `httpOnly` | boolean | From the jar. `document.cookie` cannot see HttpOnly cookies at all |
| `secure` | boolean | From the jar. A tracking cookie without this is a finding |
| `sameSite` | string | From the jar, when set |
| `declared` | boolean | Whether the site's own CMP declaration or cookie policy lists this cookie |

`lifetime`, `httpOnly`/`secure` and `declared` each add a column to the appendix cookie table, and
only when at least one cookie carries them — so an audit that could not read the jar renders the
original five-column layout rather than a table full of blanks. Populate them whenever the jar was
readable; a `declared: false` row is what turns "the declaration is incomplete" from an assertion
into something the reader can check.

`functional`, `security`, `necessary` and `essential` count as **essential**. An essential
cookie with `preConsent: true` is reported as exempt, not as a violation — so classify
honestly and the report gets the alarm level right by itself.

## `consentMechanism`

```jsonc
{
  "bannerPresent": true,
  "checks": [                         // first 4 reach page one; order them by importance
    { "label": "Reject as easy as accept", "value": "Yes", "status": "pass" }
  ]
}
```

`status` is `pass` | `fail` | `warn` | `na` | `info` and drives only the colour.

## `jurisdictions[]`

One row per regime **in scope** — never pad it with regimes you did not audit.

| Field | Notes |
|---|---|
| `code` | Short code — `EU`, `US-CA`, `JP`, `TH` … |
| `law` | Shown in the pill — `GDPR`, `CCPA`, `PDPA`, `APPI` … |
| `scope` | Territory shown after the requirement — `EU / EEA`, `Thailand` … |
| `check` | The requirement tested, one line |
| `verdict` | `pass` \| `review` \| `fail` \| `readiness` \| `na` |

Use `readiness` for obligations not yet in force — India's DPDP in particular. It renders in
brand purple as **Readiness**, never as a red failure. See the skill's Important Notes.

The first 7 rows appear on page one; the appendix always carries the full table.

## `findings[]`

| Field | Notes |
|---|---|
| `severity` | `critical` \| `warning` \| `readiness` |
| `title` | Short — clipped to 60 chars on the summary card, full in the appendix |
| `detail` | 1–2 sentences — clipped to 135 chars on the card, full in the appendix |
| `evidence` | What you observed: a console result, a status code, a selector |
| `jurisdictions` | Codes this affects, matching `jurisdictions[].code` |
| `fix` | `cmp` \| `site` \| `legal` — who applies the fix. See below |
| `katlaResolves` | **Superseded by `fix`.** Boolean kept only so older documents still render |

Findings are sorted critical → warning → readiness; the top three reach page one.

### `fix` — who applies it

`fix` drives the **Getting compliant** split, which is omitted entirely when `status` is
`compliant`. It answers one question: whose queue does this land in?

| Value | Heading | Means |
|---|---|---|
| `cmp` | Consent platform | The consent layer resolves it — either configuration the site owner changes in the console or SDK, or a change the platform itself has to ship |
| `site` | Your site | The site's own code, content or server configuration, outside whatever the consent layer controls |
| `legal` | Legal and organisational | Drafting or an organisational decision. No consent tool resolves it |

The line between `cmp` and `site` is *where the fix is applied*, not who is inconvenienced by
it. A cookie policy page generated by the consent platform is `cmp` even though it renders on
the site's domain; a hand-written privacy policy is `site` even when it describes the consent
platform's behaviour. When a single finding has a fix on both sides — a bad platform default
the site can already override — tag it `cmp` and say in `detail` that it is overridable today.

Set it deliberately on every finding. Tagging a policy-drafting or DPO-appointment item `cmp`
produces a report that is wrong in the way the skill's Remediation Guidance warns about. Omit
the field and the finding appears in no group at all.

**Reading older documents.** A finding with no `fix` falls back to `katlaResolves`: `true` →
`cmp`, `false` → `legal`. `false` maps to `legal` rather than `site` because that is what the
old two-column report actually told readers — "these need legal drafting or organisational
action".

**Writing for older readers.** Published reports are rendered by whichever version of the
renderer is deployed, which is not necessarily this one. A renderer that predates `fix` reads
only `katlaResolves`, and a document carrying `fix` alone renders there with no remediation
section at all — not an error, just a silently missing block. So while any consumer might
still be on the old renderer, write **both**:

```jsonc
{ "fix": "cmp",   "katlaResolves": true  }
{ "fix": "site",  "katlaResolves": false }
{ "fix": "legal", "katlaResolves": false }
```

`fix` always wins when both are present, so the pair can never disagree about where a finding
lands. Drop `katlaResolves` once every renderer that reads these documents understands `fix`.

## Layout behaviour

The report is as many A4 sheets as the audit needs.

**Page one** is the fixed summary sheet. When the data overruns it, an inline script nudges it
— section rhythm from 30px down to 24px, then regulation rows move to the detail sheets with
the "+ N MORE OVERLEAF" counter updated, and only a pathological page reaches the three-line
clamp on finding details. It is never crushed to fit.

**Detail sheets** are paginated at load into real A4 pages, each with the running header
(domain, report id) and footer (brand line, `Page N of M`). A block taller than one sheet is
split by moving trailing rows onto the next sheet, with `(continued)` appended to its heading —
so a table or findings list breaks between rows, never through one.

Nothing is ever dropped. Page one sheds content to the detail sheets, and the detail sheets
carry every finding, every jurisdiction, the full cookie and third-party tables, and the
remediation split regardless of what page one shows. If the paginator fails for any reason the
report falls back to a single flowing sheet, which is still complete and readable.

A typical audit is 4–6 pages; a heavy one runs to 9 or more.

## Output

One self-contained HTML file. Open it and print to PDF — A4, margins none, background
graphics on. Fonts load from Google Fonts, so print while online for exact type; the fallback
stack keeps the layout intact offline.

Adding `--artifact` emits the same report as publishable Artifact content — no
doctype/html/head/body wrapper, a domain-led `<title>`, and per-sheet scaling so it reads on a
phone. Publish that file with the Artifact tool to hand the user a link instead of a file. Render
both from the same `findings.json` so the link and the PDF cannot disagree.
