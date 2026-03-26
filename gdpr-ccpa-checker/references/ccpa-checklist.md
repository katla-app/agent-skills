# CCPA/CPRA Compliance Checklist

## Applicability

CCPA applies to businesses that:
- Have annual gross revenue over $25 million, OR
- Buy/sell/share personal information of 100,000+ consumers/households, OR
- Derive 50%+ of annual revenue from selling/sharing personal information

## Opt-Out Mechanism

### "Do Not Sell or Share" Link

- [ ] **Link is present**: A clear "Do Not Sell or Share My Personal Information" link exists
- [ ] **Link is visible**: Located in the website footer or other prominent location
- [ ] **Link is functional**: Clicking it provides a working opt-out mechanism
- [ ] **No account required**: Opt-out does not require creating an account
- [ ] **No excessive steps**: Opt-out process is straightforward (not buried behind multiple clicks)
- [ ] **Takes effect immediately**: Opt-out takes effect within 15 business days maximum

### Global Privacy Control (GPC)

- [ ] **GPC signal honored**: Site detects and respects `navigator.globalPrivacyControl`
- [ ] **GPC treated as opt-out**: GPC signal is treated as a valid opt-out of sale request
- [ ] **`.well-known/gpc.json` exists**: File at `/.well-known/gpc.json` with `{"gpc": true, "lastUpdate": "[date]"}`
- [ ] **No GPC override**: Site does not ignore or override GPC signals

## Privacy Policy (CCPA Sections)

### Notice at Collection

- [ ] **Categories of PI collected**: Lists categories of personal information collected
- [ ] **Purpose for each category**: Describes why each category is collected
- [ ] **Retention period**: States how long each category is retained
- [ ] **Notice before collection**: Notice is provided at or before the point of collection
- [ ] **Sensitive PI identified**: Sensitive personal information categories are separately identified

### Full Privacy Policy

- [ ] **Right to know**: Explains consumers' right to know what PI is collected
- [ ] **Right to delete**: Explains right to request deletion of PI
- [ ] **Right to opt-out**: Explains right to opt-out of sale/sharing
- [ ] **Right to correct**: Explains right to correct inaccurate PI (CPRA addition)
- [ ] **Right to limit sensitive PI**: Explains right to limit use of sensitive PI (CPRA)
- [ ] **Non-discrimination**: States that consumers won't be discriminated against for exercising rights
- [ ] **Contact methods**: Provides at least two methods to submit privacy requests (e.g., toll-free number + web form)
- [ ] **Response timeframe**: Commits to responding within 45 days
- [ ] **Authorized agent**: Explains how authorized agents can submit requests
- [ ] **Categories sold/shared**: Discloses categories of PI sold or shared in the last 12 months
- [ ] **Third-party categories**: Lists categories of third parties PI is shared with
- [ ] **Updated annually**: Policy has been updated within the last 12 months

## Cookie Behavior Under CCPA

Unlike GDPR, CCPA follows an **opt-out model**:

- [ ] **Cookies allowed by default**: Non-essential cookies may be set before opt-out (unlike GDPR)
- [ ] **Opt-out blocks sale cookies**: After opt-out, cookies used for selling/sharing data are blocked
- [ ] **Analytics allowed post-opt-out**: First-party analytics may continue after opt-out
- [ ] **Informational banner**: Banner informs users of their rights (not asking permission)

## Financial Incentive Programs

- [ ] **Clear disclosure**: Any financial incentive for providing PI is clearly disclosed
- [ ] **Voluntary**: Incentive programs are opt-in
- [ ] **Easy to withdraw**: Consumers can opt-out of incentive programs at any time
- [ ] **Material terms explained**: Terms of the incentive program are clearly stated

## Minors (Under 16)

- [ ] **No sale without opt-in**: PI of consumers under 16 is not sold without affirmative opt-in
- [ ] **Parental consent for under 13**: For consumers under 13, parental consent is required
- [ ] **Age verification**: Appropriate age verification mechanisms are in place

## Technical Requirements

### Verification Process

- [ ] **Identity verification**: Reasonable methods to verify identity of requestors
- [ ] **Two-step verification for deletion**: Deletion requests confirmed through a two-step process
- [ ] **Record keeping**: Requests and responses are documented for 24 months

### Data Inventory

- [ ] **PI mapped**: Organization knows what personal information it collects
- [ ] **Data flow documented**: Understands how PI flows through systems and to third parties
- [ ] **Service providers identified**: Contracts with service providers include CCPA-required provisions
