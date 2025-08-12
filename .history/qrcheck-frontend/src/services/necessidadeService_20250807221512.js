import api from './api'

// GET /necessidades
export const listarNecessidades   = () =>
  api.get('/necessidades').then(res => res.data)

// POST /necessidades
export const criarNecessidade     = data =>
  api.post('/necessidades', data).then(res => res.data)

// PATCH /necessidades/:id
export const atualizarNecessidade = (id, data) =>
  api.patch(`/necessidades/${id}`, data).then(res => res.data)

// DELETE /necessidades/:id
export const removerNecessidade   = id =>
  api.delete(`/necessidades/${id}`).then(res => res.data)
