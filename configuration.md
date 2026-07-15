---
title: Configuration
permalink: /configuration/
---

# Configuration

The `.env` file stores local settings and credentials. Keep it private, never commit it to GitHub, and never attach it to a support issue.

## License

```env
SMMO_LICENSE_KEY=
SMMO_LICENSE_SERVER_URL=https://license.topup.eu.org/v1/check
```

Leave the key empty only when launching interactively. A background service such as systemd requires the key in `.env`.

## SimpleMMO session

```env
SMMO_TRAVEL_AREA_ID=1
CF_CLEARANCE=
PALAMEDES_AUTHENTICATED=1
LARAVEL_SESSION=
XSRF_TOKEN=
REMEMBER_WEB=
SMMO_USER_AGENT=
```

Use credentials from your own account:

1. Sign in at `https://web.simple-mmo.com` in your browser.
2. Open Developer Tools with `F12`.
3. Open **Application → Storage → Cookies**.
4. Select `web.simple-mmo.com`.
5. Copy the relevant cookies into `.env`.
6. Open **Network**, select a request, and copy its User-Agent.

The User-Agent must match the browser session that produced the cookies. Sessions can expire and may need to be refreshed.

## Telegram

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Create a personal Telegram bot with `@BotFather`, send it a message, and use Telegram's `getUpdates` endpoint to locate your chat ID. Do not reuse credentials supplied by another user.

## Quest and local storage

```env
SMMO_EXPEDITION_ID=74
SMMO_NOTIFICATION_SETTINGS_FILE=data/notification_settings.json
SMMO_RUNTIME_SETTINGS_FILE=data/runtime_settings.json
```

The `data` folder stores persistent toggles and statistics. Include it in backups when moving to another installation.

## Security checklist

- Use only your own account and bot credentials.
- Never publish `.env` or `license.key`.
- Rotate a Telegram token immediately if it is exposed.
- Refresh SimpleMMO cookies when the session expires.
- Remove credentials from logs before requesting support.
