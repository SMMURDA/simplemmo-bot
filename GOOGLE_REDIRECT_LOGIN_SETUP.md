---
title: Google Redirect Login Setup
permalink: /google-redirect-login-setup/
---

# Google Redirect OAuth Setup

The Trial page now uses a normal server-side Google OAuth redirect instead of the browser One Tap/FedCM prompt.

1. Open Google Cloud Console → APIs & Services → Credentials.
2. Open the OAuth 2.0 Web application used by the site.
3. Add Authorized JavaScript origin: `https://topup.eu.org`.
4. Add Authorized redirect URI exactly: `https://license.topup.eu.org/v1/auth/google/callback`.
5. Copy the Client ID and Client Secret.
6. Set Worker secrets:

```bash
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler deploy
```

Use the same `--env production` flag on secrets and deploy when applicable. Verify `/v1/auth/config` returns `google_oauth_enabled: true`. The old POST credential route remains available for backwards compatibility, but the new Trial button uses `GET /v1/auth/google`.
