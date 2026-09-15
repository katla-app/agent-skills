# APAC Privacy Regimes — Router & Comparison Matrix

Use this file to decide **which jurisdiction checklists to load** before auditing. Load only the
per-jurisdiction files that apply — each one lives in `references/apac/`.

Apply the main skill's grading policy to this router and every country checklist. These groupings
reuse browser observations; they do not establish identical legal duties. Verify each obligation's
conditions, exceptions and commencement with current primary sources before grading. Words such as
“expected”, “best practice” and “in practice” are not by themselves statutory requirements.

> **Accuracy note:** privacy law in APAC is moving fast. Dates and thresholds below reflect the
> state of play as of **September 2026**. Several regimes have amendments or implementing
> regulations in flight (India, Indonesia, Japan, Taiwan). Verify current status before
> presenting anything as a definitive legal finding.

## Step 1 — Scope the audit

Use the countries or regimes selected by the user under `../SKILL.md`. If none were specified,
ask which to check and wait for an answer; clarify "APAC" into countries unless all covered
regimes were explicitly requested. Targeting signals help assess applicability within that
selection, not choose or expand the audit scope. Signals to look for on the requested host:

- Country/region selector, language switcher, or locale in the URL (`/th/`, `/id/`, `?lang=ja`)
- Currency shown at checkout (THB, IDR, SGD, TWD, MYR, HKD, PHP, INR, JPY)
- ccTLD or regional subdomain (`.jp`, `.co.th`, `.co.id`, `.sg`, `.tw`, `.com.my`, `.hk`, `.ph`, `.in`)
- Local address, phone number, or company registration number in the footer
- Local payment methods (PromptPay, GoPay/OVO/DANA, PayNow, FPS, GCash/Maya, UPI, LINE Pay, PayPay)
- Local ad/analytics tags (LINE Tag, Yahoo! JAPAN, Naver, Shopee/Lazada pixels)
- Shipping destinations offered at checkout

If applicability within the selected countries remains ambiguous, ask for the missing market
or business information rather than guessing. Do not add countries based on these signals alone.

## Step 2 — Comparison matrix

| Jurisdiction | Law | Consent model for cookies/trackers | Banner effectively required? | Language obligation | Published contact required? |
|---|---|---|---|---|---|
| Japan | APPI | Opt-out for own use; **consent confirmation required** when passing IDs to third parties who will link them | Not strictly — but yes in practice for ad-tech ID sharing | Japanese expected in practice | Purpose of use + inquiry contact must be published |
| Thailand | PDPA | **Opt-in**, GDPR-style | **Yes** | Thai expected | Controller + DPO contact |
| Indonesia | PDP Law | **Opt-in**, explicit and recorded | **Yes** | **Bahasa Indonesia for consent requests** | Controller contact; DPO where required |
| Singapore | PDPA | Notify + consent, with deemed consent and legitimate-interests exceptions | Often not — notice may suffice | English sufficient | **DPO business contact must be public** |
| Taiwan | PDPA | Notice at collection; consent unless exempt | Not strictly — notice-driven | Traditional Chinese expected | Collector identity + rights channel |
| Malaysia | PDPA (as amended 2024) | Notice + consent | Increasingly yes | **Bahasa Malaysia AND English — statutory** | **DPO contact must be published** |
| Hong Kong | PDPO | PICS on/before collection; **opt-in for direct marketing** | Not strictly — PICS-driven | EN + Traditional Chinese is best practice | PICS contact person |
| Philippines | Data Privacy Act | **Consent** (esp. sensitive PI), evidenced and recorded | **Yes** | Language the subject understands | **DPO contact must be published** |
| India | DPDP Act + Rules 2025 | **Consent only** — no legitimate-interest basis | Yes, once in force | **22 scheduled languages + English — from ~May 2027** | Grievance officer / DPO contact |

## Step 3 — Consent-model groupings

Audit effort clusters into three shapes. Test the shape, not nine separate flows.

**A. Opt-in, GDPR-shaped** — Thailand, Indonesia, Philippines, India (once in force).
Reuse the measured initial, refused, accepted and withdrawn states. Apply only the locally
required consent behavior, accounting for alternative bases and exceptions; do not import GDPR
button-layout requirements automatically. Then check local language, records and representation
where required.

**B. Notice-first** — Singapore, Taiwan, Hong Kong, Malaysia.
The banner is not the centre of gravity; the **notice** is. Check that a compliant collection
notice is presented at or before collection, that it names the right things, and that the
withdrawal/opt-out channel actually exists and works. A site can pass here with no banner at all
and still fail badly on notice content.

**C. Transfer-triggered** — Japan.
The obligation bites when cookie IDs or other "personally referable information" leave the site to
a third party who will link them to a person. The audit question is *what leaves the page and to
whom*, more than *what the banner says*.

## Step 4 — Cross-cutting checks worth running once

These apply across most or all of the nine, so run them once and reuse the result:

- **Pre-consent network egress** — which third-party hosts are contacted before any interaction
- **Language/localisation** — is the notice available in the local language, and is it reachable
  without already knowing the local language?
- **Published accountability contact** — DPO, grievance officer, or named contact person
- **Withdrawal channel** — a persistent way to change or revoke a choice after the first visit
- **Breach notification** — distinguish internal procedures from any specific public disclosure
  duty; policy silence alone does not prove no procedure exists
- **Children's data** — establish the relevant age, processing and commencement conditions;
  possible visits by minors alone do not establish a current violation

## Out of scope for this skill

Commonly needed alongside the nine above, but **not** covered here — say so explicitly rather
than implying coverage:

- **China (PIPL)** — separate regime, materially stricter on cross-border transfer
- **South Korea (PIPA)** — separate regime with its own consent granularity rules
- **Vietnam (PDPD / Decree 13)** — separate regime
- **Australia (Privacy Act)** and **New Zealand (Privacy Act 2020)**

If the user needs these, tell them this skill does not cover them yet.
