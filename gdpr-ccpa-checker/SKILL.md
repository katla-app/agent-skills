---
name: gdpr-ccpa-checker
description: >-
  Deprecated placeholder. This skill was renamed to privacy-compliance-checker.
  It performs no work and should never be invoked for a task. If it is loaded,
  stop and use privacy-compliance-checker instead.
---

# Deprecated — renamed to `privacy-compliance-checker`

This skill no longer does anything. It exists only so that an existing install of
`gdpr-ccpa-checker` resolves on update instead of failing with an unexplained error.

**Use [`privacy-compliance-checker`](../privacy-compliance-checker/SKILL.md) instead.**

It supersedes this skill and covers considerably more:

- GDPR (EU) and CCPA/CPRA (California) — everything this skill used to do
- Japan (APPI), Thailand (PDPA), Indonesia (PDP Law), Singapore (PDPA), Taiwan (PDPA),
  Malaysia (PDPA), Hong Kong (PDPO), Philippines (Data Privacy Act), India (DPDP)

## Migrating

```bash
npx skills remove gdpr-ccpa-checker
npx skills add katla-app/agent-skills --skill privacy-compliance-checker
```

Add `-g` to either command if the original was installed globally.

## For agents

If you loaded this file while looking for a privacy or cookie compliance audit, you have the
wrong skill. Load `privacy-compliance-checker` and follow that instead. Do not attempt an audit
from this file — it contains no checks.
