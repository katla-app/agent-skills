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

## APAC Regional Trackers

Western cookie scanners routinely miss these. On a site serving Japan, Korea, Greater China or
Southeast Asia, these are the tags most likely to fire before consent and go unreported.

### Cookies

| Cookie | Service | Region | Purpose |
|--------|---------|--------|---------|
| `_lt`, `__lt__cid` | LINE Tag | JP, TH, TW | Ad conversion tracking |
| `B`, `T`, `XB` (on `yahoo.co.jp`) | Yahoo! JAPAN | JP | Ad targeting and measurement |
| `ra_uid`, `rat_*` | Rakuten Analytics Tag | JP | Analytics and ad attribution |
| `NNB`, `nx_ssl` | Naver | KR, regional | Ad targeting |
| `wcs_bt` | Naver Analytics | KR, regional | Site analytics |
| `_kau`, `_kahai`, `_karmt` | Kakao | KR, regional | Ad and conversion tracking |
| `_hmt`, `HMACCOUNT` | Baidu Tongji | CN, regional | Site analytics |
| `pgv_pvid` | Tencent | CN, regional | Analytics and ad tracking |
| `cna`, `_tb_token_`, `xman_us_f` | Alibaba / Alimama | CN, SEA | Ad and commerce tracking |
| `SPC_F`, `SPC_EC`, `SPC_U` | Shopee | SEA | Commerce session and tracking |
| `lzd_cid`, `t_uid`, `t_fv` | Lazada | SEA | Commerce tracking |
| `cto_bundle`, `cto_bidid` | Criteo | Heavy use in JP/KR | Retargeting |

### Ad-tech and analytics domains to flag pre-consent

| Domain | Service | Category |
|--------|---------|----------|
| `tr.line.me`, `d.line-scdn.net` | LINE Tag | Marketing |
| `yjtag.yahoo.co.jp`, `b.yjtag.jp`, `s.yimg.jp` | Yahoo! JAPAN | Marketing |
| `rat.rakuten.co.jp`, `r.r10s.jp` | Rakuten | Marketing/Analytics |
| `wcs.naver.net`, `nlog.naver.com` | Naver | Analytics/Marketing |
| `t1.daumcdn.net`, `analytics.kakao.com` | Kakao | Marketing |
| `hm.baidu.com` | Baidu Tongji | Analytics |
| `tajs.qq.com`, `pingjs.qq.com` | Tencent | Analytics |
| `log.mmstat.com` | Alimama | Marketing |
| `analytics.tiktok.com` | TikTok | Marketing |
| `*.appsflyer.com`, `app.adjust.com` | AppsFlyer / Adjust | Attribution |

> Cookie names for these platforms are less consistently documented than the Google and Meta
> equivalents. Treat the table as a starting point for identification, confirm against what the
> site actually sets, and verify categorisation before putting a name in a compliance report.

## Red Flags During Audit

Watch for these patterns that indicate potential compliance issues:

1. **Long-lived tracking cookies** (>13 months) set without consent
2. **Third-party cookies** from ad networks present before consent
3. **Fingerprinting scripts** that don't rely on cookies but still track users
4. **Zombie cookies** that regenerate after deletion (using localStorage, ETags, etc.)
5. **Cookie syncing** between multiple ad networks
6. **Undisclosed cookies** not mentioned in the cookie policy
7. **Cookies with generic names** that obscure their purpose
8. **Regional ad tags firing pre-consent** (LINE, Yahoo! JAPAN, Naver, Kakao, Shopee, Lazada,
   Baidu, Tencent) — commonly missed because Western scanners do not recognise them
9. **Cookie policy that lists only Western trackers** while the page loads regional ones
