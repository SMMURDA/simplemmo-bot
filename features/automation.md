---
title: Automation Features
permalink: /features/automation/
---

# Automation Features

[← Back to Home](/)

## Auto Travel

Auto Travel runs the main step loop. It waits for server cooldown, adds a small safety delay, and then performs the next travel step.

| Method | API | Description |
|---|---|---|
| `POST` | `/api/action/travel/{area_id}` | Performs one travel step in the selected area. |
| `GET` | `/travel?new_page=true` | Loads travel page data, potion data, signed endpoints, and encounter state. |

## Auto NPC Attack

When travel finds an NPC encounter, the bot can attack automatically until the encounter ends. It records NPC kills, EXP, gold, and hit count.

## Battle Arena

Battle Arena can run once or continue automatically. Natural Energy mode waits for regenerated energy; Auto MOE mode pauses travel and uses one Mushroom of Energy when the battle needs energy. The menu reports energy, league progress, wins, hits, and MOE usage.

## Auto World Boss

Auto World Boss reads the current and upcoming boss schedule from the live battle page. When a boss becomes attackable, the bot stores the current travel state, pauses Auto Travel, attacks the boss, and restores the exact previous travel state after the boss finishes or the attack exits safely.

If travel was already paused manually—or held by another blocking feature—the World Boss worker does not force it to resume. The dedicated Telegram menu includes Auto ON/OFF, **View Upcoming World Bosses**, statistics, status, refresh, and a separate notification toggle.

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

## Material Gather

When travel finds material encounters, the bot gathers automatically and reports material amount, player EXP, skill EXP, and level changes if notifications are enabled.

## Auto Equip

Auto Equip attempts to equip found equipment through the web flow. It is mutually exclusive with Auto Sell because both features handle found equipment.

| Method | API | Description |
|---|---|---|
| `GET` | `/inventory/equip/{item_id}?api=true` | Equips selected equipment item through SimpleMMO inventory flow. |

## Captcha Solver, Optional AI, and Debug

If bot verification appears, the captcha can be sent to Telegram and answered with inline buttons. Optional AI assistance is enabled only from the private local configuration. The AI response must end with a validated `FINAL_CHOICE: N`; truncated `MAX_TOKENS`/`LENGTH` output receives one continuation attempt before the solver falls back safely.

The normal **Captcha / Warning** notification toggle remains separate. **Captcha Debug** can mirror the full terminal flow to Telegram for diagnosis. Its title is shown only on the first debug message of each CAPTCHA run, while following messages contain only the raw log line.

| Method | API | Description |
|---|---|---|
| `GET` | `/travel` | Loads captcha context when verification appears. |
| `POST` | `/api/bot-verification` | Submits captcha answer. |

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
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/features/telegram-controls/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Telegram Controls</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/features/economy/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Inventory, Bank & Economy</strong>
  </a>
</nav>
