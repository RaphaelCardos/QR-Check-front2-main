import api from './api'

// == Admin /admin ==
export const listarAdministradores = () =>
  api.get('/admin').then(res => res.data)

export const criarAdministrador    = data =>
  api.post('/admin', data).then(res => res.data)
