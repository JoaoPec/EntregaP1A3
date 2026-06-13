import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHistorico } from '../services/api'

function Historico() {
  const [vendas, setVendas] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(function () {
    async function carregar() {
      try {
        const dados = await getHistorico()
        setVendas(dados || [])
      } catch (err) {
        setErro(err.message)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  function formatarData(dataStr) {
    if (!dataStr) return '-'
    const data = new Date(dataStr)
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="pagina">
      <h1>Histórico de compras</h1>
      <p className="texto-ajuda">Veja todas as suas compras realizadas no Cognify.</p>

      {carregando && <p>Carregando histórico...</p>}
      {erro && <p className="msg-erro" role="alert">{erro}</p>}

      {!carregando && vendas.length === 0 && (
        <div className="historico-vazio">
          <p>Você ainda não fez nenhuma compra.</p>
          <Link to="/jogos" className="btn btn-primario">Comprar jogos</Link>
        </div>
      )}

      {vendas.length > 0 && (
        <div className="lista-historico">
          {vendas.map(function (venda) {
            return (
              <div key={venda.id} className="card-historico">
                <div className="historico-cabecalho">
                  <strong>Compra #{venda.id}</strong>
                  <span>{formatarData(venda.data)}</span>
                </div>
                <p>Itens: {venda.quantidade}</p>
                <p className="historico-valor">
                  Total: R$ {Number(venda.valor_total).toFixed(2)}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Historico
