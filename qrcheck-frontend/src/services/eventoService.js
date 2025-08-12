import api from './api';

// Listar todos os eventos disponíveis
export const listarEventos = async () => {
  try {
    console.log('🔍 Fazendo requisição para /eventos/...');
    const response = await api.get('/eventos/');
    console.log('✅ Eventos carregados:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar eventos:', error);
    console.error('📊 Detalhes do erro:', {
      status: error.status,
      message: error.message,
      detail: error.detail,
      response: error.response?.data
    });
    throw error;
  }
};

// Listar eventos em que o participante está inscrito
export const listarMeusEventos = async () => {
  try {
    console.log('🔍 Fazendo requisição para /eventos/meus-eventos...');
    const response = await api.get('/eventos/meus-eventos');
    console.log('✅ Meus eventos carregados:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar meus eventos:', error);
    console.error('📊 Detalhes do erro:', {
      status: error.status,
      message: error.message,
      detail: error.detail,
      response: error.response?.data
    });
    throw error;
  }
};

// Listar TODAS as inscrições do participante (incluindo eventos passados)
export const listarTodasInscricoes = async () => {
  try {
    console.log('🔍 Fazendo requisição para /eventos/todas-inscricoes...');
    const response = await api.get('/eventos/todas-inscricoes');
    console.log('✅ Todas as inscrições carregadas:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar todas as inscrições:', error);
    console.error('📊 Detalhes do erro:', {
      status: error.status,
      message: error.message,
      detail: error.detail,
      response: error.response?.data
    });
    throw error;
  }
};

// Verificar se participante está inscrito em um evento específico
export const verificarInscricao = async (idEvento) => {
  try {
    const response = await api.get(`/eventos/${idEvento}/inscrito`);
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar inscrição:', error);
    throw error;
  }
};

// Obter detalhes de um evento específico
export const obterEvento = async (idEvento) => {
  try {
    const response = await api.get(`/eventos/${idEvento}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter evento:', error);
    throw error;
  }
};

// Inscrever-se em um evento
export const inscreverEmEvento = async (idEvento) => {
  try {
    console.log('🔍 Fazendo inscrição no evento:', idEvento);
    const response = await api.post(`/inscricao-evento/${idEvento}`);
    console.log('✅ Inscrição realizada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao inscrever em evento:', error);
    console.error('📊 Detalhes do erro:', {
      status: error.status,
      message: error.message,
      detail: error.detail,
      response: error.response?.data
    });
    throw error;
  }
}; 