import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Configuração do proxy para o backend
  server: {
    proxy: {
      '/api': {  // Todas as rotas que começam com /api serão redirecionadas
        target: 'http://127.0.0.1:8000',  // URL do seu backend FastAPI
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api ao enviar para o backend
        secure: false,  // Opcional: desativa verificação SSL para localhost
      }
    }
  },

  // Configurações existentes
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});