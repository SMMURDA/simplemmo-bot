---
title: "VHack Revolution — Automation"
permalink: /vhack/features/automation/
product: vhack
---

{% include product-switcher.html simplemmo_href="/smmo/features/automation/" vhack_href="/vhack/features/automation/" %}

# Automation — VHack Revolution Bot

[← Back to Home]({{ '/' | relative_url }})

> **Educational guide.** This page explains how the VHack Revolution Bot's automation features work and how to use them responsibly. It is provided for **educational and personal use only**. You are responsible for reviewing and complying with vHack.cc's terms of service before using any automation. Automation may carry account risk — always use it at your own discretion.

## How automation works

This tool automates interactions with vHack.cc to reduce repetitive manual work. It reads the same game state you would see in the game, respects server pacing, and performs actions one at a time. It is intended to help you understand game mechanics and optimise your own gameplay, not to bypass the game's rules.

## Responsible-use tips

- **Start small.** Enable one module at a time and observe how it behaves.
- **Respect pacing.** The built-in delays keep actions within normal game pacing.
- **Monitor your session.** Keep an eye on the dashboard and notifications.
- **Know the rules.** Read the game's terms of service before enabling any automation.

## Priority Mode

When multiple automations want to run simultaneously, Priority Mode determines execution order:

| Mode | Order (highest → lowest) | Behaviour |
|---|---|---|
| **1** | Auto Bounty → Auto NC Miner → Auto Farm | A live bounty is never interrupted. NC Miner waits until bounty finishes, then mines refilled blocks. |
| **2** (default) | Auto NC Miner → Auto Bounty → Auto Farm | An NC refill stops the current bounty run, then mines immediately. |

Toggle with `[P]` on terminal page 4, or Settings → Priority mode in the web UI.

## Auto Farm

Repeatedly performs: **Network refresh → Scan → Exploit → Repeat**.

### Configuration

| Setting | Description |
|---|---|---|
| Max rounds | Number of farm cycles before stopping |
| IPs per round | How many targets to exploit per round |
| Delays | Timing between actions |
| Skip done targets | Ignore already-exploited IPs |
| Voucher processing | Trigger voucher redemption at connection threshold |
| Connection threshold | 1–50 (default 50) — triggers voucher batch when reached |

### Threshold-based voucher batches

With threshold 50 and 10 targets/round, voucher processing triggers every 5 rounds when 50 connections are reached. If any log read or redemption fails, connections are preserved — no voucher is lost.

### Keyboard controls

| Key | Action |
|---|---|
| `A` | Toggle Auto Farm start (runs only when NC Miner/Bounty idle) |
| `F` | Start / pause / resume Farm |
| `X` | Stop Farm |

## Auto NC Miner

Mines NC blocks on a **20×20 grid** (400 blocks total). The next block is chosen based on row/column distance from the last claim position, not ID number proximity.

### Modes

| Mode | Description |
|---|---|
| **Jackpot Watch** | Stops mining when a jackpot is claimed |
| **Sweep All** | Claims every block regardless |

### Claim styles

Any combination can be active:

| Style | Description |
|---|---|
| Diagonal | 4-way diagonal traversal |
| Horizontal | Row-by-row scanning |
| Zig-zag | Vertical zig-zag pattern |
| 50/50 balanced | Even distribution across the grid |

Multi-claim follow-ups retry up to 4 claims per block.

### Keyboard controls

| Key | Action |
|---|---|
| `K` | Toggle Auto NC trigger |
| `N` | Start / stop NC Miner |
| `O` | Stop NC Miner + disable auto |
| `M` | Toggle mode (Jackpot Watch / Sweep All) |
| `L` | Toggle diagonal claim style |
| `H` | Toggle horizontal claim style |
| `Z` | Toggle zigzag claim style |
| `E` | Toggle 50/50 balanced claim style |

## Auto Bounty

- Detects `huntRunning` / `huntLevel` from server `:UPD:` messages
- Performs **batched Network search** (default 7 refreshes) with soft cycling
- **Win detection** from system broadcast: `Target found by @...! ... @all`
- Post-bounty voucher processing and safe terminal cleanup
- Auto-resumes Auto Farm after bounty completes

### Configuration

```env
BOUNTY_REFRESH_BATCH=7
BOUNTY_CYCLE_DELAY_MS=2500
```

### Keyboard controls

| Key | Action |
|---|---|
| `B` | Toggle Auto Bounty |

## Auto Voucher

1. Fetch terminal connections with `GETCONNECTIONS`
2. Read every remote log with `GETREMOTELOG`
3. Extract codes following `/* vTC VOUCHER */` marker
4. Redeem each code with `REDEEMV2`
5. Skip connections with no voucher

No local skip cache or timer — voucher codes are processed from live server data only. Accepted responses: `UPD {vtc}` for success and `REDEEMEDV2 {result:1}` for already-redeemed codes.

### Keyboard controls

| Key | Action |
|---|---|
| `V` | Start / stop Voucher |

## Clear Terminal

1. Read initial connection count with `GETCONNECTIONS`
2. Send `:CLEARCONNECTIONS`
3. Poll `GETCONNECTIONS` several times
4. Report success from actual before/after count

## Auto Reconnect

On unexpected socket error or close, the bot retries with progressive delay:

```
1s → 2s → 4s → 8s → 15s
```

Uses the existing authenticated session and preserves registered chat and bounty listeners. Never reconnects after the user selects Exit.

| Key | Action |
|---|---|
| `T` | Toggle Auto Reconnect |

## Continue Reading

<nav aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/features/overview/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Feature Overview</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/features/terminal/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Terminal Interface</strong>
  </a>
</nav>
