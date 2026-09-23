# Katla SDK - React Integration

Package: `@katla.app/sdk/react`

## KatlaProvider

Wrap your app with `KatlaProvider` to enable all Katla hooks and components.

```tsx
import { KatlaProvider } from '@katla.app/sdk/react';

function App() {
  return (
    <KatlaProvider siteId="your-site-id">
      {/* Your app */}
    </KatlaProvider>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `siteId` | `string` | -- | Your site's UUID (required) |
| `baseUrl` | `string` | `https://cdn.katla.app` | Override the CDN base URL |
| `locale` | `PolicyLocale` | -- | Default locale for policy documents (e.g., `en-GB`, `de-DE`, `sv-SE`) |
| `debug` | `boolean` | `false` | Enable console logging |
| `initialCookies` | `CookieData \| null` | -- | Pre-fetched cookie data (skips runtime fetch) |
| `guardScript` | `string` | -- | Pre-fetched guard script content |
| `guard` | `boolean` | `true` | Inject the cookie guard script |
| `consentBridge` | `boolean` | `true` | Connect `window.KatlaConsent` events to React state |
| `googleConsentMode` | `boolean` | `false` | Signal consent state to Google Analytics/Ads |

## Hooks

### useKatlaCookies

Returns cookie data grouped by category.

```tsx
import { useKatlaCookies } from '@katla.app/sdk/react';

function CookieList() {
  const { cookies, loading, error } = useKatlaCookies();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!cookies) return null;

  return (
    <ul>
      {Object.entries(cookies.cookies).map(([category, list]) => (
        <li key={category}>{category}: {list.length} cookies</li>
      ))}
    </ul>
  );
}
```

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `cookies` | `CookieData \| null` | Cookie data grouped by category |
| `loading` | `boolean` | `true` while fetching |
| `error` | `Error \| null` | Fetch error, if any |

### useKatlaConsent

Read current consent state and subscribe to changes.

```tsx
import { useKatlaConsent } from '@katla.app/sdk/react';

function ConsentStatus() {
  const { consent } = useKatlaConsent();

  if (!consent) return <p>No consent recorded yet.</p>;

  return (
    <ul>
      {Object.entries(consent).map(([category, allowed]) => (
        <li key={category}>{category}: {allowed ? 'Allowed' : 'Declined'}</li>
      ))}
    </ul>
  );
}
```

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `consent` | `ConsentState \| null` | Current consent per category, or `null` if none |
| `onChange` | `(callback) => () => void` | Subscribe to consent changes; returns unsubscribe |

### useKatlaClient

Returns the underlying `KatlaClient` instance for direct SDK access.

```tsx
import { useKatlaClient } from '@katla.app/sdk/react';

function ManifestLoader() {
  const client = useKatlaClient();

  async function loadManifest() {
    const manifest = await client.getManifest();
    console.log(manifest);
  }

  return <button onClick={loadManifest}>Load manifest</button>;
}
```

### useConsentManager

Full consent management state and actions for building custom consent UIs.

```tsx
import { useConsentManager } from '@katla.app/sdk/react';

function MyConsentUI() {
  const {
    ready, hasDecision, open, setOpen,
    selected, availableCategories, toggleCategory,
    acceptAll, rejectAll, saveSelection, cookies,
  } = useConsentManager();

  if (!ready) return null;

  return (
    <div>
      {!hasDecision && (
        <div>
          <p>We use cookies.</p>
          <button onClick={acceptAll}>Accept all</button>
          <button onClick={rejectAll}>Reject all</button>
          <button onClick={() => setOpen(true)}>Customize</button>
        </div>
      )}
      {open && (
        <div>
          {availableCategories.map((cat) => (
            <label key={cat}>
              <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggleCategory(cat)} />
              {cat}
            </label>
          ))}
          <button onClick={saveSelection}>Save</button>
        </div>
      )}
    </div>
  );
}
```

**Returns:**

| Field | Type | Description |
|-------|------|-------------|
| `ready` | `boolean` | `true` once `window.KatlaConsent` is available |
| `hasDecision` | `boolean` | `true` after the visitor has made a consent choice |
| `open` | `boolean` | Whether the preferences panel is visible |
| `setOpen` | `(open: boolean) => void` | Toggle the preferences panel |
| `selected` | `ManageableCategory[]` | Currently selected categories |
| `availableCategories` | `ManageableCategory[]` | Categories that have cookies |
| `toggleCategory` | `(cat: ManageableCategory) => void` | Toggle a category on/off |
| `acceptAll` | `() => void` | Accept all categories and close the panel |
| `rejectAll` | `() => void` | Reject non-essential categories and close the panel |
| `saveSelection` | `() => void` | Save selected categories and close the panel |
| `cookies` | `{ data, loading, error }` | Cookie data from `useKatlaCookies()` |

## Components

### CookieBanner

Pre-built consent banner with accept/reject/customize actions.

```tsx
import { CookieBanner } from '@katla.app/sdk/react';

// Basic usage
<CookieBanner />

// Custom labels
<CookieBanner
  title="We use cookies"
  description="Choose which categories you'd like to allow."
  labels={{
    acceptAll: 'Accept all',
    rejectAll: 'Reject non-essential',
    saveSelection: 'Save selection',
    functionalBadge: 'Functional always on',
    privacyTrigger: 'Privacy preferences',
  }}
  className="my-banner"
/>

// Render prop for full UI override
<CookieBanner>
  {({ acceptAll, rejectAll, open, setOpen, selected, toggleCategory, saveSelection }) => (
    <div className="my-custom-banner">
      <button onClick={acceptAll}>OK</button>
      <button onClick={rejectAll}>No thanks</button>
      <button onClick={() => setOpen(!open)}>Customize</button>
    </div>
  )}
</CookieBanner>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Cookie preferences"` | Banner heading |
| `description` | `ReactNode` | Brief consent copy | Descriptive text below the title |
| `labels` | `object` | See above | Button and badge labels |
| `className` | `string` | -- | Additional class on root element |
| `children` | `(state: ConsentManagerState) => ReactNode` | -- | Render prop for full UI override |

### CookieCatalog

Renders all detected cookies grouped by category.

```tsx
import { useKatlaCookies, CookieCatalog } from '@katla.app/sdk/react';

function CookieList() {
  const { cookies, loading, error } = useKatlaCookies();
  return <CookieCatalog data={cookies} loading={loading} error={error} />;
}

// With custom rendering
<CookieCatalog
  data={cookies}
  loading={loading}
  error={error}
  maxPerCategory={10}
  renderCookie={(cookie) => (
    <div><code>{cookie.name}</code> - {cookie.domain}</div>
  )}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `CookieData \| null` | -- | Cookie data from `useKatlaCookies()` |
| `loading` | `boolean` | `false` | Show loading state |
| `error` | `Error \| string \| null` | -- | Show error state |
| `maxPerCategory` | `number` | `5` | Max cookies shown per category |
| `className` | `string` | -- | Additional class on root element |
| `emptyMessage` | `string` | `"No cookies found."` | Message when no cookies exist |
| `renderCategory` | `(category, cookies) => ReactNode` | -- | Override a full category section |
| `renderCookie` | `(cookie, category) => ReactNode` | -- | Override a single cookie row |

## Static Cookies with React

Pre-fetch cookies at build time to avoid runtime fetches:

```json
{
  "scripts": {
    "prebuild": "katla pull your-site-id",
    "build": "vite build"
  }
}
```

```tsx
import cookies from './.katla/cookies.json';

<KatlaProvider siteId="your-site-id" initialCookies={cookies}>
  {/* useKatlaCookies() returns data immediately */}
</KatlaProvider>
```

## Full Example

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { KatlaProvider, CookieBanner, CookieCatalog, useKatlaCookies } from '@katla.app/sdk/react';

function App() {
  const { cookies, loading, error } = useKatlaCookies();

  return (
    <div>
      <h1>Cookie consent</h1>
      <CookieCatalog data={cookies} loading={loading} error={error} />
      <CookieBanner />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KatlaProvider siteId="your-site-id" debug>
      <App />
    </KatlaProvider>
  </StrictMode>,
);
```
