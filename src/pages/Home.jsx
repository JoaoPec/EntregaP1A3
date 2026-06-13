import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJogos, getCategorias } from '../services/api'
import GameCard from '../components/GameCard'

function Home() {
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
        <h1>Bem-vindo ao Cognify</h1>
        <p>Jogos educativos para crianças com TDAH, TEA leve e dislexia.</p>
        <Link to="/jogos" className="btn btn-primario">Ver todos os jogos</Link>
      </section>

      <section className="secao">
        <h2>Jogos em destaque</h2>
        {erro && <p className="msg-erro">{erro}</p>}
        <div className="grid-jogos">
          {jogos.map(function (jogo) {
            return <GameCard key={jogo.id} jogo={jogo} categorias={categorias} />
          })}
        </div>
      </section>
    </div>
  )
}

export default Home
