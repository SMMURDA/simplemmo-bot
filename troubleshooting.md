---
title: Troubleshooting
permalink: /troubleshooting/
---

# Troubleshooting

## The launcher cannot find the bot

Keep both executables in the same folder:

```text
SimpleMMO-Launcher.exe
SimpleMMO-Bot.exe
```

## `.env` is not detected

Confirm that the file is named exactly `.env`, not `.env.txt`, and is beside the executables. On Windows:

```powershell
Get-ChildItem -Force
```

## The license service cannot be reached

Test service health:

```powershell
curl.exe https://license.topup.eu.org/health
```

Check internet access, DNS, firewall rules, and system time. Online validation is mandatory.

## The SimpleMMO session is rejected

Browser cookies expire. Sign in again and refresh `CF_CLEARANCE`, `LARAVEL_SESSION`, `XSRF_TOKEN`, `REMEMBER_WEB`, and `SMMO_USER_AGENT`.

## Telegram does not respond

Verify that the bot token belongs to your Telegram bot, you have sent the bot a message, and `TELEGRAM_CHAT_ID` matches your chat. Rotate the token if it was exposed.

## Support logs

Include the app version, operating system, reproduction steps, and the complete error text. Remove all cookies, passwords, API tokens, Telegram tokens, chat identifiers, and license keys before sharing a log.
