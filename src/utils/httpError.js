import i18n from '@/i18n'

export function handleError(error, store, toastStore) {
  const { t } = i18n.global
  const d = error?.response?.data || {}
  const s = error?.response?.status
  if (s) {
    switch (s) {
      case 422:
      case 409:
        store.fieldErrors = d.errors || {}
        toastStore.showError(d.message || t('httpError.validationError'))
        break
      case 400:
        toastStore.showError(d.message || t('httpError.badRequest'))
        break
      case 401:
        toastStore.showError(d.message || t('httpError.unauthorized'))
        break
      case 403:
        toastStore.showError(d.message || t('httpError.forbidden'))
        break
      case 404:
        toastStore.showError(d.message || t('httpError.notFound'))
        break
      default:
        toastStore.showError(d.message || t('httpError.serverError'))
        console.error('Server error', s, d)
    }
  } else {
    toastStore.showError(d.message || t('httpError.networkError'))
    console.error('Network error', error)
  }
}
