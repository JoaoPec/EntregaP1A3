import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCrianca, salvarCrianca } from '../services/dadosLocais'

function CadastroCrianca({ editar }) {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [transtorno, setTranstorno] = useState('')
  const [erro, setErro] = useState('')
  const [msg, setMsg] = useState('')

  // Preenche o formulário ao editar
  useEffect(function () {
    if (editar) {
      const crianca = getCrianca()
      if (crianca) {
        setNome(crianca.nome)
        setIdade(String(crianca.idade))
        setTranstorno(crianca.transtorno)
      }
    }
  }, [editar])

  function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setMsg('')

    if (!nome || !idade || !transtorno) {
      setErro('Preencha todos os campos.')
      return
    }

    if (Number(idade) < 3 || Number(idade) > 18) {
      setErro('Informe uma idade entre 3 e 18 anos.')
      return
    }

    salvarCrianca({ nome, idade: Number(idade), transtorno })

    if (editar) {
      setMsg('Dados da criança atualizados!')
      setTimeout(function () {
        navigate('/dashboard')
      }, 800)
    } else {
      navigate('/planos')
    }
  }

  return (
    <div className="pagina">
      <div className="form-card">
        <h1>{editar ? 'Editar criança' : 'Cadastro da criança'}</h1>
        <p className="texto-ajuda">
          {editar
            ? 'Atualize os dados da criança para ajustar a experiência nos jogos.'
            : 'Informe os dados da criança para personalizar a experiência nos jogos.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="nomeCrianca">Nome da criança</label>
            <input
              id="nomeCrianca"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Ana"
            />
          </div>

          <div className="campo">
            <label htmlFor="idade">Idade</label>
            <input
              id="idade"
              type="number"
              min="3"
              max="18"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              placeholder="Ex: 8"
            />
          </div>

          <div className="campo">
            <label htmlFor="transtorno">Perfil de aprendizagem</label>
            <select
              id="transtorno"
              value={transtorno}
              onChange={(e) => setTranstorno(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="tdah">TDAH</option>
              <option value="tea">TEA leve</option>
              <option value="dislexia">Dislexia</option>
            </select>
          </div>

          {erro && <p className="msg-erro" role="alert">{erro}</p>}
          {msg && <p className="msg-sucesso" role="status">{msg}</p>}

          <button type="submit" className="btn btn-primario btn-largo">
            {editar ? 'Salvar alterações' : 'Continuar'}
          </button>

          {editar && (
            <div className="form-botoes">
              <button
                type="button"
                className="btn btn-secundario btn-largo"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default CadastroCrianca
