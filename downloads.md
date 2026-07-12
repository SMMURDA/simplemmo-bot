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

A normal package contains the bot executable, launcher executable, `.env.example`, user instructions, and license terms. It must not contain a completed `.env`, customer license key, private signing key, or source workspace.

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
