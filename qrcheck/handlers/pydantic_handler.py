from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic_i18n import PydanticI18n

# Dicionário de mensagens de erro
error_messages = {
    # 400: "Requisição inválida. Verifique os dados enviados.",
    401: "Você não está autenticado ou suas credenciais são inválidas.",
    405: "Método não permitido nesta rota.",
    # 409: "Conflito nos dados enviados. Verifique se a informação já existe.",
    429: "Muitas requisições em um curto período. Tente novamente mais tarde.",
    # 500: "Ocorreu um erro interno no servidor.",
    502: "Erro de gateway inválido. O servidor pode estar sobrecarregado.",
    503: "Serviço temporariamente indisponível. Tente novamente mais tarde.",
    504: "Tempo limite da solicitação excedido. O servidor demorou muito para responder.",
}


# Função manipuladora de exceções HTTP
async def http_exception_handler(request: Request, exc: HTTPException):
    message = error_messages.get(exc.status_code, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": message},
    )


# Dicionário de traduções de erros do Pydantic
traducoes = {
    "field required": "Campo obrigatório.",
    "extra fields not permitted": "Campos adicionais não são permitidos.",
    "none is not an allowed value": "Nulo não é um valor permitido.",
    "value is not none": "Valor não deve ser nulo.",
    "value is not None": "Valor não deve ser nulo.",
    "value could not be parsed to a boolean": "Valor não pôde ser convertido para booleano.",
    "byte type expected": "Era esperado um valor do tipo binário.",
    "value is not a valid bytes": "Valor não é um binário válido.",
    "value is not a valid dict": "Valor não é um dicionário válido.",
    "value is not a valid email address": "Valor não é um endereço de e-mail válido.",
    "value is not a valid email address: The part after the @-sign contains invalid characters: SPACE.": "Valor não é um endereço de e-mail válido: a parte após o sinal @ contém caracteres inválidos: ESPAÇO.",  # noqa: E501
    "value is not a valid email address: The part after the @-sign contains invalid characters: <, >, (, ), [, ], \\, ;, :, \", ', @, or ,": "Valor não é um endereço de e-mail válido: a parte após o sinal @ contém caracteres inválidos: <, >, (, ), [, ], \\, ;, :, \", ', @ ou ,.",  # noqa: E501
    "invalid or missing URL scheme": "Esquema da URL inválido ou ausente.",
    "URL scheme not permitted": "Esquema da URL não permitido.",
    "userinfo required in URL but missing": "Usuário e senha são obrigatórios na URL.",
    "URL path invalid": "Caminho da URL inválido.",
    "URL host invalid": "Domínio inválido.",
    "URL host invalid, top level domain required": "A URL precisa conter um domínio de topo (TLD).",
    "URL port invalid, port cannot exceed 65535": "Porta da URL inválida; não pode exceder 65535.",
    "URL invalid, extra characters found after valid URL: {}": "URL inválida; caracteres extras foram encontrados após a URL válida: {}.",  # noqa: E501
    "{} is not a valid Enum instance": "{} não é uma instância válida de Enum.",
    "{} is not a valid IntEnum instance": "{} não é uma instância válida de IntEnum.",
    "value is not a valid integer": "Valor não é um número inteiro válido.",
    "value is not a valid float": "Valor não é um número decimal válido.",
    "value is not a valid path": "Valor não é um caminho de diretório válido.",
    "file or directory at path '{}' does not exist": "Arquivo ou diretório no caminho '{}' não existe.",
    "path '{}' does not point to a file": "O caminho '{}' não aponta para um arquivo.",
    "path '{}' does not point to a directory": "O caminho '{}' não aponta para um diretório.",
    "ensure this value contains valid import path or valid callable: {}": "Certifique-se de que o valor contenha um caminho de importação ou função válida: {}.",  # noqa: E501
    "value is not a valid sequence": "Valor não é uma sequência válida.",
    "value is not a valid list": "Valor não é uma lista válida.",
    "value is not a valid set": "Valor não é um conjunto válido.",
    "value is not a valid frozenset": "Valor não é um conjunto imutável (frozenset) válido.",
    "value is not a valid tuple": "Valor não é uma tupla válida.",
    "wrong tuple length {}": "Tamanho da tupla incorreto: {}.",
    "ensure this value has at least {} items": "Este campo deve conter no mínimo {} itens.",
    "ensure this value has at most {} items": "Este campo deve conter no máximo {} itens.",
    "the list has duplicated items": "A lista contém itens duplicados.",
    "ensure this value has at least {} characters": "Este campo deve conter no mínimo {} caracteres.",
    "ensure this value has at most {} characters": "Este campo deve conter no máximo {} caracteres.",
    "str type expected": "Era esperado um valor do tipo texto.",
    "string does not match regex '{}'": "A string não corresponde à expressão regular '{}'.",
    "ensure this value is greater than {}": "O valor deve ser maior que {}.",
    "ensure this value is greater than or equal to {}": "O valor deve ser maior ou igual a {}.",
    "ensure this value is less than {}": "O valor deve ser menor que {}.",
    "ensure this value is less than or equal to {}": "O valor deve ser menor ou igual a {}.",
    "ensure this value is a multiple of {}": "O valor deve ser múltiplo de {}.",
    "value is not a valid decimal": "Valor não é um número decimal válido.",
    "ensure that there are no more than {} digits in total": "Não deve haver mais que {} dígitos no total.",
    "ensure that there are no more than {} decimal places": "Não deve haver mais que {} casas decimais.",
    "ensure that there are no more than {} digits before the decimal point": "Não deve haver mais que {} dígitos antes do ponto decimal.",  # noqa: E501
    "invalid datetime format": "Formato de data e hora inválido.",
    "invalid date format": "Formato de data inválido.",
    "date is not in the past": "A data deve estar no passado.",
    "date is not in the future": "A data deve estar no futuro.",
    "invalid time format": "Formato de hora inválido.",
    "invalid duration format": "Formato de duração inválido.",
    "value is not a valid hashable": "Valor não é um tipo válido para ser usado como chave (hashable).",
    "value is not a valid uuid": "Valor não é um UUID válido.",
    "uuid version {} expected": "Era esperado UUID da versão {}.",
    "instance of {} expected": "Era esperada uma instância de {}.",
    "a class is expected": "Era esperada uma classe.",
    "subclass of {} expected": "Era esperada uma subclasse de {}.",
    "Invalid JSON": "JSON inválido.",
    "JSON object must be str, bytes or bytearray": "O JSON deve ser uma string, bytes ou bytearray.",
    "Invalid regular expression": "Expressão regular inválida.",
    "instance of {}, tuple or dict expected": "Era esperada uma instância de {}, tupla ou dicionário.",
    "{} is not callable": "{} não é uma função válida.",
    "value is not a valid color: {}": "Valor não é uma cor válida: {}.",
    "value is not a valid boolean": "Valor deve ser verdadeiro ou falso.",
    "card number is not all digits": "O número do cartão deve conter apenas dígitos.",
    "card number is not luhn valid": "Número do cartão inválido (falha na validação de Luhn).",
    "Length for a {}": "Tamanho inválido para {}.",
    "could not parse value and unit from byte string": "Não foi possível interpretar valor e unidade da sequência binária.",
    "could not interpret byte unit: {}": "Unidade de byte não pôde ser interpretada: {}.",
    "Discriminator {} is missing in value": "Discriminador {} está ausente no valor.",
    "No match for discriminator ({})": "Nenhuma correspondência para o discriminador ({})."
}

IDIOMA = "pt_BR"  # Idioma padrão para as traduções de erros
error_translation = PydanticI18n({"pt_BR": traducoes}, default_locale=IDIOMA)


def traduzir_erro(msg):
    # Tradução flexível para e-mail inválido
    if msg.startswith("value is not a valid email address"):
        return "Valor não é um endereço de e-mail válido."
    # Adicione outros casos flexíveis aqui, se quiser
    return msg


async def request_validation_error_handler(request, exc):
    errors = exc.errors()
    mensagens = []
    for err in errors:
        msg_traduzida = traduzir_erro(err["msg"])
        mensagens.append(msg_traduzida)
    # Se quiser só uma string (primeiro erro), use: mensagens[0]
    return JSONResponse(
        status_code=422,
        content={"detail": mensagens if len(mensagens) > 1 else mensagens[0]},
    )

# async def request_validation_error_handler(request, exc):
#     errors = exc.errors()
#     for err in errors:
#         err["msg"] = traduzir_erro(err["msg"])
#     errors_as_dict = error_translation.translate(errors, IDIOMA)
#     return JSONResponse(
#         status_code=422,
#         content={"detail": errors_as_dict},
#     )
