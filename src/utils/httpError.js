export function httpErrorHandler(e) {
  if (e?.code === 'ERR_NETWORK') return { status: 0, message: 'Network error', fieldErrors: {} }
  if (e?.code === 'ERR_CANCELED') return { status: 0, message: 'Request canceled', fieldErrors: {} }

  const r = e?.response
  if (!r) return { status: 0, message: 'Error', fieldErrors: {} }

  const d = r.data
  const o = { status: r.status || 0, message: typeof d === 'string' ? d : (d?.message || 'Error'), fieldErrors: {} }
  const errs = d?.errors

  if (Array.isArray(errs)) {
    o.message = errs[0]?.detail || errs[0]?.title || o.message
    errs.forEach(x => {
      const k = (x?.source?.pointer || '').split('/').pop() || ''
      if (k) (o.fieldErrors[k] ??= []).push(x.detail || x.title || o.message)
    })
    return o
  }

  if (errs && typeof errs === 'object') {
    for (const [k, v] of Object.entries(errs)) o.fieldErrors[k] = Array.isArray(v) ? v : [String(v)]
  }

  return o
}
