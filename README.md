# FiscalVerify — Lead Magnet "Conferidor NF vs Extrato"

Landing page de captura para o lead magnet da FiscalVerify, construída em Next.js + TypeScript.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

## Backend/API (Etapa 6)

Escolha de banco: **Supabase (Postgres)**, para simplificar a operação em produção e centralizar a gestão de dados.

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
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require
DOWNLOAD_FILE=/conferidor-nf-vs-extrato.xlsx
TOKEN_EXPIRY_HOURS=24
```

### Banco de dados e persistência

- Os registros ficam na tabela `public.leads` do seu projeto Supabase.
- Para inspecionar os leads: acesse **Table Editor → leads** no painel do Supabase, ou rode `SELECT * FROM public.leads;` no SQL Editor.
- O backend executa o SQL de migração automaticamente na inicialização (se tiver permissões suficientes).

### Guia passo a passo (Supabase)

1. Crie um projeto no Supabase.
2. Vá em **Settings → Database** e copie a **Connection string** (Postgres).
3. Ajuste a string para incluir `sslmode=require` (obrigatório em produção).
4. No `.env`, defina `DATABASE_URL` com a connection string completa.
5. Inicie o backend com `npm run dev:api`; a tabela `public.leads` será criada automaticamente.
6. Opcional (produção): crie uma role limitada para o backend e substitua o usuário da connection string para reduzir privilégios.
7. Habilite backups automáticos no Supabase para retenção dos dados.

### Segurança em produção

- **Não exponha** `DATABASE_URL` no frontend; ela deve existir apenas no backend (servidor).
- Use TLS (`sslmode=require`) para o acesso ao banco.
- Prefira uma role de banco com permissões mínimas (apenas `INSERT`/`SELECT` na tabela `leads`).
- Monitore logs e falhas de conexão no painel do Supabase.

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
