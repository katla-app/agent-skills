# GDPR Compliance Checklist

Apply the grading policy in `../SKILL.md` before turning any checkbox into a finding.
Establish applicability and current national ePrivacy rules. Untested and optional items are
not failures. A banner is unnecessary when the applicable processing does not require consent.

## Cookie Consent (ePrivacy + GDPR)

### Banner Requirements

- [ ] **Consent before cookies**: No non-essential cookies are set before the user gives consent
- [ ] **Clear affirmative action**: Consent requires a clear positive action (clicking "Accept")
- [ ] **Effective refusal**: Check first-layer rejection against applicable regulator guidance. Report an obstructed or materially obscured choice with evidence of effort or visibility. Different colours, dimensions or positions alone do not establish a failure
- [ ] **Granular choices**: Users can select individual cookie categories (analytics, marketing, personalization, etc.)
- [ ] **No pre-ticked boxes**: Non-essential cookie categories are unchecked by default
- [ ] **No cookie wall**: Access to the site is not contingent on accepting cookies (unless strictly necessary)
- [ ] **Scrolling is not consent**: Continuing to browse does not constitute consent
- [ ] **Closing banner is not consent**: Dismissing the banner without action does not set non-essential cookies
- [ ] **No dark patterns**: No manipulative design (e.g., tiny reject button, confusing language, shame-based copy)
- [ ] **Consent renewal**: Check the applicable national guidance and changes in processing; do not apply a universal 12-month expiry derived from the DMA

### Consent Record

- [ ] **Consent is recorded**: Verify the browser's saved choice; server-side proof and retention belong in `notVerifiable[]` unless independently evidenced
- [ ] **Consent is withdrawable**: Users can change their consent as easily as they gave it
- [ ] **Settings accessible**: A link/button to re-open cookie preferences is always available (e.g., footer link or floating icon)

### Cookie Guard

- [ ] **Consent-dependent processing blocked**: Check collection and storage/access behavior, distinguishing library loading from tracking; use the main skill's Consent Mode rules
- [ ] **Withdrawal enforced**: Consent-dependent activity stops and refusal persists. Residual cookie presence alone does not prove continued use; assess deletion separately against the applicable duty
- [ ] **Third-party cookies managed**: Third-party tracking cookies are also blocked until consent

## Privacy Policy (GDPR Article 13 & 14)

### Data Controller

- [ ] **Identity of controller**: Full legal name and contact details of the data controller
- [ ] **DPO contact**: Data Protection Officer contact details (if applicable)
- [ ] **Representative**: EU representative details where Article 27 applies, accounting for its exceptions

### Data Processing

- [ ] **Categories of data**: Lists what personal data is collected
- [ ] **Processing purposes**: Clearly states why each category of data is processed
- [ ] **Legal basis**: Identifies legal basis for each processing activity (consent, contract, legitimate interest, legal obligation, vital interest, public task)
- [ ] **Legitimate interest details**: If legitimate interest is used, explains the interests pursued
- [ ] **Automated decision-making**: Required disclosures where the relevant automated decision-making provisions apply

### Data Sharing

- [ ] **Third-party recipients**: Lists categories of third parties who receive data
- [ ] **International transfers**: Discloses transfers outside EU/EEA
- [ ] **Transfer safeguards**: Identifies safeguards for international transfers (adequacy decision, SCCs, BCRs)

### Data Subject Rights

- [ ] **Right of access**: How to request a copy of personal data
- [ ] **Right to rectification**: How to correct inaccurate data
- [ ] **Right to erasure**: How to request deletion ("right to be forgotten")
- [ ] **Right to restrict processing**: How to limit processing
- [ ] **Right to data portability**: How to receive data in machine-readable format
- [ ] **Right to object**: How to object to processing (especially direct marketing)
- [ ] **Right to withdraw consent**: How to withdraw previously given consent
- [ ] **Right to complain**: Right to lodge complaint with supervisory authority (with contact details)

### Retention & Updates

- [ ] **Retention**: States the period, or permitted criteria for determining it
- [ ] **Policy accuracy**: Information reflects current processing; absence of a visible update date alone is not a GDPR failure
- [ ] **Change notification**: Assess information duties for actual processing changes rather than requiring a particular boilerplate paragraph

## Technical Requirements

### Data Security

- [ ] **HTTPS**: Site uses HTTPS throughout
- [ ] **Secure cookies**: Assess exposure and purpose before grading missing flags; distinguish optional hardening from a confirmed security gap
- [ ] **HttpOnly cookies**: Session cookies use `HttpOnly` flag where appropriate
- [ ] **SameSite attribute**: Cookies set appropriate `SameSite` attribute

### Third-Party Integrations

- [ ] **Google Analytics**: Assess the current product's actual consent and data behavior; neither legacy `anonymize_ip` nor Consent Mode alone proves compliance
- [ ] **Social media widgets**: Not loading tracking scripts without consent
- [ ] **Embedded content**: Assess actual storage/access and transmission; a product's privacy mode is not itself a legal requirement or guarantee
- [ ] **Font/CDN loading**: Record transmissions and assess applicable bases/safeguards; a third-party hostname alone does not prove unlawful disclosure

## DMA (Digital Markets Act) Additional Requirements

- Apply this section only to designated gatekeepers and the relevant covered processing; using a gatekeeper's analytics product does not make the audited business a gatekeeper
- [ ] **Temporal restriction**: Verify Article 5(2)'s restriction on repeating requests after refusal or withdrawal; it is not a universal cookie-consent expiry rule
- [ ] **No forced consent**: Gatekeeper platforms cannot require consent for cross-service data combination

Primary sources to verify for the audited context:
- [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [European Commission DMA overview](https://digital-markets-act.ec.europa.eu/about-dma_en)
