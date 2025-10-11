export function handleError(error, store) {
  if (error?.response) {
    const s = error.response.status
    const d = error.response.data
    if (s === 422 || s === 409) {
      store.fieldErrors = d?.errors || {}
      store.error = d?.message || 'Chyba validácie'
    } else {
      store.error = d?.message || 'Neočakávaná chyba'
    }
  } else {
    store.error = 'Sieťová chyba'
  }
}
