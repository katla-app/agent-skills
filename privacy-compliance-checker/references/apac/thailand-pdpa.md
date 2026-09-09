# Thailand — PDPA (Personal Data Protection Act B.E. 2562)

## Snapshot

| | |
|---|---|
| Law | Personal Data Protection Act B.E. 2562 (2019), fully in force 1 June 2022 |
| Regulator | Personal Data Protection Committee / Office (PDPC Thailand) |
| Consent model | **Opt-in**, closely modelled on the GDPR |
| Cookie banner | **Yes** — PDPC has issued dedicated cookie guidance |
| Extraterritorial | Yes — offering goods/services to, or monitoring, people in Thailand |
| Penalties | Administrative fines up to THB 5m, plus civil and **criminal** liability |

## Browser-observable checklist

### Cookie banner
Start from `references/gdpr-checklist.md` — the banner requirements are near-identical — then confirm:

- [ ] No non-strictly-necessary cookies or trackers before consent
- [ ] **Reject is as easy as accept** — one click, equally prominent
- [ ] Granular categories, all non-essential unchecked by default
- [ ] Consent is separate from terms of service acceptance — bundled consent is expressly invalid
- [ ] Clear plain language, and reachable in **Thai**
- [ ] A persistent way to reopen preferences and withdraw consent
- [ ] No cookie wall gating access to the site

### Privacy notice (s.23)
- [ ] Purpose of processing, with the **legal basis** for each
- [ ] Categories of personal data collected
- [ ] Retention period, or the criteria used to determine it
- [ ] Recipients or categories of recipients
- [ ] Controller identity and contact details
- [ ] **DPO contact** where a DPO is required
- [ ] The consequences of not providing data — a commonly missed item
- [ ] Full rights list plus the right to complain to the PDPC

### Data subject rights
- [ ] Access and copy, portability, object, erasure, restriction, rectification
- [ ] Withdraw consent — must be as easy as giving it
- [ ] A functioning request channel

### Local presence
- [ ] Foreign controllers targeting Thailand must appoint a **local representative in Thailand**
      (s.37(5)) — check whether one is named in the notice

## Not observable from the browser

- Records of processing activities (RoPA)
- Whether a DPO has genuinely been appointed and notified
- Breach notification to the PDPC within **72 hours**
- Data processing agreements with processors
- Whether consent records are retained in a demonstrable form

## Common failure modes

1. A banner with only "Accept" and "Settings" — a reject path buried one level down fails the
   "as easy as" test
2. English-only notice on a Thai-market site
3. Consent bundled into a single "I agree to the Terms and Privacy Policy" checkbox
4. No local representative named despite clearly targeting Thai consumers
5. Legal basis omitted entirely — the notice lists purposes but never states the basis
