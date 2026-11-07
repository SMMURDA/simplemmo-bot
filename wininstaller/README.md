# wininstaller · wininstaller.topup.eu.org

Panel publik (gratis, tanpa login) untuk mengubah VPS Linux **KVM** menjadi
**Windows Server** lewat SSH — tanpa ISO, tanpa panel provider.

Live: <https://wininstaller.topup.eu.org>

```
browser  →  Cloudflare Worker (UI + API + D1)  →  runner (VPS, Python/asyncssh)  →  VPS tujuan
```

Kredensial SSH dienkripsi (AES-GCM) di D1, didekripsi sekali saat runner
mengambil job, lalu kolomnya dikosongkan. Job kedaluwarsa 7 hari.

## Isi repo

| Path | Isi |
|---|---|
| `web/` | UI statis (satu file `index.html` + aset), di-serve Worker lewat `env.ASSETS` |
| `worker/` | Worker: API job, SSE-less polling, rate limit, enkripsi kredensial |
| `worker/schema.sql` | Skema D1 (`jobs`, `events`, `meta`, `rate`) |
| `runner/` | Runner Python: ambil job, preflight, jalankan reinstall, lapor progres |
| `runner/tests/` | Uji logika runner tanpa VPS (`python -m unittest discover -s tests`) |

## Deploy Worker

```bash
cd worker
wrangler d1 create wininstaller            # salin database_id ke wrangler.toml
wrangler d1 execute wininstaller --remote --file=schema.sql
openssl rand -hex 32 | wrangler secret put JOBS_KEY        # kunci enkripsi kredensial
openssl rand -hex 32 | wrangler secret put RUNNER_TOKEN    # token runner
wrangler deploy
```

`wrangler.toml` sudah memuat custom domain `wininstaller.topup.eu.org`
(`custom_domain = true`), jadi DNS dan sertifikat dibuat otomatis oleh Cloudflare.

Endpoint:

- `POST /api/jobs` — buat job (rate limit 6/jam/IP, host privat ditolak)
- `GET /api/jobs/:id` — status + 120 event terakhir
- `GET /api/health` — status runner + panjang antrean
- `GET /api/runner/next` — (Bearer `RUNNER_TOKEN`) ambil job berikutnya
- `POST /api/runner/jobs/:id/events` — (Bearer) kirim log + status

## Menjalankan runner

Runner harus hidup di mesin yang bisa SSH keluar (VPS kecil, 1 GB cukup —
runner tidak menjalankan Windows, hanya memerintah server lain).

```bash
cd runner
python3 -m venv .venv && ./.venv/bin/pip install -r requirements.txt
cp runner.env.example runner.env && chmod 600 runner.env   # isi WI_TOKEN
./.venv/bin/python runner.py                 # daemon
./.venv/bin/python runner.py --once --dry-run  # uji tanpa menyentuh server
```

Variabel: `WI_API`, `WI_TOKEN`, `WI_NAME`, `WI_POLL`, `WI_RDP_WAIT`,
`WI_HOLD=1` (pakai `--hold 1`, berhenti di lingkungan installer).

Systemd:

```bash
sudo cp wininstaller-runner.service /etc/systemd/system/
sudo systemctl enable --now wininstaller-runner
journalctl -u wininstaller-runner -f
```

## Apa yang dijalankan runner

1. **Preflight** (read-only): `systemd-detect-virt`, RAM, sisa disk, BIOS/UEFI,
   ada/tidak `grub` dan `kexec`. Menolak OpenVZ/LXC/Docker, RAM < ~2 GB,
   disk < 22 GB. Tanpa langkah ini, kegagalan paling mahal terjadi di tengah.
2. Unduh `reinstall.sh` resmi dari [bin456789/reinstall](https://github.com/bin456789/reinstall)
   (ISO asli Microsoft, driver virtio otomatis, deteksi disk lewat ID tabel partisi).
3. Jalankan:
   `reinstall.sh windows --image-name "Windows Server 2022 ServerStandard" --lang en-us --username Administrator --password *** --rdp-port 3389 --allow-ping`
4. Server reboot ke Windows Installer. Runner menunggu port **3389** terbuka
   (default 45 menit), lalu menandai job `done` dan menampilkan kredensial.

## Batasan yang perlu diketahui

- Hanya **KVM / bare metal**. OpenVZ/LXC mustahil (tidak punya kernel sendiri).
- Provider tanpa rescue boot dan tanpa ISO mount (mis. Spaceship) tetap bisa,
  tapi jalurnya `live` dan risiko gagal boot lebih tinggi.
- Password Administrator tampil di daftar proses server tujuan selama instalasi
  berjalan — tidak bisa dihindari karena script menerimanya lewat argumen.
- Lisensi Windows bukan bagian dari layanan ini. Image yang dipakai adalah ISO
  resmi tanpa aktivasi; user bertanggung jawab atas lisensinya.
- Runner melakukan koneksi SSH keluar dengan kredensial yang diberikan user.
  Host privat/loopback ditolak di sisi Worker; rate limit 6 job/jam/IP.
  Kalau mau dibuka benar-benar publik, pasang Cloudflare Turnstile di form.
