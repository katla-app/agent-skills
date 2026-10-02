# Katla for Claude Code

Cookie consent and compliance from your coding agent. This plugin connects Claude to your
[Katla](https://katla.app) account and teaches it how to install Katla in your code.

## What it adds

- **The Katla MCP server** at `https://api.katla.app/mcp`. Claude can list your sites, scan
  them for cookies, read consent rates, fix a cookie's category and fetch the install snippet
  for a site. It signs in with your own Katla account over OAuth, so it reaches only the
  teams and sites you already have access to. There is no API key.
- **Four skills** that Claude reads before it writes any code:
  - `katla-widget` installs the hosted consent banner: one script tag, a cookie settings
    link and the policy embed.
  - `katla-sdk` builds a custom banner with `@katla.app/sdk` for React, Next.js, Vite or
    plain JavaScript.
  - `katla-policy` puts the privacy and cookie policy Katla generates from your scan on a
    page of your site.
  - `katla-accessibility-widget` installs the accessibility widget. It lets visitors adjust
    the page for themselves. It is not an audit and does not make a site compliant.

## Install

```bash
claude plugin marketplace add katla-app/ai
claude plugin install katla@katla
```

Then run `/mcp` in Claude Code, choose the Katla server and pick **Authenticate**. A browser
window opens where you sign in with your Katla account.

## What it sends and where

The plugin runs no scripts and has no hooks. Through it, Claude talks to one service, Katla:

- **The Katla MCP server** receives the requests Claude makes through its tools: the site or
  URL you ask about and the changes you ask for. Tools that change something declare it, so
  Claude Code can ask you first.
- **Company details for your policy.** If you ask Claude to set up the privacy policy, it
  sends the company name and privacy contact email and, if you give them, a DPO email, the
  company address and its registration number. Katla stores them with your site until you
  change or remove them.
- **Consent records** come back without names, emails or IP addresses: an ID, what was
  accepted or rejected, and when.

Two things the skills can lead Claude to do outside the MCP server:

- **Install Katla's packages from npm**: `@katla.app/sdk` for a custom banner and, only when
  you ask for it, the `@katla.app/cli` command line tool. The CLI signs in through your
  browser and talks to Katla's API at `api.katla.app`, the same service as the MCP server.
- **Add Katla's script to your site.** The code Claude writes loads the banner from
  `cdn.katla.app`. Once you deploy it, your site sends its visitors' consent choices to
  Katla. That is the product, and it happens on your website, not on your machine.

## Try it

Ask Claude something that needs your Katla data, for example "Which sites do I have in Katla,
and when was each last scanned?" or "Install the Katla cookie banner on this site."

## Links

- [Setup guide](https://docs.katla.app/mcp-server)
- [Every tool and the permission model](https://docs.katla.app/mcp-reference)
- [Privacy policy](https://katla.app/privacy-policy) and [terms](https://katla.app/terms)
