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
npm run install:all
cp api/.env.exemple api/.env
```

## Rodar

```bash
npm run dev
```

- API: http://localhost:3000
- Frontend: http://localhost:5173

## Conta de teste

| E-mail | Senha |
|--------|-------|
| cliente@avjd.com | cliente123 |

## Funcionalidades do frontend

- Login com JWT
- Listagem de jogos com preço, categoria e busca
