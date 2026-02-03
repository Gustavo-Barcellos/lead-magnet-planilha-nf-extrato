import path from 'path';

const isTest = process.env.NODE_ENV === 'test';

export const PORT = Number(process.env.PORT || 4000);
export const DATABASE_URL = process.env.DATABASE_URL ||
  (isTest ? ':memory:' : path.join(process.cwd(), 'data', 'leads.db'));
export const DOWNLOAD_FILE = process.env.DOWNLOAD_FILE || '/conferidor-nf-vs-extrato.xlsx';
export const TOKEN_EXPIRY_HOURS = Number(process.env.TOKEN_EXPIRY_HOURS || 24);
