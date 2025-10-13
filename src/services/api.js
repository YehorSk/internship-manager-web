import http from './http'

export const api = {
  auth: {
    forgotPassword: (payload) => http.post('/auth/forgot-password', payload),
    resetPassword: (payload) => http.post('/auth/reset-password', payload),
  },
}
export default api
