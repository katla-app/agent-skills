# India — DPDP Act 2023 + DPDP Rules 2025

## Snapshot

| | |
|---|---|
| Law | Digital Personal Data Protection Act 2023, with the DPDP Rules notified **November 2025** |
| Regulator | Data Protection Board of India |
| Consent model | **Consent only** — plus a closed list of "certain legitimate uses". There is **no legitimate-interest basis** |
| Penalties | Up to **INR 250 crore** per category of breach |
| Also live | The SPDI Rules 2011 under the IT Act remain relevant until fully displaced |

## Commencement — audit this as readiness, not as breach

The obligations phase in. As of **September 2026**:

| Tranche | Approximate date | Status today |
|---|---|---|
| Definitions, Data Protection Board, appeals | On notification, Nov 2025 | **In force** |
| Consent Manager registration and obligations | ~November 2026 | **Imminent — roughly two months out** |
| Notice, consent mechanics, security safeguards, breach notification, children's data, Significant Data Fiduciary duties, data principal rights, cross-border conditions | ~**May 2027** | **Not yet in force** |

The **notice-language obligation sits in the May 2027 tranche.** Report every substantive finding
below as a **readiness gap with a May 2027 deadline**, not as a current violation — saying
otherwise misstates the legal position. Verify the exact commencement dates before presenting them.

## The language obligation — s.5(3)

The notice must be made available, at the data principal's option, in **English or any of the 22
languages listed in the Eighth Schedule to the Constitution**. This is materially more demanding
than any other regime in this skill: it is not "translate to the local language", it is a menu the
user chooses from.

Practical implication worth telling the user now, because it has a long lead time: a site serving
India needs a **language-selection mechanism attached to the notice itself**, not merely a
translated site. Sites planning consent tooling should confirm the vendor supports Eighth Schedule
languages before May 2027.

## Browser-observable checklist (readiness)

### Notice — s.5
- [ ] Notice is **standalone** — presented on its own, not folded into terms of service
- [ ] Clear and plain language
- [ ] **Itemised** description of the personal data collected, not a generic category list
- [ ] Purpose, with the goods or services enabled by the processing
- [ ] How to **withdraw consent**, stated in the notice itself
- [ ] How to exercise rights
- [ ] How to complain to the **Data Protection Board**
- [ ] Language selection covering English plus Eighth Schedule languages — *May 2027 readiness*

### Consent — s.6
- [ ] Free, specific, informed, **unconditional**, unambiguous, with clear affirmative action
- [ ] Limited to the personal data **necessary** for the specified purpose — over-collection
      invalidates the consent rather than merely being poor practice
- [ ] Withdrawal **as easy as** giving consent
- [ ] Consent request accompanied or preceded by the notice
- [ ] No bundling with terms acceptance

### Consent Managers
- [ ] A distinctively Indian mechanism: a Board-registered, interoperable platform through which a
      data principal may give, manage, review and withdraw consent. Note whether the site's
      consent tooling could integrate with one — registration provisions land ~November 2026

### Children — s.9
- [ ] Under-18s: **verifiable parental consent** required. Note that the threshold is 18, higher
      than the GDPR's 13–16 range, so an age gate calibrated for the EU is insufficient
- [ ] **No tracking or behavioural advertising directed at children.** This is a hard prohibition,
      not a consent-gated activity — if the site could plausibly reach minors and runs behavioural
      ads, flag it prominently

### Rights
- [ ] Access — a summary of personal data and processing activities, **and the identities of other
      fiduciaries with whom data was shared**
- [ ] Correction, completion, updating, erasure
- [ ] **Grievance redressal** — mandatory, and the data principal must exhaust it before
      approaching the Board, so a working grievance channel is essential rather than optional
- [ ] **Nomination** — the right to nominate another individual to exercise rights in the event of
      death or incapacity; distinctive to India and absent from copy-pasted policies
- [ ] Published contact of the DPO or of a person able to answer questions about the processing

### Cross-border
- [ ] Transfers permitted **except** to countries restricted by the government — a blacklist rather
      than an adequacy allowlist, so the analysis differs from the GDPR's. Check the policy does
      not describe an EU-style adequacy framework

## Not observable from the browser

- Significant Data Fiduciary designation and its extra duties: DPIA, independent audit,
  algorithmic due diligence, an India-based DPO
- Breach notification — intimation to each affected data principal without delay, and to the Board,
  with detail within 72 hours
- Reasonable security safeguards, which the Rules specify in some detail
- Retention and erasure timelines applicable to particular classes of fiduciary

## Common failure modes

1. Reporting DPDP gaps as current violations — most substantive duties are not yet in force
2. Treating "legitimate interest" as available in India; it is not
3. An age gate set at 13 or 16, when India's threshold is 18
4. Behavioural advertising on a site reachable by minors
5. No grievance officer, which will block the entire rights mechanism from May 2027
6. Assuming site-wide translation satisfies s.5(3) — the obligation attaches to the notice and is
   at the data principal's option
