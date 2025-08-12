// src/services/participanteService.js
import api from './api';

// ── Cadastro de participante ───────────────────────────────────────────────
export const registerParticipante = async (participanteData) => {
  const payload = {
    nome: participanteData.nome,
    sobrenome: participanteData.sobrenome,     // ← adicionado
    email: participanteData.email,
    senha: participanteData.senha,
    cpf: participanteData.cpf.replace(/\D/g, ''),
    data_nasc: participanteData.nascimento,
    ocupacao_id: participanteData.ocupacao_id || 1,
    necessidades_especificas: participanteData.necessidades || []
  };

  try {
    const response = await api.post('/admin/participantes/cadastro', payload);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;

  } catch (error) {
    console.error('❌ Erro registerParticipante:', {
      status: error.response?.status,
      responseData: error.response?.data
    });

    if (error.response?.status === 422 && Array.isArray(error.response.data.detail)) {
      const fieldErrors = error.response.data.detail.reduce((acc, errItem) => {
        if (Array.isArray(errItem.loc) && errItem.loc.length >= 2) {
          const field = errItem.loc[1];  // e.g. ['body','sobrenome'] → 'sobrenome'
          acc[field] = errItem.msg || errItem.message || 'Erro de validação';
        }
        return acc;
      }, {});
      throw { ...error, fieldErrors };
    }

    throw error;
  }
};

// ── Busca perfil do participante autenticado ───────────────────────────────
export const getParticipantePerfil = async () => {
  const response = await api.get('/meu-perfil');
  return response.data;
};

// ── Busca um participante por ID (admin) ──────────────────────────────────
export const getParticipante = async (id) => {
  const response = await api.get(`/participantes/${id}`);
  return response.data;
};

// ── Atualiza um participante por ID (admin) ───────────────────────────────
export const updateParticipante = async (id, data) => {
  const response = await api.patch(`/participantes/${id}`, data);
  return response.data;
};
