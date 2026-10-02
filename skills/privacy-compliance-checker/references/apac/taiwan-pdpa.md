# Taiwan — PDPA (Personal Data Protection Act, 個人資料保護法)

## Snapshot

| | |
|---|---|
| Law | Personal Data Protection Act, amended 2023 |
| Regulator | Personal Data Protection Commission — preparatory office established 2023; **verify current operational status** |
| Consent model | Notice at collection; consent required unless a statutory exemption applies |
| Cookie banner | Not expressly mandated — the **Art. 8 notice** is the obligation |
| Language | Traditional Chinese expected in practice |

## The Article 8 notice — the core checkable item

When collecting personal data directly, the collector must inform the individual of **all** of:

1. Name of the collector
2. Purpose of collection
3. Categories of personal data collected
4. Time period, area, recipients and method of use
5. The individual's rights under Art. 3 and how to exercise them
6. The effect on the individual of choosing not to provide the data

Item 4 and item 6 are the two most frequently missing. A privacy policy that lists purposes but
never states the **period, area, recipients and method** of use fails Art. 8 even if it reads well.

## Browser-observable checklist

### Notice
- [ ] All six Art. 8 elements present
- [ ] Notice given **at or before** collection, not only on a linked policy page
- [ ] Available in Traditional Chinese

### Sensitive data — Art. 6
- [ ] Medical records, healthcare, genetic, sexual life, health examination and criminal records
      are handled separately, with written consent where relied on
- [ ] These are not swept into a general consent

### Rights — Art. 3
- [ ] Inquire and review
- [ ] Request a copy
- [ ] Supplement or correct
- [ ] **Demand cessation of collection, processing or use**
- [ ] Demand deletion
- [ ] These rights cannot be waived by contract — a policy purporting to waive them is a finding
- [ ] A working channel to exercise them

### Direct marketing — Art. 20
- [ ] On the **first** marketing contact, the individual is offered a way to refuse
- [ ] The opt-out is **free to the individual** — the collector bears the cost
- [ ] The opt-out channel appears in marketing messages and is honoured

### Cross-border transfer
- [ ] Transfers are addressed. The competent authority may restrict transfers on stated grounds,
      including where the destination lacks adequate protection — sector-specific restrictions
      have been imposed in the past, so check the site's sector

### Breach — Art. 12
- [ ] Policy addresses notifying affected individuals after a breach is investigated

## Not observable from the browser

- Whether security measures meeting the sector regulator's standards are in place
- Registration or filing duties applicable to specific regulated industries
- Whether the Art. 8 notice was genuinely given at the point of collection offline

## Common failure modes

1. Art. 8 notice missing the period/area/recipients/method element
2. No cost-free refusal offered on first direct marketing contact
3. Sensitive Art. 6 categories bundled into general consent
4. English-only notice on a `.tw` site
