// src/services/participanteService.js
import api from './api';

// ── 1. Cadastro de participante (Admin) ────────────────────────────────────
export const registerParticipante = async (data) => {
  // data deve ter: nome, sobrenome, email, senha, cpf, nascimento, ocupacao_id, necessidades
  const payload = {
    nome: data.nome,
    sobrenome: data.sobrenome,
    email: data.email,
    senha: data.senha,
    cpf: data.cpf.replace(/\D/g, ''),
    // O backend espera "data_nasc" (date) conforme ParticipanteSchemaCreate
    data_nasc: data.data_nasc,
    ocupacao_id: data.ocupacao_id || 1,
    // O backend espera "necessidades_especificas" (List[int])
    necessidades_especificas: data.necessidades_especificas || []
  };

  try {
    const res = await api.post('/admin/participantes/cadastro', payload);
    // opcional: se o backend retornar token na criação
    if (res.data.access_token) {
      localStorage.setItem('access_token', res.data.access_token);
    }
    return res.data;

  } catch (err) {
    const status = err.response?.status;
    const detail = err.response?.data?.detail;

    console.error('❌ registerParticipante falhou:', status, err.response?.data);
    if (Array.isArray(detail)) {
      detail.forEach((item, i) =>
        console.error(`  [${i}] campo="${item.loc?.[1]}" — msg="${item.msg}"`)
      );
    }
    if (status === 422 && Array.isArray(detail)) {
      const fieldErrors = detail.reduce((acc, item) => {
        if (Array.isArray(item.loc) && item.loc.length >= 2) {
          acc[item.loc[1]] = item.msg;
        }
        return acc;
      }, {});
      throw { ...err, fieldErrors };
    }
    throw err;
  }
};

// ── 2. Perfil do participante autenticado (Usuário) ────────────────────────
export const getParticipantePerfil = () =>
  api.get('/meu-perfil').then(res => res.data);

// ── 3. Endpoints Admin para Participantes ──────────────────────────────────

// 3.1 Listar (com paginação)
export const listParticipantesAdmin = (page = 1, size = 20) =>
  api
    .get('/admin/participantes/listar', { params: { page, size } })
    .then(res => res.data);

// 3.2 Detalhar participante por ID
export const getParticipanteAdmin = (id) =>
  api.get(`/admin/participantes/${id}`).then(res => res.data);

// 3.3 Deletar participante
export const deleteParticipanteAdmin = (id) =>
  api.delete(`/admin/participantes/deletar/${id}`).then(res => res.data);

// NOTA: não há rota de PATCH/PUT em AdminParticipantesRouter,
// então removemos o updateParticipante ou só o usamos para outro endpoint,
// se você adicioná-lo no backend.

