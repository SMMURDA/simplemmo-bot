# GitHub Login Setup

The complete installation guide is included in the private source package as `GITHUB_LOGIN_SETUP.md`.

Quick requirements:

1. Create a GitHub OAuth App.
2. Set callback URL to `https://license.topup.eu.org/v1/auth/github/callback`.
3. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to Cloudflare Worker secrets.
4. Apply `license-server/migrations/0002_github_oauth.sql` from the private source package.
5. Deploy the license server before deploying this GitHub Pages update.

GitHub login should resolve an existing internal user by accepted verified normalized email before creating a new user. This allows the same person to use Google, GitHub, or Microsoft without duplicating licenses, trial history, balance, or role. See `MICROSOFT_LOGIN_SETUP.md` for the provider-neutral linking rules.

Never place the GitHub Client Secret in this public repository.
