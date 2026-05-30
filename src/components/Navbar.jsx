import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const logado = !!localStorage.getItem('cognify_token')

  function sair() {
    localStorage.removeItem('cognify_token')
    localStorage.removeItem('cognify_nome')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-conteudo">
        <Link to="/" className="logo">
          Cognify
        </Link>

        <nav aria-label="Menu principal">
          {logado && (
            <ul className="menu">
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/jogos">Jogos</Link></li>
              <li><Link to="/carrinho">Carrinho</Link></li>
              <li><Link to="/historico">Histórico</Link></li>
              <li><Link to="/relatorios">Relatórios</Link></li>
            </ul>
          )}
        </nav>

        {logado ? (
          <button type="button" className="btn btn-secundario" onClick={sair}>
            Sair
          </button>
        ) : (
          <Link to="/login" className="btn btn-primario">Entrar</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
