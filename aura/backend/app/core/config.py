from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    YOUTUBE_API_KEY: str = ""
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    PEXELS_API_KEY: str = ""
    NEWS_API_KEY: str = ""
    EXCHANGE_API_KEY: str = ""
    CORS_ORIGINS: str = '["http://localhost:5173","http://127.0.0.1:5173"]'

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"

settings = Settings()
