// src/services/participanteService.js
import api from './api';

export const registerParticipante = async (participanteData) => {
  // Monta o payload conforme o backend espera
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
    // Dispara o request
    const response = await api.post('/admin/participantes/cadastro', payload);

    // Se vier token, armazena
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }

    return response.data;
  } catch (error) {
    // Log completo do erro e do corpo retornado pelo backend
    console.error('❌ Erro no serviço registerParticipante:', {
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });

    // Se for erro de validação (422), extrai os field errors
    if (error.response?.status === 422) {
      const detail = Array.isArray(error.response.data.detail)
        ? error.response.data.detail
        : [];

      // Mapeia cada erro para { field, message }
      const fieldErrors = detail.map(err => ({
        field:   err.loc[1],  // por ex. ["body","email"] → "email"
        message: err.msg
      }));

      // Lança novamente incluindo fieldErrors, para o componente capturar
      throw { ...error, fieldErrors };
    }

    // Para outros erros, apenas relança
    throw error;
  }
};

// Função para buscar o perfil do participante autenticado
export const getParticipantePerfil = async () => {
  const response = await api.get('/meu-perfil');
  return response.data;
};

// Outras funções do serviço (retornando sempre response.data)
export const getParticipante = id =>
  api.get(`/participantes/${id}`).then(res => res.data);

export const updateParticipante = (id, data) =>
  api.patch(`/participantes/${id}`, data).then(res => res.data);
