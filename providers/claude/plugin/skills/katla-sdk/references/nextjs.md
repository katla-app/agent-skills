# Katla SDK - Next.js Integration

Packages: `@katla.app/sdk/next` (client) and `@katla.app/sdk/next/server` (server)

Requires Next.js 13+ with App Router.

## KatlaNextProvider

```tsx
// src/app/layout.tsx
import { KatlaNextProvider } from '@katla.app/sdk/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <KatlaNextProvider siteId="your-site-id">
          {children}
        </KatlaNextProvider>
      </body>
    </html>
  );
}
```

Server Components passed as children remain server-rendered despite the `use client` boundary.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `siteId` | `string` | -- | Your site's UUID (required) |
| `baseUrl` | `string` | `https://cdn.katla.app` | Override the CDN base URL |
| `locale` | `PolicyLocale` | -- | Default locale for policy documents |
| `debug` | `boolean` | `false` | Enable console logging |
| `initialCookies` | `CookieData \| null` | -- | Pre-fetched cookie data |
| `guardScript` | `string` | -- | Pre-fetched guard script content |
| `guard` | `boolean` | `true` | Inject the cookie guard script |
| `consentBridge` | `boolean` | `true` | Connect `window.KatlaConsent` events |
| `googleConsentMode` | `boolean` | `false` | Signal consent to Google Consent Mode v2 |

## Hooks

All hooks imported from `@katla.app/sdk/next` have `'use client'` already applied.

```tsx
'use client';

import {
  useKatlaCookies,   // { cookies, loading, error }
  useKatlaConsent,   // { consent, onChange }
  useKatlaClient,    // KatlaClient instance
  useConsentManager, // Full consent state + actions
} from '@katla.app/sdk/next';
```

API is identical to React hooks (see `references/react.md`).

## Components

```tsx
import { CookieBanner, CookieCatalog } from '@katla.app/sdk/next';
```

API is identical to React components (see `references/react.md`).

## Server-Side Rendering

### getCachedCookies

Uses React's `cache()` to deduplicate requests across multiple component calls in a single render.

```tsx
import { getCachedCookies } from '@katla.app/sdk/next/server';

const cookies = await getCachedCookies({ siteId: 'your-site-id' });
```

### getStaticGuardScript

Reads the guard script from static build output (`.katla/guard.js`).

```tsx
import { getStaticGuardScript } from '@katla.app/sdk/next/server';

const guardScript = await getStaticGuardScript();
```

## Full SSR Setup

```tsx
// src/app/layout.tsx
import { KatlaNextProvider } from '@katla.app/sdk/next';
import { getCachedCookies, getStaticGuardScript } from '@katla.app/sdk/next/server';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cookies, guardScript] = await Promise.all([
    getCachedCookies({ siteId: 'your-site-id' }),
    getStaticGuardScript(),
  ]);

  return (
    <html lang="en">
      <body>
        <KatlaNextProvider
          siteId="your-site-id"
          initialCookies={cookies}
          guardScript={guardScript}
        >
          {children}
        </KatlaNextProvider>
      </body>
    </html>
  );
}
```

## Static Build-Time Cookies

Add `katla pull` to your build pipeline:

```json
{
  "scripts": {
    "prebuild": "katla pull your-site-id",
    "build": "next build"
  }
}
```

## Google Consent Mode

```tsx
<KatlaNextProvider siteId="your-site-id" googleConsentMode>
  {children}
</KatlaNextProvider>
```

Ensure the Katla script loads before Google Analytics or Google Ads tags.

## Constants

```tsx
import { COOKIE_CATEGORIES } from '@katla.app/sdk/next';
```
