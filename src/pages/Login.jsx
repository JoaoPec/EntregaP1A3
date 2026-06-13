import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)

    try {
      const resposta = await login(email, senha)
      localStorage.setItem('cognify_token', resposta.token)
      navigate('/jogos')
    } catch (err) {
      setErro(err.message)
    }

    setCarregando(false)
  }

  return (
    <div className="pagina-login">
      <div className="login-card">
        <h1>Cognify</h1>
        <p className="subtitulo">Loja de jogos educativos</p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          {erro && <p className="msg-erro" role="alert">{erro}</p>}

          <button type="submit" className="btn btn-primario btn-largo" disabled={carregando}>
            {carregando ? 'Aguarde...' : 'Entrar'}
          </button>
        </form>

        <div className="login-dica">
          <p><strong>Conta teste:</strong> cliente@avjd.com / cliente123</p>
        </div>
      </div>
    </div>
  )
}

export default Login
