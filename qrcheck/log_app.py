import os

from loguru import logger

# from qrcheck.handlers.postgresql_handler import get_postgresql_error_message

# Configuração do Loguru
# logger.add("logs/eventos/{evento.id}/evento_log", rotation="10 MB", level="INFO")


def get_logger_acessos():
    # Define o caminho para o diretório de logs do sistema
    # e cria o diretório se ele não existir
    log_dir = "logs/acessos"

    # Cria o diretório se ele não existir
    os.makedirs(log_dir, exist_ok=True)

    # Define o caminho do arquivo de log
    log_file = os.path.join(log_dir, "acessos.log")

    # Remove qualquer configuração anterior (evita logs duplicados)
    logger.remove()

    # Adiciona um novo destino de log com rotação
    logger.add(log_file, rotation="1 day", level="INFO")

    return logger


def get_logger_participante(participante_id):
    # Define o caminho para o diretório de logs dos participantes
    log_dir = "logs/participantes"

    # Cria o diretório se ele não existir
    os.makedirs(log_dir, exist_ok=True)

    # Define o caminho do arquivo de log
    log_file = os.path.join(log_dir, f"participante_{participante_id}_registry.log")

    # Remove qualquer configuração anterior (evita logs duplicados)
    logger.remove()

    # Adiciona um novo destino de log com rotação
    logger.add(log_file, level="INFO")

    return logger


# # Função para logar erro de banco de dados (geral)
# def logger_database_error(error):
#     log_dir = "logs/database_errors"
#     os.makedirs(log_dir, exist_ok=True)
#     log_file = os.path.join(log_dir, "asyncpg_errors.log")

#     # Configuração do logger (a primeira vez que é configurado)
#     logger.remove()  # Remove o handler anterior
#     logger.add(log_file, rotation="1 day", level="ERROR")  # Adiciona o handler com rotação diária

#     # Registra o erro
#     logger.error(f"Erro no banco de dados: {error}")


# # Função para logar erros específicos do asyncpg (com código e tradução)
# def logger_asyncpg_error(error: asyncpg.PostgresError) -> None:
#     log_dir = "logs/database_errors"
#     os.makedirs(log_dir, exist_ok=True)
#     log_file = os.path.join(log_dir, "asyncpg_errors.log")

#     # Configuração do logger (a primeira vez que é configurado)
#     logger.remove()  # Remove o handler anterior
#     logger.add(log_file, rotation="1 day", level="ERROR")  # Adiciona o handler com rotação diária

#     # Captura o código de erro SQLSTATE e traduz a mensagem
#     code = getattr(error, "sqlstate", None)
#     message = get_postgresql_error_message(code)  # Utilizando a função do postgresql_handler para traduzir o erro

#     # Registra o erro com data e hora
#     timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
#     logger.error(f"[{timestamp}] Erro PostgreSQL ({code}): {message}")
#     logger.debug(f"Detalhes técnicos: {error}")
