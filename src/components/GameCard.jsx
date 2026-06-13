import { Link } from 'react-router-dom'

function GameCard({ jogo, categorias }) {
  let nomeCategoria = ''
  const catId = jogo.fkCategoria || jogo.fk_categoria
  if (categorias && catId) {
    const cat = categorias.find(c => c.id === catId)
    nomeCategoria = cat ? cat.nome : ''
  }

  const precoFinal = jogo.desconto
    ? (jogo.preco - jogo.desconto).toFixed(2)
    : Number(jogo.preco).toFixed(2)

  return (
    <article className="card-jogo">
      <div className="card-jogo-icone" aria-hidden="true">🎮</div>
      <h3>{jogo.nome}</h3>
      {nomeCategoria && <span className="tag">{nomeCategoria}</span>}
      <p className="preco">R$ {precoFinal}</p>
      {jogo.descricao && <p className="texto-pequeno">{jogo.descricao}</p>}
      {jogo.id && (
        <Link to={'/jogos/' + jogo.id} className="btn btn-primario btn-pequeno">
          Ver detalhes
        </Link>
      )}
    </article>
  )
}

export default GameCard
