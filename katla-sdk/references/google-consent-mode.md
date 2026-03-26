# Katla SDK - Google Consent Mode

## Category Mapping

| Katla Category | Google Consent Parameters |
|---------------|--------------------------|
| `analytics` | `analytics_storage` |
| `marketing` | `ad_storage`, `ad_user_data`, `ad_personalization` |
| `functional` | (ignored) |
| `personalization` | (ignored) |

## Setup

### Widget

Enable via the Widget Settings page in your Katla dashboard.

**Important:** The Katla script must load **before** Google Analytics or Google Ads tags so the default consent state is set first.

### React

```tsx
import { KatlaProvider } from '@katla.app/sdk/react';

<KatlaProvider siteId="your-site-id" googleConsentMode>
  {/* Your app */}
</KatlaProvider>
```

Or using individual components:

```tsx
import { KatlaProvider, KatlaGuard, ConsentBridge, GoogleConsentMode } from '@katla.app/sdk/react';

<KatlaProvider siteId="your-site-id">
  <KatlaGuard />
  <ConsentBridge />
  <GoogleConsentMode />
  {/* Your app */}
</KatlaProvider>
```

### Next.js

```tsx
<KatlaNextProvider siteId="your-site-id" googleConsentMode>
  {children}
</KatlaNextProvider>
```

### Vanilla JavaScript

```javascript
import { setupGoogleConsentMode } from '@katla.app/sdk';
const cleanup = setupGoogleConsentMode();
// cleanup(); // when needed
```

## CCPA Behavior

When a user opts out under CCPA:

| Parameter | Value |
|-----------|-------|
| `ad_storage` | `denied` |
| `ad_user_data` | `denied` |
| `ad_personalization` | `denied` |
| `analytics_storage` | `granted` |

This differs from a GDPR "Reject All" which denies all parameters including analytics.

## Verification

Use the **Google Tag Assistant** browser extension:

1. Check the **Consent** tab for a `default` event (all denied initially)
2. Accept cookies in the consent banner
3. Verify an `update` event appears with `granted` values
