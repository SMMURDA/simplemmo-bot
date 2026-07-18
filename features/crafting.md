---
title: Crafting System
permalink: /features/crafting/
---

# Crafting System

[← Back to Home](/)

## Crafting Center

Crafting Center uses the same Livewire flow as the SimpleMMO web UI. It reads the Livewire snapshot, craftable list, material requirements, energy cost, active session, and claim state.

| Method | API | Description |
|---|---|---|
| `GET` | `/crafting/menu` | Loads crafting page, Livewire snapshot, craftables, materials, level, and active session. |
| `POST` | `/livewire/update` | Sends Livewire actions for crafting operations. |
| `DYNAMIC` | `changeCraftable` | Selects craftable type such as Common, Uncommon, Rare, keys, or diamonds. |
| `DYNAMIC` | `updateCraftingAfterQuantityChange` | Updates quantity and recalculates requirements. |
| `DYNAMIC` | `autoAddMaterials` | Automatically fills required materials. |
| `DYNAMIC` | `updateMaterials` | Updates material selection. |
| `DYNAMIC` | `initiateCraftingSession` | Starts the crafting session. |
| `DYNAMIC` | `claimItems` | Claims completed crafting results. |

## Auto Craft

Auto Craft repeatedly starts crafting based on selected craftable and interval. When enabled, Auto Sprint is disabled so regenerated energy can be saved for crafting.

| Option | Description |
|---|---|
| Enable / Disable | Turns background Auto Craft ON or OFF. |
| Select Craftable | Chooses the item category to craft. |
| Select Interval | Sets interval such as 5, 10, 15, 20, 30, or 60 minutes. |
| Quantity Mapping | Quantity is calculated from interval/energy budget. |
| Persistent Setting | Saved in `data/runtime_settings.json`. |

## Crafting Queue

Crafting Queue allows multiple crafting jobs to be queued. The queue can run in background, claim completed jobs, and start the next one.

| Feature | Description |
|---|---|
| Add Queue Item | Adds selected craftable and quantity to queue. |
| Start / Pause Queue | Controls the background queue runner. |
| Loop Mode | Repeats the queue continuously when enabled. |
| Auto Claim | Claims completed crafting before starting the next job. |
| MOE Support | Uses MOE automatically if energy is insufficient during queue processing. |
| Retry Handling | Retries temporary connection errors such as `RemoteDisconnected` or connection aborted. |
| Runtime Queue | Queue exists during runtime and resets when bot restarts. |

---

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/features/economy/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Inventory, Bank & Economy</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/features/settings-dashboard/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>Settings, Notifications & Dashboard</strong>
  </a>
</nav>
