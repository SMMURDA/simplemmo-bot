---
title: "VHack Revolution — Troubleshooting"
permalink: /vhack/troubleshooting/
---

{% include product-switcher.html simplemmo_href="/troubleshooting/" vhack_href="/vhack/troubleshooting/" %}

# Troubleshooting — VHack Revolution Bot

## Connection fails immediately

### Check credentials

Verify your `.env` values match your current vHack.cc login session:

```env
VHACK_USER_ID=1239734
VHACK_ACCESS_TOKEN=your_access_token
VHACK_UNIQUE_ID=your_unique_id
VHACK_PLATFORM=Windows
```

These values expire when you log in from another device or the session rotates. Re-capture them from a fresh `:LOGIN:` request.

### Check network access

Test connectivity to the game server:

```bash
nc -zv vhack.cc 8182
```

If the connection times out, check your firewall rules, DNS resolution, and internet access.

## `.env` is not detected

Confirm the file is named exactly `.env` (not `.env.txt`) and is in the project root:

```bash
ls -la .env
```

## Timeout errors

If requests time out frequently, increase the timeout value:

```env
VHACK_TIMEOUT_MS=30000
```

For slow connections, also increase the settle delay:

```env
VHACK_SETTLE_MS=2000
```

## Auto Reconnect not working

Verify Auto Reconnect is enabled:

- **Terminal:** Press `T` on page 4 to toggle — status should show ON
- **Web:** Check Settings → Auto Reconnect

The reconnect sequence is: `1s → 2s → 4s → 8s → 15s`. After five failed attempts, the bot stops retrying.

## Bounty not detecting targets

- Ensure `BOUNTY_REFRESH_BATCH` is between 5 and 10
- Verify the bounty is actually active in-game (check `huntRunning` status on Account page)
- Check Activity page for `ERROR` or `WARNING` badges during bounty search

## Voucher redemption fails

### "VOUCHER CODE ALREADY REDEEMED"

This is expected — the bot handles `REDEEMEDV2 {result:1}` gracefully and moves to the next code. No action needed.

### Voucher not found in logs

- Ensure the connection has voucher data in its remote log
- Check that the `/* vTC VOUCHER */` marker exists in the log content
- Some connections may not have any voucher codes

## Web dashboard not accessible

### Cannot open `http://127.0.0.1:3000`

1. Verify the web server is running: `npm run web`
2. Check if the port is in use:
   ```bash
   lsof -i :3000
   ```
3. Change the port in `.env`:
   ```env
   VHACK_WEB_PORT=3001
   ```

### Page shows no data

The dashboard relies on SSE for live updates. If data doesn't appear:

1. Check that the vHack session is connected (status should be ONLINE)
2. Refresh the page
3. Check browser console for SSE connection errors

## Terminal display issues

### Banner or panels are misaligned

- Ensure your terminal is at least **80 columns × 32 rows**
- The ANSI Shadow banner requires at least 32 rows
- Width is capped at 124 columns

### Colors not showing

- Use a terminal that supports 256 colors or true color
- Check your `$TERM` variable: `echo $TERM`
- Try: `export TERM=xterm-256color`

### Flickering or screen tearing

The bot uses a flicker-free renderer that overwrites individual rows. If you still see flicker:

- Update to the latest version
- Try a different terminal emulator (iTerm2, Windows Terminal, Alacritty)

## Node.js version errors

VHack Revolution Bot requires **Node.js 18** or newer:

```bash
node --version
# Should be v18.x.x or higher
```

Update Node.js if needed:

```bash
# Using nvm
nvm install 18
nvm use 18
```

## Smoke tests fail

Run the offline test suite:

```bash
npm test
npm run check
```

If tests fail, the issue is in module wiring or core parsers. Tests never connect to the game server.

## Continue Reading

<nav class="continue-reading" aria-label="Feature navigation">
  <a class="continue-reading-card continue-reading-card--previous" href="{{ '/vhack/features/chat/' | relative_url }}">
    <span class="continue-reading-label"><span aria-hidden="true">←</span> Previous</span>
    <strong>Chat</strong>
  </a>
</nav>
