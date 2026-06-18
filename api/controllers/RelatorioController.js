const RelatorioDAO = require('../daos/RelatorioDAO');

class RelatorioController {
    async resumo(req, res) {
        try {
            const resumo = await RelatorioDAO.summary();
            res.json({
                totalCompras: resumo.total_compras || 0,
                valorTotal: resumo.valor_total || 0
            });
        } catch (error) {
            return res.status(500).json({ error: error.message, message: 'Erro ao carregar resumo de vendas.' });
        }
    }

    async categorias(req, res) {
        try {
            const categorias = await RelatorioDAO.countSalesByCategory();
            res.json(categorias || []);
        } catch (error) {
            return res.status(500).json({ error: error.message, message: 'Erro ao listar vendas por categoria.' });
        }
    }

    async jogoMaisVendido(req, res) {
        let top = req.query.top;
        const empresa = req.query.empresa;

        try {
            if (!top) {
                top = 10;
            }
            let jogos = null
            if (empresa) {
                jogos = await RelatorioDAO.countGameSellByEnterprise(top, empresa);
            } else {
                jogos = await RelatorioDAO.countGameMostSell(top);
            }
            
            if (!jogos) {
                return res.status(204).json({ error: "Sem dados suficiente." });
            }
            res.json(jogos);
        } catch (error) {
            return res.status(500).json({ error: error.message, message: 'Erro ao listar jogos mais vendidos.' });
        }
    }
}

module.exports = new RelatorioController;
