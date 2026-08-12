---
title: "VHack Revolution — Downloads"
permalink: /vhack/downloads/
---

{% include product-switcher.html simplemmo_href="/downloads/" vhack_href="/vhack/downloads/" %}

# Downloads — VHack Revolution Bot

VHack Revolution Bot is a Node.js application that runs from source code. There are no pre-compiled binaries — just clone the repository and run.

## Requirements

- **Node.js 18** or newer
- npm (included with Node.js)
- A vHack.cc account with valid login session credentials

## Get the source

```bash
git clone <repository-url> vhack-bot
cd vhack-bot
npm install
```

## Running

| Command | Description |
|---|---|
| `npm run terminal` | Start the terminal interface (LightTerminal) |
| `npm run web` | Start the web dashboard on `http://127.0.0.1:3000` |
| `npm test` | Run offline smoke tests |
| `npm run check` | Syntax-check all source files |

## What's included

```text
vhack-bot/
├── terminal.js          # Terminal entry point
├── server.js            # Web dashboard server
├── aes.js               # AES encryption layer
├── lib/
│   ├── app.js           # Interactive menu and workflows
│   ├── session.js       # TCP session and protocol
│   ├── live-ui.js       # ANSI rendering engine
│   ├── screens.js       # Non-live account/network screens
│   ├── table.js         # Terminal formatting utilities
│   ├── chat.js          # Chat extraction and bounty detection
│   ├── voucher.js       # Voucher code extraction
│   ├── nc-miner.js      # NC Miner logic
│   ├── web-controller.js # Web dashboard backend
│   ├── web-bounty.js    # Web bounty controller
│   ├── env.js           # Environment file loader
│   └── sector-solver.js # Sector solving logic
├── web/
│   ├── index.html       # Dashboard structure
│   ├── styles.css       # Responsive TUI styles
│   └── app.js           # Frontend logic
├── test/                # Offline smoke tests
├── .env.example         # Configuration template
└── package.json         # Node.js dependencies
```

## Update

To get the latest version:

```bash
cd vhack-bot
git pull
npm install
```

Your `.env` file is preserved since it's in `.gitignore`.

## System compatibility

| Platform | Status |
|---|---|
| Linux (x64) | ✓ Supported |
| macOS | ✓ Supported |
| Windows (WSL) | ✓ Supported |
| Windows (native) | ✓ Supported |
| ARM64 | ✓ Supported (Node.js runs on ARM) |

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/getting-started/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Getting Started</strong>
  </a>
</nav>
