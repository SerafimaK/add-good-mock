const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1'

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message || code || `HTTP ${status}`)
    this.status = status
    this.code = code
  }
}

function getToken() {
  try {
    const saved = sessionStorage.getItem('auth')
    if (!saved) return null
    return JSON.parse(saved).token || null
  } catch {
    return null
  }
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return null

  let payload = null
  try {
    payload = await res.json()
  } catch {}

  if (!res.ok) {
    throw new ApiError(res.status, payload?.error, payload?.message)
  }

  return payload?.data ?? null
}

export const api = {
  get:    (path)       => request('GET', path),
  post:   (path, body) => request('POST', path, body),
  patch:  (path, body) => request('PATCH', path, body),
  delete: (path)       => request('DELETE', path),
}
