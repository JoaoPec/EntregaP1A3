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

  const response = await fetch(BASE_URL + url, {
    ...options,
    headers
  })

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

export async function getJogos() {
  return request('/jogos')
}

export async function getCategorias() {
  return request('/categorias')
}
