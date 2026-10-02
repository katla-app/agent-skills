# CCPA/CPRA Compliance Checklist

Apply the grading policy in `../SKILL.md`. Checkboxes are conditional investigation prompts,
not automatic failures. Record unresolved business coverage as verification, not noncompliance.

## Applicability

Confirm the business is covered (including doing business in California and relevant statutory
definitions/exceptions), then check whether it meets a threshold:
- Have annual gross revenue of at least $26,625,000 for the preceding calendar year (effective January 1, 2025; verify current adjustment), OR
- Buy/sell/share personal information of 100,000+ consumers/households, OR
- Derive 50%+ of annual revenue from selling/sharing personal information

## Opt-Out Mechanism

### "Do Not Sell or Share" Link

Apply where the business sells/shares personal information. Check permitted alternative links
and qualifying opt-out preference signal exceptions before requiring this exact link.

- [ ] **Link is present**: A clear "Do Not Sell or Share My Personal Information" link exists
- [ ] **Link is visible**: Located in the website footer or other prominent location
- [ ] **Link is functional**: Clicking it provides a working opt-out mechanism
- [ ] **No account required**: Opt-out does not require creating an account
- [ ] **No excessive steps**: Opt-out process is straightforward (not buried behind multiple clicks)
- [ ] **Timely effect**: Apply the current request-specific deadline; a short browser test cannot verify an entire statutory response period

### Global Privacy Control (GPC)

- [ ] **GPC signal honored**: Emit GPC before navigation, verify `Sec-GPC: 1` and browser state, then observe relevant sale/sharing behavior; mark untested if the tool cannot emit it
- [ ] **GPC treated as opt-out**: GPC signal is treated as a valid opt-out of sale request
- **Optional support declaration**: `/.well-known/gpc.json` may advertise support. Missing it is not a failure; serving it is not proof of enforcement
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
- [ ] **Contact methods**: Provides methods required for the request type and business; check the online-only exception before requiring a toll-free number or two channels
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
- [ ] **Accessible notice**: Required notice is available at collection; a particular banner format is not automatically required

## Financial Incentive Programs

- [ ] **Clear disclosure**: Any financial incentive for providing PI is clearly disclosed
- [ ] **Voluntary**: Incentive programs are opt-in
- [ ] **Easy to withdraw**: Consumers can opt-out of incentive programs at any time
- [ ] **Material terms explained**: Terms of the incentive program are clearly stated

## Minors (Under 16)

Establish the relevant knowledge and processing conditions before applying these checks.
The mere possibility that a minor could visit does not prove an age-verification violation.

- [ ] **No sale without opt-in**: PI of consumers under 16 is not sold without affirmative opt-in
- [ ] **Parental consent for under 13**: For consumers under 13, parental consent is required
- [ ] **Age verification**: Appropriate age verification mechanisms are in place

## Technical Requirements

### Verification Process

Internal records and identity procedures not observed in the browser belong in `notVerifiable[]`.
Do not require identity verification for an opt-out of sale/sharing.

- [ ] **Identity verification**: Reasonable methods to verify identity of requestors
- [ ] **Two-step verification for deletion**: Deletion requests confirmed through a two-step process
- [ ] **Record keeping**: Requests and responses are documented for 24 months

### Data Inventory

- [ ] **PI mapped**: Organization knows what personal information it collects
- [ ] **Data flow documented**: Understands how PI flows through systems and to third parties
- [ ] **Service providers identified**: Contracts with service providers include CCPA-required provisions

Primary sources (re-check when auditing):
- [CPPA FAQ and applicability](https://cppa.ca.gov/faq)
- [CPPA monetary thresholds](https://cppa.ca.gov/regulations/cpi_adjustment.html)
- [W3C GPC draft: optional support resource](https://www.w3.org/TR/gpc/#gpc-support-resource)
