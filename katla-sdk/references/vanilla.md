# Katla SDK - Vanilla JavaScript & Widget

## Widget (Simplest Integration)

Add the script tag to your HTML:

```html
<script src="https://dist.katla.app/{siteId}.js"></script>
```

The widget automatically:
1. Installs a cookie guard that intercepts `document.cookie` writes
2. Displays consent UI if no prior consent exists
3. Records preferences in a `_katla_consent` cookie (365-day expiry)
4. Blocks non-consented cookies

### Query Parameters

| Parameter | Values | Function |
|-----------|--------|----------|
| `locale` | e.g., `en-GB` | Language for the widget UI |
| `theme` | `light`, `dark` | Override theme |
| `headless` | `true` | Cookie guard only, no visible widget |
| `debug` | `true` | Enable console logging |

```html
<script src="https://dist.katla.app/{siteId}.js?theme=dark&debug=true"></script>
```

### Widget Customization (via Katla site settings)

| Setting | Options | Default |
|---------|---------|---------|
| Layout | `box`, `banner` | `box` |
| Position | `top-left`, `top-right`, `bottom-left`, `bottom-right` | `bottom-right` |
| Theme | `system`, `light`, `dark` | `system` |
| Border radius | `0`--`10` | -- |
| Colors | Custom hex (primary, secondary, accent, foreground, muted) | -- |
| Google Consent Mode | `enabled`, `disabled` | `disabled` |
| Regulation | `auto`, `gdpr`, `ccpa` | `auto` |
| DMA Compliant | `true`, `false` | `false` |

## TypeScript SDK Client

```typescript
import { createKatlaClient } from '@katla.app/sdk';

const client = createKatlaClient({
  siteId: 'your-site-id',
  // baseUrl: 'https://dist.katla.app', // optional CDN override
});
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getCookies()` | `Promise<CookieData>` | Fetch detected cookies by category |
| `getManifest()` | `Promise<Manifest>` | Fetch site manifest |
| `getGuardScript()` | `Promise<string>` | Fetch guard script source |
| `injectGuard()` | `Promise<void>` | Inject the guard script into the page |
| `onConsentChange(cb)` | `() => void` | Subscribe to consent changes; returns unsubscribe |

```typescript
// Fetch cookies
const data = await client.getCookies();
for (const [category, cookies] of Object.entries(data.cookies)) {
  console.log(`${category}: ${cookies.length} cookies`);
}

// Inject guard and listen for consent
await client.injectGuard();

const unsubscribe = client.onConsentChange((consent) => {
  console.log('analytics allowed:', consent.analytics);
});

// Later: unsubscribe();
```

## JavaScript API (`window.KatlaConsent`)

Available after the widget or guard script loads.

### Properties

| Name | Type | Description |
|------|------|-------------|
| `siteId` | `string` | Your site's UUID |
| `categories` | `string[]` | All available cookie categories |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `hasConsent()` | `boolean` | Whether any consent decision exists |
| `getConsent()` | `{ type, categories } \| null` | Current consent details |
| `getAllowedCategories()` | `string[]` | Currently allowed categories |
| `isCategoryAllowed(category)` | `boolean` | Check if a category is allowed |
| `isCookieAllowed(name)` | `boolean` | Check if a specific cookie is allowed |
| `acceptAll()` | `void` | Accept all categories |
| `acceptCategories(categories)` | `void` | Accept specific categories (string[]) |
| `rejectAll()` | `void` | Reject non-essential categories |
| `optOutOfSale()` | `void` | CCPA opt-out of sale |
| `getRegulation()` | `'gdpr' \| 'ccpa'` | Current detected regulation |
| `isGPCEnabled()` | `boolean` | Whether GPC signal is present |

### Consent Change Listener

```javascript
KatlaConsent.onConsentChange = (consent) => {
  console.log('Consent updated:', consent);
};
```

## Google Consent Mode (Vanilla)

```javascript
import { setupGoogleConsentMode } from '@katla.app/sdk';
const cleanup = setupGoogleConsentMode();
// cleanup(); // when needed
```

## Alternative Embed Formats

| Format | Endpoint | Purpose |
|--------|----------|---------|
| HTML | `https://dist.katla.app/{siteId}.html` | Standalone cookie settings iframe |
| JSON | `https://dist.katla.app/{siteId}.json` | Raw cookie data for custom integrations |
| Manifest | `https://dist.katla.app/{siteId}/manifest.json` | Resource discovery |

## Policy Embed

```html
<div id="katla-policy"></div>
<script src="https://dist.katla.app/{siteId}/policy.js"></script>
```

### Format options via query parameter

- `full` (default): Full cookie + privacy policy
- `cookie`: Cookie policy only
- `table`: Cookie table data only

### Localization

Auto-detects browser language. Override: `policy.js?locale=de-DE`

### Custom styling with CSS classes

```html
<script>
  window.KatlaPolicy = {
    classes: {
      wrapper: "container mx-auto px-4",
      h1: "text-4xl font-bold mb-6",
      h2: "text-2xl font-semibold mt-8 mb-4",
      p: "text-gray-600 leading-relaxed mb-4",
      table: "w-full border-collapse",
      th: "text-left p-2 font-medium",
      td: "p-2",
    }
  };
</script>
<div id="katla-policy"></div>
<script src="https://dist.katla.app/{siteId}/policy.js"></script>
```

### Custom styling with inline styles

```html
<script>
  window.KatlaPolicy = {
    styles: {
      h1: "font-size: 2rem; color: #111;",
      p: "color: #444; line-height: 1.6;",
      table: "width: 100%; border-collapse: collapse;",
    }
  };
</script>
```

Both `classes` and `styles` can be used together.

### Supported elements

wrapper, h1, h2, h3, p, table, thead, tbody, tr, th, td, ul, li, a, strong, em

### JavaScript API

```javascript
window.KatlaPolicy.render("#my-policy");
window.KatlaPolicy.getMarkdown().then(md => console.log(md));
console.log(window.KatlaPolicy.getLocale());
```

### Direct URL access

- HTML: `https://dist.katla.app/{siteId}/policy.html`
- JSON: `https://dist.katla.app/{siteId}/policy.json`
- Markdown: `https://dist.katla.app/{siteId}/policy.md`
- JavaScript: `https://dist.katla.app/{siteId}/policy.js`
