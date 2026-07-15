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
| `GET` | `/getUpdates` | Polls messages and callback data. |
| `GET` | `/getMe` | Checks bot token validity. |

---

## Continue Reading

← Previous: [Feature Overview]({{ '/features/overview/' | relative_url }}) | Next: [Automation Features]({{ '/features/automation/' | relative_url }}) →
