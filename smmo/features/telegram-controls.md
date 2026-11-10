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
| 15 | 💬 Chat · 🤝 Party · 💪 Stats Points |
| 16 | 📡 Stream |

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
| `/chat` · 💬 Chat | Live global, ads, support and guild chat, with channel tabs and sending. |
| `/party` · 🤝 Party | Party status, manual pick with sizes, leave/disband and create-party flow, plus auto-join. |
| `/stats_points` · 💪 Stats Points | Shows unspent stat points and spends them on STR/DEF/DEX after confirmation. |
| `/stream` · 📡 Stream | Toggles the single-message live stream after confirmation (step + captcha counters and rolling events). |
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

## Chat menu

`/chat` (or the 💬 Chat button) opens the in-game chat as one live message. Inline buttons switch between the four channels:

| Button | Channel |
|---|---|
| 🌍 Global | `global` — the main world chat. |
| 📣 Ads | `advertisement` — buying, selling and trade posts. |
| 🆘 Support | `support` — help questions. |
| 🛡 Guild | The guild chat of the guild you belong to. |

* The view shows the newest eight lines, oldest at the top, each as `time Name: message`, with player names and text stripped of the game's colours and HTML.
* It refreshes itself every few seconds and edits the same message: new chat lines appear without adding messages to your Telegram chat. Identical content is skipped, so there is no needless editing.
* **✍️ Send message** asks for the text, then posts it to whichever channel is open — Global, Ads, Support or Guild. `/cancel` aborts. Empty messages and anything over 500 characters are refused before sending.
* The page token used by the chat rotates; a `401` reloads the token once and retries, and the game's own error text (rate limit, banned words) is shown in the view.
* **🔄 Refresh** reloads immediately, **❌ Close** stops the live refresh and deletes the message.

## Live stream

Travel can produce a message every few seconds: step summaries, NPC kills, item finds, materials, auto equip/sell results. The live stream groups all of that into **one message that keeps being edited** instead of a stream of new messages.

```text
📡 LIVE TRAVEL STREAM

▎ 🧭 STEP 124   🛡 CAPTCHA 3
▎ ⚔️ KILLS 13   💰 GOLD +239,130   ✨ EXP +45,120
▎ ⛏ MATERIALS 27   🎁 ITEMS 4   📜 QUEST 1

▸ STEPS (collapsed, tap to open)

▎ EVENTS
▎ 15:11:54 ⚔️ NPC DEFEATED · EXP: +4,000 · Gold: +860
▎ 15:11:49 📜 QUEST DONE · Expedition: #12 · Reward: +500 EXP
```

The summary sits in a Telegram quote block with the numbers in monospace so they line up; **EVENTS** is a collapsible quote block above, **STEPS** is a plain quote block below so the step list is always visible.

* The header shows the current **STEP**, how many **CAPTCHA** were solved, session **KILLS**, gold and EXP earned (travel rewards plus NPC rewards), materials gathered, items found and quests completed. Counters refresh as kills, finds and gathers happen, not only on the next step.
* **Quest completion** is part of the stream: the event line appears there and the QUEST counter goes up.
* The body is split into an **EVENTS** block and a **STEPS** block below it, EVENTS collapses with one tap while STEPS stays open, each one line per event, newest last. The newest six steps and four events are kept, so old lines scroll out instead of filling the message.
* Event lines are shortened: `⚔️ NPC DEFEATED · EXP: +4,000 · Gold: +860` — the "Session kills" field is dropped because the header already counts kills.
* Step lines are written as one readable paragraph: type, current gold, EXP percentage and the wait for that step.
* Edits are throttled to one every two seconds, so a fast travel loop never hits Telegram rate limits; a pending update is flushed by a timer. Identical content is skipped entirely, so the message is never recreated just because nothing changed.
* The message is **never duplicated**: if an edit fails for any reason other than the message being deleted (rate limit, HTML parse, network), the bot keeps the same message and retries on the next event. Only a deleted message gets a fresh one, exactly once.
* No pinning: the stream message is a normal message and never pins or unpins anything.
* Toggle with `/stream`, the **📡 Stream** button, or the control panel. The toggle asks for confirmation first (the prompt shows the current state), and the choice is saved and survives restarts. With it off, every event is sent as its own message again.
* **With the stream off**, a compact tracker takes its place: one pinned message with only the step number and the wait time, edited as you travel. It follows the same rules as the stream — one message, identical ticks skipped, and a failed edit never creates a duplicate. Turning the stream back on unpins and deletes it.

```text
🧭 STEP TRACKER
╰┈➤ Step : 128
╰┈➤ Wait : 5692.5ms
```

* While the stream is on, captcha chatter is suppressed: "Answer correct! Bot resuming travel...", "Icon N | similarity", the AI/automatic answer lines and the separate "CAPTCHA SOLVED" message are folded into the stream instead of being posted. Menus, captcha prompts, dashboards, license and standby messages are never streamed.

## Stat points

Every level grants stat points. **💪 Stats Points** shows how many are unspent and lets you allocate them without opening the site.

```text
💪 STAT POINTS 💪
╰┈➤ Points remaining : 85

╰┈➤ Strength  : 300
╰┈➤ Defence   : 5
╰┈➤ Dexterity : 585
```

* The values are the **base** stats you upgrade; equipment bonuses are not included, so the in-game "Total" tab will read higher.
* Buttons per stat: `+10`, `+50`, and **ALL** (spends every remaining point on that stat, the label shows how many). A button disappears when you do not have enough points for it.
* Accepting a button opens a confirmation with the stat, the amount and how many points are left; only **Yes** spends them. **Cancel** returns to the menu unchanged.
* The server's own validation text (for example "The amount must be at least 1.") is shown if it refuses.

## Party

**🤝 Party** shows whether you are in a travel party, who leads it, its size, and — when solo — the public parties with free slots.

* **Auto-join** toggle: when on and you are solo, the bot joins the first public party with a free slot after a travel step. It retries at most every three minutes and checks your state at most every 90 seconds, so it never fights with the travel loop.
* **Manual pick**: open parties are listed as buttons labelled with their size, for example `Party Name · 3/5`, so you can choose a party yourself instead of letting auto-join decide.
* **🚪 Leave party** (members) asks for confirmation, then leaves through the same action as the website. **🗑 Disband party** replaces it when you lead the party, because the game does not let an owner leave — disbanding removes every member.
* **➕ Create party** walks through the settings the website offers: a name (3-60 letters, numbers or spaces), an inactivity kick time (Off, 5/10/20/30/60 minutes, 3/6/12/24 hours, 7 days) and whether alt accounts are allowed. **Create** only fires after you confirm, and the bot reports the game's own error text if the name or settings are rejected.
* Party names, leader and member count are read from the game (five slots per party), and joining, leaving, disbanding and creating all use the same Livewire actions as the website's buttons.
* Parties kick inactive members (usually after five minutes without stepping), which is why auto-join matters when you keep travelling; being in a party shares party rewards while you step.

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
