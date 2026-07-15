---
title: Getting Started
permalink: /getting-started/
---

# Getting Started

This guide takes you from a downloaded release to a verified, running bot. Every user must supply their **own** SimpleMMO session, Telegram bot, and license key.

> Automation may violate SimpleMMO rules and may result in account restrictions. Review the applicable terms before use.

## 1. Download the correct release

Open the [Downloads]({{ '/downloads/' | relative_url }}) page and choose the package for your operating system:

- `windows-x64` for 64-bit Windows 10 or 11.
- `linux-x64` for a 64-bit Intel/AMD Linux server.
- `linux-arm64` only when an ARM build is explicitly provided.

Extract the archive into a dedicated folder. Do not run the program from inside the ZIP file.

## 2. Create your configuration

Copy `.env.example` to `.env`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
notepad .env
```

### Linux

```bash
cp .env.example .env
nano .env
```

Fill the file with your own game cookies, browser User-Agent, and Telegram credentials. See [Configuration]({{ '/configuration/' | relative_url }}) for every field.

## 3. Start the launcher

### Windows

```powershell
.\SimpleMMO-Launcher.exe
```

### Linux

```bash
chmod +x SimpleMMO-Launcher SimpleMMO-Bot
./SimpleMMO-Launcher
```

The launcher and bot executable must remain in the same folder.

## 4. Activate your license

If `SMMO_LICENSE_KEY` is empty, an interactive launch asks for the key and stores it in `license.key`. The key is still verified online at startup and periodically while the bot runs.

For systemd or other non-interactive services, place the key in `.env`:

```env
SMMO_LICENSE_KEY=SMMO-XXXXX-XXXXX-XXXXX-XXXXX
```

Read [Licensing]({{ '/licensing/' | relative_url }}) for activation and device-limit details.

## 5. Confirm the startup sequence

A successful startup follows this order:

```text
Online license check
Configuration load
SimpleMMO session validation
Telegram connection
Feature initialization
Travel loop
```

The application does not log in to SimpleMMO when license validation fails.

## Updating safely

1. Stop the launcher.
2. Back up `.env`, `license.key`, and the `data` folder.
3. Extract the new release into a clean folder.
4. Copy your private configuration and data into the new folder.
5. Start the new launcher.

Never replace your working `.env` with the blank template from a new release.
