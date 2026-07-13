---
title: Downloads
permalink: /downloads/
---

# Downloads

Official builds are distributed through the **GitHub Releases** page associated with this repository.

## Release packages

| Platform | Expected asset |
|---|---|
| Windows 64-bit | `SimpleMMO-vX.Y.Z-windows-x64.zip` |
| Linux 64-bit | `SimpleMMO-vX.Y.Z-linux-x64.tar.gz` |
| Linux ARM64 | `SimpleMMO-vX.Y.Z-linux-arm64.tar.gz`, when available |

A normal package contains the bot executable, launcher executable, `.env.example`, user instructions, and license terms. It must not contain a completed `.env`, customer license key, private signi[...]

## Windows

Download the latest Windows 64-bit build:

📥 [**Download SimpleMMO Bot for Windows (x64)**](https://release-assets.githubusercontent.com/github-production-release-asset/1298605780/01a56f8e-7c7e-406d-b8e6-aa54cb4363f8?sp=r&sv=2018-11-09&sr=b&spr=https&se=2026-07-13T03%3A46%3A55Z&rscd=attachment%3B+filename%3Dsimplemmo-windows-x64.zip&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2026-07-13T02%3A46%3A05Z&ske=2026-07-13T03%3A46%3A55Z&sks=b&skv=2018-11-09&sig=foHo7mxs0xHmk3om4LFQuPXZHsFDoowNBqEN50fTzNs%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc4MzkxMjU2NSwibmJmIjoxNzgzOTEwNzY1LCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.BL94RjWITRYeZj2AvkR_nq79Q8o9G60ul73kfrMtn0o&response-content-disposition=attachment%3B%20filename%3Dsimplemmo-windows-x64.zip&response-content-type=application%2Foctet-stream)

## Linux

Linux builds are currently **not available**. Please check back later for updates.

## Verify a download

Each release should include a SHA-256 checksum. On Windows:

```powershell
Get-FileHash .\SimpleMMO-vX.Y.Z-windows-x64.zip -Algorithm SHA256
```

On Linux:

```bash
sha256sum SimpleMMO-vX.Y.Z-linux-x64.tar.gz
```

Compare the result with the checksum published on the release page.

## Windows reputation warnings

Unsigned or newly released executables may trigger a Windows reputation prompt. Download only from the official repository and verify the checksum. Do not permanently disable antivirus protection.

## Before launching

Read [Getting Started]({{ '/getting-started/' | relative_url }}) and prepare your own SimpleMMO and Telegram credentials. Do not use a configuration supplied by another person.
