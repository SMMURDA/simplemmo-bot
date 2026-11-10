---
title: "Telegram Controls — SimpleMMO Bot"
permalink: /smmo/features/telegram-controls/
product: smmo
---

{% include product-switcher.html simplemmo_href="/smmo/features/telegram-controls/" vhack_href="/vhack/features/chat/" %}

# Telegram Controls — SimpleMMO Bot

[← Back to Home](/)

The bot is controlled from Telegram using a persistent reply keyboard and inline buttons. Most menus refresh realtime data before showing actions.

## Button colors

Every button uses the official Bot API button styles, so the important actions are recognizable without reading them:

| Color | Meaning | Examples |
|---|---|---|
| 🟢 Green (`success`) | Positive action, or a switch that is **ON** | Start, Resume, Heal, Buy, Equip, Claim, Auto Heal ON |
| 🔴 Red (`danger`) | Action that stops, closes, or cancels | Stop Bot, Pause, Close, Cancel, Escape |
| 🔵 Blue (`primary`) | Navigation, values, or a switch that is **OFF** | Refresh, Quantity, Select Item, Auto Equip OFF |

The style is applied centrally, so every existing menu is colored without changing how it works. Clients that do not support button colors simply show plain buttons; nothing breaks. Colors never hide meaning — the label always states the current state (`Auto Equip ON` / `Auto Equip OFF`).

## Reply keyboard layout

| Row | Buttons |
|---|---|
| 1 | 🚀 Start Bot · 🛑 Pause · 🟢 Resume |
| 2 | ♻️ Restart Bot · 🚫 Stop Bot |
| 3 | 📊 Dashboard · 🧙 Profile · 📜 Quest |
| 4 | ⚔️ Kills · 📈 Stats · 📊 Daily Stats |
| 5 | ⛏️ Materials · 📚 Activity Log · 🧴 Potions |
| 6 | 🔋 Energy · 💨 Sprint · 🏛️ Temple |
| 7 | 🧭 Map · 🎯 Daily Rewards · 🩹 Healer |
| 8 | 🧑‍🏭 Profession · 🌌 Abyss · 🛡️ Battle |
| 9 | 🐉 World Boss · 🥊 Player Battle |
| 10 | 🗝️ Chests · 💰 Bank · 🔨 Crafting |
| 11 | 🧠 Auto Craft · 📥 Craft Queue · 🏷️ Auto Sell |
| 12 | 📦 Sell Inventory · 🎚️ Control · 🎉 Events |
| 13 | 📬 Notifications · 🔧 Settings · 🧪 Debug |
| 14 | ✉️ Messages |

Old labels keep working: the bot normalizes emoji variations (including the text/emoji presentation selectors) before matching, so a keyboard cached by Telegram from an older build still resolves to the right command.

## Main Commands

| Command / Button | Description |
|---|---|
| `/dashboard` · 📊 Dashboard | Opens the full session dashboard. |
| `/daily_stats` · 📊 Daily Stats | Shows persistent daily statistics and reset option. |
| `/control` · 🎚️ Control | Opens runtime toggle panel for travel-related features. |
| `/notifications` · 📬 Notifications | Opens notification toggle settings. |
| `/debug` · 🧪 Debug | Checks important endpoints and token/session state. |
| `/pause` · 🛑 Pause | Pauses travel loop. |
| `/resume` · 🟢 Resume | Resumes travel if no blocking activity is active. |
| `/restart` · ♻️ Restart Bot | Restarts the bot through launcher flow. |
| 🚫 Stop Bot | Stops the running bot and returns launcher to standby mode. |
| 🚀 Start Bot | Starts the bot again from launcher standby mode. |

## Feature Commands

| Command / Button | Description |
|---|---|
| `/potion` · 🧴 Potions | Opens Potion Center. |
| `/energy` · 🔋 Energy | Opens Energy Refill Center. |
| `/sprint` · 💨 Sprint | Opens Sprint control. |
| `/temple` · 🏛️ Temple | Opens Temple worship menu. |
| `/sell` · 📦 Sell Inventory | Opens Inventory Sell Center. |
| `/autosell` · 🏷️ Auto Sell | Opens Auto Sell settings directly. |
| `/quest` · 📜 Quest | Opens Auto Quest Settings. |
| `/quest_selector` | Opens full expedition selector. |
| `/map` · 🧭 Map | Opens Map Center. |
| `/event` · 🎉 Events | Opens Event Center. |
| `/notification` | Opens in-game notification center. |
| `/profession` · 🧑‍🏭 Profession | Opens Profession Center. |
| `/daily` · 🎯 Daily Rewards | Opens Daily Reward Center. |
| `/abyss` · 🌌 Abyss | Opens Abyss Center. |
| `/battle` · 🛡️ Battle | Opens the existing Battle Arena menu. |
| `/worldboss` · 🐉 World Boss | Opens World Boss status, schedule, statistics, and Auto Attack toggle. |
| `/playerbattle` · 🥊 Player Battle | Opens manual/automatic Player Battle, energy mode, interval, filters, and statistics. |
| `/healer` · 🩹 Healer | Opens Healer Center, including the Fallback and Auto-buy switches. |
| `/messages` · ✉️ Messages | Opens the private message inbox, with conversation threads and replies. |
| `/autocraft` · 🧠 Auto Craft | Opens Auto Craft menu. |
| `/craftqueue` · 📥 Craft Queue | Opens Crafting Queue menu. |
| `/crafting` · 🔨 Crafting | Opens Crafting Center. |
| `/bank` · 💰 Bank | Opens Bank Center. |
| `/chests` · 🗝️ Chests | Opens Chests Center. |
| ⛏️ Materials | Opens the material and gathering overview. |
| 📚 Activity Log | Shows the recent activity log. |
| ⚔️ Kills / 📈 Stats | Shows combat counters and character statistics. |
| 🧙 Profile | Shows the character profile and equipment summary. |

## Healer menu controls

| Button | Meaning |
|---|---|
| 🍽️ Use x1 / 🍽️ Use x5 | Uses the selected heal item manually. |
| 🛒 Buy x10 / 🛒 Buy x100 | Buys stock of the selected item from the healer shop. |
| Fallback ON/OFF | Allows switching to another owned heal item when the selected one is empty. Green when ON. |
| Auto-buy ON/OFF | Allows buying stock when everything is empty. Off by default because it spends gold. |
| Select Item Heal | Opens the heal item picker. Blue, since it navigates. |
| Auto Heal Quantity | Shows and edits the maximum items used per heal. |
| 🔄 Refresh / ❌ Close | Reloads the menu or closes it. |

## Messages menu

`/messages` (or the ✉️ Messages button) lists your open conversations, newest activity first. Each row shows the player's name and the last message, and the line under it says who sent it and when. The list shows up to eight conversations, with **Refresh** and **Close** below.

| Button | Meaning |
|---|---|
| `1. Name · snippet` | Opens that conversation and shows the last five messages, oldest at the top, each with sender and time. |
| ✍️ Reply | Starts a reply to that player. Type the message in Telegram and send it; `/cancel` aborts. |
| 🔄 Refresh | Re-reads the conversation or the inbox from SimpleMMO. |
| ◁ Inbox | Goes back to the conversation list. |
| ❌ Close | Closes the menu and deletes the message. |

How it works:

* The inbox is read from the messages page and every row is matched with the player id used by SimpleMMO's chat, so a click always opens the right thread.
* Each conversation's last message comes from the chat retrieve endpoint, so the snippet is current, not cached from the page.
* Sending goes through the same submit endpoint the website uses, with the page's rotating API token. A `401` refreshes the token once and retries; rate limits ("You are doing this too fast") and validation errors are shown as-is.
* Messages are capped at 1000 characters, the game's own limit, and text that looks like HTML is escaped before it reaches Telegram.
* While the reply prompt is open, another keyboard command interrupts it cleanly instead of being sent to the player as a message.

## Telegram API Used

| Method | API | Description |
|---|---|---|
| `POST` | `/sendMessage` | Sends normal messages, reply keyboard menus, and colored buttons (`reply_markup` with `style`). |
| `POST` | `/editMessageText` | Updates inline menu content after button clicks. |
| `POST` | `/deleteMessage` | Deletes temporary menus when closed. |
| `POST` | `/answerCallbackQuery` | Acknowledges inline button actions. |
| `POST` | `/sendPhoto` | Sends captcha images or image-based content. |
| `POST` | `/sendMessage` | Also delivers enabled World Boss, Player Battle, Auto Equip, Healer, and CAPTCHA Debug notifications. |
| `GET` | `/getUpdates` | Polls messages and callback data. |
| `GET` | `/getMe` | Checks bot token validity. |

Button colors use the `style` field (`primary`, `success`, `danger`) added to Bot API keyboards in 2026. Telegram accepts the field on both inline and reply keyboards, and clients older than that render the same buttons without color.

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/smmo/features/overview/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Feature Overview</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/smmo/features/automation/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Automation Features</strong>
  </a>
</nav>
