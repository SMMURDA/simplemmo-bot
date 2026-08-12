---
title: "VHack Revolution — Getting Started"
permalink: /vhack/getting-started/
---

{% include product-switcher.html simplemmo_href="/getting-started/" vhack_href="/vhack/getting-started/" %}

# Getting Started — VHack Revolution Bot

This guide takes you from source code to a running VHack Revolution Bot with either the terminal interface or web dashboard.

> This tool automates interactions with vHack.cc. Use at your own risk and review the game's terms before use.

## 1. Requirements

- **Node.js 18** or newer
- A vHack.cc account with valid login session credentials
- A terminal emulator (for LightTerminal) or a web browser (for Web Dashboard)

## 2. Clone or download the project

```bash
git clone <repository-url> vhack-bot
cd vhack-bot
```

## 3. Create your configuration

Copy `.env.example` to `.env` and fill with your own credentials:

```bash
cp .env.example .env
nano .env
```

Fill the required fields from your vHack.cc login session:

```env
VHACK_USER_ID=your_user_id
VHACK_ACCESS_TOKEN=your_access_token
VHACK_UNIQUE_ID=your_unique_id
VHACK_PLATFORM=Windows
```

See [Configuration]({{ '/vhack/configuration/' | relative_url }}) for every field and how to obtain these values.

## 4. Install dependencies

```bash
npm install
```

## 5. Choose your interface

### Terminal Interface (LightTerminal)

An interactive ANSI dashboard with animated panel titles, tab navigation, and live updates.

```bash
npm run terminal
# or
node terminal.js
```

Press number keys `1`–`0` and letters `C`, `S` to navigate between pages. See [Terminal]({{ '/vhack/features/terminal/' | relative_url }}) for all 12 pages and keyboard shortcuts.

### Web Dashboard

A responsive browser-based control panel bound to `127.0.0.1`.

```bash
npm run web
# or
node server.js
```

Open `http://127.0.0.1:3000` in your browser. See [Web Dashboard]({{ '/vhack/features/web-dashboard/' | relative_url }}) for feature details.

## 6. Verify the connection

After starting either interface, the bot establishes an encrypted TCP connection to `vhack.cc:8182`. You should see:

- **Terminal:** Status changes to `ONLINE` with your alias displayed
- **Web:** Dashboard populates with account data via SSE updates

If the connection fails, check [Troubleshooting]({{ '/vhack/troubleshooting/' | relative_url }}).

## Quick reference

| Command | Description |
|---|---|
| `npm run terminal` | Start terminal interface |
| `npm run web` | Start web dashboard |
| `npm test` | Run offline smoke tests |
| `npm run check` | Syntax-check all source files |

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/configuration/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Configuration</strong>
  </a>
</nav>
