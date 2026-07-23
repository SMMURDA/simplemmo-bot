---
title: Microsoft Login Setup
permalink: /microsoft-login-setup/
---

# Microsoft Login and Email Account Linking

This public GitHub Pages package contains the Microsoft sign-in button and provider-aware frontend flow. The private Cloudflare Worker must implement the OAuth endpoints and account-linking transaction before Microsoft login is enabled.

## Microsoft Entra application

1. Open **Microsoft Entra admin center → App registrations → New registration**.
2. Choose the supported account type. Use the `common` tenant when both personal Microsoft accounts and organizational accounts should be accepted.
3. Add this Web redirect URI:

   `https://license.topup.eu.org/v1/auth/microsoft/callback`

4. Create a client secret and store it only as a Cloudflare Worker secret.
5. Request the minimum scopes needed to establish identity: `openid`, `profile`, `email`, and `User.Read` when Microsoft Graph `/me` is used to obtain the canonical email.

Recommended Worker variables/secrets:

- `MICROSOFT_CLIENT_ID`
- `MICROSOFT_CLIENT_SECRET`
- `MICROSOFT_TENANT` (`common` by default)
- `MICROSOFT_REDIRECT_URI`

Never place a Microsoft client secret in GitHub Pages, browser JavaScript, repository variables exposed to builds, screenshots, or documentation.

## Required Worker routes

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/v1/auth/config` | Returns `microsoft_enabled: true` only when the server configuration is complete. |
| `GET` | `/v1/auth/microsoft` | Creates state/PKCE data and redirects to Microsoft authorization. |
| `GET` | `/v1/auth/microsoft/callback` | Validates state, exchanges the code, verifies identity, links the account, creates the session, and redirects to the portal. |
| `POST` | `/v1/auth/logout` | Revokes the local portal session. |

The frontend keeps the Microsoft button hidden unless `/v1/auth/config` explicitly returns `microsoft_enabled: true`. This prevents a broken sign-in option during staged deployment.

## Link by verified email

Microsoft must behave like the existing GitHub login and resolve to the same internal user when the verified email matches an existing Google, GitHub, or GitLab account.

Use this server-side order inside one database transaction:

1. Validate OAuth `state` and PKCE, then exchange the authorization code on the server.
2. Validate token issuer, audience, expiration, and nonce.
3. Read a verified/canonical email. Prefer Microsoft Graph `mail`; use `userPrincipalName` only when it is a valid sign-in email and your policy accepts it.
4. Normalize the email with `trim().toLowerCase()` and store a dedicated normalized value.
5. Look up the provider identity by Microsoft subject/object ID.
6. If no Microsoft identity exists, look up the existing internal user by normalized email.
7. If the email matches a Google/GitHub/GitLab user, attach the Microsoft identity to that same internal `user_id`; do **not** create a second balance, trial, role, or license owner.
8. If no user matches, create one internal user and one Microsoft identity row.
9. Reject conflicts where the Microsoft identity is already attached to a different internal user.
10. Create the portal session for the resolved internal user.

Provider identity and account ownership should be separate concepts. A scalable model is:

- `users`: internal account, canonical email, balance, role, timestamps.
- `auth_identities`: `user_id`, `provider`, provider subject ID, provider email, verified flag, timestamps.

Recommended unique constraints:

- unique normalized canonical email on `users`
- unique (`provider`, `provider_subject`) on `auth_identities`
- unique (`user_id`, `provider`) when only one identity per provider is allowed

Do not link accounts solely from an unverified email claim. If Microsoft does not provide an acceptable verified email, stop the login and show a clear error instead of creating a duplicate account.

## Existing account behavior

When `person@example.com` already signed in through Google or GitHub:

- Microsoft login with the same accepted verified email resolves to the existing internal user.
- Existing trial history, licenses, balance, role, and device records remain attached to that user.
- The current session may report `provider: "microsoft"`, but ownership still uses the same internal `user_id`.
- A second trial must not be created just because a different OAuth provider was used.

## Safe deployment order

1. Back up the D1 database.
2. Add the Microsoft identity columns/table and unique indexes in the private Worker project.
3. Implement and test state, PKCE, token verification, email normalization, conflict handling, and transactional linking.
4. Add Microsoft secrets to the Worker.
5. Deploy the Worker while `microsoft_enabled` is still false.
6. Test callback and same-email linking in staging.
7. Enable Microsoft in `/v1/auth/config`.
8. Deploy this GitHub Pages package.

The private Worker source and its migration are intentionally not included in this public documentation repository.
