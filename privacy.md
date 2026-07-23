---
title: Privacy and Security
permalink: /privacy/
---

# Privacy and Security

SimpleMMO Bot processes configuration locally to connect to SimpleMMO, Telegram, and the license service.

## Local data

The application may store:

- `.env` credentials supplied by the user.
- `license.key` when interactive activation is used.
- Runtime settings, notification preferences, and daily statistics in `data`.

Protect this folder with appropriate operating-system permissions and backups.

## License validation data

Online validation may process the license key, app version, platform description, and a hashed device identifier. It is used to enforce status, expiration, and device limits.

## Third-party services

SimpleMMO and Telegram receive requests necessary for enabled features. Google, GitHub, or Microsoft may process identity data when the corresponding sign-in method is used. Their own privacy policies and terms apply. The public documentation website may be served through GitHub Pages and a configured domain. OAuth client secrets and account-linking decisions belong only in the private license Worker.

## User responsibility

Never publish cookies, passwords, Telegram tokens, license keys, private keys, or completed environment files. Rotate exposed credentials immediately.
