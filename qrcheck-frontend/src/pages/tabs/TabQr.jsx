// src/components/Tabs/TabQr.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import QRCode from 'qrcode';
import { getParticipantePerfil } from '../../services/participanteService';

export default function TabQr({ user }) {
  const [participante, setParticipante] = useState(user || null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState({ perfil: !user, qr: false });
  const [error, setError] = useState('');
  const qrBoxRef = useRef(null);

  // helpers
  const maskCPF = (cpf) => {
    if (!cpf) return '—';
    const only = String(cpf).replace(/\D/g, '');
    if (only.length !== 11) return cpf;
    return `${only.slice(0,3)}.${only.slice(3,6)}.${only.slice(6,9)}-${only.slice(9)}`;
  };
  const formatDateBR = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d)) return iso;
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // fetch perfil (fallback)
  const carregarPerfil = useCallback(async () => {
    if (user) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Você não está autenticado. Faça login para continuar.');
      return;
    }
    try {
      setError('');
      setLoading((p) => ({ ...p, perfil: true }));
      const data = await getParticipantePerfil();
      setParticipante(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setLoading((p) => ({ ...p, perfil: false }));
    }
  }, [user]);

  // gerar QR (payload mantém id_public, mas não exibimos na UI)
  const gerarQrCode = useCallback(async () => {
    if (!participante) return;
    try {
      setError('');
      setLoading((p) => ({ ...p, qr: true }));
      const payload = JSON.stringify({
        id_public: participante.id_public,
        nome: participante.nome,
        sobrenome: participante.sobrenome,
        timestamp: new Date().toISOString(),
      });
      const url = await QRCode.toDataURL(payload, {
        width: 300,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrUrl(url);
    } catch (err) {
      setError(err.message || 'Erro ao gerar QR code');
    } finally {
      setLoading((p) => ({ ...p, qr: false }));
    }
  }, [participante]);

  // imprimir apenas o bloco do QR
  const handlePrint = () => {
    if (!qrBoxRef.current) return;
    const html = `
      <html>
        <head><meta charset="utf-8" /><title>QR</title>
          <style>
            *{box-sizing:border-box} body{margin:0;display:flex;align-items:center;justify-content:center}
            .wrap{padding:16px} img,canvas{max-width:100%;height:auto}
          </style>
        </head>
        <body><div class="wrap">${qrBoxRef.current.outerHTML}</div></body>
      </html>`;
    const w = window.open('', '_blank', 'width=600,height=600');
    if (!w) return;
    w.document.open(); w.document.write(html); w.document.close();
    w.focus(); w.print(); w.close();
  };

  // efeitos
  useEffect(() => { carregarPerfil(); }, [carregarPerfil]);
  useEffect(() => { if (participante) gerarQrCode(); }, [participante, gerarQrCode]);

  // estados
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
          onClick={() => { setError(''); setQrUrl(''); setParticipante(null); carregarPerfil(); }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }
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

  // layout: QR à esquerda, dados à direita, botão Imprimir pequeno topo-direito
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      {/* esquerda: QR */}
      <div className="flex flex-col items-center">
        <div
          ref={qrBoxRef}
          className="p-4 bg-white rounded-xl border"
          style={{ borderColor: '#03C04A' }}
        >
          <img
            src={qrUrl}
            alt={`QR code de ${participante?.nome ?? ''}`}
            className="w-64 h-64 border rounded-lg shadow"
          />
        </div>
      </div>

      {/* direita: dados + imprimir */}
      <div className="relative w-full">
        <button
          type="button"
          onClick={handlePrint}
          className="absolute top-0 right-0 text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          aria-label="Imprimir QR"
          title="Imprimir QR"
        >
          Imprimir
        </button>

        <div className="mt-6 md:mt-0 bg-green-50/60 border rounded-xl p-4 md:p-5">
          <dl className="text-sm text-green-900 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Nome</dt>
              <dd className="text-right">{participante?.nome} {participante?.sobrenome}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">E-mail</dt>
              <dd className="text-right break-all">{participante?.email ?? '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">CPF</dt>
              <dd className="text-right">{maskCPF(participante?.cpf)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Nascimento</dt>
              <dd className="text-right">{formatDateBR(participante?.data_nasc)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Ocupação</dt>
              <dd className="text-right">
                {participante?.ocupacao?.nome ??
                  (participante?.ocupacao_id ? `ID ${participante.ocupacao_id}` : '—')}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium">Necessidade</dt>
              <dd className="text-right">
                {Array.isArray(participante?.necessidades_especificas) &&
                participante.necessidades_especificas.length
                  ? 'Sim'
                  : 'Não'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
