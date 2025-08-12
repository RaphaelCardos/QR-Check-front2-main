// src/components/Tabs/TabQr.jsx
import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { getParticipantePerfil } from '../../services/participanteService';
import { getParticipantePerfil } from '../../services/participanteService';

export default function TabQr() {
  const [participante, setParticipante] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState({ perfil: false, qr: false });
  const [error, setError] = useState('');

  const carregarPerfil = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Você não está autenticado. Faça login para continuar.');
      return;
    }

    try {
      setError('');
      setLoading({ perfil: true, qr: false });
      console.log('🔍 Carregando perfil do participante...');

      const data = await getParticipantePerfil();
      console.log('✅ Perfil carregado:', data);
      setParticipante(data);
    } catch (err) {
      console.error('❌ Erro ao carregar perfil:', err);
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(prev => ({ ...prev, perfil: false }));
    }
  }, []);

  const gerarQrCode = useCallback(async () => {
    if (!participante) return;

    try {
      setError('');
      setLoading(prev => ({ ...prev, qr: true }));
      console.log('📱 Gerando QR code para:', participante.id_public);

      const payload = JSON.stringify({
        id_public: participante.id_public,
        nome: participante.nome,
        sobrenome: participante.sobrenome,
        timestamp: new Date().toISOString(),
      });

      const url = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      console.log('✅ QR code gerado');
      setQrUrl(url);
    } catch (err) {
      console.error('❌ Erro ao gerar QR code:', err);
      setError(err.message || 'Erro ao gerar QR code');
    } finally {
      setLoading(prev => ({ ...prev, qr: false }));
    }
  }, [participante]);

  useEffect(() => {
    carregarPerfil();
  }, [carregarPerfil]);

  useEffect(() => {
    if (participante) {
      gerarQrCode();
    }
  }, [participante, gerarQrCode]);

  const retry = () => {
    setError('');
    setQrUrl('');
    setParticipante(null);
    carregarPerfil();
  };

  const downloadQRCode = () => {
    if (!qrUrl || !participante) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qr-${participante.nome}-${participante.sobrenome}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Estados de loading/erro
  if (loading.perfil) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
        <p className="mt-4 text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={retry}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Quando perfil carregado, mas QR ainda está gerando
  if (!qrUrl || loading.qr) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-600">
          {loading.qr ? 'Gerando QR code...' : 'Preparando QR code...'}
        </p>
      </div>
    );
  }

  // Tela final com QR
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Seu QR Code</h2>

      <div className="flex justify-center mb-6">
        <img
          src={qrUrl}
          alt={`QR code de ${participante.nome}`}
          className="w-64 h-64 border rounded-lg shadow"
        />
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-700">
          <span className="font-medium">Nome:</span> {participante.nome}{' '}
          {participante.sobrenome}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">ID público:</span>{' '}
          {participante.id_public.slice(0, 8)}…
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={downloadQRCode}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Baixar QR Code
        </button>
        <button
          onClick={() => window.print()}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Imprimir QR Code
        </button>
      </div>

      <p className="mt-6 text-xs text-gray-500 text-center">
        Importante: mantenha seu QR code seguro e apresente-o nos eventos para
        facilitar o check-in.
      </p>
    </div>
  );
}
