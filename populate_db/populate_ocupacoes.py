# Arquivo para popular a tabela de ocupações no banco de dados. Apenas execute e ele populará a tabela com
# as ocupações que não estiverem já registradas na tabela.

from sqlalchemy.orm import Session

from qrcheck.database import get_session_sync
from qrcheck.models.ParticipanteModels import Ocupacao

with get_session_sync() as session:

    ocupacoes = [
    # Educação
    "Estudante",
    "Professor(a)",
    "Pesquisador(a)",
    "Coordenador(a) Educacional",
    "Coordenador(a) Pedagógico(a)",
    "Orientador(a) Educacional",
    "Monitor(a) Escolar",
    "Bibliotecário(a)",
    "Intérprete de Libras",
    "Psicopedagogo(a)",

    # Saúde
    "Médico(a)",
    "Enfermeiro(a)",
    "Técnico(a) de Enfermagem",
    "Técnico(a) em Radiologia",
    "Técnico(a) em Laboratório",
    "Fisioterapeuta",
    "Psicólogo(a)",
    "Terapeuta Ocupacional",
    "Nutricionista",
    "Farmacêutico(a)",
    "Dentista (Cirurgião-Dentista)",
    "Fonoaudiólogo(a)",
    "Assistente Social",
    "Cuidador(a) de Idosos",
    "Agente Comunitário de Saúde",

    # Tecnologia da Informação
    "Desenvolvedor(a) de Software",
    "Engenheiro(a) de Computação",
    "Engenheiro(a) de Software",
    "Analista de Dados",
    "Cientista de Dados",
    "Administrador(a) de Redes",
    "Técnico(a) em TI",
    "Técnico(a) em Suporte Técnico",
    "Especialista em Segurança da Informação",
    "Designer UX/UI",
    "Especialista em Acessibilidade Digital",

    # Direito e Justiça
    "Advogado(a)",
    "Defensor(a) Público(a)",
    "Juiz(a)",
    "Promotor(a) de Justiça",
    "Assistente Jurídico",
    "Delegado(a) de Polícia",
    "Oficial de Justiça",

    # Artes, Cultura e Comunicação
    "Artista Plástico(a)",
    "Ator/Atriz",
    "Músico(a)",
    "Escritor(a)",
    "Jornalista",
    "Publicitário(a)",
    "Produtor(a) Cultural",
    "Produtor(a) de Eventos",
    "Cineasta",
    "Ilustrador(a)",
    "Fotógrafo(a)",

    # Engenharia e Construção Civil
    "Engenheiro(a) Civil",
    "Arquiteto(a)",
    "Mestre de Obras",
    "Técnico(a) em Edificações",
    "Operador(a) de Máquinas",
    "Pedreiro(a)",
    "Encanador(a)",
    "Pintor(a)",
    "Eletricista",
    "Mecânico(a)",
    "Técnico(a) em Manutenção",

    # Comércio e Serviços
    "Vendedor(a)",
    "Caixa",
    "Atendente de Telemarketing",
    "Representante Comercial",
    "Gerente de Loja",
    "Supervisor(a) de Atendimento",
    "Secretário(a) Executivo(a)",
    "Trabalhador(a) Doméstico(a)",

    # Transporte e Logística
    "Motorista",
    "Entregador",
    "Piloto(a)",
    "Técnico(a) em Logística",
    "Agente de Transporte",
    "Controlador(a) de Tráfego",

    # Meio Ambiente e Agropecuária
    "Engenheiro(a) Ambiental",
    "Engenheiro(a) Agrônomo(a)",
    "Técnico(a) em Gestão Ambiental",
    "Técnico(a) Agrícola",
    "Biólogo(a)",
    "Produtor(a) Rural",

    # Administração e Negócios
    "Administrador(a)",
    "Contador(a)",
    "Consultor(a) de Negócios",
    "Gestor(a) de Projetos",
    "Analista Administrativo(a)",
    "Empreendedor(a)",
    "Autônomo(a)",
    "Freelancer",

    # Social e Comunitário
    "Educador(a) Social",
    "Mediador(a) de Conflitos",

    # Situação Atual
    "Desempregado(a)",
    "Outra"
]


# Inserindo ocupações sem duplicar
for nome_ocupacao in ocupacoes:
    ocupacao_existente = session.query(Ocupacao).filter_by(nome=nome_ocupacao).first()
    if not ocupacao_existente:
        session.add(Ocupacao(nome=nome_ocupacao, is_custom=False))

# Commit final
session.commit()
session.close()

print("Ocupações inseridas com sucesso!")
