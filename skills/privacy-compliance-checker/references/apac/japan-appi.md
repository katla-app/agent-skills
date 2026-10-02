# Japan — APPI (Act on the Protection of Personal Information)

## Snapshot

| | |
|---|---|
| Law | Act on the Protection of Personal Information (個人情報保護法), as amended 2020 (in force April 2022) |
| Regulator | Personal Information Protection Commission (PPC / 個人情報保護委員会) |
| Consent model | Opt-out for a business's own use; **opt-in confirmation** for third-party provision |
| Cookie banner | Not mandated as such — the trigger is data leaving to a third party |
| Extraterritorial | Yes — applies to foreign businesses handling the data of people in Japan |

> A further triennial review of the APPI has been in progress; treat any amendment specifics as
> unverified and check the PPC site before asserting them.

## The rule that actually drives cookie audits

The 2020 amendment created **"personally referable information"** (個人関連情報) — data such as
cookie IDs and ad identifiers that is not personal data in the sender's hands but *will be* linked
to an identified individual by the recipient.

When such data is transferred to a third party who will link it, the **transferring site must
confirm that the recipient has obtained the individual's consent**, and must keep records of the
transfer. This is what makes ad-tech ID sharing (ad platforms, DMPs, data clean rooms, server-side
tagging to a partner) the highest-risk area on a Japanese site.

## Browser-observable checklist

### Third-party ID transfer
- [ ] Identify every third party receiving an identifier before consent — ad pixels, DMP tags,
      conversion APIs, ID-sync/cookie-matching redirects
- [ ] Where an ad or DMP tag is present, is there a consent mechanism at all covering that transfer?
- [ ] Are transfer records / consent confirmation referenced anywhere in the policy?
- [ ] Check for ID-sync chains (redirect hops between ad domains) firing pre-interaction

### Purpose of use (利用目的) — Art. 21
- [ ] Purpose of use is **publicly announced or notified** to the user
- [ ] Purpose is specific, not a catch-all like "for our business purposes"
- [ ] Purpose covers the tracking actually observed on the page

### Business operator disclosure
- [ ] Name of the business operator (and address / representative name)
- [ ] Contact point for inquiries and complaints is published
- [ ] EU/foreign operator: a Japan contact is reachable

### Data subject rights
- [ ] Disclosure, correction, addition, deletion
- [ ] **Cessation of use** and cessation of third-party provision (broadened in the 2020 amendment)
- [ ] Disclosure of third-party provision records
- [ ] A working request channel (form, email, or postal address)

### Cross-border transfer
- [ ] Where data goes overseas, the notice names the **country**, describes that country's data
      protection regime, and describes the recipient's protective measures — all three are required
      for consent-based transfers, and naming only the country is a common shortfall

### Language
- [ ] Notice available in Japanese — an English-only policy on a Japanese-market site is a
      practical failure even though the statute does not spell out a language

## Not observable from the browser

Flag these to the user rather than scoring them:

- Whether consent confirmation records for third-party transfers are actually kept (Art. 31)
- Whether the PPC opt-out filing route was used for third-party provision
- Breach notification to the PPC and to affected individuals (mandatory since 2022)
- Internal safety management measures, including for overseas subcontractors

## Common failure modes

1. Ad-tech tags and ID syncs firing with no consent mechanism at all, on the assumption that
   "cookies aren't personal data in Japan" — true for the sender, irrelevant to the transfer rule
2. Purpose of use written so broadly it authorises nothing specific
3. Cross-border section that says "we may transfer data overseas" without naming countries or
   describing the destination regime
4. English-only privacy policy on a `.jp` site
