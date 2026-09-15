# Branded report — findings schema

The audit produces a `findings.json`; `scripts/render-report.mjs` turns it into a
branded A4 HTML report. The renderer applies the status aggregation rules below to recorded
outcomes and coverage; it does not independently decide legal applicability or evidence quality.
If a fact is not in the JSON it will not appear in the report.

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
| `url` | string | yes¹ | Requested full audit URL; never replace it with an off-host redirect destination |
| `domain` | string | no | Exact requested hostname, derived from `url` if absent; retain subdomains such as `www` |
| `checkedAt` | ISO 8601 string | no | Defaults to now |
| `preparedFor` | string | no | Defaults to `Data Protection Officer` |
| `reportId` | string | no | Derived stably from url + date if absent |
| `status` | string | no | Legacy input, ignored; derived from outcomes and coverage to prevent contradictory overrides |
| `assessment` | object | yes for new reports | `{ complete: boolean, pages: string[], region: string, conditions: string, limitations: string[] }` |
| `scope` | object | recommended | `{ markets: string[], basis: string }` |
| `consentMechanism` | object | recommended | See below |
| `cookies` | array | recommended | See below |
| `thirdParties` | array | no | See below |
| `jurisdictions` | array | recommended | See below |
| `findings` | array | recommended | See below |
| `passed` | string[] | no | Checks that passed, for the appendix |
| `notVerifiable` | string[] | no | Obligations invisible from the browser |
| `needsVerification` | object[] | no | `{ title, detail, evidence?, jurisdictions? }`; explain the unresolved check and what would resolve it |
| `improvements` | string[] | no | Optional suggestions; never counted as failures or warnings |

¹ `url` or `domain` — at least one.

`status` is derived in this order:
1. Any critical finding, failed jurisdiction, or failed consent check → `noncompliant`, displayed
   as **Confirmed issues in tested scope**, even if other checks remain incomplete.
2. Incomplete assessment → `incomplete`, displayed as **Incomplete assessment**.
3. Any confirmed warning finding, consent `warn`/`warning`, or jurisdiction `warn` → `attention`.
4. Only future obligations assessed → `readiness`, displayed as **Readiness assessment**.
5. Otherwise → `compliant`, displayed as **No issues found in tested scope**.

The user-facing grade ladder is: **Critical / Failure** → **Needs attention** → **Review
(Needs verification)** → **Readiness** → **Pass**. `N/A` is separate and means the requirement
does not apply. A `review` or `untested` row makes the assessment incomplete until resolved; it
is not a confirmed failure or warning. The derived status precedence above is authoritative when
a report contains more than one outcome; optional improvements and `notVerifiable[]` do not
affect it.

Completion requires `assessment.complete: true`, some recorded current check results or readiness
results, no `needsVerification` entries, no jurisdiction `review`/`partial`/`untested`, and no
consent `review`/`untested`. An empty report cannot pass. Legacy reports without explicit coverage
render incomplete unless they already contain confirmed failures. `status` cannot override this.

Set `assessment.complete` only after completing the agreed browser scope. Record tested pages,
region/locale, clean session identifiers, observation windows and consent/GPC conditions.
Limitations can describe excluded internal duties without making a surface assessment incomplete;
blocked or unresolved checks inside the agreed scope require `complete: false` and verification
entries. Coverage is displayed even when confirmed failures take precedence in the headline.
Warnings still appear and remain counted when the headline is incomplete.

Every URL in `assessment.pages` must have the exact requested hostname. Record skipped off-host
destinations in `assessment.limitations`, not as audited pages or failed consent checks. Never
aggregate separate hosts into one report. Excluding another host does not itself make coverage
incomplete; an applicable check blocked by an off-host-only notice or redirect remains untested.
Findings, consent checks, jurisdiction verdicts and inventory totals must all use this same scope.

## `cookies[]`

| Field | Type | Notes |
|---|---|---|
| `name` | string | Cookie name |
| `domain` | string | Setting domain |
| `category` | string | `functional` `personalization` `analytics` `marketing` `security` `unknown` — `necessary`/`essential`/`unclassified` also accepted |
| `thirdParty` | boolean | |
| `preConsent` | boolean | Observed in a verified clean pre-choice capture on the requested host; not inferred from an aggregate jar |
| `purpose` | string | One short line |
| `lifetime` | string | Human-readable, e.g. `90 days`, `session`, `400 days` — from the jar's `expires` |
| `httpOnly` | boolean | From the jar. `document.cookie` cannot see HttpOnly cookies at all |
| `secure` | boolean | From the jar. Assess purpose and exposure before raising a security finding |
| `sameSite` | string | From the jar, when set |
| `declared` | boolean | Whether the site's own CMP declaration or cookie policy lists this cookie |

`lifetime`, `httpOnly`/`secure` and `declared` each add a column to the appendix cookie table, and
only when at least one cookie carries them — so an audit that could not read the jar renders the
original five-column layout rather than a table full of blanks. Populate them whenever the jar was
readable; a `declared: false` row is what turns "the declaration is incomplete" from an assertion
into something the reader can check.

The inventory groups `functional`, `security`, `necessary` and `essential` together. This display
is not a legal exemption decision: verify the actual necessary purpose before using these labels.
An unknown cookie or pre-consent presence alone does not establish a legal failure.

Retain page URL, session, consent state and capture time in the supporting audit evidence for
each inventory entry. Include third-party cookies only when attributable to an in-scope page;
cookie-domain matching alone neither includes nor excludes an observation. Exclude cookies from
off-host visits and retest contaminated sessions. Cookies first observed after acceptance do not
count as pre-consent. Local/session storage belongs in behavioral evidence, not `cookies[]`.
Apply the same provenance rule to `thirdParties[]`: observed embedded requests are in scope,
hosts discovered only by visiting another site are not. The inventory and headline must agree
with the consent checks for the requested host.

## `consentMechanism`

```jsonc
{
  "bannerPresent": true,
  "checks": [                         // first 4 reach page one; order them by importance
    { "label": "Reject as easy as accept", "value": "Yes", "status": "pass", "fix": "cmp" }
  ]
}
```

`status` is `pass` | `fail` | `warn` | `untested` | `na` | `info`.
It affects both colour and aggregate status. Use `untested` for missing required evidence,
`warn` for a confirmed smaller gap, and `info` for neutral observations. Legacy `warning` and
`review` are accepted as warning and unresolved respectively. Do not put optional suggestions here.

`fix` means the same thing it means on a finding: where the work lands if this check is not
passing. Tag every check, passing ones included — the web report lets a reader filter the whole
page down to the queue they own, and a check that drops out of the filter because nobody tagged
it looks like a check that does not apply to them.

**Only consent-mechanism checks belong here.** This array renders under a heading that reads
*Consent banner*, so every row in it is a claim about the banner: whether one exists, reject
parity, granular unticked categories, storage and withdrawal, Consent Mode signals. It is the
only array that takes a label, a value and a status, which makes it tempting to use for every
verification in the audit — and a *Consent banner* section listing a policy's last-updated date
or a controller's postal address tells the reader the audit does not know what it is looking at.
Anything else that passed goes in `passed[]`; anything wrong goes in `findings[]`.

## `jurisdictions[]`

One row per regime **in scope** — never pad it with regimes you did not audit.

| Field | Notes |
|---|---|
| `code` | Short code — `EU`, `US-CA`, `JP`, `TH` … |
| `law` | Shown in the pill — `GDPR`, `CCPA`, `PDPA`, `APPI` … |
| `scope` | Territory shown after the requirement — `EU / EEA`, `Thailand` … |
| `check` | The requirement tested, one line |
| `verdict` | `pass` \| `warn` \| `review` \| `fail` \| `readiness` \| `untested` \| `na`; `review` means unresolved, not a confirmed smaller gap |
| `fix` | `cmp` \| `site` \| `legal` — **required**, who would apply the work. Same test as on a finding. `publish-report.mjs` refuses a document missing it |

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
| `requirement` | Applicable obligation and relevant conditions; required for new confirmed findings |
| `source` | Current primary-source URL supporting the obligation; required for new confirmed findings |
| `jurisdictions` | Codes this affects, matching `jurisdictions[].code` |
| `fix` | `cmp` \| `site` \| `legal` — who applies the fix. See below |
| `katlaResolves` | **Superseded by `fix`.** Boolean kept only so older documents still render |

Findings are sorted critical → warning → readiness; the top three reach page one.
Use `critical` only for confirmed material failures and `warning` for confirmed smaller gaps.
Unresolved applicability or observations go in `needsVerification[]`, optional advice in
`improvements[]`. Reuse evidence across jurisdictions without duplicating one root-cause finding.
The renderer displays requirement and source with the finding's evidence in the appendix.

### `fix` — who applies it

Findings carry it, and so do `consentMechanism.checks[]` and `jurisdictions[]`. One vocabulary
across all three, because the reader filters across all three: a platform engineer narrowing the
report to `cmp` should see the consent checks and the regulation rows that are theirs, not only
the findings. An untagged row is not an error — it simply never matches a narrowed filter, which
is why tagging the passing ones matters as much as the failing ones.

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
