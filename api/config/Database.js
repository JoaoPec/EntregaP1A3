const sqlite = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

require('dotenv').config();

class Database {
    constructor() {
        if (!Database.instance) {
            this._connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    _connect() {
        this.db = new sqlite.Database(process.env.DB_NAME || 'vendas.db', (err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados:', err.message);
            } else {
                console.log('Conexao com o banco de dados estabelecida com sucesso.');
                this._createTable();
                this._seed();
            }
        });
    }

    _createTable() {
        this.db.serialize(() => {
            this.db.get('PRAGMA foreign_keys = ON');

            this.db.run(`CREATE TABLE IF NOT EXISTS perfis (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL UNIQUE
            )`);

            this.db.run(`CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome varchar(255) NOT NULL,
                email varchar(255) NOT NULL UNIQUE,
                senha varchar(255) NOT NULL,
                data_nascimento datetime,
                fk_perfil INTEGER NOT NULL,
                FOREIGN KEY(fk_perfil) REFERENCES perfis(id))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome varchar(255) NOT NULL UNIQUE)`);

            this.db.run(`CREATE TABLE IF NOT EXISTS empresas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome varchar(255) NOT NULL UNIQUE)`);

            this.db.run(`CREATE TABLE IF NOT EXISTS jogos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome varchar(255) NOT NULL,
                ano integer NOT NULL,
                preco real NOT NULL,
                desconto real,
                descricao TEXT,
                fk_empresa integer NOT NULL,
                fk_categoria integer NOT NULL,
                FOREIGN KEY(fk_empresa) REFERENCES empresas(id),
                FOREIGN KEY(fk_categoria) REFERENCES categorias(id),
                UNIQUE(nome, fk_empresa))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS vendas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fk_usuario INTEGER NOT NULL,
                valor_total real NOT NULL,
                quantidade integer NOT NULL,
                data datetime DEFAULT(datetime('now')),
                FOREIGN KEY(fk_usuario) REFERENCES usuarios(id))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS carrinhos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fk_usuario INTEGER NOT NULL,
                fk_venda INTEGER,
                status TEXT NOT NULL DEFAULT 'A',
                FOREIGN KEY(fk_usuario) REFERENCES usuarios(id),
                FOREIGN KEY(fk_venda) REFERENCES vendas(id))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS itens_carrinho (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fk_jogo INTEGER NOT NULL,
                fk_carrinho INTEGER NOT NULL,
                chave_ativacao TEXT,
                FOREIGN KEY(fk_jogo) REFERENCES jogos(id),
                FOREIGN KEY(fk_carrinho) REFERENCES carrinhos(id))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS avaliacoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fk_usuario INTEGER NOT NULL,
                fk_jogo INTEGER NOT NULL,
                nota INTEGER NOT NULL CHECK(nota >= 1 AND nota <= 5),
                comentario TEXT,
                data datetime DEFAULT(datetime('now')),
                FOREIGN KEY(fk_usuario) REFERENCES usuarios(id),
                FOREIGN KEY(fk_jogo) REFERENCES jogos(id),
                UNIQUE(fk_usuario, fk_jogo))`);

            this.db.run(`CREATE TABLE IF NOT EXISTS lista_desejos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fk_usuario INTEGER NOT NULL,
                fk_jogo INTEGER NOT NULL,
                FOREIGN KEY(fk_usuario) REFERENCES usuarios(id),
                FOREIGN KEY(fk_jogo) REFERENCES jogos(id),
                UNIQUE(fk_usuario, fk_jogo))`);
        });
    }

    _seed() {
        this.db.serialize(() => {
            this.db.run(`INSERT OR IGNORE INTO perfis (nome) VALUES ('Administrador')`);
            this.db.run(`INSERT OR IGNORE INTO perfis (nome) VALUES ('Cliente')`);

            const passAdmin = '$2b$10$zO.7NJgch3ywRR4z6VqLl.ymzfWiC7UWnNgflazzhI4s9WIfaIAnm';
            const passCliente = '$2b$10$zOmYNPw01MgsoQ5kAay0zedEnncs8BMzV/uwJaO.q88ld..d994ZK';
            this.db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, fk_perfil) VALUES ('Admin', 'admin@avjd.com', '${passAdmin}', (SELECT id FROM perfis WHERE nome = 'Administrador'))`);
            this.db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, fk_perfil) VALUES ('Cliente', 'cliente@avjd.com', '${passCliente}', (SELECT id FROM perfis WHERE nome = 'Cliente'))`);

            this._seedJogosFromCSV();
        });
    }

    _seedJogosFromCSV() {
        this.db.get('SELECT COUNT(*) as count FROM jogos', (countErr, row) => {
            if (countErr) {
                console.error('Erro ao verificar jogos cadastrados:', countErr);
                return;
            }

            if (row && row.count > 0) {
                return;
            }

            const csvFilePath = path.join(__dirname, 'jogos.csv');
            fs.readFile(csvFilePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Erro ao ler o arquivo CSV:', err);
                    return;
                }

                this.db.serialize(() => {
                    const lines = data.split('\n').filter(line => line.trim());
                    lines.forEach(line => {
                        const [nome, ano, preco, descricao, empresa, categoria] = line.split(',');
                        if (nome) {
                            this.db.run(`INSERT OR IGNORE INTO empresas (nome) VALUES (?)`, [empresa]);
                            this.db.run(`INSERT OR IGNORE INTO categorias (nome) VALUES (?)`, [categoria]);
                            this.db.run(`INSERT OR IGNORE INTO jogos (nome, ano, preco, descricao, fk_empresa, fk_categoria) VALUES
                                (?, ?, ?, ?, (SELECT id FROM empresas WHERE nome = ?), (SELECT id FROM categorias WHERE nome = ?))`,
                                [nome, parseInt(ano), parseFloat(preco), descricao, empresa, categoria]);
                        }
                    });
                });
            });
        });
    }
}

module.exports = new Database();
