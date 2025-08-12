class AsyncPGErrorHandler:
    """Classe base para erros relacionados ao asyncpg."""

    POSTGRESQL_ERRORS = {
        # Classe 00 — Conclusão Bem-Sucedida
        "00000": "Operação concluída com sucesso.",
        # Classe 01 — Aviso
        "01000": "Aviso: operação concluída com advertências.",
        "0100C": "Conjuntos de resultados dinâmicos retornados.",
        "01008": "Preenchimento implícito de bits zero.",
        "01003": "Valor nulo eliminado em função de conjunto.",
        "01007": "Privilégio não concedido.",
        "01006": "Privilégio não revogado.",
        "01004": "Truncamento à direita de dados de string.",
        "01P01": "Recurso obsoleto utilizado.",
        # Classe 02 — Sem Dados
        "02000": "Nenhum dado encontrado.",
        "02001": "Nenhum conjunto de resultados dinâmicos adicionais retornados.",
        # Classe 03 — Declaração SQL Ainda Não Concluída
        "03000": "Declaração SQL ainda não concluída.",
        # Classe 08 — Exceção de Conexão
        "08000": "Exceção de conexão.",
        "08003": "Conexão não existe.",
        "08006": "Falha na conexão.",
        "08001": "Cliente SQL incapaz de estabelecer conexão SQL.",
        "08004": "Servidor SQL rejeitou o estabelecimento da conexão.",
        "08007": "Resolução de transação desconhecida.",
        "08P01": "Violação de protocolo.",
        # Classe 09 — Exceção de Ação Disparada
        "09000": "Exceção de ação disparada.",
        # Classe 0A — Recurso Não Suportado
        "0A000": "Recurso não suportado.",
        # Classe 0B — Início de Transação Inválido
        "0B000": "Início de transação inválido.",
        # Classe 0F — Exceção de Localizador
        "0F000": "Exceção de localizador.",
        "0F001": "Especificação de localizador inválida.",
        # Classe 0L — Concedente Inválido
        "0L000": "Concedente inválido.",
        "0LP01": "Operação de concessão inválida.",
        # Classe 0P — Especificação de Papel Inválida
        "0P000": "Especificação de papel inválida.",
        # Classe 0Z — Exceção de Diagnóstico
        "0Z000": "Exceção de diagnóstico.",
        "0Z002": "Diagnósticos empilhados acessados sem manipulador ativo.",
        # Classe 20 — Caso Não Encontrado
        "20000": "Caso não encontrado.",
        # Classe 21 — Violação de Cardinalidade
        "21000": "Violação de cardinalidade.",
        # Classe 22 — Exceção de Dados
        "22000": "Exceção de dados.",
        "2202E": "Erro de subscrito de array.",
        "22021": "Caractere não presente no repertório.",
        "22008": "Estouro de campo de data/hora.",
        "22012": "Erro de cálculo: divisão por zero detectada.",
        "22005": "Erro na atribuição de valor.",
        "2200B": "Conflito de caractere de escape.",
        "22022": "Estouro de indicador.",
        "22015": "Estouro de campo de intervalo.",
        "2201E": "Argumento inválido para logaritmo.",
        "22014": "Argumento inválido para função ntile.",
        "22016": "Argumento inválido para função nth_value.",
        "2201F": "Argumento inválido para função power.",
        "2201G": "Argumento inválido para função width_bucket.",
        "22018": "Valor de caractere inválido para conversão.",
        "22007": "Formato de data/hora inválido.",
        "22019": "Caractere de escape inválido.",
        "2200D": "Octeto de escape inválido.",
        "22025": "Sequência de escape inválida.",
        "22P06": "Uso não padrão de caractere de escape.",
        "22010": "Valor de parâmetro de indicador inválido.",
        "22023": "Valor de parâmetro inválido.",
        "22013": "Tamanho anterior ou seguinte inválido.",
        "2201B": "Expressão regular inválida.",
        "2201W": "Contagem de linhas inválida na cláusula LIMIT.",
        "2201X": "Contagem de linhas inválida no deslocamento de resultado.",
        "2202H": "Argumento inválido para TABLESAMPLE.",
        "2202G": "Repetição inválida de TABLESAMPLE.",
        "22009": "Valor de deslocamento de fuso horário inválido.",
        "2200C": "Uso inválido de caractere de escape.",
        "2200G": "Incompatibilidade de tipo mais específico.",
        "22004": "Valor nulo não permitido.",
        "22002": "Valor nulo sem parâmetro de indicador.",
        "22003": "Valor numérico fora do intervalo.",
        "2200H": "Limite do gerador de sequência excedido.",
        "22026": "Incompatibilidade de comprimento de dados de string.",
        "22001": "Truncamento à direita de dados de string.",
        "22011": "Erro de substring.",
        "22027": "Erro de trim.",
        "22024": "String C não terminada.",
        "2200F": "String de caractere de comprimento zero.",
        "22P01": "Exceção de ponto flutuante.",
        "22P02": "Representação de texto inválida.",
        "22P03": "Representação binária inválida.",
        "22P04": "Formato de arquivo COPY inválido.",
        "22P05": "Caractere intraduzível.",
        "2200L": "Não é um documento XML.",
        "2200M": "Documento XML inválido.",
        "2200N": "Conteúdo XML inválido.",
        "2200S": "Comentário XML inválido.",
        "2200T": "Instrução de processamento XML inválida.",
        "22030": "Chave duplicada em objeto JSON.",
        "22031": "Argumento inválido para função SQL/JSON de data/hora.",
        "22032": "Texto JSON inválido.",
        "22033": "Subscrito SQL/JSON inválido.",
        "22034": "Mais de um item SQL/JSON encontrado.",
        "22035": "Nenhum item SQL/JSON encontrado.",
        "22036": "Item SQL/JSON não numérico.",
        "22037": "Chaves não únicas em objeto JSON.",
        "22038": "Item único SQL/JSON requerido.",
        "22039": "Array SQL/JSON não encontrado.",
        "2203A": "Membro SQL/JSON não encontrado.",
        "2203B": "Número SQL/JSON não encontrado.",
        "2203C": "Objeto SQL/JSON não encontrado.",
        "2203D": "Muitos elementos em array JSON.",
        "2203E": "Muitos membros em objeto JSON.",
        "2203F": "Escalar SQL/JSON requerido.",
        "2203G": "Item SQL/JSON não pode ser convertido para o tipo alvo.",
        # Classe 23 — Violação de Restrição de Integridade
        "23000": "Violação de restrição de integridade.",
        "23001": "Violação de restrição de tipo RESTRICT.",
        "23502": "Violação de restrição NOT NULL.",
        "23503": "Violação de chave estrangeira.",
        "23505": "Valor já existente no sistema. Não é permitido duplicidade.",
        "23514": "Violação de restrição CHECK.",
        "23P01": "Violação de exclusão.",
        # Classe 24 — Estado de Cursor Inválido
        "24000": "Estado de cursor inválido.",
        # Classe 25 — Estado de Transação Inválido
        "25000": "Estado de transação inválido.",
        "25001": "Transação SQL ativa.",
        "25002": "Transação de ramo já ativa.",
        "25008": "Cursor mantido requer mesmo nível de isolamento.",
        "25003": "Modo de acesso inadequado para transação de ramo.",
        "25004": "Nível de isolamento inadequado para transação de ramo.",
        "25005": "Nenhuma transação SQL ativa para transação de ramo.",
        "25006": "Transação SQL somente leitura.",
        "25007": "Mistura de instruções de esquema e dados não suportada.",
        "25P01": "Nenhuma transação SQL ativa.",
        "25P02": "Em transação SQL com falha.",
        "25P03": "Sessão inativa em transação com tempo limite.",
        "25P04": "Tempo limite de transação excedido.",
        # Classe 26 — Nome de Declaração SQL Inválido
        "26000": "Nome de declaração SQL inválido.",
        # Classe 27 — Violação de Alteração de Dados Disparada
        "27000": "Violação de alteração de dados disparada.",
        # Classe 28 — Especificação de Autorização Inválida
        "28000": "Especificação de autorização inválida.",
        "28P01": "Senha inválida.",
        # Classe 2B — Descritores de Privilégio Dependentes Ainda Existem
        "2B000": "Descritores de privilégio dependentes ainda existem.",
        "2BP01": "Objetos dependentes ainda existem.",
        # Classe 2D — Término de Transação Inválido
        "2D000": "Término de transação inválido.",
        # Classe 2F — Exceção de Rotina SQL
        "2F000": "Exceção de rotina SQL.",
        "2F005": "Função executada sem instrução RETURN.",
        "2F002": "Função não retornou valor.",
        "2F003": "Função não retornou valor esperado.",
    }


# def get_postgresql_error_message(code: str) -> str:
#     """Obtém a mensagem de erro traduzida a partir do código SQLSTATE."""
#     return AsyncPGErrorHandler.POSTGRESQL_ERRORS.get(code, "Erro desconhecido no PostgreSQL.")


# def logger_asyncpg_error(error: asyncpg.PostgresError) -> None:
#     """Registra o erro do asyncpg."""
#     code = getattr(error, 'sqlstate', None)
#     message = AsyncPGErrorHandler.POSTGRESQL_ERRORS.get(code, "Erro desconhecido no PostgreSQL.")
#     logger.error(f"Erro PostgreSQL ({code}): {message}")
#     logger.debug(f"Detalhes técnicos: {error}")
