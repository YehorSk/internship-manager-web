export function handleError(error, store, toastStore) {
  const d = error?.response?.data || {}
  const s = error?.response?.status
  if (s) {
    switch (s) {
      case 422:
      case 409:
        store.fieldErrors = d.errors || {}
        toastStore.showError(d.message || 'Chyba validácie')
        break
      case 400:
        toastStore.showError(d.message || 'Neplatný požiadavok')
        break
      case 401:
        toastStore.showError(d.message || 'Neautorizovaný prístup')
        break
      case 403:
        toastStore.showError(d.message || 'Prístup zamietnutý')
        break
      case 404:
        toastStore.showError(d.message || 'Nenájdené')
        break
      default:
        toastStore.showError(d.message || 'Neočakávaná chyba servera')
        console.error('Server error', s, d)
    }
  } else {
    toastStore.showError(d.message || 'Sieťová chyba')
    console.error('Network error', error)
  }
}
