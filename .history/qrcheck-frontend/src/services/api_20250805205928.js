import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({ message: 'Timeout - Servidor não respondeu' });
    }
    
    const errorData = error.response?.data || {};
    console.error('Erro na requisição:', {
      status: error.response?.status,
      message: errorData.message || error.message,
      details: errorData.details
    });
    
    return Promise.reject({
      status: error.response?.status,
      ...errorData
    });
  }
);

export default api;