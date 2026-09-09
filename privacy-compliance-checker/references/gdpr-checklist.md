# GDPR Compliance Checklist

## Cookie Consent (ePrivacy + GDPR)

### Banner Requirements

- [ ] **Consent before cookies**: No non-essential cookies are set before the user gives consent
- [ ] **Clear affirmative action**: Consent requires a clear positive action (clicking "Accept")
- [ ] **Reject option equally prominent**: "Reject All" must be same size, color prominence, and position as "Accept All" (DMA requirement in EU)
- [ ] **Granular choices**: Users can select individual cookie categories (analytics, marketing, personalization, etc.)
- [ ] **No pre-ticked boxes**: Non-essential cookie categories are unchecked by default
- [ ] **No cookie wall**: Access to the site is not contingent on accepting cookies (unless strictly necessary)
- [ ] **Scrolling is not consent**: Continuing to browse does not constitute consent
- [ ] **Closing banner is not consent**: Dismissing the banner without action does not set non-essential cookies
- [ ] **No dark patterns**: No manipulative design (e.g., tiny reject button, confusing language, shame-based copy)
- [ ] **Re-consent interval**: Consent is re-requested at reasonable intervals (max 12 months under DMA)

### Consent Record

- [ ] **Consent is recorded**: The site stores proof of consent (timestamp, categories accepted)
- [ ] **Consent is withdrawable**: Users can change their consent as easily as they gave it
- [ ] **Settings accessible**: A link/button to re-open cookie preferences is always available (e.g., footer link or floating icon)

### Cookie Guard

- [ ] **Scripts blocked until consent**: Analytics, marketing, and other non-essential scripts do not execute before consent
- [ ] **Cookies removed on withdrawal**: When consent is withdrawn, associated cookies are deleted
- [ ] **Third-party cookies managed**: Third-party tracking cookies are also blocked until consent

## Privacy Policy (GDPR Article 13 & 14)

### Data Controller

- [ ] **Identity of controller**: Full legal name and contact details of the data controller
- [ ] **DPO contact**: Data Protection Officer contact details (if applicable)
- [ ] **Representative**: EU representative details (if controller is outside EU)

### Data Processing

- [ ] **Categories of data**: Lists what personal data is collected
- [ ] **Processing purposes**: Clearly states why each category of data is processed
- [ ] **Legal basis**: Identifies legal basis for each processing activity (consent, contract, legitimate interest, legal obligation, vital interest, public task)
- [ ] **Legitimate interest details**: If legitimate interest is used, explains the interests pursued
- [ ] **Automated decision-making**: Discloses any automated profiling or decision-making

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

- [ ] **Retention periods**: States how long each category of data is kept
- [ ] **Policy date**: Policy shows when it was last updated
- [ ] **Change notification**: Explains how users will be notified of policy changes

## Technical Requirements

### Data Security

- [ ] **HTTPS**: Site uses HTTPS throughout
- [ ] **Secure cookies**: Cookies use `Secure` flag
- [ ] **HttpOnly cookies**: Session cookies use `HttpOnly` flag where appropriate
- [ ] **SameSite attribute**: Cookies set appropriate `SameSite` attribute

### Third-Party Integrations

- [ ] **Google Analytics**: Configured with anonymized IP (`anonymize_ip`) or Consent Mode
- [ ] **Social media widgets**: Not loading tracking scripts without consent
- [ ] **Embedded content**: YouTube/Vimeo/etc. use privacy-enhanced mode
- [ ] **Font/CDN loading**: External resources don't leak personal data

## DMA (Digital Markets Act) Additional Requirements

- [ ] **Visual equality**: Reject button is visually identical to Accept button in size, color, and prominence
- [ ] **Temporal restriction**: After rejection, consent cannot be re-requested for at least 1 year
- [ ] **No forced consent**: Gatekeeper platforms cannot require consent for cross-service data combination
