CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  consent INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  download_token TEXT NOT NULL UNIQUE,
  download_expiry TEXT NOT NULL,
  email_sent INTEGER NOT NULL DEFAULT 0,
  opt_in_confirmed INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS leads_download_token_idx ON leads (download_token);
