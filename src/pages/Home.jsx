import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJogos, getCategorias } from '../services/api'
import { getCrianca } from '../services/dadosLocais'
import GameCard from '../components/GameCard'

function Home() {
  const crianca = getCrianca()
  const [jogos, setJogos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [erro, setErro] = useState('')

  useEffect(function () {
    async function carregar() {
      try {
        const listaJogos = await getJogos()
        const listaCategorias = await getCategorias()
        setJogos(listaJogos ? listaJogos.slice(0, 4) : [])
        setCategorias(listaCategorias || [])
      } catch (err) {
        setErro(err.message)
      }
    }
    carregar()
  }, [])

  return (
    <div className="pagina">
      <section className="hero">
        <h1>Bem-vindo ao Cognify{crianca ? ', ' + crianca.nome : ''}</h1>
        <p>
          Jogos educativos adaptativos para crianças com TDAH, TEA leve e dislexia.
          A dificuldade se ajusta conforme acertos, erros e tempo de resposta.
        </p>
        <div className="acoes-rapidas" style={{ justifyContent: 'center' }}>
          <Link to="/dashboard" className="btn btn-primario">Dashboard</Link>
          <Link to="/jogos" className="btn btn-secundario">Ver jogos</Link>
        </div>
      </section>

      <section className="secao">
        <h2>Como funciona a adaptação</h2>
        <div className="cards-info">
          <div className="card-info">
            <span className="icone-info">📊</span>
            <h3>Coleta simples</h3>
            <p>Registramos acertos, erros e tempo de resposta durante o jogo.</p>
          </div>
          <div className="card-info">
            <span className="icone-info">⚙️</span>
            <h3>Regras simples</h3>
            <p>Sem IA real — usamos regras básicas para ajustar a experiência.</p>
          </div>
          <div className="card-info">
            <span className="icone-info">🎯</span>
            <h3>Adaptação</h3>
            <p>Dificuldade, tempo e estímulos visuais mudam conforme o desempenho.</p>
          </div>
        </div>
      </section>

      <section className="secao">
        <h2>Jogos em destaque</h2>
        {erro && <p className="msg-erro">{erro}</p>}
        <div className="grid-jogos">
          {jogos.map(function (jogo) {
            return <GameCard key={jogo.id} jogo={jogo} categorias={categorias} />
          })}
        </div>
        {jogos.length === 0 && !erro && <p>Nenhum jogo encontrado.</p>}
      </section>
    </div>
  )
}

export default Home
