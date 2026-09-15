# Katla Skills

Agent skills for [Claude Code](https://claude.ai/code) and other AI coding agents.

## Skills

| Skill | Description |
|-------|-------------|
| `katla-sdk` | Implement cookie consent and privacy compliance using the [Katla SDK](https://docs.katla.app/sdk) for React, Next.js, Vite, and vanilla JS |
| `privacy-compliance-checker` | Browser-based privacy compliance auditing for any webpage — GDPR, CCPA/CPRA, and nine APAC regimes: Japan (APPI), Thailand (PDPA), Indonesia (PDP Law), Singapore (PDPA), Taiwan (PDPA), Malaysia (PDPA), Hong Kong (PDPO), Philippines (DPA 2012), India (DPDP) |

### Compliance reports

`privacy-compliance-checker` records each audit as a `findings.json` and renders it into a
branded, printable A4 report — a one-page summary for a DPO or client, plus an appendix with
every finding, the full jurisdiction table, the cookie and third-party inventories, and a
remediation split separating what a consent platform fixes from what needs legal work.

Reports separate confirmed issues, checks needing verification, and optional improvements.
An incomplete audit cannot receive a clean verdict. New findings documents include explicit
`assessment` coverage; older documents without coverage render as incomplete unless they contain
confirmed failures. The same renderer must be updated on the report host for identical results.

```bash
node privacy-compliance-checker/scripts/render-report.mjs findings.json -o report.html
```

Zero dependencies, Node 18+. Open the HTML and print to PDF (A4, no margins, background
graphics on). To white-label it, copy `privacy-compliance-checker/assets/brand.json`, change
the tokens, and pass `--brand path/to/brand.json`. Schema:
`privacy-compliance-checker/references/report-schema.md`.

> **Renamed:** `privacy-compliance-checker` was previously `gdpr-ccpa-checker`. A deprecation
> stub is kept under the old name so existing installs resolve on `skills update` rather than
> failing silently — but it performs no checks. Migrate with:
>
> ```bash
> npx skills remove gdpr-ccpa-checker
> npx skills add katla-app/agent-skills --skill privacy-compliance-checker
> ```

## Installation

```bash
# Install all skills
npx skills add katla-app/agent-skills

# Install a specific skill
npx skills add katla-app/agent-skills --skill katla-sdk
npx skills add katla-app/agent-skills --skill privacy-compliance-checker

# Install globally (available in all projects)
npx skills add -g katla-app/agent-skills

# List available skills without installing
npx skills add katla-app/agent-skills --list
```
