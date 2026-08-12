---
title: "VHack Revolution — Feature Overview"
permalink: /vhack/features/overview/
product: vhack
---

{% include product-switcher.html simplemmo_href="/smmo/features/overview/" vhack_href="/vhack/features/overview/" %}

# Feature Overview — VHack Revolution Bot

[← Back to Home]({{ '/' | relative_url }})

This page lists every main feature available in VHack Revolution Bot.

## Automation

| Feature | Short Description |
|---|---|
| Auto Farm | Repeatedly performs Network refresh → Scan → Exploit → Repeat with configurable rounds, IPs, delays, and threshold-based voucher processing. |
| Auto NC Miner | Mines NC blocks on a 20×20 grid with Jackpot Watch or Sweep All modes and multiple claim styles. |
| Auto Bounty | Detects active bounties from server messages, performs batched Network search, handles win detection, and post-bounty cleanup. |
| Auto Voucher | Fetches terminal connections, reads remote logs, extracts vTC codes, and redeems them automatically. |
| Priority Mode | Controls execution order when multiple automations run simultaneously (Bounty > NC > Farm or NC > Bounty > Farm). |
| Auto Reconnect | Progressive reconnect on socket errors with delays of 1, 2, 4, 8, then 15 seconds. |

## Terminal Interface (LightTerminal)

| Feature | Short Description |
|---|---|
| Overview (1) | Automation status, priority, capacity, and progress. |
| Activity (2) | Recent events and signals with animated badges. |
| Chat (3) | Global, BM, and Crew chat channels. |
| Controls (4) | Toggle all automation modules on/off with keyboard shortcuts. |
| NC Packets (5) | Live NC miner network traffic (C2S/S2C). |
| Requests (6) | Client-to-server packet log. |
| Responses (7) | Server-to-client packet log. |
| Voucher (8) | Session summary, vTC income, and redemption history. |
| Exploit (9) | Exploit history and farm statistics. |
| Account (0) | Complete profile, economy, software, combat, and social data. |
| Direct Chat (C) | Player-to-player inbox, conversations, and message sending. |
| Safe + Miner (S) | vTC claim, safe slots, reroll, and miner balance. |

## Web Dashboard

| Feature | Short Description |
|---|---|
| Connect/Disconnect | Control shared vHack session from the browser. |
| Auto Farm | Non-blocking farm with start, pause/resume, stop controls. |
| Auto Voucher | Standalone voucher redemption with IP limit, delay, and duplicate handling. |
| Verified Clean Connections | Before/after connection count verification. |
| Settings | Farm, voucher, bounty cycling, reconnect, and safe cleaning preferences. |
| Chat | Global/BM/Crew chat while automation runs. |
| Live Updates | Real-time SSE updates for account, bounty, farm, voucher, and activity data. |
| Responsive Layout | Desktop and mobile TUI-inspired layouts with animated SVG branding. |

## Security

| Feature | Short Description |
|---|---|
| Local-only credentials | `.env` never leaves your device. |
| Encrypted TCP | AES envelope for all server communication. |
| No browser exposure | Web dashboard binds to `127.0.0.1`; secrets stay in backend. |
| Credential masking | Sensitive values masked with `[10]` in terminal. |
| No local cache | Exploit IPs and voucher codes are not persisted or skip-cached. |

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/configuration/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Configuration</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/features/automation/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Automation</strong>
  </a>
</nav>
