---
title: "VHack Revolution — Terminal Interface"
permalink: /vhack/features/terminal/
product: vhack
---

{% include product-switcher.html simplemmo_href="/features/telegram-controls/" vhack_href="/vhack/features/terminal/" %}

# Terminal Interface — VHack Revolution Bot

[← Back to Home]({{ '/' | relative_url }})

The LightTerminal is an interactive ANSI dashboard with animated colorized panel titles, tab navigation, and live SSE updates. Start it with:

```bash
npm run terminal
# or
node terminal.js
```

## Pages

| Key | Page | Description |
|---|---|---|
| `1` | **Overview** | Automation status, priority, capacity, and progress. Recent Signals shows up to 8 latest activities. |
| `2` | **Activity** | Recent events and signals with animated badges (`SUCCESS`, `MUTED`, `ERROR`, `WARNING`, `INFO`). |
| `3` | **Chat** | Global (channel 0), BM (channel 100), and Crew (channel 23355) messages. |
| `4` | **Controls** | Toggle all automation modules on/off. |
| `5` | **NC Packets** | NC miner network traffic (C2S cyan / S2C magenta). |
| `6` | **Requests** | Client-to-server packet log. |
| `7` | **Responses** | Server-to-client packet log (`SUCCESS` green, `WARNING` yellow, `ERROR` red). |
| `8` | **Voucher** | Session vTC income, balance, batch count, redeem success/fail, and code history. |
| `9` | **Exploit** | Exploit history and farm stats. |
| `0` | **Account** | Complete profile, economy, resources, capacity, software, combat, and social data. |
| `C` | **Direct Chat** | Player-to-player inbox, conversations, and message sending. |
| `S` | **Safe + Miner** | vTC claim, safe slots, reroll, and miner balance. |

## Controls (Page 4)

| Key | Action |
|---|---|
| `A` | Toggle Auto Farm start |
| `B` | Toggle Auto Bounty |
| `K` | Toggle Auto NC trigger |
| `T` | Toggle Auto Reconnect |
| `P` | Toggle Priority Mode (1: Bounty>NC>Farm, 2: NC>Bounty>Farm) |
| `F` | Start / pause / resume Farm |
| `X` | Stop Farm |
| `N` | Start / stop NC Miner |
| `O` | Stop NC Miner + disable auto |
| `V` | Start / stop Voucher |
| `M` | Toggle NC Miner mode (Jackpot Watch / Sweep All) |
| `L` | Toggle diagonal claim style |
| `H` | Toggle horizontal claim style |
| `Z` | Toggle zigzag claim style |
| `E` | Toggle 50/50 balanced claim style |
| `J` | Change alias |
| `R` | Refresh |

## Direct Player Chat (Page C)

| Key | Action |
|---|---|
| `↑` / `↓` | Select player from inbox |
| `Enter` | Open conversation with selected player |
| `W` | Write and send a message |
| `Page Up` / `Page Down` | Scroll long conversations |
| `R` | Refresh inbox and active conversation |

## Safe + Miner (Page S)

| Key | Action |
|---|---|
| `U` | Open Safe 1 |
| `I` | Open Safe 2 |
| `Y` | Reroll Safe 1 (with confirmation) |
| `H` | Reroll Safe 2 (with confirmation) |
| `V` | Claim vTC Miner balance |
| `R` | Refresh safe data |
| `↑` / `↓` or `Page Up` / `Page Down` | Scroll information |

## Visual features

### Animated shimmer titles

Each panel box has its own color (cyan, magenta, green, yellow, red) with a moving shimmer wave effect.

### Dynamic ANSI Shadow alias

On terminals with at least 32 rows, a six-line ANSI Shadow banner is generated from the active alias. Supports letters `A-Z`, digits `0-9`, spaces, `_`, and `-` without any Figlet dependency.

Set a permanent alias in `.env`:

```env
VHACK_TERMINAL_ALIAS=your_alias
```

Press `J` at runtime to change it temporarily. Enter `-` to revert to the real username.

### Revolution Bot header

Five centered lines — header **vHACK REVOLUTION BOT**, account stats, two navigation rows, and Direct/Safe/Alias row — auto-center on terminal resize.

The header uses ShimmerLoader and TypeWriter animations: title, ONLINE status, and alias are typed sequentially on session start or reconnect. Symbols `✦ ◆ ✶ ❋ ✸ ◈ ◉ ⬡ ⬢ ◍` animate on both sides.

### Flicker-free rendering

Live dashboards overwrite individual rows in place and clear only retired rows. The live loop never blanks the entire buffer, avoiding visible flicker.

### Panel rendering

All panels use rounded corners `╭ ╮ ╰ ╯` with accent colors by content type. Width is capped at 124 columns for readability on wide monitors.

## General controls

| Key | Action |
|---|---|
| `D` | Connect / disconnect |
| `↑` / `↓` | Scroll long content |
| `Page Up` / `Page Down` | Scroll 5 lines at once |
| `Q` | Quit |

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/features/automation/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Automation</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/features/web-dashboard/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Web Dashboard</strong>
  </a>
</nav>
