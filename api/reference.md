---
title: API Reference
permalink: /api/reference/
---

# API Reference

[← Back to Home](/)

This page groups the API routes used by the script and explains their purpose.

## SimpleMMO Routes

| Method | API | Used By | Description |
|---|---|---|---|
| `GET` | `/api/web-app` | Auth, dashboard, energy, bank | Reads current web app payload, user state, energy, diamonds, tokens, and fallback account data. |
| `POST` | `/api/action/travel/{area_id}` | Auto Travel | Performs one travel step in the selected area. |
| `POST` | `/api/travel/sprint` | Sprint, Energy | Uses sprint energy to reduce travel time. |
| `GET` | `/travel` | Captcha, fallback | Loads travel page and captcha context. |
| `GET` | `/travel?new_page=true` | Travel, potion, energy, sell | Loads modern travel data including potion list, boosts, signed endpoints, and encounter state. |
| `POST` | `/api/bot-verification` | Captcha Solver | Sends captcha answer to SimpleMMO. |
| `POST` | `/api/popup` | Item/reward actions | Loads dynamic popup data for certain actions. |
| `GET` | `/quests` | Quest Selector | Loads quest points and expedition list. |
| `GET` | `/quests/viewall` | Quest discovery | Loads full quest list page. |
| `GET` | `/temple?new_page=true` | Temple | Loads worship data, available gods, diamonds, reset timer, and extra worship data. |
| `GET` | `/horse-and-carriage?new_page_refresh=true` | Map | Loads map locations, costs, routes, level requirements, and current location. |
| `GET` | `/horse-and-carriage/teleport/{location_id}` | Map | Teleports to selected location. |
| `POST` | `/api/horse-and-carriage/walk/{location_id}` | Map | Walks to selected location. |
| `GET` | `/daily-reward?new_page=true` | Daily Reward | Loads daily reward claim status and signed claim endpoint. |
| `GET` | `/healer?new_page=true` | Healer | Loads HP and healer data. |
| `POST` | `/api/healer/heal` | Healer | Heals the character. |
| `GET` | `/profession` | Profession | Loads profession status, energy, rewards, and timer. |
| `POST` | `/profession/start` | Profession | Starts profession for selected duration. |
| `GET` | `/abyss?new_page=true` | Abyss | Loads Abyss overview and gate data. |
| `GET` | `/abyss/gate/show/{gate_id}?new_page=true` | Abyss | Loads selected gate detail. |
| `GET` | `/bank` | Bank | Loads bank/wallet gold and transaction data. |
| `POST` | `/bank/deposit/submit` | Bank, Auto Deposit | Deposits gold into bank. |
| `POST` | `/bank/withdraw/submit` | Bank | Withdraws gold from bank. |
| `GET` | `/inventory/items` | Sell, healer | Loads inventory item list and filters. |
| `GET` | `/item/inspect/{item_id}` | Sell | Checks item details before selling. |
| `GET` | `/item/{item_id}?new_page=true` | Sell | Loads item page and dynamic actions. |
| `GET` | `/inventory/equip/{item_id}?api=true` | Auto Equip | Equips selected item. |
| `POST` | `/api/quicksell/{item_id}/quantity` | Quick Sell | Sells selected item quantity. |
| `POST` | `/inventory/retrieve/{item_id}?api=true` | Auto Sell | Retrieves found item before selling. |
| `POST` | `/api/multi-npc` | Inventory Sell | Bulk sells filtered inventory items. |
| `POST` | `/inventory/use/{item_id}` | Healer / MOE | Starts inventory item use flow. |
| `POST` | `/inventory/use/confirm/{item_id}` | Healer / MOE | Confirms item use. |
| `POST` | `/api/shop/view/3/buy/item/{shop_item_id}` | Healer | Buys healer shop item. |
| `GET` | `/maholshut/chests?new_page=true` | Chests | Loads chest page and key counts. |
| `GET` | `/maholshut/chests/{type}?new_page=true` | Chests | Loads selected chest type page. |
| `POST` | `/api/openchest/{gold|silver|bronze}/{quantity}` | Chests | Opens selected chest quantity. |
| `POST` | `/api/buygoldkey` | Chests | Buys gold key. |
| `POST` | `/maholshut/buy-keys/submit` | Chests | Buys silver/bronze keys. |
| `GET` | `/crafting/menu` | Crafting | Loads crafting page, Livewire snapshot, craftables, materials, and status. |
| `POST` | `/livewire/update` | Crafting | Sends Livewire methods for crafting actions. |
| `GET` | `/events` | Event / notifications | Loads event or notification page. |
| `GET` | `/events/viewall` | Event | Loads all event rows. |
| `GET` | `/events?new_page_refresh=true` | Event | Refreshes event list. |
| `GET` | `/events/{slug}?new_page=true` | Event | Loads selected event detail. |
| `GET` | `/home` | Game notifications | Loads home page for notification checks. |
| `GET` | `/battle` | Arena, World Boss, Player Battle | Loads arena endpoints, boss schedule/status, and signed opponent-generation endpoint. |
| `GET` | `/worldboss/attack/{boss_id}?new_page=true` | Auto World Boss | Loads fresh boss attack context. |
| `DYNAMIC` | Dynamic World Boss attack endpoint | Auto World Boss | Attacks an available boss using the endpoint parsed from the live page. |
| `POST` | Dynamic `/api/battle/colosseum/generate-opponents` URL | Player Battle | Generates opponents from normal and advanced filters. |
| `GET` | `/user/attack/{player_id}?new_page=true` | Player Battle | Loads current player attack context and tokens. |
| `POST` | `/api/user/attack/{player_id}` | Player Battle | Performs a player battle action. |

## Trial and Member Authentication Routes

These routes belong to the private license Worker, not SimpleMMO. OAuth secrets and account-linking logic must remain server-side.

| Method | API | Description |
|---|---|---|
| `GET` | `/v1/auth/config` | Returns enabled providers. Microsoft is shown only when `microsoft_enabled` is true. |
| `POST` | `/v1/auth/google` | Verifies Google credential and resolves the internal user. |
| `GET` | `/v1/auth/github` | Starts GitHub OAuth. |
| `GET` | `/v1/auth/github/callback` | Verifies GitHub callback and resolves/link the internal account. |
| `GET` | `/v1/auth/microsoft` | Starts Microsoft OAuth with state and PKCE. |
| `GET` | `/v1/auth/microsoft/callback` | Verifies Microsoft identity and links by accepted verified normalized email. |
| `POST` | `/v1/auth/logout` | Ends the member session. |
| `GET` | `/v1/account` | Returns the signed-in internal account and license state. |
| `POST` | `/v1/trial` | Creates a trial only when the resolved internal user is eligible. |

A Google, GitHub, or Microsoft identity with the same accepted verified normalized email must resolve to the same internal `user_id`. See [Microsoft Login Setup]({{ '/microsoft-login-setup/' | relative_url }}) for conflict handling and safe deployment.

## Telegram Routes

| Method | API | Description |
|---|---|---|
| `POST` | `/sendMessage` | Sends messages and reply keyboards. |
| `POST` | `/editMessageText` | Edits inline menu messages. |
| `POST` | `/deleteMessage` | Deletes temporary messages. |
| `POST` | `/answerCallbackQuery` | Acknowledges inline callback clicks. |
| `POST` | `/sendPhoto` | Sends captcha or image content. |
| `GET` | `/getUpdates` | Receives Telegram messages and callbacks. |
| `GET` | `/getMe` | Validates bot token. |

---

## Continue Reading

← Previous: [Settings, Notifications & Dashboard]({{ '/features/settings-dashboard/' | relative_url }}) | Back to [Home](/)
