---
title: "VHack Revolution — Configuration"
permalink: /vhack/configuration/
---

{% include product-switcher.html simplemmo_href="/configuration/" vhack_href="/vhack/configuration/" %}

# Configuration — VHack Revolution Bot

The `.env` file stores all local settings and credentials. **Keep it private** — never commit it to Git, share it in screenshots, or attach it to support issues.

## Required credentials

```env
VHACK_USER_ID=1239734
VHACK_ACCESS_TOKEN=your_access_token
VHACK_UNIQUE_ID=your_unique_id
VHACK_PLATFORM=Windows
```

These values come from your own vHack.cc `:LOGIN:` session. To obtain them:

1. Connect to the vHack.cc game server using a packet sniffer or debug proxy.
2. Capture the `:LOGIN:` request your client sends.
3. Extract the four fields from the login payload: `USER_ID`, `ACCESS_TOKEN`, `PLATFORM`, and `UNIQUE_ID`.

| Field | Description |
|---|---|
| `VHACK_USER_ID` | Your numeric player ID |
| `VHACK_ACCESS_TOKEN` | Session access token from login |
| `VHACK_UNIQUE_ID` | Device-unique identifier from login |
| `VHACK_PLATFORM` | Client platform identifier (e.g., `Windows`) |

## Connection settings

```env
VHACK_HOST=vhack.cc
VHACK_PORT=8182
VHACK_TIMEOUT_MS=20000
VHACK_SETTLE_MS=1200
```

| Field | Default | Description |
|---|---|---|
| `VHACK_HOST` | `vhack.cc` | Game server hostname |
| `VHACK_PORT` | `8182` | Game server TCP port |
| `VHACK_TIMEOUT_MS` | `20000` | Request timeout in milliseconds |
| `VHACK_SETTLE_MS` | `1200` | Delay between rapid commands |

These defaults work for most setups. Only change them if you experience timeout or rate-limit issues.

## Encryption

```env
# VHACK_AES_KEY=a9c21fe75ceae3f1cad35f189c7ba866
```

The AES encryption key is used for the TCP session envelope. Uncomment and set only if you need to override the default key.

## Web dashboard

```env
VHACK_WEB_PORT=3000
```

The web server always binds to `127.0.0.1` only — credentials and the AES key stay in the Node.js backend and are never exposed to the browser.

## Bounty settings

```env
BOUNTY_REFRESH_BATCH=7
BOUNTY_CYCLE_DELAY_MS=2500
```

| Field | Default | Description |
|---|---|---|
| `BOUNTY_REFRESH_BATCH` | `7` | Number of Network refreshes per bounty search batch (5–10 recommended) |
| `BOUNTY_CYCLE_DELAY_MS` | `2500` | Delay between bounty search cycles in milliseconds |

## Terminal identity

```env
VHACK_TERMINAL_ALIAS=
```

Set a custom alias displayed in the terminal header banner. Leave blank to use your real username. You can also change the alias at runtime with the `J` key in the terminal.

## Security rules

- `.env` is listed in `.gitignore` and excluded from releases
- Access tokens, unique IDs, and encryption keys are **never** rendered in the browser or logged
- Sensitive values can be masked with `[10]` in the terminal
- **Rotate any credentials that have been shared or published**

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/getting-started/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Getting Started</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/features/overview/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Feature Overview</strong>
  </a>
</nav>
