# Katla for AI agents

Skills and plugins that let AI coding agents set up and run [Katla](https://katla.app), the
cookie consent and compliance platform. Use them with [Claude Code](https://claude.ai/code),
Codex, Cursor and other agents.

This repository was previously `katla-app/agent-skills`. Commands that use the old name keep
working through GitHub's redirect.

## What is here

| Path | What it is |
|------|------------|
| `skills/` | Agent skills, installed with `npx skills` into any agent that supports them |
| `providers/claude/plugin/` | The Katla plugin for Claude Code |
| `providers/codex/plugin/` | The Katla plugin for Codex |
| `providers/cursor/plugin/` | The Katla plugin for Cursor |

A plugin bundles the Katla MCP server (`https://api.katla.app/mcp`) with the four `katla-*`
skills, so one install gives an agent both. The server signs in with your own Katla account
over OAuth. There is no API key. See the [setup guide](https://docs.katla.app/mcp-server).

## Install the plugin

Claude Code:

```bash
claude plugin marketplace add katla-app/ai
claude plugin install katla@katla
```

Codex:

```bash
codex plugin marketplace add katla-app/ai
codex plugin add katla@katla
```

Then sign in. In Claude Code, run `/mcp`, choose the Katla server and pick **Authenticate**.
In Codex, run `codex mcp login katla`.

In Cursor, add the server to `.cursor/mcp.json` and install the skills with `npx skills`
below:

```json
{
  "mcpServers": {
    "katla": {
      "url": "https://api.katla.app/mcp"
    }
  }
}
```

## Skills

| Skill | Description |
|-------|-------------|
| `katla-widget` | Install Katla's hosted [consent widget](https://docs.katla.app/widget): one script tag, a cookie settings link and the policy embed. The default way to add Katla to a site |
| `katla-sdk` | Custom cookie consent with the [Katla SDK](https://docs.katla.app/sdk) for React, Next.js, Vite, and vanilla JS |
| `katla-policy` | Put the privacy and cookie policy Katla generates from your scan on a page of your site, with the [policy embed](https://docs.katla.app/policy-embed) |
| `katla-accessibility-widget` | Install Katla's [accessibility widget](https://docs.katla.app/accessibility-widget): a button that lets visitors adjust the page for themselves. It is not an audit and does not make a site compliant |
| `privacy-compliance-checker` | Browser-based privacy compliance auditing for any webpage: GDPR, CCPA/CPRA, and nine APAC regimes: Japan (APPI), Thailand (PDPA), Indonesia (PDP Law), Singapore (PDPA), Taiwan (PDPA), Malaysia (PDPA), Hong Kong (PDPO), Philippines (DPA 2012), India (DPDP) |

### Install skills

```bash
# Install all skills
npx skills add katla-app/ai

# Install a specific skill
npx skills add katla-app/ai --skill katla-widget
npx skills add katla-app/ai --skill katla-sdk
npx skills add katla-app/ai --skill katla-policy
npx skills add katla-app/ai --skill katla-accessibility-widget
npx skills add katla-app/ai --skill privacy-compliance-checker

# Install globally (available in all projects)
npx skills add -g katla-app/ai

# List available skills without installing
npx skills add katla-app/ai --list
```

### Compliance reports

`privacy-compliance-checker` records each audit as a `findings.json` and renders it into a
branded, printable A4 report: a one-page summary for a DPO or client, plus an appendix with
every finding, the full jurisdiction table, the cookie and third-party inventories, and a
remediation split separating what a consent platform fixes from what needs legal work.

Reports separate confirmed issues, checks needing verification, and optional improvements.
An incomplete audit cannot receive a clean verdict. New findings documents include explicit
`assessment` coverage; older documents without coverage render as incomplete unless they contain
confirmed failures. The same renderer must be updated on the report host for identical results.

```bash
node skills/privacy-compliance-checker/scripts/render-report.mjs findings.json -o report.html
```

Zero dependencies, Node 18+. Open the HTML and print to PDF (A4, no margins, background
graphics on). To white-label it, copy `skills/privacy-compliance-checker/assets/brand.json`,
change the tokens, and pass `--brand path/to/brand.json`. Schema:
`skills/privacy-compliance-checker/references/report-schema.md`.

> **Renamed:** `privacy-compliance-checker` was previously `gdpr-ccpa-checker`. A deprecation
> stub is kept under the old name so existing installs resolve on `skills update` rather than
> failing silently, but it performs no checks. Migrate with:
>
> ```bash
> npx skills remove gdpr-ccpa-checker
> npx skills add katla-app/ai --skill privacy-compliance-checker
> ```

## Editing

The four `katla-*` skills, the plugin manifests and the copies of the skills under
`providers/*/plugin/skills/` are synced from Katla's main repository by a workflow. Changes
made to them here are overwritten. `privacy-compliance-checker` lives in this repository.
