---
title: Telegram Login Setup
permalink: /telegram-login-setup/
---

# Tutorial Lengkap Login Telegram OIDC

Implementasi memakai OIDC resmi Telegram Authorization Code Flow, PKCE S256, nonce, state HMAC, Basic client authentication, dan verifikasi ID token RS256 melalui JWKS Telegram. Scope hanya `openid profile`; nomor telepon dan izin mengirim pesan tidak diminta.

## 0. Backup D1

```bash
cd license-server
npx wrangler d1 export simplemmo-licenses --remote --output=backup-before-telegram.sql
```

Tambahkan `--env production` pada semua perintah bila Worker menggunakan environment tersebut.

## 1. Siapkan bot dan Web Login

1. Buka `@BotFather` di Telegram.
2. Buat bot dengan `/newbot` atau pilih bot yang sudah ada.
3. Pasang nama dan foto yang sesuai dengan SimpleMMO Bot.
4. Buka mini app BotFather → **Bot Settings → Web Login**.
5. Tambahkan Allowed URL origin:

   `https://topup.eu.org`

6. Tambahkan redirect URI persis:

   `https://license.topup.eu.org/v1/auth/telegram/callback`

7. Salin **Client ID** dan **Client Secret** yang ditampilkan pada Web Login. Ini bukan bot token.
8. Di Advanced, pertahankan signing algorithm **RS256**.

## 2. Migration D1

Paket menyediakan `migrations/0007_telegram_oidc.sql`.

```bash
npx wrangler d1 migrations apply simplemmo-licenses --remote
```

Verifikasi:

```bash
npx wrangler d1 execute simplemmo-licenses --remote --command "PRAGMA table_info(users);"
npx wrangler d1 execute simplemmo-licenses --remote --command "PRAGMA index_list(users);"
```

Harus ada `telegram_subject` dan `idx_users_telegram_subject`. Jangan jalankan seluruh `schema.sql` pada database produksi lama.

## 3. Worker secrets

```bash
npx wrangler secret put TELEGRAM_CLIENT_ID
npx wrangler secret put TELEGRAM_CLIENT_SECRET
```

Masukkan Client ID dan Client Secret dari **BotFather Web Login**, bukan token Bot API. Untuk production:

```bash
npx wrangler secret put TELEGRAM_CLIENT_ID --env production
npx wrangler secret put TELEGRAM_CLIENT_SECRET --env production
```

## 4. Deploy dan verifikasi

```bash
npx wrangler deploy
curl -H "Origin: https://topup.eu.org" https://license.topup.eu.org/v1/auth/config
```

Harus memuat `"telegram_enabled": true`.

## 5. Deploy frontend

Deploy paket GitHub Pages Telegram-ready. Tombol Telegram hanya tampil ketika config backend aktif. Desktop menampilkan lima provider satu baris; mobile memakai susunan 3+2 atau dua kolom pada layar lebih kecil.

## 6. Uji

1. Buka `/trial/` lewat incognito.
2. Klik **Telegram**.
3. Setujui profil dasar.
4. Callback kembali ke `/v1/auth/telegram/callback`.
5. Setelah berhasil, browser diarahkan ke `/accounts/overview/?login=telegram`.
6. Logout dan login ulang untuk memastikan internal user yang sama berdasarkan `telegram_subject`.

## Perbedaan Telegram dan provider email

Telegram OIDC saat ini tidak memberikan email. Karena itu backend tidak menggabungkan akun Telegram dengan Google/GitHub/Microsoft/GitLab berdasarkan nama atau username. Akun Telegram baru memakai email internal reserved `.invalid`, sedangkan portal menampilkan `Telegram ID`. Ini mencegah account takeover. Schema D1 lama dengan `google_subject NOT NULL` tetap didukung melalui placeholder internal unik.

## Security

- State HMAC, cookie Secure/HttpOnly/SameSite=Lax, TTL 10 menit.
- PKCE S256 dan nonce.
- Token exchange memakai Basic Client authentication.
- ID token diverifikasi terhadap JWKS Telegram.
- Wajib RS256, issuer `https://oauth.telegram.org`, audience Client ID, expiry, issued-at, nonce, dan signature valid.
- Scope hanya `openid profile`.
- Secret/token tidak dikirim ke browser atau dicatat ke log.

## Troubleshooting

- Tombol tidak muncul: cek `/v1/auth/config`, secrets, environment, deploy, dan cache.
- `invalid_client`: Client ID/Secret Web Login salah atau berada di environment berbeda.
- Redirect ditolak: Allowed URLs harus berisi origin dan callback persis.
- `invalid_grant`: mulai ulang dari tombol; jangan refresh callback.
- Algorithm ditolak: set Web Login Advanced ke RS256.
- `no such column: telegram_subject`: jalankan migration `0007` remote.
- Log: `npx wrangler tail --format pretty`.

## Menonaktifkan sementara

```bash
npx wrangler secret delete TELEGRAM_CLIENT_SECRET
npx wrangler deploy
```

Tombol otomatis disembunyikan; kolom D1 boleh tetap ada.
