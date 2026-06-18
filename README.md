# Cognify

Frontend React simples + API original de loja de jogos digitais.

API base: [api-vendas-jogos-digitais](https://github.com/shandragon/api-vendas-jogos-digitais)

## Estrutura

```
api/    # API REST original (Node.js + SQLite)
src/    # Frontend React — login + listagem de jogos
```

## Instalar

```bash
npm install
```

## Rodar

```bash
npm run dev
```

- API: http://localhost:3000
- Frontend: http://localhost:5173

O frontend usa `/api/v1` por padrao e o Vite redireciona essas chamadas para a API local.

## Variaveis de ambiente

Localmente, o projeto funciona sem `.env`, usando valores de desenvolvimento. Para producao, configure:

```bash
JWT_SECRET=troque-por-um-segredo-forte
DB_NAME=vendas_api.db
```

Na Vercel, defina pelo menos `JWT_SECRET`. O SQLite usa `/tmp/vendas_api.db` automaticamente no ambiente serverless.

## Deploy na Vercel

Use as configuracoes padrao:

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

As rotas `/api/*` sao enviadas para `api/index.js` via `vercel.json`, entao frontend e API ficam no mesmo projeto.

## Conta de teste

| E-mail | Senha |
|--------|-------|
| cliente@avjd.com | cliente123 |

## Funcionalidades do frontend

- Login com JWT
- Listagem de jogos com preço, categoria e busca
