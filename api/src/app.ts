import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import validator from 'validator';
import { DOWNLOAD_FILE, TOKEN_EXPIRY_HOURS } from './config';
import { findLeadByToken, insertLead } from './db';
import { sendEmail } from './email';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.post('/api/leads', async (req, res) => {
  const rawName = typeof req.body?.name === 'string' ? req.body.name : '';
  const rawEmail = typeof req.body?.email === 'string' ? req.body.email : '';
  const consent = Boolean(req.body?.consent);

  const name = validator.escape(rawName.trim());
  const email = rawEmail.trim().toLowerCase();

  if (!name) {
    return res.status(400).json({ status: 'error', message: 'Nome é obrigatório.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'E-mail inválido.' });
  }

  if (!consent) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Consentimento é obrigatório.' });
  }

  const downloadToken = crypto.randomUUID();
  const createdAt = new Date();
  const expiry = new Date(createdAt.getTime() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  const lead = insertLead({
    name,
    email,
    consent: consent ? 1 : 0,
    created_at: createdAt.toISOString(),
    download_token: downloadToken,
    download_expiry: expiry.toISOString(),
    email_sent: 0,
    opt_in_confirmed: 0
  });

  await sendEmail(lead, 'lead-magnet-delivery', DOWNLOAD_FILE);

  return res.status(200).json({
    status: 'ok',
    message: 'Cadastro confirmado! Em instantes você receberá a planilha no seu e-mail.'
  });
});

app.get('/api/download/:token', (req, res) => {
  const token = req.params.token;
  const lead = findLeadByToken(token);

  if (!lead) {
    return res.status(403).json({ status: 'error', message: 'Token inválido.' });
  }

  const expiry = new Date(lead.download_expiry);
  if (Number.isNaN(expiry.getTime()) || expiry.getTime() < Date.now()) {
    return res.status(403).json({ status: 'error', message: 'Token expirado.' });
  }

  return res.status(200).json({ status: 'ok', downloadUrl: DOWNLOAD_FILE });
});

export default app;
