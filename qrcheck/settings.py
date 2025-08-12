from pydantic_settings import BaseSettings, SettingsConfigDict


# Arquivo de configuração das variáveis do ambiente (mais seguro e flexível para diferentes ambientes de uso)
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL_SYNC: str
    DATABASE_URL_ASYNC: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
