---
title: Telegram Controls
permalink: /features/telegram-controls/
---

# Telegram Controls

[← Back to Home](/)

The bot is controlled from Telegram using a persistent reply keyboard and inline buttons. Most menus refresh realtime data before showing actions.

## Main Commands

| Command / Button | Description |
|---|---|
| `/dashboard` | Opens the full session dashboard. |
| `/daily_stats` | Shows persistent daily statistics and reset option. |
| `/control` | Opens runtime toggle panel for travel-related features. |
| `/notifications` | Opens notification toggle settings. |
| `/debug` | Checks important endpoints and token/session state. |
| `/pause` | Pauses travel loop. |
| `/resume` | Resumes travel if no blocking activity is active. |
| `/restart` | Restarts the bot through launcher flow. |
| `🔴 Stop Bot` | Stops the running bot and returns launcher to standby mode. |
| `🟢 Start Bot` | Starts the bot again from launcher standby mode. |

## Feature Commands

| Command / Button | Description |
|---|---|
| `/potion` | Opens Potion Center. |
| `/energy` | Opens Energy Refill Center. |
| `/sprint` | Opens Sprint control. |
| `/temple` | Opens Temple worship menu. |
| `/sell` | Opens Inventory Sell Center. |
| `/autosell` | Opens Auto Sell settings directly. |
| `/quest` | Opens Auto Quest Settings. |
| `/quest_selector` | Opens full expedition selector. |
| `/map` | Opens Map Center. |
| `/event` | Opens Event Center. |
| `/notification` | Opens in-game notification center. |
| `/profession` | Opens Profession Center. |
| `/daily` | Opens Daily Reward Center. |
| `/abyss` | Opens Abyss Center. |
| `/battle` | Opens the existing Battle Arena menu. |
| `/worldboss` / `♛ World Boss` | Opens World Boss status, schedule, statistics, and Auto Attack toggle. |
| `/playerbattle` / `⚔ Player Battle` | Opens manual/automatic Player Battle, energy mode, interval, filters, and statistics. |
| `/healer` | Opens Healer Center. |
| `/autocraft` | Opens Auto Craft menu. |
| `/craftqueue` | Opens Crafting Queue menu. |
| `/crafting` | Opens Crafting Center. |
| `/bank` | Opens Bank Center. |
| `/chests` | Opens Chests Center. |

## Telegram API Used

| Method | API | Description |
|---|---|---|
| `POST` | `/sendMessage` | Sends normal messages and reply keyboard menus. |
| `POST` | `/editMessageText` | Updates inline menu content after button clicks. |
| `POST` | `/deleteMessage` | Deletes temporary menus when closed. |
| `POST` | `/answerCallbackQuery` | Acknowledges inline button actions. |
| `POST` | `/sendPhoto` | Sends captcha images or image-based content. |
| `POST` | `/sendMessage` | Also delivers enabled World Boss, Player Battle, and CAPTCHA Debug notifications. |
| `GET` | `/getUpdates` | Polls messages and callback data. |
| `GET` | `/getMe` | Checks bot token validity. |

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/features/overview/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Feature Overview</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/features/automation/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Automation Features</strong>
  </a>
</nav>
