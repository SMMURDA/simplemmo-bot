---
title: "VHack Revolution — Chat"
permalink: /vhack/features/chat/
product: vhack
---

{% include product-switcher.html simplemmo_href="/features/telegram-controls/" vhack_href="/vhack/features/chat/" %}

# Chat — VHack Revolution Bot

[← Back to Home]({{ '/' | relative_url }})

VHack Revolution Bot supports three chat channels plus direct player-to-player messaging, available in both the terminal and web dashboard interfaces.

## Channels

| Channel | ID | Name | Description |
|---|---|---|---|
| `0` | Global | Public chat | Visible on terminal page 3 and web dashboard |
| `100` | BM | Bounty/Broadcast | Bounty-related messages and broadcasts |
| `23355` | Crew | Crew/Team | Private crew or team communication |

## Protocol

### Sending a message

```text
:CHATMSG::<channel>::<UTF-8 message encoded as Base64>
```

### Receiving a message

```text
:CHAT::{from,user_id,message,time,chatChannel,...}
```

The bot automatically decodes incoming Base64 messages and displays them with timestamps and sender names.

## Terminal chat (Page 3)

View all three channels in a unified feed with animated badges. Messages are color-coded by channel:

- **Global** — standard text
- **BM** — highlighted for bounty relevance
- **Crew** — team messages with distinct styling

Use `G` / `M` keys to send messages to Global / BM chat respectively.

## Direct Player Chat (Page C)

Private one-on-one messaging with other players:

| Key | Action |
|---|---|
| `↑` / `↓` | Select player from inbox |
| `Enter` | Open conversation with selected player |
| `W` | Write and send a message |
| `Page Up` / `Page Down` | Scroll long conversations |
| `R` | Refresh inbox and active conversation |

The inbox shows all players who have sent you messages. Select a player to view the full conversation history and send replies.

## Web Dashboard chat

The web dashboard provides the same chat functionality through a browser interface. Messages are delivered in real-time via SSE updates. You can chat while any automation (Farm, Bounty, Voucher) runs in the background without interruption.

## Bounty detection

The chat module also handles **bounty detection** from system broadcasts. When the server sends:

```text
Target found by @username! ... @all
```

The bot automatically detects this pattern and triggers the bounty workflow.

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/features/web-dashboard/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Web Dashboard</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/vhack/troubleshooting/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Troubleshooting</strong>
  </a>
</nav>
