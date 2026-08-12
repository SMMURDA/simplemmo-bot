---
title: "VHack Revolution — Web Dashboard"
permalink: /vhack/features/web-dashboard/
product: vhack
---

{% include product-switcher.html simplemmo_href="/smmo/features/settings-dashboard/" vhack_href="/vhack/features/web-dashboard/" %}

# Web Dashboard — VHack Revolution Bot

[← Back to Home]({{ '/' | relative_url }})

The web dashboard is a responsive browser-based control panel for managing your VHack session. Start it with:

```bash
npm run web
# or
node server.js
```

Open `http://127.0.0.1:3000` in your browser.

## Security

- The HTTP server binds to **`127.0.0.1` only** — not accessible from other devices
- Credentials and the AES key stay in the Node.js backend
- No sensitive values are ever exposed to the browser
- All live updates are delivered over SSE (Server-Sent Events)

## Features

### Session Control

Connect and disconnect the shared vHack session directly from the dashboard. The connection state is synchronized across all connected browser tabs.

### Auto Farm

Non-blocking farm automation with full controls:

- **Start** — Begin automated Network refresh → Scan → Exploit cycles
- **Pause / Resume** — Temporarily halt without losing progress
- **Stop** — End the current farm session
- **Threshold-based vouchers** — Voucher processing triggers at the configured connection threshold

### Auto Voucher

Standalone voucher redemption independent of Auto Farm:

- IP limit and delay configuration
- Progress tracking per batch
- Protocol-aware duplicate handling
- Accepts exact server responses: `UPD {vtc}` for success, `REDEEMEDV2 {result:1}` for already-redeemed

### Verified Clean Connections

Before/after connection count verification when clearing terminal connections. The dashboard reports the actual count change, not assumed success.

### Settings

Configure all automation preferences from a single page:

| Category | Settings |
|---|---|
| Farm | Max rounds, IPs per round, delays, skip done targets |
| Voucher | Connection threshold, processing delay |
| Bounty | Refresh batch size, cycle delay |
| Reconnect | Auto reconnect toggle |
| Safe cleaning | Connection clear preferences |

### Chat

Global, BM, and Crew chat channels accessible while automation runs. Send and receive messages in real-time without interrupting any active automation.

### Live Updates

All dashboard data updates in real-time over SSE:

- Account profile and stats
- Bounty status and progress
- Farm activity and results
- Voucher redemption history
- Connection counts
- Activity feed with animated badges

### Responsive Layout

Desktop and mobile layouts inspired by terminal aesthetics with animated inline SVG branding. The interface adapts to screen size while maintaining full functionality.

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/features/terminal/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Terminal Interface</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/features/chat/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Chat</strong>
  </a>
</nav>
