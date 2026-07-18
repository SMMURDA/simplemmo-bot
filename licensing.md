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

Use the license-status endpoint to look up the current status of a license key. Send the key in a JSON request body and replace the example value with the real key only in your application or a private terminal.

**Endpoint:** `POST https://license.topup.eu.org/v1/license-status`

<div class="license-examples" data-license-examples>
  <div class="license-example-tabs" role="tablist" aria-label="License status examples">
    <button class="license-example-tab is-active" type="button" role="tab" id="license-tab-curl" aria-selected="true" aria-controls="license-panel-curl" data-license-tab="curl"><span class="license-logo-frame" aria-hidden="true"><img class="license-language-logo license-language-logo--curl" src="/assets/icons/languages/curl.svg" alt=""></span><span>cURL</span></button>
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

<callout icon="⚠️">Never expose a real license key in public source code, browser-side JavaScript, screenshots, or GitHub issues.</callout>

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
