# Katla Skills

Agent skills for [Claude Code](https://claude.ai/code) and other AI coding agents.

## Skills

| Skill | Description |
|-------|-------------|
| `katla-sdk` | Implement cookie consent and privacy compliance using the [Katla SDK](https://docs.katla.app/sdk) for React, Next.js, Vite, and vanilla JS |
| `privacy-compliance-checker` | Browser-based privacy compliance auditing for any webpage — GDPR, CCPA/CPRA, and nine APAC regimes: Japan (APPI), Thailand (PDPA), Indonesia (PDP Law), Singapore (PDPA), Taiwan (PDPA), Malaysia (PDPA), Hong Kong (PDPO), Philippines (DPA 2012), India (DPDP) |

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
