import React, { useState, useEffect } from 'react';
import { listarTodasInscricoes } from '../../services/eventoService';

export default function TabInscri() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos'); // 'todos', 'futuros', 'acontecendo', 'passados'

  useEffect(() => {
    carregarInscricoes();
  }, []);

  const carregarInscricoes = async () => {
    try {
      setLoading(true);
      const inscricoesData = await listarTodasInscricoes();
      setInscricoes(inscricoesData);
    } catch (err) {
      setError('Erro ao carregar inscrições');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
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
      return { status: 'futuro', texto: 'Em breve', cor: 'bg-blue-100 text-blue-800', icon: '⏰' };
    } else if (hoje >= dataInicio && hoje <= dataFim) {
      return { status: 'acontecendo', texto: 'Acontecendo agora', cor: 'bg-green-100 text-green-800', icon: '🎉' };
    } else {
      return { status: 'passado', texto: 'Finalizado', cor: 'bg-gray-100 text-gray-800', icon: '✅' };
    }
  };

  const filtrarInscricoes = () => {
    if (activeFilter === 'todos') {
      return inscricoes;
    }
    
    return inscricoes.filter(evento => {
      const status = getStatusEvento(evento);
      return status.status === activeFilter;
    });
  };

  const inscricoesFiltradas = filtrarInscricoes();

  const getContadores = () => {
    const contadores = {
      todos: inscricoes.length,
      futuros: inscricoes.filter(e => getStatusEvento(e).status === 'futuro').length,
      acontecendo: inscricoes.filter(e => getStatusEvento(e).status === 'acontecendo').length,
      passados: inscricoes.filter(e => getStatusEvento(e).status === 'passado').length
    };
    return contadores;
  };

  const contadores = getContadores();

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
          onClick={carregarInscricoes} 
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Minhas Inscrições</h2>
        <p className="text-gray-600">
          Histórico completo de todos os eventos em que você se inscreveu
        </p>
      </div>

      {/* Filtros */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveFilter('todos')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeFilter === 'todos'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Todos ({contadores.todos})
          </button>
          <button
            onClick={() => setActiveFilter('futuros')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeFilter === 'futuros'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Futuros ({contadores.futuros})
          </button>
          <button
            onClick={() => setActiveFilter('acontecendo')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeFilter === 'acontecendo'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Acontecendo ({contadores.acontecendo})
          </button>
          <button
            onClick={() => setActiveFilter('passados')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeFilter === 'passados'
                ? 'bg-white text-gray-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Passados ({contadores.passados})
          </button>
        </div>
      </div>

      {/* Lista de Inscrições */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inscricoesFiltradas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeFilter === 'todos' ? (
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {activeFilter === 'todos' 
                ? 'Você ainda não se inscreveu em nenhum evento'
                : `Nenhum evento ${activeFilter === 'futuros' ? 'futuro' : activeFilter === 'acontecendo' ? 'acontecendo' : 'passado'} encontrado`
              }
            </h3>
            <p className="text-gray-500">
              {activeFilter === 'todos' 
                ? 'Explore os eventos disponíveis e faça sua primeira inscrição!'
                : 'Tente mudar o filtro para ver outros eventos.'
              }
            </p>
          </div>
        ) : (
          inscricoesFiltradas.map((evento) => {
            const status = getStatusEvento(evento);
            
            return (
              <div 
                key={evento.id_public} 
                className={`bg-white rounded-lg shadow-lg overflow-hidden border transition-all hover:shadow-xl ${
                  status.status === 'acontecendo' ? 'border-green-300 ring-2 ring-green-100' :
                  status.status === 'futuro' ? 'border-blue-300' :
                  'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {evento.nome}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.cor}`}>
                      <span className="mr-1">{status.icon}</span>
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
                      <span className="text-green-600 text-sm font-medium flex items-center animate-pulse">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Acontecendo agora
                      </span>
                    )}
                  </div>

                  {/* Informações adicionais baseadas no status */}
                  {status.status === 'futuro' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        <strong>Próximo evento!</strong> Prepare-se para participar.
                      </p>
                    </div>
                  )}
                  
                  {status.status === 'passado' && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 text-sm">
                        <strong>Evento concluído!</strong> Obrigado por participar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Estatísticas */}
      {inscricoes.length > 0 && (
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo das Inscrições</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{contadores.todos}</div>
              <div className="text-sm text-blue-800">Total</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{contadores.futuros}</div>
              <div className="text-sm text-blue-800">Futuros</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{contadores.acontecendo}</div>
              <div className="text-sm text-green-800">Acontecendo</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{contadores.passados}</div>
              <div className="text-sm text-gray-800">Concluídos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
