---
title: Downloads
permalink: /downloads/
---

# Downloads

Official builds are distributed through the **GitHub Releases** page associated with this repository. The buttons below always point to the newest published release.

## Release packages

<div class="download-grid" aria-label="Release packages">
  <a class="download-card download-card--windows" href="https://github.com/SMMURDA/simplemmo-bot/releases/latest/download/SimpleMMO-Bot-Windows-x64.zip">
    <span class="download-icon download-icon--windows" aria-hidden="true">
      <svg viewBox="0 0 64 64" focusable="false"><path d="M7 12.2 29 9v21H7V12.2Zm25-3.6L57 5v25H32V8.6ZM7 34h22v21L7 51.8V34Zm25 0h25v25l-25-3.6V34Z"/></svg>
    </span>
    <span class="download-copy"><strong>Windows 64-bit</strong><small>Latest release · SimpleMMO-Bot-Windows-x64.zip</small></span>
    <span class="download-action">Download <span aria-hidden="true">↓</span></span>
  </a>
  <a class="download-card download-card--linux" href="https://github.com/SMMURDA/simplemmo-bot/releases/latest/download/SimpleMMO-Bot-Linux-x64.tar.gz">
    <span class="download-icon download-icon--linux" aria-hidden="true">
      <img src="/assets/platform/linux.svg" alt="">
    </span>
    <span class="download-copy"><strong>Linux 64-bit</strong><small>Latest release · SimpleMMO-Bot-Linux-x64.tar.gz</small></span>
    <span class="download-action">Download <span aria-hidden="true">↓</span></span>
  </a>
  <div class="download-card download-card--disabled" aria-disabled="true">
    <span class="download-icon download-icon--arm" aria-hidden="true"><img src="/assets/platform/arm.svg" alt=""></span>
    <span class="download-copy"><strong>Linux ARM64</strong><small>Package coming soon</small></span>
    <span class="download-action">Unavailable</span>
  </div>
</div>

A normal package contains the bot executable, launcher executable, `.env.example`, user instructions, and license terms. It must not contain a completed `.env`, customer license key, or private signing key.

## Verify a download

Each release should include a SHA-256 checksum. On Windows:

```powershell
Get-FileHash .\SimpleMMO-Bot-Windows-x64.zip -Algorithm SHA256
```

On Linux:

```bash
sha256sum SimpleMMO-Bot-Linux-x64.tar.gz
```

Compare the result with the checksum published on the release page.

## Windows reputation warnings

Unsigned or newly released executables may trigger a Windows reputation prompt. Download only from the official repository and verify the checksum. Do not permanently disable antivirus protection.

## Before launching

Read [Getting Started]({{ '/getting-started/' | relative_url }}) and prepare your own SimpleMMO and Telegram credentials. Do not use a configuration supplied by another person.
