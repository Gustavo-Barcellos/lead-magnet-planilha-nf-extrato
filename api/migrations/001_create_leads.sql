CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  consent BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  download_token TEXT NOT NULL UNIQUE,
  download_expiry TIMESTAMPTZ NOT NULL,
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  opt_in_confirmed BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS leads_download_token_idx ON leads (download_token);
