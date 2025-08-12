# # Carrega IDs importantes do banco de dados para o cache.
# # Isso pode ser útil para evitar consultas repetidas ao banco de dados para obter os mesmos dados.
# # Aqui ou num módulo separado importado
# from sqlalchemy import select

# from qrcheck.database import get_session_sync
# from qrcheck.models.ParticipanteModels import NecessidadeEspecifica, Ocupacao


# class IdsImportantes:
#     def __init__(self):
#         self.ID_NECESSIDADE_OUTRO = None
#         self.ID_OCUPACAO_OUTRO = None

#     def carregar_ids(self):
#         with get_session_sync() as session:
#             outro_id_necessidade = session.scalar(
#                 select(NecessidadeEspecifica.id).where(NecessidadeEspecifica.nome == "Outra(s)")  # <- corrigido aqui
#             )
#             if outro_id_necessidade is None:
#                 raise RuntimeError("A necessidade 'Outro' não foi encontrada no banco de dados.")
#             self.ID_NECESSIDADE_OUTRO = outro_id_necessidade

#             outro_id_ocupacao = session.scalar(
#                 select(Ocupacao.id).where(Ocupacao.nome == "Outra")  # <- corrigido aqui
#             )
#             if outro_id_ocupacao is None:
#                 raise RuntimeError("A ocupação 'Outro' não foi encontrada no banco de dados.")
#             self.ID_OCUPACAO_OUTRO = outro_id_ocupacao


# # Criando uma instância global
# ids_importantes = IdsImportantes()

# # Inicializando os IDs na inicialização da aplicação
# ids_importantes.carregar_ids()


# # CÓDIGO ANTERIOR #####
# # ID_NECESSIDADE_OUTRO = None
# # ID_OCUPACAO_OUTRO = None


# # def carregar_ids_importantes():
# #     with get_session_sync() as session:  # Use uma sessão síncrona
# #         outro_id_necessidade = session.scalar(
# #             select(NecessidadeEspecifica.id).where(NecessidadeEspecifica.nome == "Outro")
# #         )
# #         if outro_id_necessidade is None:
# #             raise RuntimeError("A necessidade 'Outro' não foi encontrada no banco de dados.")

# #         outro_id_ocupacao = session.scalar(
# #             select(NecessidadeEspecifica.id).where(NecessidadeEspecifica.nome == "Outro")
# #         )
# #         if outro_id_ocupacao is None:
# #             raise RuntimeError("A ocupação 'Outro' não foi encontrada no banco de dados.")

# #         return outro_id_necessidade, outro_id_ocupacao

# # # Chamando a função no ambiente síncrono
# # ID_NECESSIDADE_OUTRO, ID_OCUPACAO_OUTRO = carregar_ids_importantes()
