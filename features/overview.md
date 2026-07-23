---
title: Feature Overview
permalink: /features/overview/
---

# Feature Overview

[← Back to Home](/)

This page lists every main feature available in the script.

| Feature | Short Description |
|---|---|
| Launcher | Keeps the bot manageable from Telegram with Start, Stop, and Restart buttons. |
| Dashboard | Shows session and daily summary including travel, NPC, material, quest, sell, energy, potion, and toggles. |
| Auto Travel | Performs travel steps automatically using server cooldown and a safety delay. |
| Auto NPC Attack | Attacks NPC encounters automatically and records EXP, gold, and kills. |
| Battle Arena | Runs arena battles with Natural Energy or Auto MOE mode and session statistics. |
| Auto World Boss | Monitors the live boss schedule, pauses travel during an available boss fight, attacks automatically, and restores the previous travel state afterward. |
| Player Battle | Supports manual targets, Auto MOE, timed Natural Energy mode, opponent filters, and advanced filters. |
| Material Gather | Gathers material encounters automatically and reports material results. |
| Auto Equip | Equips found equipment through the SimpleMMO web flow. Mutually exclusive with Auto Sell. |
| Auto Sell | Automatically sells found equipment by selected rarity and supports inventory sell filters. |
| Captcha Solver | Sends captcha images to Telegram and lets the user answer with inline buttons. |
| Optional CAPTCHA AI | Uses the locally configured Gemini/Gemma model when enabled, validates `FINAL_CHOICE`, and performs one continuation retry for truncated output. |
| CAPTCHA Debug | Mirrors the complete terminal CAPTCHA flow to Telegram through a separate persistent notification toggle. |
| Energy Refill Center | Shows energy, MOE, diamonds, sprint, manual refill, diamond refill, and Auto MOE. |
| Sprint | Uses sprint energy manually or automatically. |
| Potion Center | Lists potions, active effects, quantities, duration, and allows potion use. |
| Temple Worship | Shows worship status, god choices, and extra worship purchase confirmation. |
| Map Center | Shows dynamic map data, teleport routes, and walk routes. |
| Quest Selector | Lists expeditions, rewards, progress, chance, requirements, and selected Auto Quest expedition. |
| Auto Quest Settings | Toggle Auto Quest, run quest manually, and select expedition without restarting. |
| Daily Reward Center | Checks and claims daily reward when available. |
| Healer Center | Checks HP, heals the character, and supports Auto Healer settings. |
| Profession Center | Starts profession jobs, checks energy, pauses travel while profession is running, and supports MOE flow. |
| Abyss Center | Shows Abyss gates, joins/runs Abyss, completes/escapes, and supports Auto Abyss. |
| Bank Center | Shows wallet/bank gold, deposit, withdraw, quick amounts, and session totals. |
| Auto Deposit Bank | Automatically deposits gold when the configured threshold/amount is reached. |
| Chests Center | Shows key counts, opens Gold/Silver/Bronze chests, and buys keys with confirmation. |
| Crafting Center | Handles manual crafting using Livewire actions, material auto-add, start, and claim. |
| Auto Craft | Runs crafting automatically based on selected craftable and interval; disables Auto Sprint to save energy. |
| Crafting Queue | Adds multiple crafting jobs to a queue, auto-claims, uses MOE if needed, and supports loop mode. |
| Notifications Settings | Toggles item, level, material, NPC, Auto Sell, Auto Equip, captcha/warning, CAPTCHA debug, World Boss, Player Battle, and hourly report notifications. |
| Event Center | Shows in-game events with filters and pagination. |
| Game Notifications | Reads game notification pages and displays updates in Telegram. |
| Debug Panel | Checks cookie/token/API/endpoint status for troubleshooting. |
| Persistent Runtime Settings | Saves important toggles and selected options to JSON so they survive restarts. |

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="/">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Home</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/features/telegram-controls/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Telegram Controls</strong>
  </a>
</nav>
