import { Link } from 'react-router-dom'
import { getCrianca, getPlano, getSessoes, PLANOS } from '../services/dadosLocais'

const NOMES_TRANSTORNO = {
  tdah: 'TDAH',
  tea: 'TEA leve',
  dislexia: 'Dislexia'
}

function Dashboard() {
  const crianca = getCrianca()
  const planoId = getPlano()
  const plano = planoId ? PLANOS[planoId] : null
  const sessoes = getSessoes()
  const ultimasSessoes = sessoes.slice(-3).reverse()

  const totalAcertos = sessoes.reduce(function (s, x) { return s + x.acertos }, 0)
  const totalErros = sessoes.reduce(function (s, x) { return s + x.erros }, 0)

  return (
    <div className="pagina">
      <h1>Dashboard do responsável</h1>
      <p className="texto-ajuda">
        Acompanhe o perfil da criança e o progresso nas sessões de jogo.
      </p>

      <div className="cards-indicadores">
        <div className="card-indicador">
          <span className="indicador-label">Criança</span>
          <span className="indicador-numero indicador-texto">{crianca ? crianca.nome : '-'}</span>
          {crianca && (
            <p>{crianca.idade} anos · {NOMES_TRANSTORNO[crianca.transtorno] || crianca.transtorno}</p>
          )}
        </div>
        <div className="card-indicador">
          <span className="indicador-label">Plano atual</span>
          <span className="indicador-numero indicador-texto">{plano ? plano.nome : '-'}</span>
          {plano && <p>Até {plano.limiteJogos} jogos</p>}
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{sessoes.length}</span>
          <span className="indicador-label">Sessões jogadas</span>
        </div>
        <div className="card-indicador">
          <span className="indicador-numero">{totalAcertos}/{totalAcertos + totalErros || 0}</span>
          <span className="indicador-label">Acertos totais</span>
        </div>
      </div>

      <section className="secao">
        <h2>Ações rápidas</h2>
        <div className="acoes-rapidas">
          <Link to="/jogos" className="btn btn-primario">Ver jogos</Link>
          <Link to="/editar-crianca" className="btn btn-secundario">Editar criança</Link>
          <Link to="/relatorios" className="btn btn-secundario">Ver relatórios</Link>
          <Link to="/planos" className="btn btn-secundario">Alterar plano</Link>
        </div>
      </section>

      <section className="secao">
        <h2>Últimas sessões</h2>
        {ultimasSessoes.length === 0 && (
          <p>Nenhuma sessão ainda. <Link to="/jogos">Jogue um jogo</Link> para começar.</p>
        )}
        <div className="lista-historico">
          {ultimasSessoes.map(function (s, i) {
            return (
              <div key={i} className="card-historico">
                <div className="historico-cabecalho">
                  <strong>{s.jogoNome}</strong>
                  <span>{s.data}</span>
                </div>
                <p>Acertos: {s.acertos} · Erros: {s.erros} · Tempo médio: {s.tempoMedio}s</p>
                <p>Dificuldade final: {s.dificuldadeFinal}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
