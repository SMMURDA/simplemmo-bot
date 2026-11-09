---
title: "Automation — SimpleMMO Bot"
permalink: /smmo/features/automation/
product: smmo
---

{% include product-switcher.html simplemmo_href="/smmo/features/automation/" vhack_href="/vhack/features/automation/" %}

# Automation — SimpleMMO Bot

[← Back to Home](/)

> **Educational guide.** This page explains how the SimpleMMO Bot's automation features work and how to use them responsibly. It is provided for **educational and personal use only**. You are responsible for reviewing and complying with SimpleMMO's terms of service before using any automation. Automation may carry account risk — always use it at your own discretion.

## How automation works

The bot reduces repetitive manual work by reading the same game state you would see in your browser, respecting server cooldowns, and performing one action at a time with a built-in safety delay. It does not bypass the game's own limits — it simply removes the tedious clicking.

## Responsible-use tips

* **Start small.** Enable one feature at a time and observe how it behaves before adding more.
* **Respect cooldowns.** The built-in safety delays keep actions within normal pacing.
* **Monitor your session.** Keep an eye on the dashboard and notifications.
* **Know the rules.** Read the game's terms of service before enabling any automation.

## Auto Travel

Auto Travel runs the main step loop. It waits for server cooldown, adds a small safety delay, and then performs the next travel step.

| Method | API | Description |
|---|---|---|
| `POST` | `/api/action/travel/{area_id}` | Performs one travel step in the selected area. |
| `GET` | `/travel?new_page=true` | Loads travel page data, potion data, signed endpoints, and encounter state. |

## Auto NPC Attack

When travel finds an NPC encounter, the bot can attack automatically until the encounter ends. It records NPC kills, EXP, gold, and hit count.

While fighting, HP is checked after every hit and Auto Healer can step in:

* The selected heal item is used in a quantity computed from the HP deficit.
* If the selected item is out of stock, the bot falls back to another heal item you own (up to four candidates, ordered by how close their heal value is to the deficit).
* Optional auto-buy purchases more stock when everything is empty; it is **off by default** because it spends gold.
* If HP reaches 0% and no heal succeeds, the bot stops attacking instead of continuing a fight that yields no gold or EXP, and sends a Telegram notice at most once per 15 minutes.

## Battle Arena

Battle Arena can run once or continue automatically. Natural Energy mode waits for regenerated energy; Auto MOE mode pauses travel and uses one Mushroom of Energy when the battle needs energy. The menu reports energy, league progress, wins, hits, and MOE usage.

## Auto World Boss

Auto World Boss reads the current and upcoming boss schedule from the live battle page. When a boss becomes attackable, the bot stores the current travel state, pauses Auto Travel, attacks the boss, and restores the exact previous travel state after the boss finishes or the attack exits safely.

If travel was already paused manually — or held by another blocking feature — the World Boss worker does not force it to resume. The dedicated Telegram menu includes Auto ON/OFF, **View Upcoming World Bosses**, statistics, status, refresh, and a separate notification toggle.

| Method | API | Description |
|---|---|---|
| `GET` | `/battle` | Loads `battle.world_boss.upcoming`, the next boss, HP, level, schedule, and attackable/dead state. |
| `GET` | `/worldboss/attack/{boss_id}?new_page=true` | Loads fresh attack context and tokens for the selected boss. |
| `DYNAMIC` | Dynamic World Boss attack endpoint | Sends attacks using the endpoint parsed from the live page. |

## Player Battle

Player Battle has manual and automatic modes:

- **Manual Battle** lists opponents that match the active filters. If energy is zero, the bot uses one MOE without a confirmation prompt, performs the selected battle, and restores the previous travel state.
- **Auto MOE** pauses travel while active, disables Auto Sprint, attacks filtered players, and uses one MOE automatically when energy reaches zero.
- **Natural Energy** waits for regenerated energy and a configurable interval. Energy is calculated at one point per five minutes, so a 30-minute interval requires six energy before starting the next automatic player battle.

Filters and advanced filters include minimum/maximum level, minimum gold, guild ID, Guild War only, bounty only, include unattackable, and reset. Mode, interval, filters, and toggle state are persisted.

| Method | API | Description |
|---|---|---|
| `GET` | `/battle` | Loads the current signed `generate-opponents` endpoint. |
| `POST` | Dynamic `/api/battle/colosseum/generate-opponents` URL | Generates opponents using the selected filters. |
| `GET` | `/user/attack/{player_id}?new_page=true` | Loads fresh attack context and tokens. |
| `POST` | `/api/user/attack/{player_id}` | Performs the player battle action. |
| `DYNAMIC` | MOE refill endpoint | Uses one MOE without confirmation when the selected mode permits it and energy is empty. |

## Material Gatherer

When travel finds a material encounter, the bot reads the session from the gathering information endpoint and then repeats the gather action until the server marks the session finished or the safety limit is reached.

Each summary reports the material, action, gathered count, player EXP, skill EXP, and the current skill level. A summary is only sent when at least one gather actually succeeded:

* Failures (no energy, session already ended, material depleted) are detected from the response body, not the HTTP status — SimpleMMO answers `200` with a `status: "error"` payload.
* The skill level keeps its last known value when the server does not send a new one, instead of showing `?`.
* When a session stops early, the message adds a note line with the server's own reason.

| Method | API | Description |
|---|---|---|
| `POST` | Dynamic gathering information endpoint | Reads the material session, action, skill, and remaining amount. |
| `POST` | Dynamic gathering gather endpoint | Performs one gather action until the session ends. |

## Auto Equip

Auto Equip decides whether a found item is actually an upgrade before wearing it. It is mutually exclusive with Auto Sell because both features handle found equipment.

How the decision is made:

1. The item's slot (Weapon, Helmet, Armour, Boots, Greaves, Gauntlet, Shield, Amulet), level, and stats are read from your inventory.
2. The item currently worn in the same slot is read from the equipped page, together with its stats.
3. A weighted score is compared inside the same slot only: `str`, `dex`, `def`, `vit` count 1.0 each, `luck` 0.5, `hp` 0.1, `energy` 0.2.
4. The bot equips when the new item scores higher, or when the slot is still empty.

Items are skipped — never equipped blindly — when they:

* require a higher character level,
* are gathering tools (pickaxe, wood axe, fishing rod, shovel) or non-equipment items,
* have stats that could not be read (for example, the item has not reached the inventory yet).

After equipping, the bot re-reads your equipped gear and only reports success when the item really occupies the slot.

Notifications follow the **Auto Equip** switch: turning Auto Equip off silences equip notifications completely. When it is on, you receive a message for an equipped upgrade (item, slot, stats, replaced item), for a skipped item (weaker / level too low / stats unreadable), or for a genuine failure.

| Method | API | Description |
|---|---|---|
| `GET` | `/inventory/items` | Reads candidate item type, level, and stats. |
| `GET` | `/inventory/equipped` | Reads currently equipped gear and its stats per slot. |
| `POST` | `/inventory/equip/{item_id}?api=true` | Equips the item with an `X-CSRF-TOKEN` header. `GET` on this route answers `405`, which is why older builds never equipped anything. |

## Captcha Solver, Optional AI, and Debug

SimpleMMO currently serves a **Journey Checkpoint**: four icons on the right, one shadow on the left, and you drag the matching icon onto the shadow. Older accounts and the signed fallback link still receive the classic "find the item named X" captcha. The bot handles both.

### Journey Checkpoint (automatic)

Nothing is hardcoded: the bot reads the submit endpoint, the `X-CSRF-TOKEN` value, the choice hashes, and every image URL from the page attributes.

1. All four choice images and the shadow are downloaded (one quick retry on a failed download).
2. Each image is reduced to its alpha mask, cropped to its content, scaled to 64×64, and compared with the shadow using intersection-over-union.
3. The answer is submitted as `{data, x, y, valid}` to the journey waypoint endpoint, with the CSRF header and your session cookies.
4. If the response does not report success, the bot reports the failure instead of retrying blindly against a consumed challenge.

To avoid wrong answers, auto-submit only happens when the best match scores **at least 0.90** and is clearly ahead of the runner-up (**margin ≥ 0.05**, or an identical bounding-box shape with a smaller margin). When two icons really are twins, or an image cannot be downloaded or decoded, the challenge is forwarded to Telegram with the images and inline buttons so you can answer it yourself. A `0` or `4` is never picked at random.

### Classic captcha and optional AI

If the page uses the older style, the bot sends the images to Telegram and you answer with inline buttons. Optional AI assistance is enabled only from the private local configuration and only applies to this style: the response must end with a validated `FINAL_CHOICE: N`, and truncated `MAX_TOKENS`/`LENGTH` output receives one continuation attempt before falling back safely. The silhouette checkpoint never uses AI — shadows are generated from the same assets, so pixel comparison is exact while a vision model would be guessing.

The normal **Captcha / Warning** notification toggle remains separate. **Captcha Debug** can mirror the full terminal flow to Telegram for diagnostics. Its title is shown only on the first debug message of each CAPTCHA run, and following messages contain only the raw log line.

| Method | API | Description |
|---|---|---|
| `GET` | `/i-am-not-a-bot?new_page=true` | Loads the verification page with the checkpoint endpoint, CSRF token, choice hashes, and image URLs. |
| `GET` | `/journey/waypoint/picture?uid=0..3` and `?uid=shadow` | Downloads the four choices and the shadow. |
| `POST` | `/api/journey/waypoint` | Submits the chosen icon (`{data, x, y, valid}`) with `X-CSRF-TOKEN`. Success is `{"type": "success"}`. |
| `POST` | `/api/bot-verification` | Legacy captcha submission, still used when the page serves the old style. |

## Sprint and Auto Sprint

Sprint can be used manually or automatically. Auto Sprint can be disabled automatically when Auto Craft or Auto MOE is enabled to avoid wasting energy.

| Method | API | Description |
|---|---|---|
| `POST` | `/api/travel/sprint` | Uses sprint energy to speed up travel. |

## Quest Selector and Auto Quest

Quest Selector lists expeditions from realtime quest data. The selected expedition is saved and used by Auto Quest. Auto Quest can be toggled without restarting the bot.

| Method | API | Description |
|---|---|---|
| `GET` | `/quests` | Loads quest points, expedition list, rewards, requirements, and progress. |
| `DYNAMIC` | Dynamic quest endpoint | Runs the selected expedition using endpoint parsed from page data. |

## Profession Center

Profession Center checks current profession, energy, rewards per minute, and running timer. Starting profession automatically pauses travel. If `/resume` is forced while profession is active, the bot warns the user and keeps travel paused.

| Method | API | Description |
|---|---|---|
| `GET` | `/profession` | Loads profession status, energy, rewards, and running timer. |
| `POST` | `/profession/start` | Starts profession for selected minutes. |
| `DYNAMIC` | MOE refill endpoint | Uses Energy Refill Manager if energy is insufficient. |

## Abyss Center and Auto Abyss

Abyss Center displays gates, joins a gate, runs actions, escapes, and completes if possible. Auto Abyss can run in background depending on settings.

| Method | API | Description |
|---|---|---|
| `GET` | `/abyss?new_page=true` | Loads Abyss overview and gate status. |
| `GET` | `/abyss/gate/show/{gate_id}?new_page=true` | Loads selected gate details. |
| `DYNAMIC` | Dynamic Abyss endpoints | Join, continue, attack, gather, escape, or complete Abyss using page data. |

## Temple Worship

Temple menu shows worship status, god options, reset time, diamonds, and extra worship price. Buying extra worship requires confirmation.

| Method | API | Description |
|---|---|---|
| `GET` | `/temple?new_page=true` | Loads temple status and available worship actions. |
| `DYNAMIC` | `temple.increase_worship_count_endpoint` | Buys extra worship with confirmation. |

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/smmo/features/telegram-controls/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Telegram Controls</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/smmo/features/economy/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Inventory, Bank & Economy</strong>
  </a>
</nav>
