const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'dev-only-secret-change-me';
  console.warn('JWT_SECRET nao definido. Usando segredo local de desenvolvimento.');
}

if (!process.env.DB_NAME) {
  process.env.DB_NAME = process.env.VERCEL ? path.join('/tmp', 'vendas_api.db') : 'vendas_api.db';
}

const v1Routes = require('./routes/v1');
const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API esta funcionando corretamente.' });
});

app.use('/api/v1', v1Routes);

if (require.main === module) {
  app.listen(APP_PORT, '0.0.0.0', () => {
    console.log(`API de vendas de jogos em execucao na porta ${APP_PORT}.`);
    console.log(`Acesse a url http://localhost:${APP_PORT}`);
  });
}

module.exports = app;
