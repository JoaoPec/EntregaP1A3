import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { getJogosMaisVendidos, getEmpresas, getResumoRelatorios, getVendasPorCategoria } from '../services/api'

const CORES = ['#6b8499', '#849a7a', '#a08888', '#9188a0', '#a89470']

function Relatorios() {
  const [topJogos, setTopJogos] = useState([])
  const [topPorEmpresa, setTopPorEmpresa] = useState([])
  const [resumo, setResumo] = useState({ totalCompras: 0, valorTotal: 0 })
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
        const [maisVendidos, resumoVendas, vendasPorCategoria, listaEmpresas] = await Promise.all([
          getJogosMaisVendidos(5),
          getResumoRelatorios(),
          getVendasPorCategoria(),
          getEmpresas()
        ])

        setTopJogos(maisVendidos || [])
        setResumo(resumoVendas || { totalCompras: 0, valorTotal: 0 })
        setEmpresas(listaEmpresas || [])
        setDadosPizza((vendasPorCategoria || []).map(c => ({
          name: c.categoria,
          value: c.total_vendas
        })))
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

  const totalCompras = Number(resumo.totalCompras || 0)
  const valorTotal = Number(resumo.valorTotal || 0)

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
              <Bar dataKey="vendas" fill="#6b8499" name="Vendas" />
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
              <Bar dataKey="vendas" fill="#849a7a" name="Vendas" />
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
