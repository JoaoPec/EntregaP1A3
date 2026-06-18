const BASE_URL = 'http://localhost:3000/api/v1'

function getToken() {
  return localStorage.getItem('cognify_token')
}

export function limparToken() {
  localStorage.removeItem('cognify_token')
}

export function tokenValido() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      limparToken()
      return false
    }
    return true
  } catch {
    limparToken()
    return false
  }
}

async function request(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  const precisaAuth = !url.startsWith('/auth/')
  const token = getToken()

  if (precisaAuth && token) {
    headers['Authorization'] = 'Bearer ' + token
  }

  const response = await fetch(BASE_URL + url, { ...options, headers })

  if (response.status === 204) {
    return null
  }

  const data = await response.json()

  if (!response.ok) {
    if (response.status === 401 && precisaAuth) {
      limparToken()
    }
    throw new Error(data.message || data.error || 'Erro na requisição')
  }

  return data
}

export async function login(email, senha) {
  limparToken()
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha })
  })
}

export async function getJogos(categoria) {
  const url = categoria ? '/jogos?categoria=' + encodeURIComponent(categoria) : '/jogos'
  return request(url)
}

export async function getJogo(id) {
  return request('/jogos/' + id)
}

export async function getCategorias() {
  return request('/categorias')
}

export async function getCarrinho() {
  return request('/carrinho/ativo')
}

export async function addAoCarrinho(jogoId) {
  return request('/carrinho/add', {
    method: 'POST',
    body: JSON.stringify({ jogoId })
  })
}

export async function removerDoCarrinho(gameId) {
  return request('/carrinho/' + gameId, { method: 'DELETE' })
}

export async function getHistorico() {
  return request('/vendas')
}

export async function finalizarCompra() {
  return request('/vendas/checkout', { method: 'POST' })
}

export async function pagar(metodo, dados) {
  return request('/vendas/pay', {
    method: 'POST',
    body: JSON.stringify({ metodo, dados })
  })
}

export async function getMediaAvaliacoes(jogoId) {
  return request('/avaliacoes/media/' + jogoId)
}

export async function criarAvaliacao(jogoId, nota, comentario) {
  return request('/avaliacoes', {
    method: 'POST',
    body: JSON.stringify({ jogoId, nota, comentario })
  })
}

export async function getJogosMaisVendidos(top, empresaId) {
  let url = '/relatorios/jogos-mais-vendidos?top=' + (top || 5)
  if (empresaId) url += '&empresa=' + empresaId
  return request(url)
}

export async function getEmpresas() {
  return request('/empresas')
}

export async function criarEmpresa(nome) {
  return request('/empresas', {
    method: 'POST',
    body: JSON.stringify({ nome })
  })
}

export async function atualizarEmpresa(id, nome) {
  return request('/empresas/' + id, {
    method: 'PUT',
    body: JSON.stringify({ nome })
  })
}

export async function excluirEmpresa(id) {
  return request('/empresas/' + id, { method: 'DELETE' })
}

export async function criarJogo(dados) {
  return request('/jogos', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
}

export async function atualizarJogo(id, dados) {
  return request('/jogos/' + id, {
    method: 'PUT',
    body: JSON.stringify(dados)
  })
}

export async function excluirJogo(id) {
  return request('/jogos/' + id, { method: 'DELETE' })
}
