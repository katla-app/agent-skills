# Katla SDK - Static / Build-Time Cookies

## Configuration File

ESM (`katla.config.mjs`):

```js
export default {
  siteId: 'your-site-id',
  dir: '.katla',
  // locale: 'en-GB',
  // format: 'full',
};
```

CommonJS (`katla.config.js`):

```js
module.exports = {
  siteId: 'your-site-id',
};
```

## CLI Pull

```bash
katla pull            # uses katla.config.mjs
katla pull <site-id>  # explicit site ID
```

### Generated Output

The pull command creates files in `.katla/`:

- `cookies.json` - Cookie data
- `cookies.en-gb.json` - Locale-specific cookie data
- Policy files per locale
- `guard.js` - Cookie guard script
- `manifest.json` - Index of all resources

### Build Integration

```json
{
  "scripts": {
    "prebuild": "katla pull",
    "build": "vite build"
  }
}
```

## Framework Usage

### React / Vite

```tsx
import cookies from './.katla/cookies.json';
import guardScript from './.katla/guard.js?raw';  // Vite raw import
import { KatlaProvider } from '@katla.app/sdk/react';

<KatlaProvider siteId="your-site-id" initialCookies={cookies} guardScript={guardScript}>
  {/* useKatlaCookies() returns data immediately -- no fetch */}
</KatlaProvider>
```

### Next.js

```tsx
import { KatlaNextProvider } from '@katla.app/sdk/next';
import { getStaticGuardScript } from '@katla.app/sdk/next/server';

export default async function RootLayout({ children }) {
  const guardScript = await getStaticGuardScript();

  return (
    <html lang="en">
      <body>
        <KatlaNextProvider siteId="your-site-id" guardScript={guardScript}>
          {children}
        </KatlaNextProvider>
      </body>
    </html>
  );
}
```

## Programmatic API

### fetchStaticAll

Fetch all static resources programmatically.

```typescript
import { fetchStaticAll } from '@katla.app/sdk/static';

const { cookies, policies, guard, manifest } = await fetchStaticAll({
  siteId: 'your-site-id',
  dir: '.katla',        // optional, default
  format: 'full',       // optional, default
  // locale: 'en-GB',   // optional, omit to pull all locales
});
```

### fetchStaticCookies

Fetch only cookie data.

```typescript
import { fetchStaticCookies } from '@katla.app/sdk/static';

const cookies = await fetchStaticCookies({
  siteId: 'your-site-id',
  outputPath: './public/cookies.json', // optional
});
```
