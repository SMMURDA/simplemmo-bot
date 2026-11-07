-- D1 schema for wininstaller

CREATE TABLE IF NOT EXISTS jobs (
  id           TEXT PRIMARY KEY,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL,
  ip           TEXT,
  status       TEXT NOT NULL DEFAULT 'queued',   -- queued | claimed | running | done | error
  os           TEXT NOT NULL,                    -- ws2022 | ws2019
  mode         TEXT NOT NULL,                    -- live | rescue
  host         TEXT NOT NULL,
  port         INTEGER NOT NULL,
  ssh_user     TEXT NOT NULL,
  hostname     TEXT,
  creds_enc    TEXT,                             -- AES-GCM, dihapus saat runner claim
  static_ip    TEXT,
  gateway      TEXT,
  dns1         TEXT,
  dns2         TEXT,
  admin_pass   TEXT,
  runner       TEXT,
  error        TEXT
);

CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status, created_at);
CREATE INDEX IF NOT EXISTS jobs_created_idx ON jobs(created_at);

CREATE TABLE IF NOT EXISTS events (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id  TEXT NOT NULL,
  ts      INTEGER NOT NULL,
  level   TEXT,
  step    TEXT,
  msg     TEXT
);

CREATE INDEX IF NOT EXISTS events_job_idx ON events(job_id, id);

CREATE TABLE IF NOT EXISTS meta (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rate (
  ip      TEXT NOT NULL,
  bucket  INTEGER NOT NULL,
  count   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (ip, bucket)
);
