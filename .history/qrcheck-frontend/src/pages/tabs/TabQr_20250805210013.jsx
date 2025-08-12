import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { getParticipantePerfil } from '../../services/participanteService';

export default function TabQr() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const carregarParticipanteEGerarQR = async () => {
      try {
        setLoading(true);
        console.log('🔍 Iniciando carregamento do perfil...');
        
        // Verificar se há token
        const token = localStorage.getItem('access_token');
        console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
        
        const participanteData = await getParticipantePerfil();
        console.log('✅ Dados do participante carregados:', participanteData);
        setParticipante(participanteData);
        
        // Gerar QR code com dados únicos do participante
        const qrData = JSON.stringify({
          id_public: participanteData.id_public,
          nome: participanteData.nome,
          sobrenome: participanteData.sobrenome,
          timestamp: new Date().toISOString()
        });
        
        console.log('📱 Gerando QR code com dados:', qrData);
        
        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        
        console.log('✅ QR code gerado com sucesso');
        setQrCodeDataUrl(qrCodeUrl);
      } catch (err) {
        console.error('❌ Erro detalhado:', err);
        setError(`Erro ao carregar dados do participante ou gerar QR code: ${err.message || err.detail || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
      }
    };

    carregarParticipanteEGerarQR();
  }, []);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${participante?.nome}-${participante?.sobrenome}.png`;
    link.href = qrCodeDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="ml-4 text-gray-600">Carregando dados do participante...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-semibold">Erro ao carregar dados</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
        </div>
        <div className="space-y-2">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Tentar Novamente
          </button>
          <div className="text-xs text-gray-500">
            <p>Verifique se você está logado e se o backend está rodando.</p>
            <p>Token: {localStorage.getItem('access_token') ? 'Presente' : 'Ausente'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu QR Code</h2>
        <p className="text-gray-600">
          QR Code único para {participante?.nome} {participante?.sobrenome}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code do participante" 
              className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
              <div className="text-white text-center">
                <p className="text-sm font-semibold">QR Code Válido</p>
                <p className="text-xs">ID: {participante?.id_public?.slice(0, 8)}...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Informações do Participante</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p><span className="font-medium">Nome:</span> {participante?.nome} {participante?.sobrenome}</p>
              <p><span className="font-medium">Email:</span> {participante?.email}</p>
              <p><span className="font-medium">CPF:</span> {participante?.cpf}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={downloadQRCode}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Baixar QR Code</span>
            </button>

            <button
              onClick={() => window.print()}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Imprimir QR Code</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Importante:</p>
                <p>Este QR code é único e contém suas informações de identificação. Mantenha-o seguro e apresente-o nos eventos para facilitar o check-in.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
