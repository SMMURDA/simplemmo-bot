# TOPUP AUTOMOTION — public documentation

This repository hosts the public documentation website at
<img src="assets/images/logo-topup-48.png" alt="" width="18" height="18" align="absmiddle"> [topup.eu.org](https://topup.eu.org).
It covers two products:

| Product | Documentation | Distribution |
| --- | --- | --- |
| **SimpleMMO Bot** | [`smmo/`](smmo/) | this repository's Releases |
| **vHack Revolutions** | [`vhack/`](vhack/) | arranged directly with the developer |

The site is built with Jekyll and deployed to GitHub Pages from this repository.

## This repository is the download channel for SimpleMMO Bot

The Windows and Linux builds attached to the
[latest release](https://github.com/SMMURDA/simplemmo-bot/releases/latest) are the
same files the download buttons on
[the downloads page](https://topup.eu.org/smmo/downloads/) serve. Releases from
v3.0.0 onwards list the SHA-256 of both files, so you can verify what you
downloaded before running it.

vHack Revolutions is distributed directly by the developer. Request access through
the contact channels below.

## What is in this repository

- `smmo/`, `vhack/` — getting started, features, configuration, downloads, troubleshooting
- `api/reference.md` — the third-party routes each bot calls, and what they are used for
- `features.md`, `licensing.md`, `about.md`, `privacy.md`, `terms.md` — product, licensing and legal pages
- `accounts/`, `admin/`, `account.html`, `admin.html`, `trial.html`, `index.html` — portal and product pages
- `_config.yml`, `_layouts/`, `_includes/`, `assets/` — site theme, styling and scripts
- `tools/` — build scripts for the JavaScript/CSS bundles and the documentation search index
- `maintenance.json`, `search-index.json`, `_headers`, `robots.txt`, `ads.txt` — site configuration
- `CONTRIBUTING.md`, `LICENSE` — contribution rules and license

## What is not in this repository

Both bots are closed source. This repository does **not** contain the Python
application, the license server or its administration tools, private signing keys,
user credentials, or the build workspace that produces the release binaries.

## Local development

```bash
npm ci
npm run build        # rebuild the JavaScript and CSS bundles
npm run check:js     # verify the committed .min.js bundles match their sources
npm run build:docs   # rebuild the documentation search index
```

`assets/js/*.min.js` and `assets/css/site.min.css` are generated files. Edit the
sources under `assets/` and run `npm run build`; the rebuilt bundle has to be
committed together with the source change. If a committed bundle is stale, the
Pages workflow stops the deploy instead of publishing it.

Deployment is handled by `.github/workflows/pages.yml` using
`actions/jekyll-build-pages`. No `Gemfile` is included, so a local Jekyll preview
requires your own Jekyll installation; the deployed site is built from these same
sources.

## Reporting a problem

Read [CONTRIBUTING.md](CONTRIBUTING.md) first: use the latest release, check the
troubleshooting guide, and include the app version and your operating system.

## Security

Never publish `.env` files, game cookies, passwords, Telegram bot tokens, license
keys, CSRF tokens, API tokens, or private keys in an issue, a pull request, or a
screenshot. See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete list.

## Disclaimer

Automation may violate the terms or rules of SimpleMMO or vHack and may result in
account restrictions. Users are responsible for reviewing the applicable
third-party terms and for all activity performed with their accounts.

## License

The contents of this repository are covered by the proprietary license in
[LICENSE](LICENSE). The bot binaries are licensed separately through a license key
and are not covered by that license.

## Contact

- <img src="assets/icons/payments/telegram.svg" alt="" width="16" height="16" align="absmiddle"> [Telegram — @bovalone](https://t.me/bovalone)
- <img src="assets/icons/payments/email.svg" alt="" width="16" height="16" align="absmiddle"> [Email — ask@topup.eu.org](mailto:ask@topup.eu.org)

Copyright © 2026 Mustofa Bovalone. All rights reserved.
