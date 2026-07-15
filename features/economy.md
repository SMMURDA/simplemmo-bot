---
title: Inventory, Bank, and Economy
permalink: /features/economy/
---

# Inventory, Bank & Economy

[← Back to Home](/)

## Bank Center

Bank Center shows wallet gold, bank gold, quick deposit/withdraw amounts, transaction stats, last action, and last error.

| Method | API | Description |
|---|---|---|
| `GET` | `/bank` | Loads bank page, balances, CSRF token, and quick amount data. |
| `GET` | `/api/web-app` | Fallback source for wallet/bank user data. |
| `POST` | `/bank/deposit/submit` | Deposits gold into bank using `_token` and `GoldAmount`. |
| `POST` | `/bank/withdraw/submit` | Withdraws gold from bank using `_token` and `GoldAmount`. |

## Auto Deposit Bank

Auto Deposit runs in the background when enabled. It can automatically deposit a configured gold amount. The amount is saved in runtime settings so it survives restart/crash.

| Option | Description |
|---|---|
| Enable / Disable | Turns Auto Deposit ON or OFF from Bank menu. |
| Preset Amounts | Supports quick values such as 100,000, 1,000,000, and 10,000,000. |
| Custom Amount | User can send a custom gold amount from Telegram. |
| Persistent Setting | Saved to `data/runtime_settings.json` as `bank_auto_deposit_enabled` and `bank_auto_deposit_amount`. |

## Inventory Sell Center

Inventory Sell Center summarizes inventory by rarity and type. It supports multi-select filters before selling.

| Method | API | Description |
|---|---|---|
| `GET` | `/inventory/items` | Loads inventory item list, quantity, rarity, type, and filter data. |
| `GET` | `/item/inspect/{item_id}` | Checks item details before selling. |
| `GET` | `/item/{item_id}?new_page=true` | Loads item page and dynamic popup data. |
| `POST` | `/api/quicksell/{item_id}/quantity` | Sells selected item quantity. |
| `POST` | `/inventory/retrieve/{item_id}?api=true` | Retrieves found item into inventory before quick sell. |
| `POST` | `/api/multi-npc` | Sells filtered inventory items in bulk. |

## Auto Sell

Auto Sell is used for items found during travel. It can be toggled and filtered by rarity. Default target rarities are Common, Uncommon, and Rare.

| Option | Description |
|---|---|
| Rarity Filter | Selects which rarities can be sold automatically. |
| Equipment Check | Confirms item type/rarity before selling. |
| Safety Block | Blocks Celestial, Divine, and unknown rarity from bulk sell. |
| Auto Equip Conflict | Enabling Auto Sell disables Auto Equip. |

## Chests Center

Chests Center checks Gold/Silver/Bronze keys, opens selected chest quantity, and supports key purchase with confirmation.

| Method | API | Description |
|---|---|---|
| `GET` | `/maholshut/chests?new_page=true` | Loads key counts and chest page data. |
| `GET` | `/maholshut/chests/{type}?new_page=true` | Loads selected chest type page. |
| `POST` | `/api/openchest/{gold\|silver\|bronze}/{quantity}` | Opens selected chest quantity. |
| `POST` | `/api/buygoldkey` | Buys gold keys. |
| `POST` | `/maholshut/buy-keys/submit` | Buys silver/bronze keys when supported. |

## Energy Refill Center

Energy Refill Center displays energy, MOE, diamonds, and refill options. It also controls Auto MOE.

| Method | API | Description |
|---|---|---|
| `GET` | `/api/web-app` | Loads energy, diamonds, and user data. |
| `GET` | `/travel?new_page=true` | Loads signed refill endpoints from page data. |
| `POST` | `/inventory/use/confirm/{item_id}` | Uses MOE item after selecting tradable/untradable item ID. |
| `DYNAMIC` | Diamond refill endpoint | Refills energy using diamonds with confirmation. |
| `POST` | `/api/travel/sprint` | Used by refill + sprint or Auto MOE sprint flow. |

## Healer Center

Healer Center checks HP and heals if the character is not full HP. Auto Healer can be toggled and configured.

| Method | API | Description |
|---|---|---|
| `GET` | `/healer?new_page=true` | Loads HP, max HP, healer state, and available actions. |
| `POST` | `/api/healer/heal` | Heals the character. |
| `GET` | `/inventory/items` | Checks heal item inventory. |
| `POST` | `/inventory/use/{item_id}` | Starts heal item use flow. |
| `POST` | `/inventory/use/confirm/{item_id}` | Confirms heal item use. |
| `POST` | `/api/shop/view/3/buy/item/{shop_item_id}` | Buys healer-related shop item. |

## Map Center

Map Center loads dynamic map data and supports teleport/walk actions.

| Method | API | Description |
|---|---|---|
| `GET` | `/horse-and-carriage?new_page_refresh=true` | Loads location, route, cost, level, and current map data. |
| `GET` | `/horse-and-carriage/teleport/{location_id}` | Teleports to selected location. |
| `POST` | `/api/horse-and-carriage/walk/{location_id}` | Walks to selected location. |

## Potion Center

Potion Center lists owned potions, quantities, active effects, and supports potion use.

| Method | API | Description |
|---|---|---|
| `GET` | `/travel?new_page=true` | Loads potion list, active boosts, and potion endpoints. |
| `DYNAMIC` | `travel.potion.use_endpoint` | Uses selected potion quantity from dynamic page data. |

---

## Continue Reading

← Previous: [Automation Features]({{ '/features/automation/' | relative_url }}) | Next: [Crafting System]({{ '/features/crafting/' | relative_url }}) →
