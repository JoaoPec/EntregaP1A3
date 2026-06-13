import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getCarrinho,
  getJogos,
  removerDoCarrinho,
  finalizarCompra,
  pagar
} from '../services/api'

function Carrinho() {
  const [itens, setItens] = useState([])
  const [jogosMap, setJogosMap] = useState({})
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState('pix')
  const [carregando, setCarregando] = useState(true)

  async function carregarCarrinho() {
    setCarregando(true)
    setErro('')
    try {
      const resposta = await getCarrinho()
      const listaJogos = await getJogos()

      // Cria um mapa id -> jogo para facilitar
      const mapa = {}
      if (listaJogos) {
        listaJogos.forEach(function (j) {
          mapa[j.id] = j
        })
      }
      setJogosMap(mapa)

      if (resposta && resposta.carrinho && resposta.carrinho.itens) {
        setItens(resposta.carrinho.itens)
      } else {
        setItens([])
      }
    } catch (err) {
      setErro(err.message)
    }
    setCarregando(false)
  }

  useEffect(function () {
    carregarCarrinho()
  }, [])

  async function handleRemover(jogoId) {
    setErro('')
    try {
      await removerDoCarrinho(jogoId)
      setMsg('Item removido do carrinho.')
      carregarCarrinho()
    } catch (err) {
      setErro(err.message)
    }
  }

  async function handleFinalizar() {
    setErro('')
    setMsg('')
    try {
      // Primeiro simula o pagamento
      await pagar(metodoPagamento, { confirmado: true })
      // Depois finaliza a compra
      const resposta = await finalizarCompra()
      setMsg(resposta.message || 'Compra realizada com sucesso!')
      setItens([])
    } catch (err) {
      setErro(err.message)
    }
  }

  // Calcula total
  let total = 0
  itens.forEach(function (item) {
    const jogo = jogosMap[item.fkJogo]
    if (jogo) {
      const preco = jogo.desconto ? jogo.preco - jogo.desconto : jogo.preco
      total += preco
    }
  })

  return (
    <div className="pagina">
      <h1>Carrinho de compras</h1>

      {carregando && <p>Carregando carrinho...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}
      {msg && <p className="msg-sucesso" role="status">{msg}</p>}

      {!carregando && itens.length === 0 && (
        <div className="carrinho-vazio">
          <p>Seu carrinho está vazio.</p>
          <Link to="/jogos" className="btn btn-primario">Ver jogos</Link>
        </div>
      )}

      {itens.length > 0 && (
        <>
          <ul className="lista-carrinho">
            {itens.map(function (item) {
              const jogo = jogosMap[item.fkJogo]
              const nome = jogo ? jogo.nome : 'Jogo #' + item.fkJogo
              const preco = jogo
                ? (jogo.desconto ? jogo.preco - jogo.desconto : jogo.preco).toFixed(2)
                : '0.00'

              return (
                <li key={item.id} className="item-carrinho">
                  <div>
                    <strong>{nome}</strong>
                    <p>R$ {preco}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-perigo btn-pequeno"
                    onClick={() => handleRemover(item.fkJogo)}
                  >
                    Remover
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="total-carrinho">Total: <strong>R$ {total.toFixed(2)}</strong></p>

          <div className="pagamento">
            <h2>Forma de pagamento</h2>
            <div className="campo">
              <label htmlFor="metodo">Escolha o método</label>
              <select
                id="metodo"
                value={metodoPagamento}
                onChange={(e) => setMetodoPagamento(e.target.value)}
              >
                <option value="pix">PIX</option>
                <option value="cartao">Cartão de crédito</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <button type="button" className="btn btn-primario btn-largo" onClick={handleFinalizar}>
              Finalizar compra
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Carrinho
