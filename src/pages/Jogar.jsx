import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getJogo } from '../services/api'
import {
  getCrianca,
  calcularAdaptacao,
  salvarSessao
} from '../services/dadosLocais'

const TOTAL_PERGUNTAS = 5

// Gera soma simples conforme dificuldade
function gerarPergunta(nivel) {
  let max = 5
  if (nivel === 'Média') max = 10
  if (nivel === 'Alta') max = 20

  const a = Math.floor(Math.random() * max) + 1
  const b = Math.floor(Math.random() * max) + 1
  return { a, b, resposta: a + b }
}

function Jogar() {
  const { id } = useParams()
  const crianca = getCrianca()

  const [jogo, setJogo] = useState(null)
  const [perguntaAtual, setPerguntaAtual] = useState(null)
  const [resposta, setResposta] = useState('')
  const [numeroPergunta, setNumeroPergunta] = useState(1)
  const [acertos, setAcertos] = useState(0)
  const [erros, setErros] = useState(0)
  const [tempos, setTempos] = useState([])
  const [inicioPergunta, setInicioPergunta] = useState(Date.now())
  const [adaptacao, setAdaptacao] = useState({ dificuldade: 'Baixa', tempo: 'Ampliado', estimulos: 'Reforçados' })
  const [finalizado, setFinalizado] = useState(false)
  const [msg, setMsg] = useState('')
  const [erro, setErro] = useState('')

  useEffect(function () {
    async function carregar() {
      try {
        const dados = await getJogo(id)
        setJogo(dados)
        setPerguntaAtual(gerarPergunta('Baixa'))
        setInicioPergunta(Date.now())
      } catch (err) {
        setErro(err.message)
      }
    }
    carregar()
  }, [id])

  function proximaPergunta(novosAcertos, novosErros, novosTempos) {
    const tempoMedio = novosTempos.length > 0
      ? novosTempos.reduce(function (s, t) { return s + t }, 0) / novosTempos.length
      : 0

    const novaAdaptacao = calcularAdaptacao(novosAcertos, novosErros, tempoMedio)
    setAdaptacao(novaAdaptacao)

    if (numeroPergunta >= TOTAL_PERGUNTAS) {
      finalizarSessao(novosAcertos, novosErros, novosTempos, novaAdaptacao)
      return
    }

    setNumeroPergunta(numeroPergunta + 1)
    setPerguntaAtual(gerarPergunta(novaAdaptacao.dificuldade))
    setResposta('')
    setInicioPergunta(Date.now())
  }

  function finalizarSessao(novosAcertos, novosErros, novosTempos, novaAdaptacao) {
    const tempoMedio = novosTempos.length > 0
      ? (novosTempos.reduce(function (s, t) { return s + t }, 0) / novosTempos.length).toFixed(1)
      : 0

    salvarSessao({
      jogoId: id,
      jogoNome: jogo ? jogo.nome : 'Jogo',
      criancaNome: crianca ? crianca.nome : 'Criança',
      acertos: novosAcertos,
      erros: novosErros,
      tempoMedio: tempoMedio,
      dificuldadeFinal: novaAdaptacao.dificuldade,
      data: new Date().toLocaleString('pt-BR')
    })

    setFinalizado(true)
  }

  function handleResponder(e) {
    e.preventDefault()
    if (!perguntaAtual) return

    const tempoResposta = (Date.now() - inicioPergunta) / 1000
    const novosTempos = [...tempos, tempoResposta]
    setTempos(novosTempos)

    let novosAcertos = acertos
    let novosErros = erros

    if (Number(resposta) === perguntaAtual.resposta) {
      novosAcertos = acertos + 1
      setAcertos(novosAcertos)
      setMsg('Correto!')
    } else {
      novosErros = erros + 1
      setErros(novosErros)
      setMsg('Resposta: ' + perguntaAtual.resposta)
    }

    setTimeout(function () {
      setMsg('')
      proximaPergunta(novosAcertos, novosErros, novosTempos)
    }, 800)
  }

  if (erro) return <p className="msg-erro">{erro}</p>
  if (!jogo && !finalizado) return <p>Carregando jogo...</p>

  if (finalizado) {
    const tempoMedio = tempos.length > 0
      ? (tempos.reduce(function (s, t) { return s + t }, 0) / tempos.length).toFixed(1)
      : 0

    return (
      <div className="pagina">
        <div className="form-card">
          <h1>Sessão finalizada</h1>
          <p><strong>{crianca ? crianca.nome : 'Criança'}</strong> jogou <strong>{jogo.nome}</strong></p>
          <div className="resultado-adaptacao">
            <p>Acertos: {acertos}</p>
            <p>Erros: {erros}</p>
            <p>Tempo médio: {tempoMedio}s</p>
            <p>Dificuldade final: {adaptacao.dificuldade}</p>
            <p>Tempo de resposta: {adaptacao.tempo}</p>
            <p>Estímulos: {adaptacao.estimulos}</p>
          </div>
          <div className="acoes-rapidas">
            <Link to="/dashboard" className="btn btn-primario">Ver dashboard</Link>
            <Link to="/jogos" className="btn btn-secundario">Outros jogos</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pagina">
      <h1>Jogando: {jogo.nome}</h1>
      <p className="texto-ajuda">
        Criança: <strong>{crianca ? crianca.nome : 'Não cadastrada'}</strong> ·
        Pergunta {numeroPergunta} de {TOTAL_PERGUNTAS}
      </p>

      <div className="jogo-area">
        <div className="adaptacao-atual">
          <p><strong>Adaptação atual:</strong> {adaptacao.dificuldade} · {adaptacao.tempo} · {adaptacao.estimulos}</p>
          <p>Acertos: {acertos} · Erros: {erros}</p>
        </div>

        {perguntaAtual && (
          <form onSubmit={handleResponder} className="form-card">
            <p className="pergunta-jogo">Quanto é {perguntaAtual.a} + {perguntaAtual.b}?</p>
            <div className="campo">
              <label htmlFor="resposta">Sua resposta</label>
              <input
                id="resposta"
                type="number"
                value={resposta}
                onChange={(e) => setResposta(e.target.value)}
                autoFocus
                required
              />
            </div>
            {msg && <p className="msg-sucesso" role="status">{msg}</p>}
            <button type="submit" className="btn btn-primario btn-largo">Responder</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Jogar
