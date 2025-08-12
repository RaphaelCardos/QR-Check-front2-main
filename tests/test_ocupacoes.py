import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from qrcheck.models.ParticipanteModels import Ocupacao

pytestmark = pytest.mark.asyncio


async def test_lista_ocupacoes(client: TestClient, session: AsyncSession):
    # Criar algumas ocupações de teste
    ocupacao1 = Ocupacao(nome="Desenvolvedor")
    ocupacao2 = Ocupacao(nome="Designer")

    # Adicionar as ocupações diretamente à sessão
    session.add_all([ocupacao1, ocupacao2])
    await session.commit()  # Certifique-se de fazer commit assíncrono

    # Testar a rota de listagem
    response = client.get("/ocupacoes/listar")
    HTTP_OK = 200
    assert response.status_code == HTTP_OK
    data = response.json()
    assert len(data) >= 2  # noqa: PLR2004
    assert any(ocupacao["nome"] == "Desenvolvedor" for ocupacao in data)
    assert any(ocupacao["nome"] == "Designer" for ocupacao in data)


async def test_acessa_ocupacao(client: TestClient, session: AsyncSession):
    # Criar uma ocupação de teste
    ocupacao = Ocupacao(nome="Teste Acesso")
    session.add(ocupacao)
    await session.commit()

    # Testar a rota de acesso
    response = client.get(f"/ocupacoes/{ocupacao.id}")
    HTTP_OK = 200
    assert response.status_code == HTTP_OK
    data = response.json()
    assert data["nome"] == "Teste Acesso"

    # Testar acesso a ocupação inexistente
    response = client.get("/ocupacoes/99999")
    HTTP_NOT_FOUND = 404
    assert response.status_code == HTTP_NOT_FOUND


async def test_cadastra_ocupacao(client: TestClient, session: AsyncSession, admin_token: str):
    # Testar cadastro de uma única ocupação
    headers = {"Authorization": f"Bearer {admin_token}"}
    ocupacao_data = {"nome": "Nova Ocupação"}
    response = client.post("/ocupacoes/cadastrar", json=ocupacao_data, headers=headers)
    HTTP_CREATED = 201
    assert response.status_code == HTTP_CREATED
    data = response.json()
    assert data["nome"] == "Nova Ocupação"

    # Testar cadastro de múltiplas ocupações
    ocupacoes_data = {"nome": ["Ocupação 1", "Ocupação 2"]}
    response = client.post("/ocupacoes/cadastrar", json=ocupacoes_data, headers=headers)
    HTTP_CREATED = 201
    assert response.status_code == HTTP_CREATED

    # Testar cadastro de ocupação duplicada
    response = client.post("/ocupacoes/cadastrar", json=ocupacao_data, headers=headers)
    HTTP_CONFLICT = 409
    assert response.status_code == HTTP_CONFLICT


async def test_atualiza_ocupacao(client: TestClient, session: AsyncSession, admin_token: str):
    # Criar uma ocupação de teste
    ocupacao = Ocupacao(nome="Ocupação Original")
    session.add(ocupacao)
    await session.commit()

    # Testar atualização
    headers = {"Authorization": f"Bearer {admin_token}"}
    update_data = {"nome": "Ocupação Atualizada"}
    response = client.put(f"/ocupacoes/atualizar/{ocupacao.id}", json=update_data, headers=headers)
    HTTP_OK = 200
    assert response.status_code == HTTP_OK
    data = response.json()
    assert data["nome"] == "Ocupação Atualizada"

    # Testar atualização de ocupação inexistente
    response = client.put("/ocupacoes/atualizar/99999", json=update_data, headers=headers)
    HTTP_NOT_FOUND = 404
    assert response.status_code == HTTP_NOT_FOUND


async def test_deleta_ocupacao(client: TestClient, session: AsyncSession, admin_token: str):
    # Criar uma ocupação de teste
    ocupacao = Ocupacao(nome="Ocupação para Deletar")
    session.add(ocupacao)
    await session.commit()

    # Testar deleção
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.delete(f"/ocupacoes/deletar/{ocupacao.id}", headers=headers)
    HTTP_NO_CONTENT = 204
    assert response.status_code == HTTP_NO_CONTENT

    # Verificar se a ocupação foi realmente deletada
    response = client.get(f"/ocupacoes/{ocupacao.id}")
    HTTP_NOT_FOUND = 404
    assert response.status_code == HTTP_NOT_FOUND

    # Testar deleção de ocupação inexistente
    response = client.delete("/ocupacoes/deletar/99999", headers=headers)
    HTTP_NOT_FOUND = 404
    assert response.status_code == HTTP_NOT_FOUND
