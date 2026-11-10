---
title: "Downloads — SimpleMMO Bot"
permalink: /smmo/downloads/
product: smmo
---

{% include product-switcher.html simplemmo_href="/smmo/downloads/" vhack_href="/vhack/downloads/" %}

# Downloads — SimpleMMO Bot

Official builds are distributed through the **GitHub Releases** page associated with this repository. The buttons below always point to the newest published release.

## Release packages

<div class="download-grid" aria-label="Release packages">
  <a class="download-card download-card--windows" href="https://github.com/SMMURDA/simplemmo-bot/releases/latest/download/SimpleMMO-Bot-Windows-x64.zip">
    <span class="download-icon download-icon--windows" aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false"><path d="M7 12.2 29 9v21H7V12.2Zm25-3.6L57 5v25H32V8.6ZM7 34h22v21L7 51.8V34Zm25 0h25v25l-25-3.6V34Z"/></svg>
    </span>
    <span class="download-copy"><strong>Windows 64-bit</strong><small>Latest release · SimpleMMO-Bot-Windows-x64.zip</small></span>
    <span class="download-action">Download <span aria-hidden="true">↓</span></span>
  </a>
  <a class="download-card download-card--linux" href="https://github.com/SMMURDA/simplemmo-bot/releases/latest/download/SimpleMMO-Bot-Linux-x64.tar.gz">
    <span class="download-icon download-icon--linux" aria-hidden="true">
      <img src="/assets/platform/linux-tux.png" alt="" width="36" height="36" loading="lazy">
    </span>
    <span class="download-copy"><strong>Linux 64-bit</strong><small>Latest release · SimpleMMO-Bot-Linux-x64.tar.gz</small></span>
    <span class="download-action">Download <span aria-hidden="true">↓</span></span>
  </a>
  <div class="download-card download-card--disabled" aria-disabled="true">
    <span class="download-icon download-icon--arm" aria-hidden="true"><img src="/assets/platform/arm.svg" alt="" width="36" height="36" loading="lazy"></span>
    <span class="download-copy"><strong>Linux ARM64</strong><small>Package coming soon</small></span>
    <span class="download-action">Unavailable</span>
  </div>
</div>

A normal package contains the bot executable, launcher executable, `.env.example`, user instructions, and license terms. It must not contain a completed `.env`, customer license key, or private signing key.

## Current release — v3.7.0

The newest build adds:

* *Journey Checkpoint captcha bypass* — the drag-to-match verification is solved locally by silhouette comparison, and genuinely ambiguous challenges are forwarded to Telegram instead of guessed.

  > *`GET /i-am-not-a-bot?new_page=true` · `POST /api/journey/waypoint`*

* *Player Market* — browse by category, search and filter, buy after confirmation, list items for sale, remove listings and read recent sales. Item photos are large, crisp and animated when the game ships an animated sprite, with stats and description from the game's inspect view.

  > *`GET /market/listings` · `POST /api/market/buy/{listing_id}` · `POST /api/market/{item_id}` · `GET /item/inspect/{item_id}`*

* *Live in-game chat* — a 💬 Chat button opens global, ads, support and guild chat as one live message, with channel tabs and a send flow for each one.

  > *`POST /api/chat/retrieve` · `POST /api/chat/submit`*

* *Auto-sprint stays after a restart* — enabling Auto Craft no longer saves auto sprint as OFF; turning Auto Sprint ON takes the energy back from Auto MOE or Auto Craft and reports which one it switched off.

  > *`POST /api/travel/sprint`*

* *Tidier stream layout* — EVENTS above STEPS, the step list stays visible while events collapse, six steps and four events, with STEP, CAPTCHA, ENERGY, KILLS, GOLD, EXP, MATERIALS, ITEMS and QUEST counters.

  > *`editMessageText` (Telegram Bot API)*

* *Quoted event messages* — with the live stream off, NPC kills, item finds and gather summaries are wrapped in a Telegram quote so they stay readable.

  > *`sendMessage` (Telegram Bot API)*

* *Confirmation buttons* — toggling the live stream, spending stat points, leaving or disbanding a party and buying market items all ask first.

  > *`answerCallbackQuery` · `editMessageText` (Telegram Bot API)*

* *Party menu* — manual pick with party sizes, leave for members, disband for the leader, and a create-party flow with inactivity kick and alt-account settings.

  > *`GET /travel/party` · `POST /livewire/update`*

* *Private messages* — a ✉️ Messages button opens the inbox, shows each conversation's last message and the last five messages of a thread, and lets you reply.

  > *`GET /messages/view/chat` · `POST /api/chat/retrieve` · `POST /api/chat/submit`*

* *Live stream reliability* — one edited message, no pinning, no duplicates, and a failed edit never spawns a second message.

  > *`editMessageText` (Telegram Bot API)*

* *Auto Equip* — found equipment is compared with what you wear and only clear upgrades are equipped, with notifications that follow the Auto Equip switch.

  > *`POST /inventory/equip/{item_id}?api=true`*

* *Safer healing* — fallback heal items when the selected one is empty, optional auto-buy (off by default) and a clean stop instead of fighting at 0% HP.

  > *`GET /healer?new_page=true` · `POST /api/healer/heal`*

* *Accurate gather summaries* — no more `EXP +0` / `Level ?`, resolved item types and quieter license notices.

  > *`POST` to the signed gathering endpoint from `/travel?new_page=true`*

* *Colored Telegram buttons* — green for positive actions, red for stop or cancel, blue for navigation, with a consistent emoji keyboard.

  > *`reply_markup` (Telegram Bot API)*

* *English-only interface* — every Telegram menu, notification, confirmation and error message, plus the whole terminal output, is English.

The full list is on the [release page](https://github.com/SMMURDA/simplemmo-bot/releases/latest).

## Verify a download

Each release should include a SHA-256 checksum. On Windows:

```powershell
Get-FileHash .\SimpleMMO-Bot-Windows-x64.zip -Algorithm SHA256
```

On Linux:

```bash
sha256sum SimpleMMO-Bot-Linux-x64.tar.gz
```

Compare the result with the checksum published on the release page.

## Windows reputation warnings

Unsigned or newly released executables may trigger a Windows reputation prompt. Download only from the official repository and verify the checksum. Do not permanently disable antivirus protection.

## Before launching

Read [Getting Started]({{ '/smmo/getting-started/' | relative_url }}) and prepare your own SimpleMMO and Telegram credentials. Do not use a configuration supplied by another person.

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/smmo/configuration/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Configuration</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/licensing/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Licensing</strong>
  </a>
</nav>

