// Funções auxiliares de autenticação

export function getUsuarioLogado() {
  const token = localStorage.getItem('cognify_token')
  if (!token) return null

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (e) {
    return null
  }
}

export function isAdmin() {
  const usuario = getUsuarioLogado()
  return usuario && usuario.perfil === 'Administrador'
}
