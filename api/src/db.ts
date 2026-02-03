import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { DATABASE_URL } from './config';

export type LeadRecord = {
  id: number;
  name: string;
  email: string;
  consent: boolean;
  created_at: string;
  download_token: string;
  download_expiry: string;
  email_sent: boolean;
  opt_in_confirmed: boolean;
};

type LeadInsert = Omit<LeadRecord, 'id'>;

type LeadStore = {
  insertLead: (lead: LeadInsert) => Promise<LeadRecord>;
  findLeadByToken: (token: string) => Promise<LeadRecord | undefined>;
  clearLeads: () => Promise<void>;
};

const isMemory = DATABASE_URL === 'memory' || DATABASE_URL === '';

const migrationsPath = path.join(process.cwd(), 'api', 'migrations', '001_create_leads.sql');

function createMemoryStore(): LeadStore {
  let nextId = 1;
  const leads = new Map<string, LeadRecord>();

  return {
    async insertLead(lead) {
      const record: LeadRecord = { id: nextId, ...lead };
      nextId += 1;
      leads.set(record.download_token, record);
      return record;
    },
    async findLeadByToken(token) {
      return leads.get(token);
    },
    async clearLeads() {
      leads.clear();
      nextId = 1;
    }
  };
}

function createPostgresStore(): LeadStore {
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required for Postgres mode.');
  }

  if (!DATABASE_URL.startsWith('postgres://') && !DATABASE_URL.startsWith('postgresql://')) {
    throw new Error(
      'DATABASE_URL must be a Postgres connection string (e.g. postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require).'
    );
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined
  });

  const migrationSql = fs.readFileSync(migrationsPath, 'utf8');

  const ensureMigrated = async () => {
    await pool.query(migrationSql);
  };

  const migrationPromise = ensureMigrated();

  return {
    async insertLead(lead) {
      await migrationPromise;
      const result = await pool.query<LeadRecord>(
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
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id,
            name,
            email,
            consent,
            created_at,
            download_token,
            download_expiry,
            email_sent,
            opt_in_confirmed
        `,
        [
          lead.name,
          lead.email,
          lead.consent,
          lead.created_at,
          lead.download_token,
          lead.download_expiry,
          lead.email_sent,
          lead.opt_in_confirmed
        ]
      );
      return result.rows[0];
    },
    async findLeadByToken(token) {
      await migrationPromise;
      const result = await pool.query<LeadRecord>(
        `
          SELECT id,
            name,
            email,
            consent,
            created_at,
            download_token,
            download_expiry,
            email_sent,
            opt_in_confirmed
          FROM leads
          WHERE download_token = $1
        `,
        [token]
      );
      return result.rows[0];
    },
    async clearLeads() {
      await migrationPromise;
      await pool.query('DELETE FROM leads');
    }
  };
}

const store: LeadStore = isMemory ? createMemoryStore() : createPostgresStore();

export const insertLead = store.insertLead;
export const findLeadByToken = store.findLeadByToken;
export const clearLeads = store.clearLeads;
