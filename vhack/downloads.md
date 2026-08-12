---
title: "VHack Revolution — Downloads"
permalink: /vhack/downloads/
---

{% include product-switcher.html simplemmo_href="/downloads/" vhack_href="/vhack/downloads/" %}

# Downloads — VHack Revolution Bot

VHack Revolution Bot is distributed directly by the developer. Contact through any of these channels to request access:

<div class="license-contact-grid" aria-label="Contact developer">
  <a class="license-contact-card" href="https://t.me/bovalone" target="_blank" rel="noopener noreferrer">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-telegram.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Telegram</strong><small>@bovalone</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
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
</div>

## Requirements

- **Node.js 18** or newer
- npm (included with Node.js)
- A vHack.cc account with valid login session credentials

## What's included

After receiving access, the project contains:

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

## Running

| Command | Description |
|---|---|
| `npm run terminal` | Start the terminal interface (LightTerminal) |
| `npm run web` | Start the web dashboard on `http://127.0.0.1:3000` |
| `npm test` | Run offline smoke tests |
| `npm run check` | Syntax-check all source files |

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
