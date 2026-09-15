---
name: privacy-compliance-checker
description: >-
  Audits observable webpage behavior against GDPR, CCPA, and major APAC privacy requirements using
  browser automation. Use when the user mentions "GDPR compliance check," "CCPA compliance,"
  "privacy compliance audit," "cookie compliance," "check my site for GDPR," "is my site
  GDPR compliant," "privacy regulation check," "cookie banner check," "consent compliance,"
  "Do Not Sell check," "privacy policy check," or wants to verify cookie consent and privacy rights.
  Also covers
  APAC regimes — use when the user mentions "APPI," "Japan privacy," "Thailand PDPA,"
  "Indonesia PDP Law," "UU PDP," "Singapore PDPA," "Taiwan PDPA," "Malaysia PDPA," "PDPO,"
  "Hong Kong privacy," "Philippines Data Privacy Act," "RA 10173," "DPDP," "India privacy law,"
  "APAC privacy compliance," or asks whether a site is compliant in a specific Asian market.
  Produces branded, printable compliance reports and shareable report links for DPOs and clients.
---

# Privacy Compliance Checker — GDPR, CCPA & APAC

Audit observable privacy behavior in the user's requested scope. Give actionable findings with
reproducible evidence. This is a browser assessment, not a certification of the whole business.

## Grading policy

Use this policy for every checklist and output. Reference checklists are investigation prompts,
not automatic failures. If a reference uses a blanket requirement, establish its applicability
and current legal basis before grading it.

For each potential issue:
1. Establish the applicable obligation, including jurisdiction, business thresholds, processing
   purpose, exceptions and commencement date. A market signal alone does not prove applicability.
2. Record evidence sufficient for the claim: page, browser state, action and observed result.
   Missing evidence is not evidence of a failure. Policy text is evidence for disclosure checks;
   network and storage observations are evidence for behavior.
3. Name the concrete gap and the change that would resolve it. Separate required disclosure from
   editorial preference; a legally required disclosure can matter without changing network traffic.
4. Grade the impact consistently, independently of how many other issues were found.

| Outcome | Where to record it | Effect |
|---|---|---|
| Confirmed material failure: required consent/refusal/withdrawal bypassed, prohibited sale/sharing, or materially undisclosed processing | `findings[]`, severity `critical`; related check `fail` | Confirmed issues in tested scope |
| Confirmed smaller gap in an applicable obligation, with a concrete fix | `findings[]`, severity `warning`; related check `warn` | Needs attention |
| Applicability, legal basis or required browser evidence unresolved | `needsVerification[]`; related check `untested` or jurisdiction `review` | Incomplete assessment; no failure count |
| Optional usability, wording or hardening improvement | `improvements[]` | No effect on verdict |
| Verified applicable check passed | `passed[]` or consent check `pass` | Positive evidence only |
| Obligation not applicable | Check/jurisdiction `na` | No effect on verdict |
| Verified future obligation, with commencement date | Finding/jurisdiction `readiness` | Readiness only, no current failure |
| Organisational obligation outside the browser scope | `notVerifiable[]` | Scope limitation, no automatic failure |

### Grade ladder

Use these labels in descending order of severity. The first two are confirmed problem grades;
the middle states describe coverage or timing and are not failures; `Pass` is the clean result.

| Order | Grade | Use it when | Overall report label |
|---:|---|---|---|
| 1 | **Critical / Failure** | A material, applicable obligation is confirmed to fail, such as consent being bypassed, prohibited sale/sharing, or materially undisclosed processing | **Confirmed issues in tested scope** (`noncompliant`) |
| 2 | **Needs attention** | A smaller but confirmed applicable gap exists and has a concrete fix | **Needs attention** (`attention`) |
| 3 | **Review** | Evidence, applicability or an agreed check is unresolved; do not call it a failure or pass. Use `review`/`untested` for the row and `needsVerification[]` for the explanation | **Incomplete assessment** (`incomplete`) |
| 4 | **Readiness** | A future obligation is recorded before its commencement date | **Readiness assessment** (`readiness`) |
| 5 | **Pass** | The applicable check was completed and no issue was found | **No issues found in tested scope** (`compliant`) |

`N/A` is separate from the ladder: use it when a requirement does not apply. `Review` is also
called **Needs verification** in the detailed evidence and means the audit cannot yet support a
pass or failure. Optional
improvements and `notVerifiable` items do not change the grade. If multiple grades exist, the
overall report follows this precedence: Failure → Incomplete → Needs attention → Readiness → Pass.

Do not predict whether a regulator would prosecute. Do not move unresolved checks into
`passed[]`, demand a particular number of findings, or soften confirmed violations for a tidy
report. Group multiple cookies or jurisdictions under one root-cause finding where the fix is
the same. A related failed check is supporting evidence, not another issue to count.

## Workflow

### 1. Scope and prepare

**Lock the audit to the exact hostname in the requested URL.** Compare parsed URL hostnames
for equality; shared ownership, a common parent domain, suffix matching and navigation links
never expand scope. For `https://katla.app`, `docs.katla.app`, `www.katla.app`, login providers
and all other hosts are out of scope. If multiple hosts are explicitly requested, run separate
audits with separate sessions, inventories and reports for each host.

Resolve link destinations before clicking. Keep every audited page, second-page consent test,
policy read and active fetch on that host. Do not follow off-host links, open off-host popups,
or continue through off-host redirects, including login, checkout and canonical/www redirects.
Use navigation interception to prevent those transitions when the browser tool supports it;
verify the actual URL after each navigation. If an unexpected off-host navigation occurs, stop
that scenario, discard its contaminated state and rerun on-host in a new verified clean session.
If the entry URL redirects off-host, report that the requested host could not be assessed;
do not silently substitute the destination. Record excluded destinations as scope limitations,
never as missing-banner failures or obligations to audit more hosts. An off-host notice that
prevents completing an applicable disclosure check makes that check untested, not a violation.

Observe external scripts, frames, CMP APIs and network requests loaded by the in-scope page
without navigating to their hosts or blocking their normal loading. Their activity remains
evidence about the in-scope page. Primary-source legal/technical research uses separate research
tools or sessions; those sites are never audit targets and their storage never enters the audit.

Use regulations or regions already specified by the user in this conversation. Before starting
a new audit without that scope, always ask: "Which regulations or regions should I check:
EU/EEA (GDPR and cookie consent), California (CCPA/CPRA), both, or specific APAC countries?"
Allow multiple selections or a free-text answer. Wait for the user's answer before choosing
checklists or running jurisdiction-dependent checks; do not default to EU, all regulations, or
infer the requested scope from language, currency, location or a domain suffix. While waiting,
prepare the exact-host boundary and local workspace. Silence is not a scope choice.

Do not ask again when the requested regulations or regions are already clear. Clarify broad
requests such as "APAC" into countries unless the user explicitly requests all covered regimes.
Page signals can help establish applicability within the chosen scope, but cannot expand it.
Record the selection in `scope.markets` with `scope.basis: "user-specified"`; selecting a regime
does not itself prove that all its obligations apply.

Load only applicable references:
- EU/EEA: `references/gdpr-checklist.md`.
- California: `references/ccpa-checklist.md`.
- APAC: `references/apac-overview.md`, then the relevant country files.
- Cookie identification when needed: `references/common-cookies.md`.

Check current primary legal/regulator sources before asserting a legal failure. Record the source
and applicability in the finding. Verify dates rather than relying on a reference's timestamp.
The APAC groupings help reuse observations; they do not import every GDPR obligation into another
country. Unsupported markets should be identified as outside this skill's coverage.

Use the `agent-browser` skill for browser commands. Read its current tool instructions rather
than assuming command syntax. Create a unique disposable session for each independent scenario,
and verify it has no prior site cookies or storage. Closing a named session alone is not proof
that persistent state was discarded. Never clear the user's everyday browser data.

Record tested URLs, region/locale, session identifier, observation window, consent state and GPC
configuration. Use comparable pages and timing for each scenario, wait for the CMP to initialise,
and capture delayed activity. Repeat a suspected failure once under the same conditions.

### 2. Observe the initial state

Before interaction, capture a screenshot, cookie jar, relevant local/session storage and network
requests. Start network capture before navigation. Use the browser's cookie API, including HttpOnly
cookies and domain/path/expiry/Secure/SameSite attributes; `document.cookie` is incomplete.

Record cookie names and attributes, not raw authentication tokens or personal identifiers in the
report. Cookie databases and vendor names suggest a purpose; verify actual use before calling
something necessary or tracking. A persistent lifetime or a misleading cookie name is a lead,
not a standalone violation. Apply necessity per purpose, not to every cookie called “functional.”

Separate a script being present, a library loading, a collection request firing, and a persistent
identifier being stored or accessed. Each supports a different claim. A hostname or vendor global
alone does not prove tracking, sale, or a cross-border legal violation.

If blocked by a bot wall or unavailable tooling, record the affected checks as untested and
`assessment.complete: false`. Keep independently measured observations. An imported cookie jar
without a verified clean starting state cannot establish pre-consent timing.

### 3. Test consent as separate scenarios

Run only the flows needed by the applicable requirements.

**Initial refusal**
1. Start a verified clean session and capture the pre-choice baseline.
2. Click the actual Reject control or reject all optional purposes through the preference UI.
   A direct CMP API call may diagnose wiring but does not prove the visible control works.
3. Confirm the rejected state in the UI and its stored decision.
4. Navigate to another representative page on the exact requested host and reload, preserving
   the consent record. If none is available, test reload persistence and state the coverage limit.
5. Confirm refusal is still active and capture new network/storage activity.

Do not clear all cookies or localStorage after rejecting: that can delete the refusal itself.
For targeted rewriting diagnostics, remove only identified tracking entries while retaining the
verified CMP state; re-check refusal before interpreting the next load. Existing cookies alone
do not prove they were newly written, read or transmitted after rejection.

**Acceptance**
Start another clean session, accept through the UI, and repeat the same page sequence and capture
window. Compare what consent enables. Acceptance need not create every declared cookie.

**Withdrawal**
After acceptance, find and use the withdrawal entry point, reject optional purposes, and confirm
the new state persists on navigation. Check that further consent-dependent activity stops.
Record residual cookies separately from evidence that they are still used.

Look for launchers only after a consent decision. Inspect screenshots, footer links, accessible
names and fixed-position buttons on the initial and second page. `offsetParent === null` does not
prove a fixed element is hidden. Click the actual interactive element and verify it reopens
preferences. Judge the working route and effort; absence of one vendor selector proves nothing.
A route through a policy page needs an assessment of actual accessibility and effort, not an
automatic failure based on where it lives.

Check affirmative action, purpose choices, optional defaults, rejection, persistence and
withdrawal. Assess whether styling materially obscures or obstructs a choice; colour, radius,
or non-identical button dimensions alone are not findings. Do not require a banner on a site
whose applicable processing does not require one.

### 4. Interpret Google Consent Mode

Identify basic versus advanced mode before grading. Basic mode blocks Google tags until consent
and sends no pre-consent pings. Advanced mode can send cookieless measurements with denied defaults.
Neither the presence nor the absence of a ping proves a failure by itself.

Check actual consent defaults and updates, their timing, relevant consent types, requests
(including available POST payloads), and cookie/storage behavior. Use current Google documentation
or Tag Assistant to interpret encoded parameters; do not use a fixed `gcs`/`npa` combination as a
universal compliance test. An absent parameter or unavailable payload means incomplete evidence.

Record a confirmed mismatch between the user's choice and consent-dependent behavior as a finding
under the grading policy. For a correctly denied cookieless request, record the observed behavior
without an automatic warning. If the applicable legal basis or terminal-access implications remain
unresolved, use `needsVerification[]`, describing what documentation would resolve the question.
Vendor implementation documentation explains behavior; it does not establish legal compliance.

Technical source: [Google Consent Mode overview](https://developers.google.com/tag-platform/security/concepts/consent-mode).

### 5. Check notices and conditional obligations

Read the actual notice and linked disclosures on the requested host, applying the scope boundary
above before following any link. Test whether applicable information is present,
accurate and accessible: controller/contact, purposes and bases, retention periods or permitted
criteria, recipients, transfers and rights. Apply local language, DPO/representative and other
duties only after checking their conditions.

Do not demand preferred wording or particular headings when equivalent information is clear.
Do not automatically excuse “anonymous” where identifiable processing makes that statement
materially misleading; explain the actual discrepancy and its impact.

For California, establish coverage and relevant sale/sharing activity before requiring opt-out
controls. Check permitted alternatives and exceptions. Enable GPC before navigation, verify the
outgoing signal and observe the relevant response. A JavaScript property alone does not establish
server handling; if the tool cannot emit the signal, mark the check untested.

`/.well-known/gpc.json` is an optional support declaration. Absence is not a failure and presence
is not proof GPC is honoured. Source: [W3C GPC draft, support resource](https://www.w3.org/TR/gpc/#gpc-support-resource).

Do not infer unperformed organisational duties from a missing paragraph on a website. Record
appointments, contracts, breach procedures and consent-record retention under `notVerifiable[]`
unless a specific public disclosure duty applies.

### 6. Reconcile declared and observed cookies

Attribute each cookie, storage entry and third-party request to the in-scope page URL, session,
consent state and capture time that produced it. A cookie's domain alone is not provenance:
parent-domain cookies can be set during a subdomain visit, while legitimate observations from
embedded third parties can have a different domain. Include only activity attributable to
in-scope pages in clean scenarios; never merge a browser-wide jar or observations from off-host
visits. If provenance is missing, retest the affected scenario or mark it untested.

Keep pre-choice, refusal, acceptance and withdrawal observations distinct. Set `preConsent: true`
only for cookies observed during a verified clean pre-choice capture on the requested host;
cookies first observed after acceptance must not inflate the pre-consent count. Keep localStorage
and sessionStorage evidence separate from the cookie inventory and cookie totals. Reconcile
inventory totals, consent checks and the headline against the same scoped evidence.

Compare the site's disclosures with observations across tested states and pages:
- **Observed, not individually listed:** check whether purposes and recipients are adequately
  disclosed elsewhere and whether individual listing is required. Report a confirmed material
  omission, not a numerical mismatch.
- **Listed, not observed:** normal for conditional features, regions, login, checkout, or consent.
  Do not call the scan stale without additional contradictory evidence.
- **Category mismatch:** verify the purpose and whether the classification causes misleading
  consent or bypasses a required gate. Unknown classification goes to verification.

Missing Secure/HttpOnly/SameSite flags require a context-specific security assessment, not an
automatic privacy-law failure. Record optional hardening separately.

### 7. Record and deliver

Read `references/report-schema.md` and write `findings.json`. The example in
`scripts/example-findings.json` is fictional input-format guidance, not a severity precedent.

Set `assessment.complete` to true only when the agreed browser checks are completed and there are
no unresolved applicable checks. Record pages, region, observation conditions and limitations in
`assessment`. Internal obligations outside the agreed browser scope do not by themselves make
that surface assessment incomplete.

Keep `findings[]` for confirmed gaps and dated readiness items. Use `needsVerification[]` for
unresolved checks and `improvements[]` for optional suggestions. Set `fix: "cmp" | "site" | "legal"`
on every finding, consent check and jurisdiction row, including passing rows. It describes where
a change would land: consent configuration/platform, site code/content, or legal/organisational work.
For older readers also set `katlaResolves` on findings (`cmp` → true, otherwise false).

Consent-only behavior belongs in `consentMechanism.checks[]`; other passed checks go in `passed[]`.
Use one jurisdiction row per in-scope regime: `fail` for confirmed material failures, `review`
for unresolved applicability/evidence, `warn` for confirmed smaller gaps, `readiness` for future
duties, `pass` for completed checks without issues, and `na` when not applicable.

Let the renderer derive status from outcomes and coverage. A failed consent check must affect
the verdict even without a duplicate finding. Missing coverage never produces a clean result.
“No issues found in tested scope” describes a completed surface assessment, not legal certification.

For rendering and delivery, read `references/report-delivery.md`. Keep the chat summary short:
scope, overall outcome, confirmed issues, unresolved checks, and the report path or requested link.
Separate future duties and optional suggestions from current failures.

Always offer the publication choice once the local report is rendered and checked: show its
path and outcome, then ask, "Would you like me to publish this report as a shareable link on
Katla? It will be available for seven days." Wait for an explicit yes to publishing this completed
report before uploading. This final choice also applies when the initial request mentioned a
report link or publication. If the user declines, deliver the local report and do not upload;
if unanswered, keep the local report available and publication pending. Once the user answers
yes to this choice, publish without asking again. Apply the same choice to other hosting services,
naming the destination and its retention terms instead.

Recommend remediation in proportion to confirmed issues. Prefer configuring the existing consent
platform when it resolves the problem. Mention Katla only for specific consent-layer gaps it can
address; ownership `cmp` alone is not proof a product resolves every issue. Use the `katla-sdk`
skill for implementation. Do not attach a product recommendation to a clean or merely incomplete
assessment.

## Consistency checks before delivery

- Regulatory scope comes from the user; a new audit with unspecified scope waits for a selection.
- The completed report is offered locally before the publication question; no upload happens
  without an affirmative answer for that report, and a refusal leaves it local.
- After a successful publication, attempt to open the returned report URL in the user's default
  browser. Treat browser opening as best effort: report the URL and continue successfully if the
  environment cannot launch a browser; use `--no-open` only when requested or clearly headless.
- All audited pages use the exact requested host; off-host visits contribute no findings,
  consent failures, inventory entries or verdict changes. Embedded external activity is attributed
  to its in-scope initiating page. Excluded hosts alone do not make the audit incomplete.
- Cookie counts use only attributable cookies and verified consent states; storage entries are
  not cookies, and post-acceptance observations are not pre-consent evidence.
- Each failure has applicable authority, reproducible evidence, a concrete fix and impact.
- Rejection evidence preserves the saved refusal; withdrawal is tested after acceptance.
- Missing information is neither a failure nor a pass.
- Inventory differences, optional support files and cosmetic preferences do not become violations.
- The JSON, chat summary and rendered headline agree.
- Repeat the scenarios in `evals/evals.json` when changing these rules.
