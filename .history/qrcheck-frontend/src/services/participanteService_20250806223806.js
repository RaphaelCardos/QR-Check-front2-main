// src/services/participanteService.js
import api from './api';

export const registerParticipante = async (participanteData) => {
  const payload = {
    nome: participanteData.nome,
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

    // Só tenta mapear fieldErrors se for 422 e detail for array
    if (error.response?.status === 422 && Array.isArray(error.response.data.detail)) {
      const fieldErrors = error.response.data.detail.reduce((acc, errItem) => {
        // checa se errItem.loc existe e é array longo >=2
        if (Array.isArray(errItem.loc) && errItem.loc.length >= 2) {
          const field = errItem.loc[1];       // e.g. ["body","email"] → "email"
          acc[field] = errItem.msg || errItem.message || 'Erro de validação';
        }
        return acc;
      }, {});

      // lança com fieldErrors
      throw { ...error, fieldErrors };
    }

    throw error;
  }
};
