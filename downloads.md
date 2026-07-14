---
title: Downloads
permalink: /downloads/
---

# Downloads

Official builds are distributed through the **GitHub Releases** page associated with this repository.

## Release packages

| Platform | Expected asset |
|---|---|
| Windows 64-bit | [📥 **SimpleMMO-v2.0.1-windows-x64.zip**](https://github.com/SMMURDA/simplemmo-bot/releases/download/v2.0.1/simplemmo-windows-x64.zip) |
| Linux 64-bit | [📥 **SimpleMMO-v2.0.1-linux-x64.tar.gz**](https://github.com/SMMURDA/simplemmo-bot/releases/download/v2.0.1/simplemmo-linux-x64.tar.gz) |
| Linux ARM64 | SimpleMMO-v2.0.1-linux-arm64.tar.gz (not available) |

A normal package contains the bot executable, launcher executable, `.env.example`, user instructions, and license terms. It must not contain a completed `.env`, customer license key, private signi[...]

## Verify a download

Each release should include a SHA-256 checksum. On Windows:

```powershell
Get-FileHash .\SimpleMMO-v2.0.1-windows-x64.zip -Algorithm SHA256
```

On Linux:

```bash
sha256sum SimpleMMO-v2.0.1-linux-x64.tar.gz
```

Compare the result with the checksum published on the release page.

## Windows reputation warnings

Unsigned or newly released executables may trigger a Windows reputation prompt. Download only from the official repository and verify the checksum. Do not permanently disable antivirus protection.

## Before launching

Read [Getting Started]({{ '/getting-started/' | relative_url }}) and prepare your own SimpleMMO and Telegram credentials. Do not use a configuration supplied by another person.
