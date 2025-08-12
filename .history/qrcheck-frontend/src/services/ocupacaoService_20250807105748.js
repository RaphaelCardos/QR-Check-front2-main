// src/services/ocupacaoService.js
import api from './api';

/**
 * Busca todas as ocupações cadastradas.
 * GET /ocupacoes
 * @returns {Promise<Array<{ id: number; nome: string }>>}
 */
export const listarOcupacoes = async () => {
  try {
    const response = await api.get('/ocupacoes');
    return response.data;
  } catch (err) {
    console.error('❌ Erro ao listar ocupações:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Cria uma nova ocupação.
 * POST /ocupacoes
 * @param {{ nome: string }} data
 */
export const criarOcupacao = async (data) => {
  try {
    const response = await api.post('/ocupacoes', data);
    return response.data;
  } catch (err) {
    console.error('❌ Erro ao criar ocupação:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Atualiza uma ocupação existente.
 * PATCH /ocupacoes/:id
 * @param {number} id
 * @param {{ nome?: string }} data
 */
export const atualizarOcupacao = async (id, data) => {
  try {
    const response = await api.patch(`/ocupacoes/${id}`, data);
    return response.data;
  } catch (err) {
    console.error(`❌ Erro ao atualizar ocupação ${id}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * Remove uma ocupação.
 * DELETE /ocupacoes/:id
 * @param {number} id
 */
export const removerOcupacao = async (id) => {
  try {
    const response = await api.delete(`/ocupacoes/${id}`);
    return response.data;
  } catch (err) {
    console.error(`❌ Erro ao remover ocupação ${id}:`, err.response?.data || err.message);
    throw err;
  }
};
