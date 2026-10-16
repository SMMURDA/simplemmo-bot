# TOPUP AUTOMOTION — Public Documentation

This repository hosts the public documentation website at
<img src="assets/images/logo-topup-48.png" alt="" width="18" height="18" align="absmiddle"> [TOPUP.EU.ORG](https://topup.eu.org).
It covers two products:

| Product | Documentation | Distribution |
| --- | --- | --- |
| **SimpleMMO Bot** | [`smmo/`](smmo/) | this repository's Releases |
| **vHack Revolutions** | [`vhack/`](vhack/) | arranged directly with the developer |

The site is built with Jekyll and deployed to GitHub Pages from this repository.

## What this site serves

The repository is larger than a documentation site: it is the whole public
front end, including the sign-in flow and the member and admin pages.

| Area | URL | Purpose |
| --- | --- | --- |
| Documentation | `/smmo/`, `/vhack/`, `/api/reference/` | product guides and the integration reference |
| Sign-in | `/login/` | OAuth sign-in and one-day trial request. The previous `/trial/` address still exists and forwards here, keeping its query parameters. |
| Member portal | `/accounts/` | overview, trial license, buy license, my licenses, top up, e-mail verification |
| Admin panel | `/admin/` | licenses, top-ups, payment methods, pricing, users |
| Downloads | `/smmo/downloads/` | the release binaries below |

Every account, licence, payment and pricing value on those pages is fetched at
runtime from the private licence service on `license.topup.eu.org`. The pages are
static HTML; the role check in `assets/js/admin-v2.js` is a convenience gate, not
the access control — the service enforces that per request.

## Repository layout

| Path | Contents |
| --- | --- |
| `_layouts/`, `_includes/` | the single Jekyll layout and its partials (navigation, docs sidebar, product switcher) |
| `assets/css/` | `site.css` (source) and `site.min.css` (the file pages load) |
| `assets/js/` | see "Source files and bundles" below |
| `accounts/`, `admin/` | member and admin pages, all `noindex` and excluded from the sitemap |
| `api/`, `smmo/`, `vhack/` | Markdown documentation |
| `trial/index.html` | standalone forwarder for the old `/trial/` address |
| `tools/` | the asset and docs-index build scripts |

## Source files and bundles

`assets/js/site.js`, `docs.js` and `portal-common.js` are sources; the pages load
the built `site.min.js`, `docs.min.js` and `portal-common.min.js`. The build is
reproducible and checked in CI, so a stale bundle fails the deploy instead of
reaching production.

`portal-v2.js`, `admin-v2.js`, `verify.js` and `trial.js` are loaded from source
as-is. `trial.js` is a minified blob without a separate source file — edit it with
care, and never regenerate it from memory.

```bash
npm ci
npm run check:js     # verify every bundle matches its source (CI runs this)
npm run build:js     # rebuild the bundles
npm run build:css    # rebuild site.min.css
npm run build:docs   # rebuild search-index.json
npm run build        # build:js + build:css
```

## Notes for maintainers

**Version markers.** Every CSS and JS reference carries `?v=YYYYMMDD-N`. Raise it
whenever the file changes. The site is served through a Worker with a CDN in
front, and edge copies of assets live for five minutes, so a stale marker can
serve the previous file to returning visitors. After a deploy finishes, purge the
zone cache as well — GitHub Pages deploying is not the same as the CDN serving
the new bytes.

**Do not delete shared asset folders.** Several files under `assets/` are not
referenced by any HTML in this repository and are still in use:

* `assets/icons/payments/` — the file name comes from the payment method row in
  the licence database, not from any HTML.
* `assets/icons/tags/` — every tag on the developer page maps to one of these
  through its own icon table, and the whole set is requested at runtime.
* `assets/techstack/` — fetched by other TOPUP properties.

If a tool reports "unreferenced assets", check cross-repository and
database-driven references before removing anything.

## This repository is the download channel for SimpleMMO Bot

The Windows and Linux builds attached to the
[latest release](https://github.com/SMMURDA/simplemmo-bot/releases/latest) are the
same files the download buttons on
[the downloads page](https://topup.eu.org/smmo/downloads/) serve. Releases from
v3.0.0 onwards list the SHA-256 of both files, so you can verify what you
downloaded before running it.

vHack Revolutions is distributed directly by the developer. Request access through
the contact channels below.

## What is not in this repository

Both bots are closed source. This repository does **not** contain the Python
application, the licence service or its administration tools, private signing
keys, user credentials, or the build workspace that produces the release binaries.

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

* <img src="assets/icons/social/telegram.svg" alt="" width="18" height="18" align="absmiddle"> [@bovalone](https://t.me/bovalone)
* <img src="assets/icons/social/gmail.svg" alt="" width="18" height="14" align="absmiddle"> [ask@topup.eu.org](mailto:ask@topup.eu.org)

Copyright © 2026 Mustofa Bovalone. All rights reserved.
