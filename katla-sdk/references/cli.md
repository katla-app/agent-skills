# Katla CLI Reference

## Installation

```bash
npm install -g @katla.app/cli
```

## Authentication

| Command | Description |
|---------|-------------|
| `katla login` | Opens browser to sign in |
| `katla signup` | Opens browser to create an account |
| `katla logout` | Clears stored credentials |
| `katla switch` | Switch between teams |

## Status

```bash
katla status
```

Quick overview of all domains with verification status, last scan date, and scan count.

## Domains

| Command | Description |
|---------|-------------|
| `katla domains ls` | List all domains |
| `katla domains add example.com` | Add a domain (optional `--method meta_tag\|dns`) |
| `katla domains verify example.com` | Verify ownership (polls up to 60 seconds) |
| `katla domains rm example.com` | Remove a domain (with confirmation) |
| `katla domains scan example.com` | Trigger a cookie scan (polls up to 6 minutes) |

## Cookies

| Command | Description |
|---------|-------------|
| `katla cookies ls example.com` | List cookies (optional `--category analytics`) |
| `katla cookies update example.com _ga analytics` | Reclassify a cookie |
| `katla cookies export example.com` | Export to CSV (optional `--output my-cookies.csv`) |

Valid categories: `functional`, `personalization`, `analytics`, `marketing`, `security`, `unknown`.

## Consents

| Command | Description |
|---------|-------------|
| `katla consents ls example.com` | List consent records (optional `--limit 100`) |
| `katla consents export example.com` | Export to CSV (optional `--output my-consents.csv`) |

## Widget & Plan

| Command | Description |
|---------|-------------|
| `katla install example.com` | Outputs manifest, script, HTML, and JSON URLs |
| `katla plan` | View current plan, usage stats, and available plans |
| `katla plan change` | Interactive prompt to select a new plan |

## Static Cookies

```bash
katla pull              # uses katla.config.mjs
katla pull <site-id>    # explicit site ID
```

Fetches cookies, policies, guard script, and manifest to `.katla/` directory.

## Domain Verification

### Meta Tag Method

```html
<meta name="katla-verification" content="your-token-here" />
```

### DNS Method

Add a TXT record:
- Name: `_katla-verification`
- Value: `your-token-here`

DNS changes can take a few minutes to propagate.
