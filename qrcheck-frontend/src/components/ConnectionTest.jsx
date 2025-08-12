import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ConnectionTest = () => {
  const [status, setStatus] = useState('Testando...');
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Conectando ao backend...');
      console.log('🔍 Testando conexão com:', api.defaults.baseURL);
      
      const response = await api.get('/');
      console.log('✅ Resposta do backend:', response.data);
      
      setApiInfo({
        url: api.defaults.baseURL,
        status: response.status,
        data: response.data
      });
      setStatus('✅ Conectado com sucesso!');
      setError(null);
    } catch (err) {
      console.error('❌ Erro na conexão:', err);
      setError({
        message: err.message || 'Erro desconhecido',
        status: err.status,
        details: err.response?.data
      });
      setStatus('❌ Falha na conexão');
    }
  };

  const testEventosEndpoint = async () => {
    try {
      setStatus('Testando endpoint de eventos...');
      const response = await api.get('/eventos/');
      console.log('✅ Eventos carregados:', response.data);
      setStatus('✅ Endpoint de eventos funcionando!');
    } catch (err) {
      console.error('❌ Erro no endpoint de eventos:', err);
      setError({
        message: 'Erro no endpoint de eventos',
        status: err.status,
        details: err.response?.data
      });
      setStatus('❌ Falha no endpoint de eventos');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔗 Teste de Conexão</h2>
      
      <div className="space-y-4">
        {/* Status da conexão */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Status da Conexão:</h3>
          <p className={`font-mono ${status.includes('✅') ? 'text-green-600' : status.includes('❌') ? 'text-red-600' : 'text-blue-600'}`}>
            {status}
          </p>
        </div>

        {/* Informações da API */}
        {apiInfo && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">Informações da API:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>URL:</strong> {apiInfo.url}</p>
              <p><strong>Status:</strong> {apiInfo.status}</p>
              <p><strong>Resposta:</strong> {apiInfo.data}</p>
            </div>
          </div>
        )}

        {/* Erro detalhado */}
        {error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-800">Erro Detalhado:</h3>
            <div className="space-y-1 text-sm text-red-700">
              <p><strong>Mensagem:</strong> {error.message}</p>
              {error.status && <p><strong>Status:</strong> {error.status}</p>}
              {error.details && <p><strong>Detalhes:</strong> {JSON.stringify(error.details)}</p>}
            </div>
          </div>
        )}

        {/* Botões de teste */}
        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Testar Conexão
          </button>
          
          <button
            onClick={testEventosEndpoint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🎉 Testar Eventos
          </button>
        </div>

        {/* Informações de debug */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Informações de Debug:</h3>
          <div className="space-y-1 text-sm">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>URL Atual:</strong> {window.location.href}</p>
            <p><strong>Token Armazenado:</strong> {localStorage.getItem('access_token') ? 'Presente' : 'Ausente'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest; 