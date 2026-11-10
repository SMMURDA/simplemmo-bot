---
title: "Player Market — SimpleMMO Bot"
permalink: /smmo/features/market/
product: smmo
---

{% include product-switcher.html simplemmo_href="/smmo/features/market/" vhack_href="/vhack/features/overview/" %}

# Player Market

[← Back to Home]({{ '/' | relative_url }})

> **Educational guide.** This page documents the market feature. It is provided for **educational and personal use only**. You are responsible for reviewing and complying with SimpleMMO's terms of service. Trading with other players carries risk — always confirm the price before you buy.

The 💬 Chat-style button row gained a **🏪 Market** entry: `/market` opens the player market inside Telegram, with the same categories the game offers.

## Category screen

The first screen mirrors the market sidebar:

| Row | Categories |
|---|---|
| 1 | 🗂️ All · ⚔️ Weapons |
| 2 | 🛡️ Armour · 🎒 Items |
| 3 | 🐾 Pets · 📿 Amulets |
| 4 | 🛡 Shields · 👢 Boots |
| 5 | ⛑️ Helmets · 🧩 Collectables |
| 6 | 👤 Avatars · ⛏️ Materials |
| 7 | 🖼️ Sprites · 🦵 Greaves |
| 8 | 🧤 Gauntlets · 🏞️ Backgrounds |
| 9 | ✨ Specials · 🛠️ Tools |
| 10 | 🧪 Potions · 🎉 Event Collectables |
| 11 | 🃏 Trading Cards · 🎫 Membership |
| 12 | 🧰 Treasure Chest |

`Tools` groups fishing rods, wood axes, pickaxes and shovels, exactly like the game. `🔎 Search by name`, `🧾 My listings`, `🕘 Recent sales` and `❌ Close` sit underneath.

## Searching and filtering

* Search by name: send part of an item name as a message (`dragon`, `shovel`, …).
* Filters: item type, rarity, a gold range (`10000-500000`, open-ended allowed) and sort order (cheapest or most expensive first).
* Results show five listings per screen with the page summary: number of listings, lowest, median and highest price on that page.
* `◁ Prev` / `Next ▷` page through results; `◁ Categories` returns to the category screen and clears the filters.

## Buying

Tapping a listing opens the item as one message: the sprite (animated when the game ships an animated GIF), its name, type and rarity, value, stats, supply, market range, level, seller and price, plus **✅ Buy** and **❌ Cancel**.

* The item's **stats and description** come from the game's own inspect and item-popup endpoints, so tools show their description (for example “This rare shovel can be used to find up to three materials.”) while items without one simply omit the line.
* There is **no gold limit** on purchases; the confirmation button is the only gate. The bot never buys on its own.
* After a purchase the market message shows the result (item, price, server message) with **◁ Back** (same page and filters), **🗂️ Categories** and **❌ Close**.
* A rejected purchase shows the game's own reason, such as `This item no longer exists on the market.`

## Selling

`➕ Sell an item` asks for part of the item name, lists matching inventory items with their quantity, then asks how many to list (1–20) and the price per item, showing the lowest current listing as a reference. The final confirmation shows the quantity, price, total and the 6% market fee before anything is listed.

## My listings and recent sales

* `🧾 My listings` lists your active listings with their prices; tapping one asks to remove it from the market.
* `🕘 Recent sales` shows the latest market sales with item, price, time and seller.

## Notes

* Every write (buy, list, remove) requires a confirmation tap.
* Item sprites are upscaled with nearest-neighbour (no blur) and animated sprites keep their animation, so the item is readable at a glance without opening anything.
* The market reads prices with the site's own filters, so the summary matches what the website shows for the same page.

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/smmo/features/telegram-controls/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Telegram Controls</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/smmo/features/settings-dashboard/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Settings & Dashboard</strong>
  </a>
</nav>

