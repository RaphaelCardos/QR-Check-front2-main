// src/services/participanteService.js
import api from './api';

// ── Cadastro de participante ───────────────────────────────────────────────
export const registerParticipante = async (participanteData) => {
  const payload = {
    nome: participanteData.nome,
    sobrenome: participanteData.sobrenome,       // obrigatório
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
    const status = error.response?.status;
    const detail = error.response?.data?.detail;

    console.error('❌ registerParticipante falhou com status', status);

    if (Array.isArray(detail)) {
      console.error('❌ Detalhes de validação:');
      detail.forEach((item, idx) => {
        console.error(
          `  [${idx}] campo="${item.loc?.[1]}" — msg="${item.msg}"`
        );
      });
    } else {
      console.error('❌ responseData:', error.response?.data);
    }

    // Se for 422 e detail for array, monte fieldErrors
    if (status === 422 && Array.isArray(detail)) {
      const fieldErrors = detail.reduce((errs, item) => {
        if (Array.isArray(item.loc) && item.loc.length >= 2) {
          errs[item.loc[1]] = item.msg;
        }
        return errs;
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
