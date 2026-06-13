const BASE_URL = 'http://localhost:3000/api/v1'

function getToken() {
  return localStorage.getItem('cognify_token')
}

async function request(url, options = {}) {
  const token = getToken()

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
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
    throw new Error(data.message || data.error || 'Erro na requisição')
  }

  return data
}

export async function login(email, senha) {
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
