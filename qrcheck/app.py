import time
from http import HTTPStatus

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from jwt import ExpiredSignatureError, PyJWTError, decode
from user_agents import parse

# from qrcheck.constants import ids_importantes
from qrcheck.handlers.pydantic_handler import http_exception_handler, request_validation_error_handler
from qrcheck.log_app import get_logger_acessos
from qrcheck.routers import (
    AdministradoresRouter,
    AdminParticipantesRouter,
    AuthenticateRouter,
    EventosRouter,
    NecessidadesRouter,
    OcupacoesRouter,
    ParticipantesRouter,
)
from qrcheck.settings import Settings

settings = Settings()


# carregar_ids_importantes()  # Carrega os IDs importantes do banco de dados para o cache.

app = FastAPI(
    swagger_ui_parameters={"docExpansion": "none"},  # Minimiza as seções das rotas no Swagger
)
app.title = "QRCheck"
app.version = "0.1.0"

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Index é a página principal.
@app.get("/", status_code=HTTPStatus.OK, tags=["🏡 Página Inicial"])
def index_page():
    return "Olá, mundo! Eu estou funcionando!"


@app.get("/faq", status_code=HTTPStatus.OK, tags=["🏡 Página Inicial"])
def faq_page():
    return "Perguntas Frequentes..."


@app.get("/sobre", status_code=HTTPStatus.OK, tags=["🏡 Página Inicial"])
def sobre_page():
    return "Sobre o QR Check..."


@app.get("/contato", status_code=HTTPStatus.OK, tags=["🏡 Página Inicial"])
def contato_page():
    return "Entre em contato conosco!..."


# Rota de autenticações:
app.include_router(AuthenticateRouter.router)

# Rota dos participantes:
app.include_router(ParticipantesRouter.router)
# Rota dos participantes (Admin):
app.include_router(AdminParticipantesRouter.router)

# Rota das ocupações:
app.include_router(OcupacoesRouter.router)

# Rota das necessidades específicas:
app.include_router(NecessidadesRouter.router)

# Rota dos eventos:
app.include_router(EventosRouter.router)

# Rotas dos administradores:
app.include_router(AdministradoresRouter.router)


# Middleware para tratamento de exceções e erros de validação
app.add_exception_handler(HTTPException, http_exception_handler)

# Traduzindo os principais erros de validação para português
app.add_exception_handler(RequestValidationError, request_validation_error_handler)

# Manipulador de erro RequestValidationError (erro de validação do Pydantic)
# Traduzindo os principais erros de validação para português


# Middleware para logar as requisições e respostas
@app.middleware("http")
async def log_middleware(request: Request, call_next, logger=get_logger_acessos()):
    start_time = time.time()

    ip = request.headers.get("x-forwarded-for", request.client.host)
    user_agent = request.headers.get("user-agent", "")
    referer = request.headers.get("referer", "")
    query = request.url.query or ""

    # Define o valor padrão para o user_id
    user_id = "Não registrado"
    # Verifica se o token está no cookie ou no header Authorization
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header[len("Bearer ") :]  # remove o 'Bearer ' e pega só o token
    # Se o token estiver presente, decodifica-o
    # e extrai o user_id (sub) do payload
    if token:
        try:
            payload = decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub", "Token sem sub")
        except ExpiredSignatureError:
            user_id = "Token expirado"
        except PyJWTError:
            user_id = "Token inválido"

    # Verifica o user agent e extrai informações do navegador, sistema operacional e dispositivo
    ua = parse(user_agent_string=user_agent)
    navegador = f"{ua.browser.family} {ua.browser.version_string}"
    sistema = f"{ua.os.family} {ua.os.version_string}"
    dispositivo = "Mobile" if ua.is_mobile else "Tablet" if ua.is_tablet else "PC"

    response = await call_next(request)
    duration = round(time.time() - start_time, 3)

    # Loga o IP, ID do usuário (se tiver), método, rota, status, tempo de resposta, navegador, sistema operacional e dispositivo
    logger.info(
        f"IP: {ip} | User: {user_id} | Método: {request.method} | "
        f"Rota: {request.url.path}?{query} | Status: {response.status_code} | "
        f"Tempo: {duration}s | Navegador (User-Agent): {navegador} | SO: {sistema} | "
        f"Dispositivo: {dispositivo} | Referer: {referer}"
    )

    return response
