export function handleError(e, store) {
  const r = e?.response;

  if (r?.status === 422 && r?.data?.errors) {
    store.fieldErrors = r.data.errors;
    store.error = '';
    return;
  }

  store.fieldErrors = {};
  store.error =
    r?.data?.message ||
    r?.statusText ||
    e?.message ||
    'Unexpected error';
}
