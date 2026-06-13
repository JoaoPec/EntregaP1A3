import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const logado = !!localStorage.getItem('cognify_token')

  function sair() {
    localStorage.removeItem('cognify_token')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-conteudo">
        <Link to="/jogos" className="logo">Cognify</Link>

        <nav aria-label="Menu principal">
          {logado && (
            <ul className="menu">
              <li><Link to="/jogos">Jogos</Link></li>
            </ul>
          )}
        </nav>

        {logado ? (
          <button type="button" className="btn btn-secundario btn-pequeno" onClick={sair}>
            Sair
          </button>
        ) : (
          <Link to="/login" className="btn btn-primario btn-pequeno">Entrar</Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
