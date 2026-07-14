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

## Material Gather

When travel finds material encounters, the bot gathers automatically and reports material amount, player EXP, skill EXP, and level changes if notifications are enabled.

## Auto Equip

Auto Equip attempts to equip found equipment through the web flow. It is mutually exclusive with Auto Sell because both features handle found equipment.

| Method | API | Description |
|---|---|---|
| `GET` | `/inventory/equip/{item_id}?api=true` | Equips selected equipment item through SimpleMMO inventory flow. |

## Captcha Solver

If bot verification appears, the captcha is sent to Telegram. The user answers with inline buttons.

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

← Previous: [Telegram Controls]({{ '/features/telegram-controls/' | relative_url }}) | Next: [Inventory, Bank & Economy]({{ '/features/economy/' | relative_url }}) →
