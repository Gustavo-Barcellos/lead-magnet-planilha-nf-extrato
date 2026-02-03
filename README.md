# FiscalVerify — Lead Magnet "Conferidor NF vs Extrato"

Landing page de captura para o lead magnet da FiscalVerify, construída em Next.js + TypeScript.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

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
