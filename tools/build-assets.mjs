#!/usr/bin/env node
/*
 * Membangun berkas assets/js/*.min.js dari sumbernya, atau memeriksa apakah
 * berkas yang sudah di-commit masih sinkron dengan sumbernya.
 *
 * Kenapa skrip dan bukan template Jekyll: sama seperti build-docs-index.mjs,
 * hasilnya di-commit dan ditinjau sebelum masuk repo, sehingga tidak ada
 * langkah tambahan yang bisa menggagalkan build GitHub Pages.
 *
 * Bedanya dengan build-docs-index.mjs: berkas .min.js ini LANGSUNG dilayani ke
 * pengunjung. Kalau ia basi terhadap sumbernya, situs menjalankan kode lama
 * tanpa ada yang sadar — persis yang pernah terjadi pada trial.min.js dan
 * verify.min.js. Karena itu workflow Pages juga memanggil mode --check, supaya
 * bundel basi tidak pernah sampai ke produksi. Mode --check tidak menulis apa
 * pun, jadi tidak bisa merusak apa-apa.
 *
 * Pakai:
 *   npm run build:js     # tulis ulang assets/js/*.min.js
 *   npm run check:js     # keluar dengan kode 1 kalau ada bundel yang basi
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Hanya berkas yang benar-benar dirujuk halaman, lihat _layouts/default.html.
// Bundel admin-v2, portal-v2, trial, dan verify dihapus pada 2026-10-13 karena
// tidak dimuat halaman mana pun (versi non-min-nya yang dipakai).
const TARGETS = ["site", "docs", "portal-common"];

const check = process.argv.includes("--check");
const bin = join(process.cwd(), "node_modules", ".bin", process.platform === "win32" ? "terser.cmd" : "terser");
if (!existsSync(bin)) {
  console.error("terser belum terpasang. Jalankan: npm ci");
  process.exit(1);
}

let basi = 0;
for (const nama of TARGETS) {
  const sumber = join("assets", "js", `${nama}.js`);
  const keluaran = join("assets", "js", `${nama}.min.js`);
  const sementara = join(mkdtempSync(join(tmpdir(), "min-")), `${nama}.min.js`);

  // Opsi -c -m plus terser.json: perintah inilah yang menghasilkan bundel yang
  // sudah ada, terverifikasi identik byte-per-byte untuk site/docs/portal-common.
  execFileSync(bin, [sumber, "-c", "-m", "--config-file", "terser.json", "-o", sementara], { stdio: "inherit" });

  if (check) {
    const cocok = existsSync(keluaran) && readFileSync(sementara).equals(readFileSync(keluaran));
    if (cocok) {
      console.log(`OK: ${keluaran} sinkron dengan ${sumber}`);
    } else {
      console.error(`BASI: ${keluaran} berbeda dari hasil minifikasi ${sumber}`);
      basi += 1;
    }
  } else {
    writeFileSync(keluaran, readFileSync(sementara));
    console.log(`dibangun: ${keluaran}`);
  }
}

if (basi > 0) {
  console.error(`\n${basi} bundel basi. Jalankan: npm run build:js — lalu commit hasilnya.`);
  process.exit(1);
}
