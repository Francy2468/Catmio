const TOKEN_KEY = 'catmio_token'

export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

export function getUser() {
  const token = getToken()
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch {
    return null
  }
}

export function isAdmin() {
  const user = getUser()
  return user?.role === 'admin'
}

export function logout() {
  removeToken()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}
