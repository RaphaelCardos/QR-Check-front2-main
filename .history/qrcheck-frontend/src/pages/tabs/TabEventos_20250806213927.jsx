// src/components/Tabs/TabEventos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  listarEventos,
  listarMeusEventos,
  inscreverEmEvento
} from '../../services/eventoService';

// Mapeamento de status dos eventos
const STATUS_MAP = {
  futuro:      { status: 'futuro',      texto: 'Em breve',          cor: 'bg-blue-100 text-blue-800' },
  acontecendo: { status: 'acontecendo', texto: 'Acontecendo agora', cor: 'bg-green-100 text-green-800' },
  finalizado:  { status: 'finalizado',  texto: 'Finalizado',        cor: 'bg-gray-100 text-gray-800' },
};

const getStatusEvento = evento => {
  const agora  = Date.now();
  const inicio = new Date(evento.data_inicio).getTime();
  const fim    = new Date(evento.data_fim).getTime();

  if (agora < inicio)   return STATUS_MAP.futuro;
  if (agora <= fim)     return STATUS_MAP.acontecendo;
  return STATUS_MAP.finalizado;
};

const formatarData = iso => new Date(iso).toLocaleDateString('pt-BR');

export default function TabEventos() {
  const [eventos, setEventos]         = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [activeTab, setActiveTab]     = useState('disponiveis');

  const loadData = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [evs, myEvs] = await Promise.all([
        listarEventos(),
        listarMeusEventos()
      ]);
      setEventos(evs);
      setMeusEventos(myEvs);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError(err.message || 'Falha ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInscrever = useCallback(async eventoId => {
    try {
      await inscreverEmEvento(eventoId);
      await loadData();
      alert('Inscrição realizada com sucesso!');
    } catch (err) {
      console.error('Erro na inscrição:', err);
      if (err.status === 409) {
        alert('Você já está inscrito neste evento!');
      } else {
        alert('Erro ao realizar inscrição. Tente novamente.');
      }
    }
  }, [loadData]);

  const disponiveis = useMemo(
    () => eventos.map(e => ({ ...e, statusInfo: getStatusEvento(e) })),
    [eventos]
  );
  const meus = useMemo(
    () => meusEventos.map(e => ({ ...e, statusInfo: getStatusEvento(e) })),
    [meusEventos]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={loadData}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const renderCard = (evento, alreadyRegistered) => {
    const { statusInfo } = evento;
    const podeInscrever = evento.inscricoes_abertas && statusInfo.status !== 'finalizado';

    return (
      <div
        key={evento.id_public}
        className="bg-white rounded-lg shadow overflow-hidden border hover:shadow-lg transition"
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
              {evento.nome}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.cor}`}>
              {statusInfo.texto}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {formatarData(evento.data_inicio)} – {formatarData(evento.data_fim)}
          </p>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{evento.descricao}</p>

          <div className="mt-auto flex justify-between items-center">
            {alreadyRegistered ? (
              <span className="text-green-600 font-medium text-sm flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0..." />
                </svg>
                Inscrito
              </span>
            ) : (
              <button
                onClick={() => handleInscrever(evento.id_public)}
                disabled={!podeInscrever}
                className={`px-4 py-2 rounded font-medium text-sm ${
                  podeInscrever
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {podeInscrever ? 'Inscrever-se' : 'Inscrições Fechadas'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Eventos</h2>
        <p className="text-gray-600">Descubra eventos futuros e gerencie suas inscrições</p>
      </header>

      <div className="flex justify-center mb-8 space-x-2">
        <button
          onClick={() => setActiveTab('disponiveis')}
          className={`px-6 py-2 rounded ${activeTab === 'disponiveis'
            ? 'bg-white text-green-600 shadow'
            : 'text-gray-600 hover:text-gray-800'}`}
        >
          Disponíveis ({disponiveis.length})
        </button>
        <button
          onClick={() => setActiveTab('meus')}
          className={`px-6 py-2 rounded ${activeTab === 'meus'
            ? 'bg-white text-green-600 shadow'
            : 'text-gray-600 hover:text-gray-800'}`}
        >
          Meus Eventos ({meus.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'disponiveis'
          ? disponiveis.map(e => renderCard(e, false))
          : meus.map(e => renderCard(e, true))}
      </div>
    </div>
  );
}
