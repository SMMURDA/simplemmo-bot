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

## Optional CAPTCHA AI

The bot can optionally use a Gemini API key to assist with a SimpleMMO image-verification prompt. This feature is **off by default**. You can enable or disable it at any time from your local `.env` file.

```env
# Optional CAPTCHA AI. Leave the key empty to use Telegram/manual verification only.
GEMINI_API_KEY=
CAPTCHA_AI_ENABLED=false

# Optional local pacing for Gemini requests. Leave at the default unless instructed otherwise.
GEMINI_MIN_REQUEST_INTERVAL_SECONDS=3
```

### What each setting does

| Setting | Purpose | Safe default |
| --- | --- | --- |
| `GEMINI_API_KEY` | Your personal Google AI Studio API key. It authorizes optional Gemini requests from your own installation. | Leave empty |
| `CAPTCHA_AI_ENABLED` | Turns CAPTCHA AI on or off. Accepted enabled values are `true`, `yes`, `on`, or `1`. | `false` |
| `GEMINI_MIN_REQUEST_INTERVAL_SECONDS` | Minimum delay between Gemini requests made by this installation. It helps avoid sending requests too quickly. | `3` |

### Enable CAPTCHA AI

1. Create or use your own API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open the `.env` file in your bot folder on your own device.
3. Set the values locally:

   ```env
   GEMINI_API_KEY=your-personal-api-key
   CAPTCHA_AI_ENABLED=true
   GEMINI_MIN_REQUEST_INTERVAL_SECONDS=3
   ```

4. Save the file and restart the bot or launcher.

When enabled, the bot may send the CAPTCHA image choices and the requested item label to Gemini for analysis. The bot uses the returned explicit final choice only when available. If AI is unavailable, incomplete, or cannot provide a valid final choice, the bot follows its normal manual verification flow instead.

### Disable CAPTCHA AI

To return to Telegram/manual verification, change only this setting and restart the bot:

```env
CAPTCHA_AI_ENABLED=false
```

You may leave `GEMINI_API_KEY` in your private local `.env`; it is not used while CAPTCHA AI is disabled. To remove it completely, clear the value instead:

```env
GEMINI_API_KEY=
CAPTCHA_AI_ENABLED=false
```

### Privacy, quota, and support

- Create and use **your own** Google AI Studio API key. API quota, availability, and any applicable charges are controlled by your Google account.
- Never post an API key in screenshots, Telegram messages, GitHub issues, support requests, or public repositories.
- Do not place an API key in this documentation website, browser-side JavaScript, or a GitHub Pages setting. The key belongs only in the local `.env` file on the machine running the bot.
- CAPTCHA AI sends only the image-verification content needed for the request. It does not require you to share your SimpleMMO password, cookies, Telegram token, license key, or completed `.env` file with support.
- If the API reports a quota, network, or response error, set `CAPTCHA_AI_ENABLED=false`, restart the bot, and use the normal Telegram/manual flow.
- Remove or redact `GEMINI_API_KEY` before sharing any configuration file or log.

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
