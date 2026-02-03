# FiscalVerify — Lead Magnet "Conferidor NF vs Extrato"

Landing page de captura para o lead magnet da FiscalVerify, construída em Next.js + TypeScript.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Backend/API (Etapa 6)

Escolha de banco: **SQLite local** para o MVP, pois simplifica a execução local e evita dependências externas. Em produção, basta trocar `DATABASE_URL` para um serviço Postgres/Supabase quando necessário.

### Como rodar

```bash
npm run dev:api
```

Para subir frontend + backend ao mesmo tempo:

```bash
npm run dev:all
```

> Em desenvolvimento, o Next.js faz proxy das rotas `/api/*` para `http://localhost:4000` (configurado em `next.config.js`).

### Variáveis de ambiente

Crie um arquivo `.env` (opcional) com:

```bash
PORT=4000
DATABASE_URL=data/leads.db
DOWNLOAD_FILE=/conferidor-nf-vs-extrato.xlsx
TOKEN_EXPIRY_HOURS=24
```

### Banco de dados e persistência

- O SQLite fica salvo em `data/leads.db` (criado automaticamente na primeira execução).
- Os registros persistem entre reinícios enquanto o arquivo `data/leads.db` existir.
- Para inspecionar os leads localmente: `sqlite3 data/leads.db "SELECT * FROM leads;"`.

### Endpoints

- `POST /api/leads`
- `GET /api/download/:token`

## Formulário

O formulário envia um `POST` para `/api/leads` com o payload:

```json
{
  "name": "Nome",
  "email": "email@empresa.com",
  "consent": true
}
```

> A rota `/api/leads` será implementada na etapa 6.

## Testes

```bash
npm test
npm run lint
```

## CI

O GitHub Actions executa `npm test` e `npm run lint` em cada pull request.
