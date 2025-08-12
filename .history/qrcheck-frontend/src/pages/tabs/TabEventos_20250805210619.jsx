import React, { useState, useEffect } from 'react';
import { listarEventos, listarMeusEventos, inscreverEmEvento, verificarInscricao } from '../../services/eventoService';

export default function TabEventos() {
  const [eventos, setEventos] = useState([]);
  const [meusEventos, setMeusEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('disponiveis'); // 'disponiveis' ou 'meus-eventos'

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      setLoading(true);
      const [eventosData, meusEventosData] = await Promise.all([
        listarEventos(),
        listarMeusEventos()
      ]);
      
      setEventos(eventosData);
      setMeusEventos(meusEventosData);
    } catch (err) {
      setError('Erro ao carregar eventos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInscrever = async (evento) => {
    try {
      await inscreverEmEvento(evento.id_public);
      // Recarregar eventos após inscrição
      await carregarEventos();
      alert('Inscrição realizada com sucesso!');
    } catch (err) {
      if (err.status === 409) {
        alert('Você já está inscrito neste evento!');
      } else {
        alert('Erro ao realizar inscrição. Tente novamente.');
      }
      console.error('Erro na inscrição:', err);
    }
  };

  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const getStatusEvento = (evento) => {
    const hoje = new Date();
    const dataInicio = new Date(evento.data_inicio);
    const dataFim = new Date(evento.data_fim);
    
    if (hoje < dataInicio) {
      return { status: 'futuro', texto: 'Em breve', cor: 'bg-blue-100 text-blue-800' };
    } else if (hoje >= dataInicio && hoje <= dataFim) {
      return { status: 'acontecendo', texto: 'Acontecendo agora', cor: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'finalizado', texto: 'Finalizado', cor: 'bg-gray-100 text-gray-800' };
    }
  };

  const isInscrito = (evento) => {
    return meusEventos.some(meuEvento => meuEvento.id_public === evento.id_public);
  };

  const podeSeInscrever = (evento) => {
    const status = getStatusEvento(evento);
    return evento.inscricoes_abertas && status.status !== 'finalizado';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          <p className="text-lg font-semibold">{error}</p>
        </div>
        <button 
          onClick={carregarEventos} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Eventos</h2>
        <p className="text-gray-600">
          Descubra eventos futuros e gerencie suas inscrições
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('disponiveis')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'disponiveis'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Eventos Disponíveis ({eventos.length})
          </button>
          <button
            onClick={() => setActiveTab('meus-eventos')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'meus-eventos'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Meus Eventos ({meusEventos.length})
          </button>
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'disponiveis' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum evento disponível</h3>
              <p className="text-gray-500">Não há eventos futuros com inscrições abertas no momento.</p>
            </div>
          ) : (
            eventos.map((evento) => {
              const status = getStatusEvento(evento);
              const inscrito = isInscrito(evento);
              const podeInscrever = podeSeInscrever(evento);
              
              return (
                <div key={evento.id_public} className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {evento.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.cor}`}>
                        {status.texto}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{evento.categoria} • {evento.subcategoria}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatarData(evento.data_inicio)} - {formatarData(evento.data_fim)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {evento.descricao}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        evento.inscricoes_abertas 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {evento.inscricoes_abertas ? 'Inscrições Abertas' : 'Inscrições Fechadas'}
                      </span>
                      
                      {inscrito ? (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Inscrito
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInscrever(evento)}
                          disabled={!podeInscrever}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
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
            })
          )}
        </div>
      )}

      {activeTab === 'meus-eventos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meusEventos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Você ainda não está inscrito em nenhum evento</h3>
              <p className="text-gray-500 mb-4">Explore os eventos disponíveis e faça sua primeira inscrição!</p>
              <button
                onClick={() => setActiveTab('disponiveis')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver Eventos Disponíveis
              </button>
            </div>
          ) : (
            meusEventos.map((evento) => {
              const status = getStatusEvento(evento);
              
              return (
                <div key={evento.id_public} className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                        {evento.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.cor}`}>
                        {status.texto}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{evento.categoria} • {evento.subcategoria}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{formatarData(evento.data_inicio)} - {formatarData(evento.data_fim)}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {evento.descricao}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Inscrito
                      </span>
                      
                      {status.status === 'acontecendo' && (
                        <span className="text-green-600 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Acontecendo agora
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
