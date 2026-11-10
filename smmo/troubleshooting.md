---
title: "Troubleshooting — SimpleMMO Bot"
permalink: /smmo/troubleshooting/
product: smmo
---

{% include product-switcher.html simplemmo_href="/smmo/troubleshooting/" vhack_href="/vhack/troubleshooting/" %}

# Troubleshooting — SimpleMMO Bot

## The launcher cannot find the bot

Keep both executables in the same folder:

```text
SimpleMMO-Launcher.exe
SimpleMMO-Bot.exe
```

## `.env` is not detected

Confirm that the file is named exactly `.env`, not `.env.txt`, and is beside the executables. On Windows:

```powershell
Get-ChildItem -Force
```

## The license service cannot be reached

Test service health:

```powershell
curl.exe https://license.topup.eu.org/health
```

Check internet access, DNS, firewall rules, and system time. Online validation is mandatory.

## A certificate notice appears at startup

```text
[LICENSE] Note: the server certificate differs from the one recorded in this build
```

This is informational, not an error. The license server's TLS certificate is renewed every few months, which changes its fingerprint; the bot reports it once per run and continues, because the response itself is signed with Ed25519 and that signature is what proves the server's identity. No action is required. If the notice repeats in a loop or the license check fails afterwards, check the system clock and whether a proxy is intercepting HTTPS.

## "This build is no longer supported" on startup

The license server enforces a minimum version so that old binaries cannot keep running with outdated behaviour. Download the current release from the Downloads page and copy your `.env`, `license.key`, and `data` folder into the new directory.

## The SimpleMMO session is rejected

Browser cookies expire. Sign in again and refresh `CF_CLEARANCE`, `LARAVEL_SESSION`, `XSRF_TOKEN`, `REMEMBER_WEB`, and `SMMO_USER_AGENT`.

## Telegram does not respond

Verify that the bot token belongs to your Telegram bot, you have sent the bot a message, and `TELEGRAM_CHAT_ID` matches your chat. Rotate the token if it was exposed.

## Buttons look plain or keep the old labels

Button colors (`style`) and the emoji keyboard are sent by the bot, but Telegram caches a reply keyboard per chat. Open the bot once and the current keyboard is pushed again; if it does not change, update the Telegram app — clients released before 2026 ignore the color field and show plain buttons (nothing else changes).

## A verification checkpoint was forwarded to Telegram

The bot solves the Journey Checkpoint automatically. It only forwards the challenge when the match is genuinely ambiguous (two icons with the same silhouette) or an image could not be downloaded or decoded. Pick the icon that matches the shadow with the inline buttons; the answer is submitted for you. Repeated forwards mean the page changed again — update the bot before answering manually every time.

## Auto Equip is ON but nothing is equipped

Since v3.2.0 this usually means the decision is working as intended:

* the found item is **not** an upgrade for its slot (lower weighted stats),
* your character level is too low for the item,
* the item is a gathering tool, a material, or a non-equipment item,
* the item's stats could not be read yet, so the bot refuses to guess.

Open **Auto Equip** notifications to see the reason for each item (equipped, skipped, or failed). Builds older than v3.2.0 could not equip at all — the equip request used the wrong HTTP method and the server answered `405` — so update if the log still shows `The GET method is not supported for route inventory/equip/...`.

## Item notifications show `Type: Unknown`

Fixed in v3.2.0: the travel response does not include an item's type, so the bot now resolves it from your inventory before notifying. If it still appears, the item is not in your inventory yet — refresh the inventory once by opening the Sell or Inventory menu.

## Gather summary shows `EXP +0` and `Level ?`

Fixed in v3.2.0. The bot now treats a server error body (`status: "error"`) as a stopped session instead of "material depleted", keeps the last known skill level instead of showing `?`, and only sends a summary when at least one gather actually succeeded — with a note explaining why it stopped. Common reasons are empty energy, a session that already ended, or a depleted material. If you still see `+0` with no note, the response format changed again; capture the terminal output for that gather and report it.

## The bot stops attacking in the middle of a fight

That is deliberate. When HP hits 0% and no heal item can be used, continuing the fight only produces 0 gold and 0 EXP and can trigger false verification warnings. The bot stops, sends one notice per 15 minutes, and resumes travelling.

If it happens often, check the Healer menu:

* the selected heal item is empty → enable **Fallback** so another owned item is used,
* every heal item is empty → enable **Auto-buy** (spends gold) or restock manually,
* the threshold is too low for the area → raise the Auto Heal threshold.

## Support logs

Include the app version, operating system, reproduction steps, and the complete error text. Remove all cookies, passwords, API tokens, Telegram tokens, chat identifiers, and license keys before sharing a log.

---

## Market

* **"The market returned a page instead of JSON"** — the market JSON endpoints need the page CSRF token. Reopen `/market`; the bot refreshes the token on the next listing request. If it persists, restart the bot so the cookie session is renewed.
* **Item picture is missing or small** — items with no sprite fall back to a text card. Static sprites are upscaled without blur; animated GIF sprites are sent as a still frame first and then replaced by the animation, so wait a second before judging the picture.
* **Buy rejected** — the bot shows the game's own reason (for example `This item no longer exists on the market.`), which usually means another player bought the listing first. There is no gold limit in the bot; the confirmation tap is the only gate.
* **Description is missing on some items** — the game only stores descriptions for some items (tools and a few specials usually have one). Items without one simply omit the description line.

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/licensing/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Licensing</strong>
  </a>
  <a class="continue-reading-card continue-reading-card--next" href="{{ '/api/reference/' | relative_url }}">
    <span class="continue-reading-label">Next <span aria-hidden="true">→</span></span>
    <strong>API Reference</strong>
  </a>
</nav>
