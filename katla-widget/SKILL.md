---
name: katla-widget
description: >-
  Installs Katla's hosted cookie consent widget (one script tag) on a website and wires the
  rest of the site to it. Use when the user wants a cookie banner, cookie consent, GDPR/CCPA
  consent or a cookie policy on their site and has not asked for a custom-built banner, or
  mentions "Katla widget," "katla install," "KatlaConsent," "katla.open," "policy embed," or
  "cookie settings link." Works on any site: Vite, React, Next.js, plain HTML, Lovable,
  site builders. For a custom banner built in code, use the katla-sdk skill instead.
homepage: https://docs.katla.app/widget
---

# Katla Widget

The widget is Katla's hosted consent banner. One script tag installs a cookie guard that
refuses non-consented cookies at `document.cookie`, shows the banner to new visitors, stores
their choice, and records it as consent evidence. The banner's look, copy, regulation and
Google Consent Mode setting all live in the Katla dashboard, not in the site's code.

## Widget or SDK?

| The user wants | Use |
|---|---|
| A working, compliant banner with no UI work | This skill (the widget) |
| The banner restyled (colors, layout, position, radius, theme) | This skill - it is dashboard configuration, not code |
| A banner built from their own components, or consent as React state | The `katla-sdk` skill |

If unsure, install the widget. Use one or the other on a page, never both.

## Prerequisites

1. The site is added to Katla. With the Katla MCP server: `katla_list_sites`, or
   `katla_add_site` if it is missing. There is no DNS record or meta tag to publish first.
2. At least one completed scan, so the banner knows which cookies exist: `katla_scan_site`,
   then poll `katla_get_scan_status`. Scans crawl the published site, so scan the live
   domain rather than a local or preview URL.

## Step 1: Get the tag

Call `katla_get_install_snippet` with the site's domain. It returns the `siteId` and the
script tag:

```html
<script async src="https://cdn.katla.app/{siteId}.js"></script>
```

Use the tag exactly as returned. Never guess or invent a site ID.

Without the MCP server, the tag is in the Katla dashboard under **Install → Widget**, or from
the CLI with `katla install example.com`.

## Step 2: Put it in `<head>`

The tag goes in the document `<head>`, before any analytics, ads or other tag that sets
cookies. The guard can only refuse cookies that are written after it has run.

| Stack | Where |
|---|---|
| Vite, Lovable, plain React SPA | `index.html`, inside `<head>`, above other scripts |
| Plain HTML / multi-page site | Every page's `<head>`, or the shared head partial |
| Next.js App Router | `app/layout.tsx`: a plain `<script>` inside `<head>` in the root layout |
| Next.js Pages Router | `pages/_document.tsx`, inside `<Head>` |
| WordPress | Use the Katla WordPress plugin instead of pasting the tag |
| Site builders | The site-wide "custom code in head" setting |

Vite / Lovable example (`index.html`):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <script async src="https://cdn.katla.app/{siteId}.js"></script>
    <!-- analytics and other tags go below -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Do not load the widget from a React component or `useEffect`: by then other scripts may
already have set cookies.

## Step 3: Gate your own tags on consent

The guard blocks cookies, but a script the site loads itself should also wait for consent.
The widget exposes `window.KatlaConsent`:

```javascript
function loadAnalytics() {
  /* inject the analytics script here */
}

function onConsent() {
  if (window.KatlaConsent?.isCategoryAllowed('analytics')) loadAnalytics();
}

onConsent();
window.KatlaConsent?.subscribe(onConsent);
```

Categories: `functional` (always allowed), `personalization`, `analytics`, `marketing`,
`security`, `unknown`. See `references/javascript-api.md` for the full API.

For Google Analytics or Google Ads, prefer switching on **Google Consent Mode** in the site
settings (`katla_update_site_settings` with `googleConsentMode: true`) over gating gtag by
hand. The Katla tag must still come before the Google tag.

## Step 4: Add a "Cookie settings" link

Visitors must be able to change their mind as easily as they consented. Put a control in the
footer that opens the preference center:

```html
<button type="button" onclick="window.katla?.open?.()">Cookie settings</button>
```

In React:

```tsx
<button type="button" onClick={() => (window as any).katla?.open?.()}>
  Cookie settings
</button>
```

`window.katla` appears a moment after the script loads, so always call it with optional
chaining.

## Step 5 (optional): Embed the cookie policy

Katla generates a cookie and privacy policy from the scan. To show it on a page:

```html
<div id="katla-policy"></div>
<script src="https://cdn.katla.app/{siteId}/policy.js"></script>
```

In a React SPA, render the `<div id="katla-policy">` on the policy route and load the script
once that route has mounted. See `references/policy-embed.md` for formats, locales and
styling. Set the policy's URL as `privacyPolicyUrl` with `katla_update_site_settings` so the
banner links to it.

## Customizing the banner

Appearance is configuration, not code. With the MCP server, use `katla_update_site_settings`
(`theme`, `layout`, `regulation`, `googleConsentMode`, `privacyPolicyUrl` and more);
otherwise the site's widget settings in the dashboard. Do not restyle the widget with CSS
overrides from the site. See `references/configuration.md`.

## Verify the install

1. Open the published site in a private window: the banner should appear.
2. Before choosing, check DevTools → Application → Cookies: no analytics or marketing
   cookies should be set.
3. Accept, reload: the banner stays closed and a `_katla_consent` cookie exists.
4. With the MCP server, `katla_check_cookies` on the live URL runs a one-page audit, and
   `katla_check_consent_mode` checks the Google Consent Mode setup.

## Common mistakes

- Placing the tag at the end of `<body>` or loading it from JavaScript: cookies set before it
  runs are not blocked.
- Installing the widget and the SDK's `KatlaProvider` on the same page.
- A `Content-Security-Policy` that blocks it. Allow `https://cdn.katla.app` in `script-src`
  and `https://consent.katla.app` in `connect-src` (and `https://cdn.katla.app` in `img-src`
  on the free plan).
- Using a script optimizer that defers or combines the Katla tag.
- Scanning a preview or localhost URL instead of the published domain.
