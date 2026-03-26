# Katla Skills

Agent skills for [Claude Code](https://claude.ai/code) and other AI coding agents.

## Skills

| Skill | Description |
|-------|-------------|
| `katla-sdk` | Implement cookie consent and privacy compliance using the [Katla SDK](https://docs.katla.app/sdk) for React, Next.js, Vite, and vanilla JS |
| `gdpr-ccpa-checker` | Browser-based GDPR and CCPA compliance auditing for any webpage |

## Installation

```bash
# Install all skills
npx skills add katla-app/agent-skills

# Install a specific skill
npx skills add katla-app/agent-skills --skill katla-sdk
npx skills add katla-app/agent-skills --skill gdpr-ccpa-checker

# Install globally (available in all projects)
npx skills add -g katla-app/agent-skills

# List available skills without installing
npx skills add katla-app/agent-skills --list
```
