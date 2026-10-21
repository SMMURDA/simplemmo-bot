#!/usr/bin/env python3
"""Tulis ulang _data/release.yml dari sebuah tag rilis.

Dipakai oleh .github/workflows/release-data.yml setiap kali rilis baru
diterbitkan, dan bisa dijalankan manual di mesin lokal:

    TAG=v3.0.0 PUBLISHED_AT=2026-10-13T18:26:44Z python3 tools/update-release-data.py

Kenapa lewat berkas data, bukan template: situs ini statis di GitHub Pages dan
tidak punya langkah runtime yang bisa memanggil GitHub API saat build. Nilainya
karena itu harus ada di repositori, dan skrip ini yang menjaganya tetap akurat.
"""

from __future__ import annotations

import datetime as dt
import os
import re
import sys
from pathlib import Path

TARGET = Path("_data/release.yml")
TAG_RE = re.compile(r"[A-Za-z0-9._-]{1,40}\Z")

HEADER = """\
# Versi rilis yang ditampilkan di halaman depan (dipakai lewat Liquid
# site.data.release.* di index.html).
#
# Berkas ini DIBUAT OTOMATIS oleh .github/workflows/release-data.yml setiap kali
# rilis baru diterbitkan. Jangan disunting manual — perubahannya akan tertimpa.
# Untuk mengisi ulang dari rilis lama, jalankan workflow itu secara manual
# dengan input tag.
"""


def read_env(name: str) -> str:
    return (os.environ.get(name) or "").strip()


def main() -> int:
    tag = read_env("TAG")
    if not TAG_RE.match(tag):
        print(f"tag tidak valid: {tag!r}", file=sys.stderr)
        return 2

    published = read_env("PUBLISHED_AT")
    if published:
        try:
            stamp = dt.datetime.fromisoformat(published.replace("Z", "+00:00"))
        except ValueError:
            print(f"published_at bukan ISO-8601: {published!r}", file=sys.stderr)
            return 2
    else:
        stamp = dt.datetime.now(dt.timezone.utc)

    if stamp.tzinfo is None:
        stamp = stamp.replace(tzinfo=dt.timezone.utc)
    stamp = stamp.astimezone(dt.timezone.utc)

    version = tag.lstrip("vV") or tag
    display = f"{stamp.day} {stamp.strftime('%B')} {stamp.year}"

    content = (
        HEADER
        + f'\nversion: "{version}"\n'
        + f'tag: "{tag}"\n'
        + f'released: "{stamp.date().isoformat()}"\n'
        + f'released_display: "{display}"\n'
    )

    TARGET.parent.mkdir(parents=True, exist_ok=True)
    previous = TARGET.read_text(encoding="utf-8") if TARGET.exists() else None
    if previous == content:
        print(f"{TARGET}: tidak berubah ({tag})")
        return 0

    TARGET.write_text(content, encoding="utf-8")
    print(f"{TARGET}: diperbarui -> {tag} ({display})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
