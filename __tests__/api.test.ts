/** @jest-environment node */

import request from 'supertest';

let app: typeof import('../api/src/app').default;
let sendEmail: jest.Mock;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = ':memory:';

  jest.resetModules();
  jest.doMock('../api/src/email', () => ({
    sendEmail: jest.fn().mockResolvedValue(undefined)
  }));

  const appModule = await import('../api/src/app');
  app = appModule.default;

  const emailModule = await import('../api/src/email');
  sendEmail = emailModule.sendEmail as jest.Mock;
});

beforeEach(async () => {
  const dbModule = await import('../api/src/db');
  dbModule.clearLeads();
  sendEmail.mockClear();
});

describe('Lead API', () => {
  it('accepts valid lead payloads', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({ name: 'Maria Silva', email: 'maria@empresa.com', consent: true });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(sendEmail).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid emails', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({ name: 'Maria Silva', email: 'email-invalido', consent: true });

    expect(response.status).toBe(400);
  });

  it('rejects missing consent', async () => {
    const response = await request(app)
      .post('/api/leads')
      .send({ name: 'Maria Silva', email: 'maria@empresa.com', consent: false });

    expect(response.status).toBe(400);
  });

  it('returns download link for valid tokens', async () => {
    const dbModule = await import('../api/src/db');
    dbModule.insertLead({
      name: 'Maria Silva',
      email: 'maria@empresa.com',
      consent: 1,
      created_at: new Date().toISOString(),
      download_token: 'valid-token',
      download_expiry: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      email_sent: 0,
      opt_in_confirmed: 0
    });

    const response = await request(app).get('/api/download/valid-token');

    expect(response.status).toBe(200);
    expect(response.body.downloadUrl).toBeDefined();
  });

  it('rejects invalid tokens', async () => {
    const response = await request(app).get('/api/download/invalid-token');

    expect(response.status).toBe(403);
  });
});
