# Common Cookie Database

Quick reference for identifying cookies during compliance audits.

## Analytics Cookies

| Cookie | Service | Purpose |
|--------|---------|---------|
| `_ga` | Google Analytics | Distinguishes unique users (2-year expiry) |
| `_ga_*` | Google Analytics 4 | GA4 session persistence |
| `_gid` | Google Analytics | Distinguishes users (24-hour expiry) |
| `_gat` | Google Analytics | Throttle request rate |
| `_gac_*` | Google Ads/Analytics | Campaign-related information |
| `__utma`, `__utmb`, `__utmc`, `__utmz` | Google Analytics (legacy) | Legacy UA tracking |
| `_hjid` | Hotjar | Unique user ID |
| `_hjSession_*` | Hotjar | Session data |
| `_hjSessionUser_*` | Hotjar | User session data |
| `mp_*` | Mixpanel | User tracking and analytics |
| `ajs_*` | Segment | Analytics.js tracking |
| `amplitude_*` | Amplitude | User analytics |
| `_clck`, `_clsk` | Microsoft Clarity | Session recording |
| `ph_*` | PostHog | Product analytics |
| `plausible_*` | Plausible | Privacy-friendly analytics |

## Marketing / Advertising Cookies

| Cookie | Service | Purpose |
|--------|---------|---------|
| `_fbp` | Meta/Facebook | Browser identification for ad targeting |
| `_fbc` | Meta/Facebook | Click identifier from Facebook ads |
| `_gcl_au` | Google Ads | Conversion linker |
| `_gcl_aw` | Google Ads | Google Ads click info |
| `_uetsid`, `_uetvid` | Microsoft/Bing Ads | Ad tracking |
| `_pin_unauth` | Pinterest | Conversion tracking |
| `_tt_enable_cookie` | TikTok | Check if cookies can be placed |
| `_ttp` | TikTok | Tracking pixel |
| `li_fat_id`, `li_sugr` | LinkedIn | Ad targeting and analytics |
| `IDE`, `DSID` | Google DoubleClick | Ad serving and retargeting |
| `test_cookie` | Google DoubleClick | Check if cookies are supported |
| `NID` | Google | Preferences and ad personalization |
| `fr` | Facebook | Ad delivery and measurement |
| `tr` | Facebook | Tracking pixel |
| `snapchat_*` | Snapchat | Ad conversion tracking |
| `twclid` | Twitter/X | Click tracking |
| `personalization_id` | Twitter/X | Ad personalization |

## Functional Cookies

| Cookie | Service | Purpose |
|--------|---------|---------|
| `JSESSIONID` | Java servers | Server session ID |
| `PHPSESSID` | PHP servers | Server session ID |
| `connect.sid` | Node.js/Express | Server session ID |
| `__next_*` | Next.js | Framework cookies |
| `csrf_token`, `XSRF-TOKEN`, `_csrf` | Various | CSRF protection |
| `i18next`, `NEXT_LOCALE` | Various | Language/locale preference |
| `cookie_consent`, `cookieconsent_status` | Various | Consent state storage |
| `_katla_consent` | Katla | Consent state storage |

## Security Cookies

| Cookie | Service | Purpose |
|--------|---------|---------|
| `__cf_bm` | Cloudflare | Bot management |
| `cf_clearance` | Cloudflare | Challenge completion |
| `__cfruid` | Cloudflare | Rate limiting |
| `_dd_s` | Datadog | Session tracking for monitoring |
| `__hstc` | HubSpot | Visitor tracking (first-party) |
| `__cfduid` | Cloudflare (deprecated) | Bot detection |

## Personalization Cookies

| Cookie | Service | Purpose |
|--------|---------|---------|
| `intercom-session-*` | Intercom | Chat session |
| `intercom-id-*` | Intercom | Visitor identification |
| `drift_*` | Drift | Chat widget |
| `crisp-client/*` | Crisp | Chat widget state |
| `hubspotutk` | HubSpot | Visitor tracking for personalization |

## Payment / E-commerce

| Cookie | Service | Purpose |
|--------|---------|---------|
| `__stripe_mid`, `__stripe_sid` | Stripe | Fraud prevention |
| `cart`, `cart_sig` | Shopify | Shopping cart |
| `_shopify_*` | Shopify | Store functionality |
| `woocommerce_*` | WooCommerce | Cart and session |

## Red Flags During Audit

Watch for these patterns that indicate potential compliance issues:

1. **Long-lived tracking cookies** (>13 months) set without consent
2. **Third-party cookies** from ad networks present before consent
3. **Fingerprinting scripts** that don't rely on cookies but still track users
4. **Zombie cookies** that regenerate after deletion (using localStorage, ETags, etc.)
5. **Cookie syncing** between multiple ad networks
6. **Undisclosed cookies** not mentioned in the cookie policy
7. **Cookies with generic names** that obscure their purpose
