# GitHub Login Setup

The complete installation guide is included in the private source package as `GITHUB_LOGIN_SETUP.md`.

Quick requirements:

1. Create a GitHub OAuth App.
2. Set callback URL to `https://license.topup.eu.org/v1/auth/github/callback`.
3. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Cloudflare Worker secrets.
4. Apply `license-server/migrations/0002_github_oauth.sql` from the private source package.
5. Deploy the license server before deploying this GitHub Pages update.

Never place the GitHub Client Secret in this public repository.
