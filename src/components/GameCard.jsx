function GameCard({ jogo, categorias }) {
  let nomeCategoria = ''
  if (categorias && jogo.fk_categoria) {
    const cat = categorias.find(c => c.id === jogo.fk_categoria)
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
    </article>
  )
}

export default GameCard
