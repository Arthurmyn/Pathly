from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings, read from environment variables (and an optional .env file)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # No default on purpose: credentials must come from the environment, never from the code.
    database_url: str
    db_pool_min_size: int = 1
    db_pool_max_size: int = 5


@lru_cache
def get_settings() -> Settings:
    return Settings()
