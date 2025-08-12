// src/services/authService.js
import api from './api';

/**
 * Faz login usando OAuth2 Password Flow.
 * Envia username e password como form-urlencoded,
 * armazena access_token e refresh_token (se houver) no localStorage.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ access_token: string, refresh_token?: string, token_type: string }>}
 */
export const login = async (email, password) => {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);

  try {
    const response = await api.post('/auth/token', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token, token_type } = response.data;

    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    if (refresh_token) {
      localStorage.setItem('refresh_token', refresh_token);
    }

    return { access_token, refresh_token, token_type };
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Renova o access token usando o refresh token armazenado.
 * Reenvia refresh_token como form-urlencoded e atualiza o storage.
 *
 * @returns {Promise<{ access_token: string, refresh_token?: string, token_type: string }>}
 */
export const refreshToken = async () => {
  const token = localStorage.getItem('refresh_token');
  if (!token) {
    throw new Error('Sem refresh token disponível');
  }

  const form = new URLSearchParams();
  form.append('refresh_token', token);

  try {
    const response = await api.post('/auth/refresh', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token: newRefresh, token_type } = response.data;

    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    if (newRefresh) {
      localStorage.setItem('refresh_token', newRefresh);
    }

    return { access_token, refresh_token: newRefresh, token_type };
  } catch (error) {
    console.error('❌ Erro ao renovar token:', error.response?.data || error.message);
    throw error;
  }
};
