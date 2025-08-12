# Arquivo para popular a tabela de ocupações no banco de dados. Apenas execute e ele populará a tabela com
# as ocupações que não estiverem já registradas na tabela.

from sqlalchemy.orm import Session

from qrcheck.database import get_session_sync
from qrcheck.models.ParticipanteModels import NecessidadeEspecifica

with get_session_sync() as session:

    necessidades_especificas = [
    # Deficiências
    "Deficiência auditiva",
    "Deficiência visual",
    "Deficiência física",
    "Deficiência intelectual",
    "Deficiência múltipla",
    "Deficiência de fala",

    # Transtornos e Neurodivergências
    "Autismo",
    "Transtornos do espectro autista (TEA)",
    "Síndrome de Asperger",  # ainda usado em alguns contextos
    "Déficit de atenção (TDA/TDAH)",
    "Dificuldade de aprendizagem",
    "Transtornos de saúde mental",

    # Síndromes específicas
    "Síndrome de Down",
    "Síndrome de West",
    "Síndrome de Rett",
    "Síndrome de Angelman",
    "Síndrome de Prader-Willi",
    "Síndrome de Williams",
    "Síndrome de Turner",

    # Condições crônicas de saúde
    "Doença crônica",
    "Diabetes",
    "Epilepsia",

    # Mobilidade e acessibilidade
    "Mobilidade reduzida",
    "Uso de cadeiras de rodas",

    # Apoio e suporte
    "Requisição de apoio psicológico",

    # Outros
    "Outra(s)"
]


# Inserindo ocupações sem duplicar
for nome_necessidade in necessidades_especificas:
    necessidade_existente = session.query(NecessidadeEspecifica).filter_by(nome=nome_necessidade).first()
    if not necessidade_existente:
        session.add(NecessidadeEspecifica(nome=nome_necessidade, is_custom=False))

# Commit final
session.commit()
session.close()

print("Nececessidades específicas inseridas com sucesso!")
