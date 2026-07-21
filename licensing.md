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

## Check license status

Use this read-only endpoint to inspect a license without activating a new device or updating its last-check timestamp.

<div class="api-endpoint-card" aria-label="License status endpoint">
  <div class="api-endpoint-card__request">
    <span class="http-method http-method--post">POST</span>
    <code>https://license.topup.eu.org/v1/license-status</code>
  </div>
  <div class="api-endpoint-card__meta">
    <div><small>Authentication</small><strong>None</strong></div>
    <div><small>Content type</small><strong>application/json</strong></div>
    <div><small>Operation</small><strong>Read only</strong></div>
  </div>
</div>

### Request body

| Field | Type | Required | Description |
|---|---|---|---|
| `license_key` | `string` | Yes | License key in the format issued by the distributor. Whitespace is trimmed and letters are normalized to uppercase. |

### Request examples

<div class="license-examples" data-license-examples>
  <div class="license-example-tabs" role="tablist" aria-label="License status examples">
    <button class="license-example-tab is-active" type="button" role="tab" id="license-tab-curl" aria-selected="true" aria-controls="license-panel-curl" data-license-tab="curl"><span class="license-logo-frame license-logo-frame--curl" aria-hidden="true"><span class="license-curl-mark">&gt;_</span></span><span>cURL</span></button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-python" aria-selected="false" aria-controls="license-panel-python" data-license-tab="python" tabindex="-1"><span class="license-logo-frame" aria-hidden="true"><img class="license-language-logo" src="/assets/icons/languages/python.svg" alt=""></span><span>Python</span></button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-node" aria-selected="false" aria-controls="license-panel-node" data-license-tab="node" tabindex="-1"><span class="license-logo-frame" aria-hidden="true"><img class="license-language-logo" src="/assets/icons/languages/nodejs.svg" alt=""></span><span>Node.js</span></button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-php" aria-selected="false" aria-controls="license-panel-php" data-license-tab="php" tabindex="-1"><span class="license-logo-frame" aria-hidden="true"><img class="license-language-logo license-language-logo--php" src="/assets/icons/languages/php.svg" alt=""></span><span>PHP</span></button>
    <button class="license-example-tab" type="button" role="tab" id="license-tab-powershell" aria-selected="false" aria-controls="license-panel-powershell" data-license-tab="powershell" tabindex="-1"><span class="license-logo-frame" aria-hidden="true"><img class="license-language-logo" src="/assets/icons/languages/powershell.svg" alt=""></span><span>PowerShell</span></button>
  </div>
  <div class="license-example-panels">
    <section class="license-example-panel" role="tabpanel" id="license-panel-curl" aria-labelledby="license-tab-curl" data-license-panel="curl">
      <div class="highlight"><pre><code class="language-bash"><span class="nf">curl</span> <span class="k">-X</span> POST <span class="s">"https://license.topup.eu.org/v1/license-status"</span> <span class="o">\</span>
  <span class="k">-H</span> <span class="s">"Content-Type: application/json"</span> <span class="o">\</span>
  <span class="k">-d</span> <span class="s">'{"license_key":"SMMO-XXXXX-XXXXX-XXXXX-XXXXX"}'</span></code></pre></div>
    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-python" aria-labelledby="license-tab-python" data-license-panel="python" hidden>
      <div class="highlight"><pre><code class="language-python"><span class="k">import</span> <span class="nn">requests</span>

response <span class="o">=</span> requests.<span class="nf">post</span>(
    <span class="s">"https://license.topup.eu.org/v1/license-status"</span>,
    json<span class="o">=</span>{<span class="s">"license_key"</span>: <span class="s">"SMMO-XXXXX-XXXXX-XXXXX-XXXXX"</span>},
    timeout<span class="o">=</span><span class="mi">15</span>,
)
response.<span class="nf">raise_for_status</span>()

license_status <span class="o">=</span> response.<span class="nf">json</span>()
<span class="nf">print</span>(license_status)</code></pre></div>
    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-node" aria-labelledby="license-tab-node" data-license-panel="node" hidden>
      <div class="highlight"><pre><code class="language-javascript"><span class="k">const</span> response <span class="o">=</span> <span class="k">await</span> <span class="nf">fetch</span>(<span class="s">"https://license.topup.eu.org/v1/license-status"</span>, {
  method: <span class="s">"POST"</span>,
  headers: { <span class="s">"Content-Type"</span>: <span class="s">"application/json"</span> },
  body: JSON.<span class="nf">stringify</span>({
    license_key: <span class="s">"SMMO-XXXXX-XXXXX-XXXXX-XXXXX"</span>,
  }),
});

<span class="k">if</span> (!response.ok) {
  <span class="k">throw new</span> Error(<span class="s">`License status request failed: ${response.status}`</span>);
}

<span class="k">const</span> licenseStatus <span class="o">=</span> <span class="k">await</span> response.<span class="nf">json</span>();
console.<span class="nf">log</span>(licenseStatus);</code></pre></div>
    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-php" aria-labelledby="license-tab-php" data-license-panel="php" hidden>
      <div class="highlight"><pre><code class="language-php"><span class="k">&lt;?php</span>

<span class="nv">$curl</span> <span class="o">=</span> <span class="nf">curl_init</span>(<span class="s">"https://license.topup.eu.org/v1/license-status"</span>);
<span class="nf">curl_setopt_array</span>(<span class="nv">$curl</span>, [
    CURLOPT_POST <span class="o">=&gt;</span> <span class="k">true</span>,
    CURLOPT_HTTPHEADER <span class="o">=&gt;</span> [<span class="s">"Content-Type: application/json"</span>],
    CURLOPT_POSTFIELDS <span class="o">=&gt;</span> <span class="nf">json_encode</span>([
        <span class="s">"license_key"</span> <span class="o">=&gt;</span> <span class="s">"SMMO-XXXXX-XXXXX-XXXXX-XXXXX"</span>,
    ]),
    CURLOPT_RETURNTRANSFER <span class="o">=&gt;</span> <span class="k">true</span>,
    CURLOPT_TIMEOUT <span class="o">=&gt;</span> <span class="mi">15</span>,
]);

<span class="nv">$response</span> <span class="o">=</span> <span class="nf">curl_exec</span>(<span class="nv">$curl</span>);
<span class="nv">$statusCode</span> <span class="o">=</span> <span class="nf">curl_getinfo</span>(<span class="nv">$curl</span>, CURLINFO_HTTP_CODE);
<span class="nf">curl_close</span>(<span class="nv">$curl</span>);

<span class="k">if</span> (<span class="nv">$response</span> <span class="o">===</span> <span class="k">false</span> <span class="o">||</span> <span class="nv">$statusCode</span> <span class="o">&lt;</span> <span class="mi">200</span> <span class="o">||</span> <span class="nv">$statusCode</span> <span class="o">&gt;=</span> <span class="mi">300</span>) {
    <span class="k">throw new</span> RuntimeException(<span class="s">"License status request failed."</span>);
}

<span class="nv">$licenseStatus</span> <span class="o">=</span> <span class="nf">json_decode</span>(<span class="nv">$response</span>, <span class="k">true</span>, flags: JSON_THROW_ON_ERROR);
<span class="nf">print_r</span>(<span class="nv">$licenseStatus</span>);</code></pre></div>
    </section>
    <section class="license-example-panel" role="tabpanel" id="license-panel-powershell" aria-labelledby="license-tab-powershell" data-license-panel="powershell" hidden>
      <div class="highlight"><pre><code class="language-powershell"><span class="nf">Invoke-RestMethod</span> <span class="k">-Uri</span> <span class="s">"https://license.topup.eu.org/v1/license-status"</span> <span class="k">-Method</span> Post <span class="k">-ContentType</span> <span class="s">"application/json"</span> <span class="k">-Body</span> <span class="s">'{"license_key":"SMMO-XXXX-XXXX-XXXX-XXXX"}'</span></code></pre></div>
    </section>
  </div>
</div>

<callout icon="⚠️">Never expose a real license key in public source code, browser-side JavaScript, screenshots, or GitHub issues.</callout>

### Response status reference

HTTP success and license validity are separate signals. A `200 OK` response means the lookup completed successfully; always inspect the JSON `status` and `active` fields before deciding whether the license is usable.

<div class="api-status-table-wrap">
<table class="api-status-table">
  <thead>
    <tr><th>HTTP</th><th>API status</th><th>Active</th><th>Meaning</th></tr>
  </thead>
  <tbody>
    <tr><td><span class="api-status api-status--success">200 OK</span></td><td><code>active</code></td><td><strong>Yes</strong></td><td>The key exists, is enabled, and has not expired.</td></tr>
    <tr><td><span class="api-status api-status--success">200 OK</span></td><td><code>not_found</code></td><td>No</td><td>The lookup completed, but the supplied key is unknown.</td></tr>
    <tr><td><span class="api-status api-status--success">200 OK</span></td><td><code>revoked</code></td><td>No</td><td>The key exists but is inactive or revoked.</td></tr>
    <tr><td><span class="api-status api-status--success">200 OK</span></td><td><code>expired</code></td><td>No</td><td>The key exists, but its expiration time has passed.</td></tr>
    <tr><td><span class="api-status api-status--warning">204 No Content</span></td><td>—</td><td>—</td><td>Successful browser CORS preflight from the official site; no response body.</td></tr>
    <tr><td><span class="api-status api-status--warning">400 Bad Request</span></td><td><code>invalid_request</code></td><td>No</td><td>The JSON body is invalid or <code>license_key</code> is missing.</td></tr>
    <tr><td><span class="api-status api-status--danger">403 Forbidden</span></td><td>—</td><td>—</td><td>A browser preflight came from an origin that is not allowed.</td></tr>
    <tr><td><span class="api-status api-status--danger">404 Not Found</span></td><td>—</td><td>—</td><td>The request used an endpoint path that does not exist.</td></tr>
    <tr><td><span class="api-status api-status--danger">500 Server Error</span></td><td>—</td><td>—</td><td>The license service encountered an unexpected internal error.</td></tr>
  </tbody>
</table>
</div>

### Response examples

<div class="api-response-list">
  <details class="api-response" open>
    <summary><span class="api-status api-status--success">200 OK</span><span><strong>Active license</strong><small>The license can be used.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "ok": true,
  "active": true,
  "status": "active",
  "message": "License is active.",
  "license": {
    "key_masked": "SMMO••••X7K9",
    "created_at": "2026-07-01T08:30:00.000Z",
    "expires_at": "2026-08-01T08:30:00.000Z",
    "expires_in_days": 12,
    "max_devices": 1,
    "active_devices": 1
  }
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--success">200 OK</span><span><strong>License not found</strong><small>The lookup succeeded, but the key is unknown.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "ok": true,
  "active": false,
  "status": "not_found",
  "message": "License key was not found."
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--success">200 OK</span><span><strong>Revoked license</strong><small>The key exists but has been disabled.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "ok": true,
  "active": false,
  "status": "revoked",
  "message": "License is inactive or revoked.",
  "license": {
    "key_masked": "SMMO••••X7K9",
    "created_at": "2026-07-01T08:30:00.000Z",
    "expires_at": "2026-08-01T08:30:00.000Z",
    "expires_in_days": 12,
    "max_devices": 1,
    "active_devices": 1
  }
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--success">200 OK</span><span><strong>Expired license</strong><small>The key exists, but its access period has ended.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "ok": true,
  "active": false,
  "status": "expired",
  "message": "License has expired.",
  "license": {
    "key_masked": "SMMO••••X7K9",
    "created_at": "2026-06-01T08:30:00.000Z",
    "expires_at": "2026-07-01T08:30:00.000Z",
    "expires_in_days": 0,
    "max_devices": 1,
    "active_devices": 1
  }
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--warning">400 Bad Request</span><span><strong>Invalid request</strong><small>The required license key was not supplied.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "ok": false,
  "active": false,
  "status": "invalid_request",
  "message": "license_key is required."
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--danger">404 Not Found</span><span><strong>Unknown route</strong><small>The endpoint URL is incorrect.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "message": "Not found"
}</code></pre></div>
  </details>

  <details class="api-response">
    <summary><span class="api-status api-status--danger">500 Server Error</span><span><strong>Internal error</strong><small>The service could not complete the request.</small></span><span class="api-response__chevron" aria-hidden="true">⌄</span></summary>
    <div class="api-response__body"><pre><code class="language-json">{
  "message": "Internal license server error"
}</code></pre></div>
  </details>
</div>

### Activation validation response

The bot itself uses `POST /v1/check`. That endpoint returns a signed envelope for both accepted and rejected license decisions. A `200 OK` response alone does not mean the license is valid: the client verifies the Ed25519 signature, decodes the signed payload, and continues only when `valid` is `true`.

| HTTP | Signed field | Result |
|---|---|---|
| `200 OK` | `valid: true` | License accepted; the bot may continue. |
| `200 OK` | `valid: false` | License rejected because of invalid data, unknown key, revoked/expired status, or device limit. |
| `404 Not Found` | — | Validation URL is incorrect. |
| `500 Server Error` | — | Signing, database, or service failure; the bot stops safely. |

## Online-only behavior

An internet connection is required at startup and during runtime. There is no offline grace period. If the service cannot be reached or a signed validation fails, the bot does not continue running.

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
