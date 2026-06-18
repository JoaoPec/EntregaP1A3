const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const envPath = path.resolve(__dirname, '.env');
if (!fs.existsSync(envPath) && !process.env.RAILWAY_ENVIRONMENT) {
  console.error('ERRO: O arquivo .env nao foi encontrado!');
  console.error('Por favor, crie um arquivo .env na raiz do projeto e adicione as variaveis de ambiente necessarias.');

  process.exit(1);
}

const v1Routes = require('./routes/v1');
const app = express();
const APP_PORT = process.env.PORT || process.env.APP_PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/check', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API esta funcionando corretamente.' });
});

app.use('/api/v1', v1Routes);

const frontendPath = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(APP_PORT, '0.0.0.0', () => {
  console.log(`API de vendas de jogos em execucao na porta ${APP_PORT}.`);
  console.log(`Acesse a url http://localhost:${APP_PORT}`);
});
