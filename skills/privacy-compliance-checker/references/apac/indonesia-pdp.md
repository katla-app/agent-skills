# Indonesia — PDP Law (Law No. 27 of 2022)

## Snapshot

| | |
|---|---|
| Law | Personal Data Protection Law (UU PDP), Law No. 27 of 2022 |
| In force | Enacted 17 Oct 2022; two-year transition ended **17 Oct 2024** |
| Regulator | Supervisory authority mandated by the law — verify current establishment status |
| Consent model | **Opt-in**, explicit and recorded |
| Cookie banner | **Yes** |
| Penalties | Administrative fines up to **2% of annual revenue**; criminal liability for unlawful disclosure |

> Implementing regulation and the supervisory body have been slower to land than the statute.
> Check the current position before telling a user who enforces this and how.

## Browser-observable checklist

### Consent (Arts. 20–22)
- [ ] Explicit consent, given by clear affirmative action
- [ ] Consent request is **separate** from other terms, not bundled
- [ ] Consent request is presented in **Bahasa Indonesia** — the law requires the request be
      delivered in an understandable form in the Indonesian language, and Indonesia's national
      language law reinforces this
- [ ] Consent is specific per purpose — a single blanket consent covering unrelated purposes fails
- [ ] Withdrawal is available and as easy as consent
- [ ] No non-essential trackers before consent

### Privacy notice
- [ ] Identity and contact details of the data controller
- [ ] Legal basis relied on (Art. 20 lists six: consent, contract, legal obligation, vital
      interest, public interest/duty, legitimate interest)
- [ ] Purpose of processing
- [ ] Categories of personal data, distinguishing **specific (sensitive) personal data** —
      health, biometrics, genetics, criminal records, children's data, financial data, sexual
      orientation
- [ ] Retention period
- [ ] Recipients and, where applicable, cross-border destinations
- [ ] Accountability for the security of the data

### Rights
- [ ] Information, access, rectification, erasure, portability
- [ ] Withdraw consent
- [ ] Object to **automated decision-making and profiling** — call this out where the site
      personalises content or pricing
- [ ] Delay or limit processing
- [ ] Claim compensation

### Cross-border transfer
- [ ] Notice addresses transfers abroad, and the basis: destination adequacy, then binding
      safeguards, then consent as the fallback

### Children
- [ ] Where the service could reach minors, parental/guardian consent is addressed

## Not observable from the browser

- Whether a DPO has been appointed where required (large-scale, systematic monitoring, or
  sensitive-data core activity)
- Breach notification within **3×24 hours** to the affected subject and the authority
- Data protection impact assessments for high-risk processing
- Actual records evidencing recorded consent

## Common failure modes

1. Consent flow presented only in English on a site otherwise fully localised to Bahasa Indonesia
2. Blanket single consent covering analytics, marketing and profiling together
3. Sensitive/"specific" personal data handled with ordinary consent and no separate treatment
4. Notice that predates October 2024 and was never updated for the PDP Law
