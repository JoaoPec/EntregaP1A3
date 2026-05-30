import { useEffect, useState } from 'react'
import { getJogos, getCategorias } from '../services/api'
import { getPlano, PLANOS } from '../services/dadosLocais'
import GameCard from '../components/GameCard'

function Jogos() {
  const [jogos, setJogos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(function () {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const listaJogos = await getJogos()
        const listaCategorias = await getCategorias()
        setJogos(listaJogos || [])
        setCategorias(listaCategorias || [])
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  // Filtros simples no frontend (nome e categoria)
  const jogosFiltrados = jogos.filter(function (jogo) {
    if (busca && !jogo.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false
    }
    if (categoriaFiltro) {
      const cat = categorias.find(c => c.id === jogo.fk_categoria)
      if (!cat || cat.nome !== categoriaFiltro) return false
    }
    return true
  })

  // Limita jogos conforme o plano
  const planoId = getPlano()
  const limite = planoId ? PLANOS[planoId].limiteJogos : 4
  const jogosDoPlano = jogosFiltrados.slice(0, limite)
  const nomePlano = planoId ? PLANOS[planoId].nome : 'Básico'

  return (
    <div className="pagina">
      <h1>Jogos educativos</h1>
      <p className="texto-ajuda">
        Plano {nomePlano}: até {limite} jogos disponíveis. Escolha um e clique em "Ver detalhes" para jogar.
      </p>

      <div className="filtros">
        <div className="campo">
          <label htmlFor="busca">Buscar por nome</label>
          <input
            id="busca"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome do jogo"
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria">Categoria</label>
          <select
            id="categoria"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(function (cat) {
              return <option key={cat.id} value={cat.nome}>{cat.nome}</option>
            })}
          </select>
        </div>
      </div>

      {erro && <p className="msg-erro" role="alert">{erro}</p>}
      {carregando && <p>Carregando jogos...</p>}

      <div className="grid-jogos">
        {jogosDoPlano.map(function (jogo) {
          return <GameCard key={jogo.id} jogo={jogo} categorias={categorias} />
        })}
      </div>

      {!carregando && jogosDoPlano.length === 0 && (
        <p>Nenhum jogo encontrado com esse filtro.</p>
      )}
    </div>
  )
}

export default Jogos
