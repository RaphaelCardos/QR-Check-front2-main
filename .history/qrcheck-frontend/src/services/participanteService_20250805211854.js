import api from './api';

export const registerParticipante = async (participanteData) => {
  try {
    console.log('🔍 Iniciando cadastro de participante...');
    console.log('📊 Dados recebidos:', participanteData);
    
    const payload = {
      nome: participanteData.nome,
      email: participanteData.email,
      senha: participanteData.senha,
      cpf: participanteData.cpf.replace(/\D/g, ''),
      data_nasc: participanteData.nascimento,
      ocupacao_id: participanteData.ocupacao_id || 1,
      necessidades_especificas: participanteData.necessidades || []
    };

    console.log('📤 Payload enviado:', payload);
    console.log('🌐 URL da requisição:', '/admin/participantes/cadastro');

    const response = await api.post('/admin/participantes/cadastro', payload);
    
    console.log('✅ Resposta do cadastro:', response.data);
    
    // Opcional: Armazena o token se o backend retornar
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro no serviço:', {
      status: error.status,
      message: error.message,
      details: error.details,
      response: error.response?.data
    });
    
    // Tratamento específico para erros de validação
    if (error.status === 422) {
      const fieldErrors = error.details?.map(err => ({
        field: err.loc[1],
        message: err.msg
      })) || [];
      throw { ...error, fieldErrors };
    }
    
    throw error;
  }
};

// Função para buscar o perfil do participante autenticado
export const getParticipantePerfil = async () => {
  try {
    console.log('🔍 Fazendo requisição para /meu-perfil...');
    console.log('🌐 URL base:', api.defaults.baseURL);
    
    const response = await api.get('/meu-perfil');
    console.log('✅ Resposta recebida:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar perfil do participante:', error);
    console.error('📊 Detalhes do erro:', {
      status: error.status,
      message: error.message,
      detail: error.detail,
      response: error.response?.data
    });
    throw error;
  }
};

// Outras funções do serviço
export const getParticipante = async (id) => {
  return api.get(`/participantes/${id}`);
};

export const updateParticipante = async (id, data) => {
  return api.patch(`/participantes/${id}`, data);
};