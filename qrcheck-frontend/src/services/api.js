// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// ── Interceptor de requisição: injeta o token JWT ─────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Interceptor de resposta: trata 401 Unauthorized ───────────────────────
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Remove token e redireciona para login
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
