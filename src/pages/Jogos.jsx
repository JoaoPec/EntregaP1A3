import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getJogos, getCategorias } from '../services/api'
import GameCard from '../components/GameCard'

function Jogos() {
  const navigate = useNavigate()
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
        if (err.message === 'Token inválido.' || err.message.includes('Acesso negado')) {
          navigate('/login', { replace: true })
          return
        }
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  const jogosFiltrados = jogos.filter(function (jogo) {
    if (busca && !jogo.nome.toLowerCase().includes(busca.toLowerCase())) {
      return false
    }
    if (categoriaFiltro) {
      const catId = jogo.fkCategoria || jogo.fk_categoria
      const cat = categorias.find(c => c.id === catId)
      if (!cat || cat.nome !== categoriaFiltro) return false
    }
    return true
  })

  return (
    <div className="pagina">
      <h1>Jogos</h1>
      <p className="texto-ajuda">Lista de jogos disponíveis na loja.</p>

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
        {jogosFiltrados.map(function (jogo) {
          return <GameCard key={jogo.id} jogo={jogo} categorias={categorias} />
        })}
      </div>

      {!carregando && !erro && jogosFiltrados.length === 0 && (
        <p>Nenhum jogo encontrado.</p>
      )}
    </div>
  )
}

export default Jogos
