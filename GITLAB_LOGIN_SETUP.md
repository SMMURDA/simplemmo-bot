---
title: GitLab Login Setup
permalink: /gitlab-login-setup/
---

# Tutorial Lengkap Login GitLab — Try Trial

Panduan ini digunakan bersama backend private dan paket GitHub Pages yang sudah memiliki tombol GitLab.

GitLab login memakai authorization code flow, state HMAC, PKCE S256, cookie OAuth 10 menit, token exchange server-side, dan scope minimum `read_user`. Jika email GitLab sama dengan email Google/GitHub/Microsoft yang sudah tersimpan, `gitlab_subject` ditambahkan ke internal user yang sama sehingga trial, saldo, role, lisensi, dan perangkat tidak diduplikasi.

## 0. Backup database

```bash
cd license-server
npx wrangler d1 export simplemmo-licenses --remote --output=backup-before-gitlab.sql
```

Jika memakai environment production, gunakan flag environment yang sama pada semua perintah Wrangler.

## 1. Buat GitLab OAuth application

1. Buka `https://gitlab.com/` dan login.
2. Klik avatar → **Edit profile**.
3. Buka **Access → Applications**.
4. Klik **Add new application**.
5. Isi Name: `SimpleMMO Bot Trial`.
6. Isi Redirect URI persis:

   `https://license.topup.eu.org/v1/auth/gitlab/callback`

7. Biarkan aplikasi sebagai **Confidential** karena token ditukar oleh Cloudflare Worker menggunakan client secret.
8. Jangan aktifkan Trusted kecuali memang dikelola sebagai instance-wide trusted application.
9. Pilih hanya scope:

   `read_user`

10. Simpan aplikasi.
11. Salin **Application ID** dan **Secret**. Secret hanya disimpan sebagai Cloudflare Worker secret dan tidak boleh masuk GitHub Pages.

## 2. Pasang backend

Extract paket backend GitLab-ready, lalu:

```bash
cd license-server
npm install
```

Pertahankan `wrangler.toml` produksi. Binding D1 harus tetap memakai database produksi:

```toml
[[d1_databases]]
binding = "DB"
database_name = "simplemmo-licenses"
database_id = "DATABASE_ID_PRODUKSI_MILIKMU"
```

## 3. Jalankan migration D1

Migration baru:

`migrations/0006_gitlab_oauth.sql`

Jalankan:

```bash
npx wrangler d1 migrations apply simplemmo-licenses --remote
```

Verifikasi:

```bash
npx wrangler d1 execute simplemmo-licenses --remote --command "PRAGMA table_info(users);"
npx wrangler d1 execute simplemmo-licenses --remote --command "PRAGMA index_list(users);"
```

Harus ada kolom `gitlab_subject` dan index `idx_users_gitlab_subject`.

Jangan menjalankan seluruh `schema.sql` pada database produksi lama. Gunakan migration `0006`.

## 4. Simpan Worker secrets

```bash
npx wrangler secret put GITLAB_CLIENT_ID
npx wrangler secret put GITLAB_CLIENT_SECRET
```

Nilai:

- `GITLAB_CLIENT_ID`: GitLab **Application ID**.
- `GITLAB_CLIENT_SECRET`: GitLab application **Secret**.

Jika menggunakan environment production:

```bash
npx wrangler secret put GITLAB_CLIENT_ID --env production
npx wrangler secret put GITLAB_CLIENT_SECRET --env production
```

Secret provider lain tidak perlu diubah.

## 5. Deploy Worker

```bash
npx wrangler deploy
```

Atau:

```bash
npx wrangler deploy --env production
```

Tes:

```bash
curl -H "Origin: https://topup.eu.org" https://license.topup.eu.org/v1/auth/config
```

Harus memuat:

```json
{
  "github_enabled": true,
  "microsoft_enabled": true,
  "gitlab_enabled": true
}
```

Jika `gitlab_enabled` false, periksa kedua secret GitLab dan pastikan secret dipasang di environment Worker yang sama.

## 6. Deploy GitHub Pages

Deploy isi paket frontend GitLab-ready ke repository yang menjalankan `https://topup.eu.org`, lalu tunggu GitHub Pages selesai.

Halaman `/trial/` menampilkan provider yang aktif saja. Pada desktop tampil satu baris horizontal; pada mobile tampil grid 2×2 agar tidak overflow. Setiap tombol hanya berisi logo dan nama provider.

## 7. Uji login

1. Buka `/trial/` dengan incognito.
2. Klik **GitLab**.
3. Setujui scope `read_user`.
4. Callback harus kembali ke:

   `https://license.topup.eu.org/v1/auth/gitlab/callback`

5. Setelah berhasil, Worker mengarahkan ke:

   `https://topup.eu.org/accounts/overview/?login=gitlab`

6. Logout dan login ulang untuk memastikan internal account yang sama digunakan.

## 8. Verifikasi account linking

```bash
npx wrangler d1 execute simplemmo-licenses --remote --command "SELECT id,email,google_subject,github_subject,microsoft_subject,gitlab_subject,trial_license_id,role,balance_idr FROM users WHERE email='EMAIL_KAMU';"
```

Jika normalized email GitLab sama, hasil yang benar adalah satu row dengan internal `id`, trial, balance, role, dan lisensi lama; `gitlab_subject` sekarang terisi.

Jika GitLab mengembalikan email berbeda, Worker membuat akun terpisah demi keamanan. Backend juga kompatibel dengan schema produksi lama yang masih mengharuskan `google_subject NOT NULL`.

## Security

- State ditandatangani HMAC dan berlaku 10 menit.
- Cookie OAuth memakai `Secure`, `HttpOnly`, dan `SameSite=Lax`.
- PKCE menggunakan S256.
- Client secret dan token hanya diproses Worker.
- Scope hanya `read_user`; tidak meminta akses repository penuh.
- `gitlab_subject` memiliki unique index.
- Linking dilakukan berdasarkan provider subject lalu normalized email.
- Konflik subject/email ditolak.

## Troubleshooting

### Tombol GitLab tidak muncul

Periksa `/v1/auth/config`, secret, environment Wrangler, deploy terbaru, dan cache GitHub Pages.

### Redirect URI mismatch

GitLab Redirect URI harus persis:

`https://license.topup.eu.org/v1/auth/gitlab/callback`

### `invalid_client`

Periksa Application ID dan Secret. Jika secret di-renew, secret lama langsung tidak berlaku; pasang secret baru lalu deploy ulang.

### `invalid_grant`

Mulai ulang dari tombol GitLab dalam incognito. Jangan refresh callback karena authorization code hanya dapat dipakai sekali.

### Profil/email tidak tersedia

Pastikan aplikasi memiliki scope `read_user` dan akun GitLab mempunyai email utama yang valid.

### `no such column: gitlab_subject`

```bash
npx wrangler d1 migrations apply simplemmo-licenses --remote
```

### Monitoring

```bash
npx wrangler tail --format pretty
```

Worker mencatat stage linking dan error provider secara aman tanpa mencatat access token atau client secret.

## Mematikan GitLab sementara

```bash
npx wrangler secret delete GITLAB_CLIENT_SECRET
npx wrangler deploy
```

`gitlab_enabled` menjadi false dan tombol GitLab otomatis disembunyikan. Kolom D1 boleh tetap ada.
