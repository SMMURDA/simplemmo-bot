---
title: Online Licensing
permalink: /licensing/
---

# Online Licensing

SimpleMMO Bot uses online activation to verify that a license is active and used within its device allowance.

## How activation works

1. The app reads the license key and creates a privacy-conscious device identifier.
2. It sends the key, app version, and device identifier to the license service over HTTPS.
3. The server checks status, expiration, product, and device allowance.
4. The server returns a digitally signed decision.
5. The app verifies the signature before continuing.

The production validation endpoint is:

```text
https://license.topup.eu.org/v1/check
```

## Purchase a license

Ready to purchase a license or need help choosing one? Contact us through any of the channels below.

<div class="license-contact-grid" aria-label="License purchase contacts">
  <a class="license-contact-card" href="mailto:ask@topup.eu.org">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-email.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Email</strong><small>ask@topup.eu.org</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
  <a class="license-contact-card" href="https://instagram.com/bovalonee" target="_blank" rel="noopener noreferrer">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-instagram.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Instagram</strong><small>@bovalonee</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
  <a class="license-contact-card" href="https://t.me/bovalone" target="_blank" rel="noopener noreferrer">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-telegram.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Telegram</strong><small>@bovalone</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
</div>

## Online-only behavior

An internet connection is required at startup and during runtime. There is no offline grace period. If the service cannot be reached or a signed validation fails, the bot does not continue running[...]

## Device limits

A license can allow one or more devices. A new computer or VPS may consume an activation slot. Contact the distributor for a device reset before migrating when your allowance is full.

## Common messages

| Message | Meaning |
|---|---|
| License key not found | The key is incorrect or not registered. |
| License expired | The subscription period has ended. |
| License revoked | The key has been disabled. |
| Device limit reached | All activation slots are in use. |
| Server unavailable | DNS, internet, firewall, or service availability prevented validation. |
| Invalid signature | The response could not be authenticated; use an official current release. |

## Protect your key

Treat a license key like a purchase credential. Do not post it in screenshots, logs, GitHub issues, or public chat. A leaked key may be revoked or consume device slots.
