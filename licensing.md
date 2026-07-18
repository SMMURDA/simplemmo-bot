---
title: Online Licensing
permalink: /licensing/
---

# Online Licensing

SimpleMMO Bot uses online activation to verify that a license is active and used within its device allowance.

## How activation works

1. The app reads the license key and creates a privacy-conscious device identifier.
2. It sends the key, app version, and device identifier to the license service over HTTPS.
3. The server checks status, expiration, product, and device allowance.
4. The server returns a digitally signed decision.
5. The app verifies the signature before continuing.

The production validation endpoint is:

```text
https://license.topup.eu.org/v1/check
```

## Check license status

Use the license-status endpoint to look up the current status of a license key. Send the key in a JSON request body and replace the example value with the real key only in your application or a private terminal.

**Endpoint:** `POST https://license.topup.eu.org/v1/license-status`

<div class="license-examples" data-license-examples>
  <div class="license-example-tabs" role="tablist" aria-label="License status examples">
    <button class="license-example-tab is-active" type="button" role="tab" id="license-tab-curl" aria-selected="true" aria-controls="license-panel-curl" data-license-tab="curl">
      <svg class="license-language-logo license-language-logo--curl" viewBox="0 0 72 28" aria-hidden="true"><text x="2" y="21" fill="currentColor" font-family="Arial, sans-serif" font-size="22" font-weight="700">curl</text></svg>
      <span>cURL</span>
    </button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-python" aria-selected="false" aria-controls="license-panel-python" data-license-tab="python" tabindex="-1">
      <svg class="license-language-logo license-language-logo--python" viewBox="0 0 32 32" aria-hidden="true"><path fill="#3776ab" d="M16 2c-7 0-6.6 3-6.6 3v3h6.8v1H7c-3.3 0-5 2-5 5.3 0 3.3 1.7 5.7 5 5.7h2.6v-3.7c0-3.3 2.8-5.4 6.2-5.4h6.6c3.1 0 5.6-2.6 5.6-5.8V7.9C28 4.6 25.4 2 22.2 2H16Zm-3.8 3.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/><path fill="#ffd343" d="M16.2 30c7 0 6.6-3 6.6-3v-3H16v-1h9.2c3.3 0 5-2 5-5.3 0-3.3-1.7-5.7-5-5.7h-2.6v3.7c0 3.3-2.8 5.4-6.2 5.4H9.8c-3.1 0-5.6 2.6-5.6 5.8v-1.8C4.2 27.4 6.8 30 10 30h6.2Zm3.8-3.4a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/></svg>
      <span>Python</span>
    </button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-node" aria-selected="false" aria-controls="license-panel-node" data-license-tab="node" tabindex="-1">
      <svg class="license-language-logo license-language-logo--node" viewBox="0 0 32 32" aria-hidden="true"><path fill="#5fa04e" d="m16 2 12 7v14l-12 7L4 23V9l12-7Zm0 3.2L6.8 10.5v11L16 26.8l9.2-5.3v-11L16 5.2Z"/><text x="8.5" y="19.2" fill="#5fa04e" font-family="Arial, sans-serif" font-size="9" font-weight="700">JS</text></svg>
      <span>Node.js</span>
    </button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-php" aria-selected="false" aria-controls="license-panel-php" data-license-tab="php" tabindex="-1">
      <svg class="license-language-logo license-language-logo--php" viewBox="0 0 42 28" aria-hidden="true"><ellipse cx="21" cy="14" rx="19" ry="10" fill="#777bb4"/><text x="9" y="17.5" fill="#fff" font-family="Arial, sans-serif" font-size="10" font-weight="700">php</text></svg>
      <span>PHP</span>
    </button>
  </div>

  <div class="license-example-panels">
    <section class="license-example-panel" role="tabpanel" id="license-panel-curl" aria-labelledby="license-tab-curl" data-license-panel="curl" markdown="1">

```bash
curl -X POST "https://license.topup.eu.org/v1/license-status" \\
  -H "Content-Type: application/json" \\
  -d '{"license_key":"SMMO-XXXXX-XXXXX-XXXXX-XXXXX"}'
```

    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-python" aria-labelledby="license-tab-python" data-license-panel="python" hidden markdown="1">

```python
import requests

response = requests.post(
    "https://license.topup.eu.org/v1/license-status",
    json={"license_key": "SMMO-XXXXX-XXXXX-XXXXX-XXXXX"},
    timeout=15,
)
response.raise_for_status()

license_status = response.json()
print(license_status)
```

    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-node" aria-labelledby="license-tab-node" data-license-panel="node" hidden markdown="1">

```javascript
const response = await fetch("https://license.topup.eu.org/v1/license-status", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    license_key: "SMMO-XXXXX-XXXXX-XXXXX-XXXXX",
  }),
});

if (!response.ok) {
  throw new Error(`License status request failed: ${response.status}`);
}

const licenseStatus = await response.json();
console.log(licenseStatus);
```

    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-php" aria-labelledby="license-tab-php" data-license-panel="php" hidden markdown="1">

```php
<?php

$curl = curl_init("https://license.topup.eu.org/v1/license-status");
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ["Content-Type: application/json"],
    CURLOPT_POSTFIELDS => json_encode([
        "license_key" => "SMMO-XXXXX-XXXXX-XXXXX-XXXXX",
    ]),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
]);

$response = curl_exec($curl);
$statusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($response === false || $statusCode < 200 || $statusCode >= 300) {
    throw new RuntimeException("License status request failed.");
}

$licenseStatus = json_decode($response, true, flags: JSON_THROW_ON_ERROR);
print_r($licenseStatus);
```

    </section>
  </div>
</div>
<callout icon="⚠️">Never expose a real license key in public source code, browser-side JavaScript, screenshots, or GitHub issues.</callout>

## Purchase a license

Ready to purchase a license or need help choosing one? Contact us through any of the channels below.

<div class="license-contact-grid" aria-label="License purchase contacts">
  <a class="license-contact-card" href="mailto:ask@topup.eu.org">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-email.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Email</strong><small>ask@topup.eu.org</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
  <a class="license-contact-card" href="https://instagram.com/bovalonee" target="_blank" rel="noopener noreferrer">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-instagram.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Instagram</strong><small>@bovalonee</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
  <a class="license-contact-card" href="https://t.me/bovalone" target="_blank" rel="noopener noreferrer">
    <span class="license-contact-icon" aria-hidden="true"><img src="/assets/icons/license-telegram.svg" alt=""></span>
    <span class="license-contact-copy"><strong>Telegram</strong><small>@bovalone</small></span>
    <span class="license-contact-arrow" aria-hidden="true">→</span>
  </a>
</div>

## Online-only behavior

An internet connection is required at startup and during runtime. There is no offline grace period. If the service cannot be reached or a signed validation fails, the bot does not continue running[...]

## Device limits

A license can allow one or more devices. A new computer or VPS may consume an activation slot. Contact the distributor for a device reset before migrating when your allowance is full.

## Common messages

| Message | Meaning |
|---|---|
| License key not found | The key is incorrect or not registered. |
| License expired | The subscription period has ended. |
| License revoked | The key has been disabled. |
| Device limit reached | All activation slots are in use. |
| Server unavailable | DNS, internet, firewall, or service availability prevented validation. |
| Invalid signature | The response could not be authenticated; use an official current release. |

## Protect your key

Treat a license key like a purchase credential. Do not post it in screenshots, logs, GitHub issues, or public chat. A leaked key may be revoked or consume device slots.
