import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAdmin } from '../services/auth'

function Navbar() {
  const navigate = useNavigate()
  const logado = !!localStorage.getItem('cognify_token')
  const admin = logado && isAdmin()
  const [modoEscuro, setModoEscuro] = useState(false)

  useEffect(function () {
    const salvo = localStorage.getItem('cognify_modo_escuro') === 'true'
    setModoEscuro(salvo)
    if (salvo) {
      document.body.classList.add('modo-escuro')
    }
  }, [])

  function toggleModoEscuro() {
    const novo = !modoEscuro
    setModoEscuro(novo)
    localStorage.setItem('cognify_modo_escuro', novo ? 'true' : 'false')
    if (novo) {
      document.body.classList.add('modo-escuro')
    } else {
      document.body.classList.remove('modo-escuro')
    }
  }

  function sair() {
    localStorage.removeItem('cognify_token')
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-conteudo">
        <Link to="/" className="logo">Cognify</Link>

        <nav aria-label="Menu principal">
          {logado && (
            <ul className="menu">
              {admin && <li><Link to="/admin">Admin</Link></li>}
              {!admin && <li><Link to="/dashboard">Dashboard</Link></li>}
              <li><Link to="/">Início</Link></li>
              <li><Link to="/jogos">Jogos</Link></li>
              <li><Link to="/carrinho">Carrinho</Link></li>
              <li><Link to="/historico">Histórico</Link></li>
              <li><Link to="/relatorios">Relatórios</Link></li>
            </ul>
          )}
        </nav>

        <div className="navbar-acoes">
          <button
            type="button"
            className="btn btn-secundario btn-pequeno"
            onClick={toggleModoEscuro}
            aria-label={modoEscuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
          >
            {modoEscuro ? 'Modo claro' : 'Modo escuro'}
          </button>
          {logado ? (
            <button type="button" className="btn btn-secundario btn-pequeno" onClick={sair}>Sair</button>
          ) : (
            <Link to="/login" className="btn btn-primario btn-pequeno">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
