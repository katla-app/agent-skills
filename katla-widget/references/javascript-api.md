# Katla Widget - JavaScript API

The widget script exposes `window.KatlaConsent` for programmatic access to consent state.

## Prerequisites

- The [consent widget](https://docs.katla.app/widget) script installed on your page

## Reading consent state

```javascript
KatlaConsent.hasConsent()              // boolean
KatlaConsent.hasGrantedConsent()       // boolean - something beyond the required categories
KatlaConsent.getConsent()              // { type, categories }
KatlaConsent.getAllowedCategories()    // string[]
KatlaConsent.getConsentRecord()        // { id, timestamp } | null
```

`hasConsent()` is true for a rejection - a refusal is a choice, and it is on file.
`hasGrantedConsent()` asks the different question of whether anything was actually allowed,
which is what tells "nothing to withdraw" apart from "nothing chosen yet".

`getConsentRecord()` returns the visitor's receipt: the server-side record id and the moment
the choice was made, in epoch milliseconds. The preference centre shows it in its status
strip, and you can show the same thing in your own UI. Either field can be `null` - the id
until the tracking call returns one, and the timestamp on installs whose cookie was written
before Katla stored it.

## Checking specific cookies or categories

```javascript
KatlaConsent.isCategoryAllowed('analytics')   // boolean
KatlaConsent.isCookieAllowed('_ga')           // boolean
```

## Setting consent programmatically

```javascript
KatlaConsent.acceptAll()
KatlaConsent.acceptCategories(['analytics', 'marketing'])
KatlaConsent.rejectAll()
KatlaConsent.withdrawConsent()  // take back a consent already given
KatlaConsent.optOutOfSale()  // CCPA: opt out of sale/sharing
```

The widget follows whichever way the choice was made. Calling `acceptAll()` from your own
control closes the banner and shows the settings button, exactly as pressing **Accept All** in
the banner does, and the same holds for `rejectAll()`, `acceptCategories()` and
`optOutOfSale()`.

`rejectAll()` records a choice; `withdrawConsent()` takes one back. They end in the same
state - required categories only, every other cookie removed, the refusal stored against the
existing consent id - and that is deliberate. Withdrawing used to delete the `_katla_consent`
cookie, which meant the visitor who withdrew was re-prompted on every page load afterwards
while the one who pressed Reject was not: the same intent, and the more deliberate act got
nagged for it. Under CCPA it defers to `optOutOfSale()`, because there an absent cookie means
*allowed* and erasing it would undo the refusal.

## Opening the preference center

```javascript
katla.open()
```

`window.katla` is a small façade installed by the widget script, separate from
`KatlaConsent`: that one reads and writes the decision, this one shows the screen for making
it. Wire it to your own control - a footer link is the usual place:

```html
<button type="button" onclick="katla.open()">Cookie settings</button>
```

It is the answer whenever the floating cookie icon is turned off, and worth having even when
it is not: the right to withdraw has to be as easy to exercise as giving consent was, and a
link in the footer is where people look for it.

The script loads asynchronously, so `window.katla` does not exist for the first few hundred
milliseconds of a page. Guard the call if your control is in the server-rendered HTML:

```javascript
window.katla?.open?.()
```

## Listening for changes

```javascript
const unsubscribe = KatlaConsent.subscribe((consent) => {
  console.log('Consent updated:', consent) // { type, categories }
})

// Later, to stop listening:
unsubscribe()
```

`subscribe()` hears every change, whether it came from the banner, the preference center or
this API, and any number of listeners can be registered. It was added in guard script version
`2` (`KatlaConsent.version`).

`onConsentChange` still works, but it is a single slot: assigning it replaces whatever was
there, including a handler set by another integration.

```javascript
KatlaConsent.onConsentChange = (consent) => {
  console.log('Consent updated:', consent)
}
```

## Google Consent Mode

If you use Google Analytics or Google Ads and want to signal consent state via Google Consent Mode v2, use `setupGoogleConsentMode()` from the SDK:

```javascript
import { setupGoogleConsentMode } from '@katla.app/sdk';

const cleanup = setupGoogleConsentMode();
```

This sets default consent to `denied` for all Google parameters, then automatically updates them when the visitor makes a consent choice. See the [Google Consent Mode guide](https://docs.katla.app/google-consent-mode) for full details.

## Regulation and GPC

```javascript
KatlaConsent.getRegulation()  // 'gdpr' or 'ccpa'
KatlaConsent.isGPCEnabled()   // true if browser has GPC enabled
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `siteId` | `string` | Your site's UUID |
| `categories` | `string[]` | All available cookie categories |

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `acceptAll()` | `void` | Accept all cookie categories |
| `rejectAll()` | `void` | Reject all non-functional cookies |
| `withdrawConsent()` | `void` | Withdraw a consent already given: deletes the consent cookie and shows the banner again |
| `acceptCategories(categories)` | `void` | Accept specific categories |
| `optOutOfSale()` | `void` | CCPA: opt out of sale/sharing of personal information |
| `hasConsent()` | `boolean` | Whether visitor has made a consent choice |
| `getConsent()` | `object \| null` | Current consent state (`{ type, categories }`) |
| `getAllowedCategories()` | `string[]` | Currently allowed categories |
| `isCategoryAllowed(category)` | `boolean` | Check if a specific category is allowed |
| `isCookieAllowed(name)` | `boolean` | Check if a specific cookie is allowed |
| `isGPCEnabled()` | `boolean` | Whether browser GPC signal is active |
| `getRegulation()` | `string` | Active regulation (`'gdpr'` or `'ccpa'`) |
