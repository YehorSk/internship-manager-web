export function handleError(error, store) {
  const d = error?.response?.data || {}
  const s = error?.response?.status
  if (s) {
    switch (s) {
      case 422:
      case 409:
        store.fieldErrors = d.errors || {}
        store.error = d.message || 'Chyba validácie'
        break
      case 400:
        store.error = d.message || 'Neplatný požiadavok'
        break
      case 401:
        store.error = 'Neautorizovaný prístup'
        break
      case 403:
        store.error = 'Prístup zamietnutý'
        break
      case 404:
        store.error = d.message || 'Nenájdené'
        break
      default:
        store.error = d.message || 'Neočakávaná chyba servera'
        console.error('Server error', s, d)
    }
  } else {
    store.error = 'Sieťová chyba'
    console.error('Network error', error)
  }
}
