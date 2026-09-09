# Hong Kong — PDPO (Personal Data (Privacy) Ordinance, Cap. 486)

## Snapshot

| | |
|---|---|
| Law | Personal Data (Privacy) Ordinance, Cap. 486; anti-doxxing amendment 2021 |
| Regulator | Privacy Commissioner for Personal Data (PCPD) |
| Structure | Six **Data Protection Principles** (DPPs) in Schedule 1 |
| Consent model | Notice-driven (PICS); **opt-in for direct marketing** |
| Cookie banner | Not expressly mandated — the PICS is the obligation |

> **Section 33** — the cross-border transfer restriction — **has never been brought into force.**
> Do not report a s.33 breach. The PCPD instead publishes recommended model contractual clauses
> and expects transfers to be addressed as a matter of good practice.

## The PICS — Personal Information Collection Statement

DPP1(3) requires that, on or before collecting personal data, the individual is told:

1. Whether supplying the data is **obligatory or voluntary**, and if obligatory, the consequences
   of not supplying it
2. The **purposes** for which the data will be used
3. The **classes of transferees** to whom the data may be transferred
4. That the individual has **rights of access and correction**, and the **name or job title and
   address of the contact person** for such requests

Item 4's contact-person detail is specific and frequently reduced to a bare "contact us" link,
which does not satisfy it.

## Browser-observable checklist

### PICS
- [ ] A PICS is presented at or before collection — at signup, checkout, and enquiry forms, not
      only buried in the privacy policy
- [ ] All four DPP1(3) elements present
- [ ] Named contact person or job title **and address** given
- [ ] Cookies and online tracking are described in the PICS where they collect personal data
- [ ] Available in English and Traditional Chinese — best practice rather than statute, but a
      Chinese-language site with an English-only PICS is a real risk under the "practicable steps"
      standard

### Direct marketing — Part 6A (criminal liability attaches here)
- [ ] Before using data for direct marketing, the individual is **informed of that intention** and
      told the **kinds of personal data** to be used and the **classes of marketing subjects**
- [ ] A **response channel** is provided for the individual to indicate consent or objection
- [ ] Consent is obtained — an indication of no objection — before marketing begins
- [ ] Providing personal data to a **third party** for that party's marketing requires
      **written consent**, and the notice must say whether provision is for gain
- [ ] **Every** marketing message carries a free opt-out channel
- [ ] The opt-out is honoured

Part 6A breaches are criminal offences, with substantially higher exposure where data is provided
to others for gain. Treat marketing findings here as high severity.

### DPP3 — use limitation
- [ ] Data is not used for a **new purpose** beyond the original without prescribed consent
- [ ] Consent is express, voluntary, and can be withdrawn by written notice

### Rights
- [ ] Data access request and data correction request channels are described and reachable
- [ ] Any fee mentioned is not excessive

### Retention — DPP2
- [ ] Retention periods stated; data not kept longer than necessary

## Not observable from the browser

- Whether data access requests are answered within **40 days**
- Whether a personal data privacy policy and internal controls exist beyond the public statement
- Breach notification — **voluntary** in Hong Kong, though the PCPD recommends it and reform has
  been under discussion; do not report the absence of a mandatory-notification commitment as a breach

## Common failure modes

1. Marketing consent collected as a pre-ticked box or bundled into terms acceptance
2. PICS missing the classes of transferees, or naming no contact person
3. Reporting a s.33 cross-border breach — the provision is not in force
4. No opt-out channel in marketing emails, which is where criminal exposure begins
