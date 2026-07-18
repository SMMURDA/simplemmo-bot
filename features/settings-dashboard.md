---
title: Settings, Notifications, and Dashboard
permalink: /features/settings-dashboard/
---

# Settings, Notifications & Dashboard

[← Back to Home](/)

## Session Dashboard

Dashboard summarizes the current bot session and daily activity. It is also used for periodic reports.

| Section | Description |
|---|---|
| Travel | Steps, gold, EXP, item found, captcha count, and runtime. |
| NPC | Kill count, EXP, gold, and combat summary. |
| Materials | Gather sessions, material count, player EXP, and skill EXP. |
| Quest | Quest runs, selected expedition, EXP, and gold. |
| Auto Sell | Status, selected rarity, sold/skipped/failed count, and last error. |
| Energy & Potion | Energy, MOE, diamonds, and active effects. |
| Runtime Toggles | Shows current ON/OFF state of key automation features. |

## Daily Stats

Daily Stats are stored locally and can be reset from Telegram.

| File | Description |
|---|---|
| `data/daily_stats.json` | Stores daily counters such as travel, quest, material, and combat totals. |

## Control Panel

Control Panel changes runtime behavior without restarting the bot.

| Toggle | Description |
|---|---|
| NPC Attack | Enables or disables automatic NPC attack. |
| Material Gather | Enables or disables automatic material gathering. |
| Auto Equip | Enables equipment auto-equip and disables Auto Sell. |
| Auto Sell | Enables found-item auto sell and disables Auto Equip. |
| Auto Sprint | Enables or disables automatic sprint. |
| Auto Craft | Enables or disables background Auto Craft. |
| Auto Quest | Enables or disables background Auto Quest. |
| Auto Healer | Enables or disables automatic healing. |
| Abyss | Enables or disables Auto Abyss. |

## Notifications Settings

Notification settings are persistent and can be toggled from Telegram.

| Notification | Description |
|---|---|
| Item Found | Sends item found notification during travel. |
| Level Up | Sends level-up alerts. |
| Material Gather | Sends material gather summary. |
| NPC Kill | Sends NPC kill summary. |
| Auto Sell | Sends Auto Sell result messages. |
| Auto Equip | Sends Auto Equip result messages. |
| Captcha / Warning | Sends captcha and warning messages. |
| Hourly Report | Sends periodic dashboard report. |

| File | Description |
|---|---|
| `data/notification_settings.json` | Stores notification toggles. |

## Persistent Runtime Settings

Important toggles and selected options survive restarts through local JSON storage.

| File | Description |
|---|---|
| `data/runtime_settings.json` | Stores runtime feature toggles and selected values. |

Saved values include Auto Equip, Auto Sell, Auto Sell rarity, Auto Sprint, Auto Quest, Auto Craft, Auto MOE, Auto Healer, Auto Abyss, Bank Auto Deposit, and related quantities/options.

## Event Center

Event Center displays SimpleMMO event rows with filter, pagination, and refresh.

| Method | API | Description |
|---|---|---|
| `GET` | `/events` | Loads event overview. |
| `GET` | `/events/viewall` | Loads all event rows. |
| `GET` | `/events?new_page_refresh=true` | Refreshes event data. |
| `GET` | `/events/{slug}?new_page=true` | Loads event detail page. |

## Game Notifications

Game notification checks read game pages and show updates in Telegram.

| Method | API | Description |
|---|---|---|
| `GET` | `/events` | Event notification source. |
| `GET` | `/home` | General notification source. |

## Debug Panel

Debug Panel checks common failure points such as cookies, CSRF, API token, Telegram, and important SimpleMMO routes.

| Check | Description |
|---|---|
| Cookie Mode | Confirms current cookie/session configuration. |
| API Token | Shows whether API token is available. |
| CSRF Token | Shows whether CSRF token is available. |
| Telegram Status | Confirms Telegram bot response. |
| Endpoint Checks | Tests web app, travel, quest, temple, map, healer, profession, and other key routes. |

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/features/crafting/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Crafting System</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/api/reference/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>API Reference</strong>
  </a>
</nav>
