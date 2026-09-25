# Accessibility widget configuration

The bundle at `https://cdn.katla.app/a11y.js` is the same file for every site, so all
configuration comes from the page that loads it, through two channels:

- **`data-*` attributes** on the script tag - the short path.
- **`window.KatlaA11y`**, declared in a script *above* the tag - the full surface, including
  panel colours and labels.

Colours have a third source underneath both: the site's branding in Katla, which the widget
fetches with `data-site`. The tag and the global only override it.

Where both set the same thing, `window.KatlaA11y` wins. Invalid values are ignored and the
default is used instead, so a typo never breaks the widget - but it also never warns you.

## Options

| Attribute | `window.KatlaA11y` key | Values | Default |
|---|---|---|---|
| `data-site` | `site` | The Katla site ID | none (branding shown) |
| `data-position` | `position` | `bottom-right`, `bottom-left` | `bottom-right` |
| `data-accent` | `theme.accent` | Hex, `#rgb` or `#rrggbb` | Brand primary, else `#5B21B6` |
| - | `theme.panel` | Hex: panel background | Brand background, else `#ffffff` |
| - | `theme.text` | Hex: panel text | Brand text colour, else `#16161a` |
| `data-statement` | `statementUrl` | `https://`, `http://`, `mailto:` or a path | none (link hidden) |
| `data-feedback` | `feedbackUrl` | `https://`, `http://`, `mailto:` or a path | none (link hidden) |
| `data-shortcut` | `shortcut` | e.g. `alt+shift+a`, `ctrl+alt+k`; `off` disables | `alt+shift+a` |
| `data-skip-link` | `skipLink` | `"false"` / `false` removes the hidden first-tab-stop button | on |
| - | `labels` | Object of label overrides, see below | English |

Notes:

- **Colours are hex only.** Named colours, `rgb()`, `hsl()` and `var()` are ignored. Resolve
  a design token to its final hex value first.
- **Branding first.** Without a colour on the tag or the global, the widget uses the site's
  branding (the light colours, or the dark ones if the banner theme is `dark`). Overriding
  it here is per page and stops following later branding changes.
- **Contrast.** The launcher icon is white, or dark when `accent` is too pale for white.
  `text` on `panel` should reach 4.5:1.
- **Links** with any other scheme (including `javascript:`) are dropped.
- **Shortcut** is modifiers joined with `+` and a single character last. Modifiers: `alt`
  (or `option`), `ctrl` (or `control`), `shift`, `meta` (or `cmd`). Avoid `alt+1`..`alt+9`:
  they switch browser tabs on Windows and Linux. Turning the shortcut off leaves the skip
  button and the launcher as the keyboard routes in.
- **Skip link.** Keep it on unless the site already has its own control that opens the
  panel early in the tab order: without it, a keyboard user reaches the launcher only after
  tabbing through the whole page.
- **Branding** is not configurable. The widget asks the CDN, per site ID, and shows the
  "Powered by Katla" line on the Free and Starter plans. Pro and above drop it.

## Labels

Every string in the panel can be overridden. Pass only the ones you change; empty strings
and unknown keys are ignored.

| Key | Default |
|---|---|
| `title` | Accessibility |
| `open` | Accessibility settings (launcher and skip button) |
| `close` | Close accessibility settings |
| `textSize` | Text size |
| `defaultSize` | Default text size |
| `textAlign` | Text alignment |
| `alignDefault` | Auto |
| `alignLeft` | Left |
| `alignCentre` | Centre |
| `alignRight` | Right |
| `reading` | Reading |
| `readableFont` | Readable font |
| `lineSpacing` | Extra line spacing |
| `letterSpacing` | Extra letter spacing |
| `readingGuide` | Reading guide |
| `colour` | Colour |
| `dark` | Dark |
| `light` | Light |
| `contrast` | High contrast |
| `invert` | Invert colours |
| `saturation` | Saturation |
| `lowSaturation` | Low saturation |
| `monochrome` | Monochrome |
| `highSaturation` | High saturation |
| `navigation` | Navigation |
| `highlightLinks` | Highlight links |
| `highlightHeadings` | Highlight headings |
| `highlightFocus` | Highlight focus |
| `highlightHover` | Highlight hover |
| `bigCursor` | Large cursor |
| `media` | Media |
| `hideImages` | Hide images |
| `muteSounds` | Mute sounds |
| `stopAnimations` | Stop animations |
| `reset` | Reset all |
| `hide` | Hide this button |
| `hideHint` | It comes back when you reload the page. |
| `statement` | Accessibility statement |
| `feedback` | Report a problem |
| `brand` | Powered by |

There is no `locale` option: to serve the panel in the page's language, set the labels from
the site's own translations, for example by rendering `window.KatlaA11y` per locale.

## Declaring the global per stack

Plain HTML, Vite and Lovable (`index.html`):

```html
<script>
  window.KatlaA11y = { labels: { title: 'Barrierefreiheit' } };
</script>
<script src="https://cdn.katla.app/a11y.js" data-site="{siteId}" defer></script>
```

Next.js App Router (`app/layout.tsx`), as the last children of `<body>`:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `window.KatlaA11y = ${JSON.stringify({ labels: { title: 'Barrierefreiheit' } })};`,
  }}
/>
<script src="https://cdn.katla.app/a11y.js" data-site="{siteId}" defer />
```

The global is read once, when the script runs. Changing it later has no effect until the
next page load.

## Opening the panel from the site

| Trigger | Example |
|---|---|
| A link to the hash | `<a href="#katla-a11y">Accessibility</a>` |
| An attribute on any element | `<button type="button" data-katla-a11y-open>Accessibility</button>` |
| An event | `window.dispatchEvent(new Event('katla-a11y:open'))` |

All three also bring back a launcher the visitor hid.

## What is stored

The visitor's choices are saved in `localStorage` under `katla-a11y`, on their device only.
It is not a cookie and is never sent to Katla or the site, so it needs no consent and does
not appear in the cookie scan. In private browsing, or with storage blocked, the settings
apply for the current page view only.
