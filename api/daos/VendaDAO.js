const dbService = require('../services/DatabaseService');
const Venda = require("../models/Venda");

class VendaDAO {
  async findById(id) {
    const sql = 'SELECT * FROM vendas WHERE id = ?';
    const row = await dbService.get(sql, [id]);
    return row;
  }

  async findByUser(usuarioId) {
    const sql = `
      SELECT
        v.id,
        v.valor_total,
        v.quantidade,
        v.data,
        v.fk_usuario,
        j.nome as jogo_nome,
        j.preco as jogo_preco,
        ic.chave_ativacao
      FROM vendas v
      LEFT JOIN carrinhos c ON c.fk_venda = v.id
      LEFT JOIN itens_carrinho ic ON ic.fk_carrinho = c.id
      LEFT JOIN jogos j ON j.id = ic.fk_jogo
      WHERE v.fk_usuario = ?
      ORDER BY v.data DESC, v.id DESC
    `;
    const rows = await dbService.all(sql, [usuarioId]);
    const vendasPorId = new Map();

    rows.forEach(row => {
      if (!vendasPorId.has(row.id)) {
        vendasPorId.set(row.id, {
          id: row.id,
          valor_total: row.valor_total,
          quantidade: row.quantidade,
          data: row.data,
          fk_usuario: row.fk_usuario,
          itens: []
        });
      }

      if (row.jogo_nome) {
        vendasPorId.get(row.id).itens.push({
          nome: row.jogo_nome,
          preco: row.jogo_preco,
          chave_ativacao: row.chave_ativacao
        });
      }
    });

    return Array.from(vendasPorId.values());
  }

  async findAll() {
    const sql = 'SELECT * FROM vendas';
    const rows = await dbService.all(sql);
    return rows;
  }

  async create(venda) {
    const sql = 'INSERT INTO vendas (fk_usuario, data, valor_total, quantidade) VALUES (?, ?, ?, ?)';
    const params = [venda.fkUsuario, venda.data, venda.valorTotal, venda.quantidade];
    const result = await dbService.run(sql, params);
    venda.id = result.lastID;
    return venda;
  }

  async update(id, venda) {
    const sql = 'UPDATE vendas SET fk_usuario = ?, data = ?, valor_total = ?, quantidade = ? WHERE id = ?';
    const params = [venda.usuarioId, venda.data, venda.valorTotal, venda.quantidade, id];
    const result = await dbService.run(sql, params);
    return { changes: result.changes };
  }

  async delete(id) {
    const sql = 'DELETE FROM vendas WHERE id = ?';
    const result = await dbService.run(sql, [id]);
    return { changes: result.changes };
  }
}

module.exports = new VendaDAO();
