import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { DATABASE_URL } from './config';

export type LeadRecord = {
  id: number;
  name: string;
  email: string;
  consent: number;
  created_at: string;
  download_token: string;
  download_expiry: string;
  email_sent: number;
  opt_in_confirmed: number;
};

const isFileDatabase = DATABASE_URL !== ':memory:' && !DATABASE_URL.startsWith('file:');
if (isFileDatabase) {
  const dir = path.dirname(DATABASE_URL);
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DATABASE_URL);

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    executed_at TEXT NOT NULL
  );
`);

const migrationsDir = path.join(process.cwd(), 'api', 'migrations');
if (fs.existsSync(migrationsDir)) {
  const migrations = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql'));
  const applied = new Set(
    db.prepare('SELECT name FROM migrations').all().map((row: { name: string }) => row.name)
  );

  for (const file of migrations) {
    if (applied.has(file)) {
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    db.exec(sql);
    db.prepare('INSERT INTO migrations (name, executed_at) VALUES (?, ?)').run(
      file,
      new Date().toISOString()
    );
  }
}

export function insertLead(lead: Omit<LeadRecord, 'id'>): LeadRecord {
  const stmt = db.prepare(
    `
      INSERT INTO leads (
        name,
        email,
        consent,
        created_at,
        download_token,
        download_expiry,
        email_sent,
        opt_in_confirmed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
  );
  const info = stmt.run(
    lead.name,
    lead.email,
    lead.consent,
    lead.created_at,
    lead.download_token,
    lead.download_expiry,
    lead.email_sent,
    lead.opt_in_confirmed
  );
  return { id: Number(info.lastInsertRowid), ...lead };
}

export function findLeadByToken(token: string): LeadRecord | undefined {
  return db.prepare('SELECT * FROM leads WHERE download_token = ?').get(token) as
    | LeadRecord
    | undefined;
}

export function clearLeads(): void {
  db.prepare('DELETE FROM leads').run();
}
