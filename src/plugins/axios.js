import axios from 'axios'

const raw = import.meta.env.VITE_API_BASE_URL || ''
const baseURL = raw.endsWith('/api') || raw.endsWith('/api/') ? raw.replace(/\/$/, '') : `${raw.replace(/\/$/, '')}/api`

const instance = axios.create({
  baseURL,
  headers: { Accept: 'application/vnd.api+json' }
})

instance.defaults.headers.post['Content-Type'] = 'application/vnd.api+json'
instance.defaults.headers.put['Content-Type'] = 'application/vnd.api+json'
instance.defaults.headers.patch['Content-Type'] = 'application/vnd.api+json'

const normalizeError = (error) => {
  const res = error.response
  const out = { message: 'Chyba pri spracovaní požiadavky', fieldErrors: {} }
  if (!res) { out.message = 'Sieťová chyba'; return out }
  const data = res.data
  if (Array.isArray(data?.errors)) {
    out.message = data.errors[0]?.detail || data.errors[0]?.title || out.message
    data.errors.forEach(e => {
      const ptr = e?.source?.pointer || ''
      const key = ptr.startsWith('/data/attributes/') ? ptr.replace('/data/attributes/', '') : ptr.replace('/', '')
      if (key) { if (!out.fieldErrors[key]) out.fieldErrors[key] = []; out.fieldErrors[key].push(e.detail || e.title || out.message) }
    })
    return out
  }
  if (data?.message && typeof data?.errors === 'object') {
    out.message = data.message
    Object.entries(data.errors).forEach(([k, v]) => { out.fieldErrors[k] = Array.isArray(v) ? v : [String(v)] })
    return out
  }
  if (typeof data?.message === 'string') { out.message = data.message; return out }
  if (typeof data === 'string') { out.message = data; return out }
  return out
}

instance.interceptors.response.use(r => r, err => {
  err.normalized = normalizeError(err)
  return Promise.reject(err)
})

export default instance
