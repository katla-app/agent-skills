# Singapore — PDPA (Personal Data Protection Act 2012)

## Snapshot

| | |
|---|---|
| Law | Personal Data Protection Act 2012, substantially amended 2020 (in force from Feb 2021) |
| Regulator | Personal Data Protection Commission (PDPC) |
| Consent model | Notify + consent, softened by **deemed consent** and statutory exceptions |
| Cookie banner | Often not required — the **notification** obligation is what bites |
| Penalties | Up to **10% of annual Singapore turnover** or SGD 1m, whichever is higher |

Singapore is a **notice-first** regime. A site can be compliant with no banner and still fail
badly on notice content, DPO publication, or withdrawal handling. Audit accordingly.

## The consent shortcuts that matter

Before flagging a missing banner, check whether one of these applies — they are legitimate and
widely relied on:

- **Deemed consent by conduct** — the individual voluntarily provides data for an obvious purpose
- **Deemed consent by contractual necessity** — for onward transfer needed to fulfil a contract
- **Legitimate interests exception** — requires a documented assessment, and the reliance must be
  **disclosed in the privacy policy**
- **Business improvement exception** — covers a good deal of first-party product analytics

A site relying on legitimate interests without disclosing it in the policy is a genuine finding.

## Browser-observable checklist

### Notification obligation
- [ ] Purposes for collection, use and disclosure are stated at or before collection
- [ ] Purposes are specific rather than a blanket recital
- [ ] Where legitimate interests are relied on, the policy **says so**

### DPO — s.11(5)
- [ ] **Business contact information of at least one DPO is publicly available.** This is an
      explicit statutory duty and one of the most reliably checkable items in the whole regime
- [ ] The contact is a working channel — an email or form, not just a role title

### Consent and withdrawal
- [ ] Any consent sought is not bundled as a condition of service beyond what is reasonably required
- [ ] A withdrawal channel exists and is reachable from the site
- [ ] Policy explains the **likely consequences** of withdrawal — a specific PDPA requirement
- [ ] Withdrawal is not obstructed or penalised

### Access and correction
- [ ] Policy explains how to request access to personal data and how to request correction
- [ ] Response timeframes are addressed

### Marketing
- [ ] Where marketing to Singapore phone numbers is offered, the **Do Not Call** obligations are
      addressed — DNC is a separate part of the PDPA from the data protection obligations
- [ ] Marketing messages carry sender identification and an opt-out

### Data breach
- [ ] Policy references breach handling — notification to the PDPC within **3 calendar days** of
      assessing a breach as notifiable is mandatory

### Transfer limitation
- [ ] Overseas transfers are addressed, with a comparable-protection standard

## Not observable from the browser

- Whether the legitimate-interests or business-improvement assessments were actually documented
- Whether the DPO role is genuinely staffed
- Data intermediary contracts
- Retention limitation practice — whether data is actually disposed of when no longer needed

## Common failure modes

1. **No published DPO contact** — extremely common and squarely non-compliant
2. Withdrawal mentioned but with no channel, or no explanation of consequences
3. A GDPR policy copy-pasted with "Singapore" swapped in, which describes rights the PDPA does
   not grant and omits the DPO publication duty it does
4. Relying on legitimate interests silently
