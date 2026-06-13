import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getJogosMaisVendidos, getHistorico, getCategorias, getJogos, getEmpresas } from '../services/api'

const CORES = ['#7c9cbf', '#a8c5a0', '#d4a5a5', '#c9b8d9', '#f0c987']

function Relatorios() {
  const [topJogos, setTopJogos] = useState([])
  const [topPorEmpresa, setTopPorEmpresa] = useState([])
  const [vendas, setVendas] = useState([])
  const [dadosPizza, setDadosPizza] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [empresaFiltro, setEmpresaFiltro] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(function () {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [maisVendidos, historico, categorias, jogos, listaEmpresas] = await Promise.all([
          getJogosMaisVendidos(5),
          getHistorico(),
          getCategorias(),
          getJogos(),
          getEmpresas()
        ])

        setTopJogos(maisVendidos || [])
        setVendas(historico || [])
        setEmpresas(listaEmpresas || [])

        if (jogos && categorias) {
          const contagem = {}
          categorias.forEach(function (cat) {
            contagem[cat.id] = { nome: cat.nome, qtd: 0 }
          })
          jogos.forEach(function (jogo) {
            const catId = jogo.fkCategoria || jogo.fk_categoria
            if (contagem[catId]) contagem[catId].qtd += 1
          })
          setDadosPizza(Object.values(contagem).filter(c => c.qtd > 0).map(c => ({
            name: c.nome,
            value: c.qtd
          })))
        }
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  useEffect(function () {
    async function carregarPorEmpresa() {
      if (!empresaFiltro) {
        setTopPorEmpresa([])
        return
      }
      try {
        const dados = await getJogosMaisVendidos(5, empresaFiltro)
        setTopPorEmpresa(dados || [])
      } catch (err) {
        setErro(err.message)
      }
    }
    carregarPorEmpresa()
  }, [empresaFiltro])

  const totalCompras = vendas.length
  const valorTotal = vendas.reduce((s, v) => s + Number(v.valor_total), 0)

  const dadosBarras = (topJogos || []).map(function (j) {
    return {
      nome: j.nome.length > 15 ? j.nome.substring(0, 15) + '...' : j.nome,
      vendas: j.total
    }
  })

  const dadosEmpresa = (topPorEmpresa || []).map(function (j) {
    return {
      nome: j.nome.length > 15 ? j.nome.substring(0, 15) + '...' : j.nome,
      vendas: j.total
    }
  })

  return (
    <div className="pagina">
      <h1>Relatórios</h1>
      <p className="texto-ajuda">Indicadores de vendas e ranking de jogos.</p>

      {carregando && <p>Carregando...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      <div className="cards-indicadores">
        <div className="card-indicador">
          <span className="indicador-numero">{totalCompras}</span>
          <span className="indicador-label">Compras</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">R$ {valorTotal.toFixed(2)}</span>
          <span className="indicador-label">Valor total</span>
        </div>
      </div>

      <section className="secao-grafico">
        <h2>Ranking — jogos mais vendidos</h2>
        {dadosBarras.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosBarras}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#7c9cbf" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem vendas registradas ainda.</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Jogos mais vendidos por empresa</h2>
        <div className="campo">
          <label htmlFor="empresaRel">Empresa</label>
          <select id="empresaRel" value={empresaFiltro} onChange={(e) => setEmpresaFiltro(e.target.value)}>
            <option value="">Selecione uma empresa</option>
            {empresas.map(function (emp) {
              return <option key={emp.id} value={emp.id}>{emp.nome}</option>
            })}
          </select>
        </div>
        {dadosEmpresa.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosEmpresa}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="vendas" fill="#a8c5a0" name="Vendas" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>{empresaFiltro ? 'Sem vendas para esta empresa.' : 'Selecione uma empresa.'}</p>
        )}
      </section>

      <section className="secao-grafico">
        <h2>Ranking por categoria</h2>
        {dadosPizza.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dadosPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {dadosPizza.map(function (_, i) {
                  return <Cell key={i} fill={CORES[i % CORES.length]} />
                })}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Sem dados de categorias.</p>
        )}
      </section>
    </div>
  )
}

export default Relatorios
