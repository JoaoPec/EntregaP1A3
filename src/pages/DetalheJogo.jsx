import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  getJogo,
  getCategorias,
  addAoCarrinho,
  getMediaAvaliacoes,
  criarAvaliacao
} from '../services/api'
import { calcularAdaptacao } from '../services/dadosLocais'

// Simula adaptação com regras simples (sem IA) - preview na tela de detalhes
function calcularAdaptacaoPreview(acertos, erros, tempo) {
  return calcularAdaptacao(acertos, erros, tempo)
}

function DetalheJogo() {
  const { id } = useParams()
  const [jogo, setJogo] = useState(null)
  const [categoria, setCategoria] = useState('')
  const [media, setMedia] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState('')
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')

  // Valores simulados para demonstrar adaptação
  const [acertos, setAcertos] = useState(7)
  const [erros, setErros] = useState(3)
  const [tempo, setTempo] = useState(4)

  const adaptacao = calcularAdaptacaoPreview(acertos, erros, tempo)

  useEffect(function () {
    async function carregar() {
      try {
        const dadosJogo = await getJogo(id)
        setJogo(dadosJogo)

        const cats = await getCategorias()
        const cat = cats.find(c => c.id === dadosJogo.fk_categoria)
        if (cat) setCategoria(cat.nome)

        const dadosMedia = await getMediaAvaliacoes(id)
        if (dadosMedia) {
          setMedia(dadosMedia.media)
          setComentarios(dadosMedia.avaliacoes || [])
        }
      } catch (err) {
        setErro(err.message)
      }
    }
    carregar()
  }, [id])

  async function handleCarrinho() {
    setMsg('')
    setErro('')
    try {
      await addAoCarrinho(Number(id))
      setMsg('Jogo adicionado ao carrinho!')
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleAvaliacao(e) {
    e.preventDefault()
    setMsg('')
    setErro('')
    try {
      await criarAvaliacao(Number(id), Number(nota), comentario)
      setMsg('Avaliação enviada com sucesso!')
      const dadosMedia = await getMediaAvaliacoes(id)
      if (dadosMedia) {
        setMedia(dadosMedia.media)
        setComentarios(dadosMedia.avaliacoes || [])
      }
      setComentario('')
    } catch (err) {
      setErro(err.message)
    }
  }

  if (!jogo && !erro) return <p>Carregando...</p>
  if (erro && !jogo) return <p className="msg-erro">{erro}</p>

  const precoFinal = jogo.desconto
    ? (jogo.preco - jogo.desconto).toFixed(2)
    : jogo.preco.toFixed(2)

  return (
    <div className="pagina">
      <div className="detalhe-jogo">
        <div className="detalhe-info">
          <h1>{jogo.nome}</h1>
          {categoria && <span className="tag">{categoria}</span>}
          <p className="preco-grande">R$ {precoFinal}</p>
          <p>{jogo.descricao || 'Jogo educativo adaptativo para crianças neurodivergentes.'}</p>
          <p><strong>Ano:</strong> {jogo.ano}</p>

          <button type="button" className="btn btn-primario" onClick={handleCarrinho}>
            Adicionar ao carrinho
          </button>

          <Link to={'/jogar/' + id} className="btn btn-secundario" style={{ marginTop: '0.5rem', display: 'inline-block' }}>
            Jogar agora
          </Link>

          {msg && <p className="msg-sucesso" role="status">{msg}</p>}
          {erro && <p className="msg-erro" role="alert">{erro}</p>}
        </div>

        <div className="detalhe-adaptacao">
          <h2>Simulação de adaptação</h2>
          <p className="texto-ajuda">
            Ajuste os valores abaixo para ver como o jogo se adaptaria (regras simples, sem IA).
          </p>

          <div className="simulador">
            <div className="campo">
              <label htmlFor="acertos">Acertos: {acertos}</label>
              <input
                id="acertos"
                type="range"
                min="0"
                max="10"
                value={acertos}
                onChange={(e) => setAcertos(Number(e.target.value))}
              />
            </div>
            <div className="campo">
              <label htmlFor="erros">Erros: {erros}</label>
              <input
                id="erros"
                type="range"
                min="0"
                max="10"
                value={erros}
                onChange={(e) => setErros(Number(e.target.value))}
              />
            </div>
            <div className="campo">
              <label htmlFor="tempo">Tempo médio (seg): {tempo}</label>
              <input
                id="tempo"
                type="range"
                min="1"
                max="15"
                value={tempo}
                onChange={(e) => setTempo(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="resultado-adaptacao">
            <p><strong>Dificuldade:</strong> {adaptacao.dificuldade}</p>
            <p><strong>Tempo:</strong> {adaptacao.tempo}</p>
            <p><strong>Estímulos visuais:</strong> {adaptacao.estimulos}</p>
          </div>
        </div>
      </div>

      <section className="secao-avaliacoes">
        <h2>Avaliações</h2>
        {media !== null && (
          <p>Média: <strong>{media}</strong> / 5 ({comentarios.length} avaliações)</p>
        )}

        <form onSubmit={handleAvaliacao} className="form-avaliacao">
          <div className="campo">
            <label htmlFor="nota">Sua nota (1 a 5)</label>
            <select id="nota" value={nota} onChange={(e) => setNota(e.target.value)}>
              <option value="5">5 - Excelente</option>
              <option value="4">4 - Bom</option>
              <option value="3">3 - Regular</option>
              <option value="2">2 - Ruim</option>
              <option value="1">1 - Péssimo</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="comentario">Comentário</label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte sua experiência com o jogo"
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-secundario">Enviar avaliação</button>
        </form>

        <div className="lista-comentarios">
          {comentarios.map(function (av, i) {
            return (
              <div key={i} className="comentario-item">
                <p><strong>Nota: {av.nota}/5</strong></p>
                <p>{av.comentario || 'Sem comentário'}</p>
              </div>
            )
          })}
          {comentarios.length === 0 && <p>Nenhuma avaliação ainda.</p>}
        </div>
      </section>
    </div>
  )
}

export default DetalheJogo
