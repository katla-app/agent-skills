# Philippines — Data Privacy Act of 2012 (RA 10173)

## Snapshot

| | |
|---|---|
| Law | Data Privacy Act of 2012 (RA 10173) and its Implementing Rules and Regulations |
| Regulator | National Privacy Commission (NPC) |
| Consent model | **Consent-centric**, especially for sensitive personal information |
| Cookie banner | **Yes**, where cookies process personal information |
| Penalties | Criminal (imprisonment) plus NPC administrative fines |

## The consent definition to test against

Consent must be a **freely given, specific, informed indication of will**, and must be
**evidenced by written, electronic or recorded means**. It must be time-bound to the declared
purpose and withdrawable. A silent, implied, or "by continuing to browse" consent does not meet
this definition — that pattern is a clear finding on a Philippine site.

Sensitive personal information (s.13) is narrower than the general lawful-processing criteria:
consent must generally be obtained, with only limited statutory exceptions. Under the Philippine
definition, sensitive PI includes race, ethnic origin, marital status, age, colour, religious,
philosophical or political affiliations, health, education, genetic or sexual life, legal
proceedings, government-issued identifiers such as **TIN and SSS numbers**, and tax returns.
Note that **age and marital status** are sensitive here — broader than most regimes — so forms
collecting date of birth need genuine consent.

## Browser-observable checklist

### Consent
- [ ] Affirmative action required — no pre-ticked boxes, no browse-wrap
- [ ] Consent is recorded in a demonstrable form
- [ ] Separate consent where sensitive personal information is collected
- [ ] Withdrawal channel available
- [ ] No non-essential trackers before consent

### Privacy notice
- [ ] Description of personal data collected
- [ ] Purpose of processing, and the lawful criterion relied on
- [ ] Recipients or classes of recipients
- [ ] Retention period
- [ ] Identity and contact details of the personal information controller
- [ ] Existence of automated decision-making or profiling, where applicable
- [ ] Method for exercising rights and for lodging a complaint with the NPC

### DPO
- [ ] **DPO contact details are published.** Appointing a DPO is mandatory and the DPO must be
      registered with the NPC — an unnamed, uncontactable privacy function is a finding

### Rights (s.16 and s.18)
- [ ] Right to be informed
- [ ] Right to access
- [ ] Right to object, including to direct marketing and profiling
- [ ] Right to erasure or blocking
- [ ] Right to rectification
- [ ] Right to damages
- [ ] Right to **data portability**
- [ ] **Transmissibility to heirs and assigns** — distinctive to the Philippines and almost always
      absent from a copy-pasted GDPR policy, which makes it a useful tell that the policy was
      never localised

### Cross-border
- [ ] Transfers addressed; the controller remains accountable for data transferred abroad

## Not observable from the browser

- Registration of the data processing system with the NPC, required above the applicable
  thresholds for sensitive personal information
- Whether the DPO is genuinely registered
- Breach notification to the NPC and affected subjects within **72 hours** where sensitive PI or
  data enabling identity fraud is involved and there is real risk of serious harm
- Privacy impact assessments and the internal privacy management programme

## Common failure modes

1. Implied consent via continued browsing — invalid under the DPA's consent definition
2. No published DPO contact
3. Date of birth or government ID collected without treating it as sensitive PI
4. GDPR policy reused verbatim, missing transmissibility of rights and the NPC complaint route
