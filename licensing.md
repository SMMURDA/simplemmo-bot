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

## Check a license through the API

Send a `POST` request with JSON. Use the same stable, privacy-conscious SHA-256 device ID on every check; generating a new device ID may consume another activation slot.

| Field | Required | Description |
|---|---:|---|
| `license_key` | Yes | Customer license key. |
| `device_id` | Yes | Stable 64-character SHA-256 device identifier. |
| `product_id` | Yes | Must be `simplemmo-bot-v2`. |
| `app_version` | Yes | Version of the client making the request. |
| `platform` | Yes | Short platform description, such as `Linux-x86_64`. |

The service returns a signed envelope:

```json
{
  "payload": "BASE64URL_ENCODED_JSON",
  "signature": "BASE64URL_ED25519_SIGNATURE"
}
```

After decoding `payload`, a successful decision looks like this:

```json
{
  "valid": true,
  "message": "Lisensi valid.",
  "license_id": "lic_example",
  "device_id": "YOUR_64_CHARACTER_SHA256_DEVICE_ID",
  "expires_at": "2026-08-12T00:00:00.000Z",
  "checked_at": "2026-07-14T00:00:00.000Z",
  "check_after_seconds": 600
}
```

<blockquote><p><strong>Security note:</strong> HTTP 200 alone does not mean that a license is valid. Production clients must verify the Ed25519 signature, confirm that the returned <code>device_id</code> matches the request, reject stale <code>checked_at</code> values, and then read <code>valid</code>. The examples below expect <code>LICENSE_PUBLIC_KEY_B64</code> to contain the official raw 32-byte Ed25519 public key encoded as standard Base64.</p></blockquote>

### cURL

This command sends the check and prints the signed response. cURL alone does not verify the Ed25519 signature.

```bash
curl --fail-with-body --silent --show-error \
  --request POST "https://license.topup.eu.org/v1/check" \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data '{
    "license_key": "SMMO-XXXXX-XXXXX-XXXXX-XXXXX",
    "device_id": "YOUR_64_CHARACTER_SHA256_DEVICE_ID",
    "product_id": "simplemmo-bot-v2",
    "app_version": "2.1.0",
    "platform": "Linux-x86_64"
  }'
```

### Python

Requires `requests` and `cryptography`.

```python
import base64
import json
import os
import sys
from datetime import datetime, timezone

import requests
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

URL = "https://license.topup.eu.org/v1/check"
LICENSE_KEY = os.environ["LICENSE_KEY"]
DEVICE_ID = os.environ["DEVICE_ID"]
PUBLIC_KEY = base64.b64decode(os.environ["LICENSE_PUBLIC_KEY_B64"])


def b64url_decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + "=" * (-len(value) % 4))


response = requests.post(
    URL,
    json={
        "license_key": LICENSE_KEY,
        "device_id": DEVICE_ID,
        "product_id": "simplemmo-bot-v2",
        "app_version": "2.1.0",
        "platform": "Python-client",
    },
    headers={"Accept": "application/json"},
    timeout=(5, 12),
)
response.raise_for_status()
envelope = response.json()

payload_bytes = b64url_decode(envelope["payload"])
signature = b64url_decode(envelope["signature"])
Ed25519PublicKey.from_public_bytes(PUBLIC_KEY).verify(signature, payload_bytes)
payload = json.loads(payload_bytes)

checked_at = datetime.fromisoformat(payload["checked_at"].replace("Z", "+00:00"))
if abs((datetime.now(timezone.utc) - checked_at).total_seconds()) > 300:
    raise RuntimeError("Stale license response")
if payload.get("device_id") != DEVICE_ID:
    raise RuntimeError("Device ID mismatch")

print(payload["message"])
sys.exit(0 if payload.get("valid") is True else 1)
```

### Node.js

Requires Node.js 18 or later. No external package is needed.

```js
const { createPublicKey, verify } = require("node:crypto");

const url = "https://license.topup.eu.org/v1/check";
const licenseKey = process.env.LICENSE_KEY;
const deviceId = process.env.DEVICE_ID;
const rawPublicKey = Buffer.from(process.env.LICENSE_PUBLIC_KEY_B64, "base64");

// Wrap the raw 32-byte Ed25519 key in an SPKI DER header for Node.js.
const spkiPrefix = Buffer.from("302a300506032b6570032100", "hex");
const publicKey = createPublicKey({
  key: Buffer.concat([spkiPrefix, rawPublicKey]),
  format: "der",
  type: "spki",
});

async function main() {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      license_key: licenseKey,
      device_id: deviceId,
      product_id: "simplemmo-bot-v2",
      app_version: "2.1.0",
      platform: `${process.platform}-${process.arch}`,
    }),
  });

  if (!response.ok) throw new Error(`License server returned HTTP ${response.status}`);
  const envelope = await response.json();
  const payloadBytes = Buffer.from(envelope.payload, "base64url");
  const signature = Buffer.from(envelope.signature, "base64url");

  if (!verify(null, payloadBytes, publicKey, signature)) {
    throw new Error("Invalid license signature");
  }

  const payload = JSON.parse(payloadBytes.toString("utf8"));
  if (payload.device_id !== deviceId) throw new Error("Device ID mismatch");
  if (Math.abs(Date.now() - Date.parse(payload.checked_at)) > 300_000) {
    throw new Error("Stale license response");
  }

  console.log(payload.message);
  process.exit(payload.valid === true ? 0 : 1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(2);
});
```

### PHP

Requires the cURL and Sodium extensions.

```php
<?php
$url = 'https://license.topup.eu.org/v1/check';
$licenseKey = getenv('LICENSE_KEY');
$deviceId = getenv('DEVICE_ID');
$publicKey = base64_decode(getenv('LICENSE_PUBLIC_KEY_B64'), true);

function b64url_decode_strict(string $value): string {
    $value = strtr($value, '-_', '+/');
    $value .= str_repeat('=', (4 - strlen($value) % 4) % 4);
    $decoded = base64_decode($value, true);
    if ($decoded === false) {
        throw new RuntimeException('Invalid Base64URL value');
    }
    return $decoded;
}

$requestBody = json_encode([
    'license_key' => $licenseKey,
    'device_id' => $deviceId,
    'product_id' => 'simplemmo-bot-v2',
    'app_version' => '2.1.0',
    'platform' => PHP_OS_FAMILY . '-' . php_uname('m'),
], JSON_THROW_ON_ERROR);

$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $requestBody,
    CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 12,
]);
$responseBody = curl_exec($curl);
if ($responseBody === false) {
    throw new RuntimeException(curl_error($curl));
}
$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
curl_close($curl);
if ($status < 200 || $status >= 300) {
    throw new RuntimeException("License server returned HTTP $status");
}

$envelope = json_decode($responseBody, true, 512, JSON_THROW_ON_ERROR);
$payloadBytes = b64url_decode_strict($envelope['payload']);
$signature = b64url_decode_strict($envelope['signature']);

if (!sodium_crypto_sign_verify_detached($signature, $payloadBytes, $publicKey)) {
    throw new RuntimeException('Invalid license signature');
}

$payload = json_decode($payloadBytes, true, 512, JSON_THROW_ON_ERROR);
if (($payload['device_id'] ?? '') !== $deviceId) {
    throw new RuntimeException('Device ID mismatch');
}
if (abs(time() - strtotime($payload['checked_at'])) > 300) {
    throw new RuntimeException('Stale license response');
}

echo $payload['message'] . PHP_EOL;
exit(($payload['valid'] ?? false) === true ? 0 : 1);
```

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
