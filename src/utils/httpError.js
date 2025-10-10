export function handleError(error, store, t = (k) => k) {
  if (error?.response) {
    const s = error.response.status
    const d = error.response.data
    if (s === 422 || s === 409) {
      store.errors = d?.errors || {}
      store.credentials = d?.message || ''
      store.failure = d?.message || t('errors.validation')
    } else {
      store.failure = d?.message || t('errors.unexpected')
    }
  } else {
    store.failure = t('errors.network')
  }
}
