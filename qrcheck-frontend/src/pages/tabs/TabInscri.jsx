// src/components/Tabs/TabInscri.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { listarTodasInscricoes } from '../../services/eventoService';

// Mapeamento de status
const STATUS_MAP = {
  futuro:    { status: 'futuro',    texto: 'Em breve',           cor: 'bg-blue-100 text-blue-800',  icon: '⏰' },
  acontecendo: { status: 'acontecendo', texto: 'Acontecendo agora', cor: 'bg-green-100 text-green-800', icon: '🎉' },
  passado:   { status: 'passado',   texto: 'Finalizado',        cor: 'bg-gray-100 text-gray-800',  icon: '✅' },
};

const getStatusEvento = evento => {
  const agora      = Date.now();
  const inicioMs   = new Date(evento.data_inicio).getTime();
  const fimMs      = new Date(evento.data_fim).getTime();
  if (agora < inicioMs)     return STATUS_MAP.futuro;
  if (agora <= fimMs)       return STATUS_MAP.acontecendo;
  return STATUS_MAP.passado;
};

const formatarData = iso => new Date(iso).toLocaleDateString('pt-BR');

export default function TabInscri() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [filter, setFilter]         = useState('todos'); // 'todos' | 'futuro' | 'acontecendo' | 'passado'

  const loadInscricoes = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const data = await listarTodasInscricoes();
      setInscricoes(data);
    } catch (err) {
      console.error('Erro ao carregar inscrições:', err);
      setError(err.message || 'Falha ao carregar inscrições');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInscricoes();
  }, [loadInscricoes]);

  // Inscrições filtradas
  const inscricoesFiltradas = useMemo(() => {
    if (filter === 'todos') return inscricoes;
    return inscricoes.filter(e => getStatusEvento(e).status === filter);
  }, [inscricoes, filter]);

  // Contadores para os filtros
  const contadores = useMemo(() => ({
    todos:        inscricoes.length,
    futuros:      inscricoes.filter(e => getStatusEvento(e).status === 'futuro').length,
    acontecendo: inscricoes.filter(e => getStatusEvento(e).status === 'acontecendo').length,
    passados:    inscricoes.filter(e => getStatusEvento(e).status === 'passado').length,
  }), [inscricoes]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={loadInscricoes}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Minhas Inscrições</h2>
        <p className="text-gray-600">Histórico de eventos em que você se inscreveu</p>
      </header>

      {/* Filtros */}
      <div className="flex justify-center mb-8 space-x-2">
        {['todos','futuro','acontecendo','passado'].map(key => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md font-medium transition ${filter === key
              ? 'bg-white text-green-600 shadow'
              : 'text-gray-600 hover:text-gray-800'}`}
          >
            {key === 'todos' ? `Todos (${contadores.todos})`
              : key === 'futuro' ? `Futuros (${contadores.futuros})`
              : key === 'acontecendo' ? `Acontecendo (${contadores.acontecendo})`
              : `Passados (${contadores.passados})`}
          </button>
        ))}
      </div>

      {/* Lista de inscrições */}
      {inscricoesFiltradas.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">
            {filter === 'todos'
              ? 'Você ainda não se inscreveu em nenhum evento.'
              : 'Nenhum evento com esse status.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inscricoesFiltradas.map(evento => {
            const { status, texto, cor, icon } = getStatusEvento(evento);
            return (
              <div
                key={evento.id_public}
                className={`bg-white rounded-lg shadow overflow-hidden border transition hover:shadow-lg ${
                  status === 'acontecendo' 
                    ? 'border-green-300 ring-2 ring-green-100' 
                    : status === 'futuro' 
                      ? 'border-blue-300' 
                      : 'border-gray-200'}`}
              >
                <div className="p-6 flex flex-col h-full">
                  <header className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{evento.nome}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${cor}`}>
                      <span className="mr-1">{icon}</span> {texto}
                    </span>
                  </header>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">
                      {formatarData(evento.data_inicio)} – {formatarData(evento.data_fim)}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-3">{evento.descricao}</p>
                  </div>
                  <footer className="mt-4 flex justify-between items-center">
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1..." clipRule="evenodd" />
                      </svg>
                      Inscrito
                    </span>
                    {status === 'acontecendo' && (
                      <span className="text-green-600 text-sm animate-pulse">Acontecendo agora</span>
                    )}
                  </footer>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
