import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Base de datos
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:@127.0.0.1:3306/unimarket"
    )

    # JWT & Seguridad
    SECRET_KEY: str = os.getenv("SECRET_KEY", "unimarket_secret_key_change_in_production_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Redis Cache
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB: int = int(os.getenv("REDIS_DB", 0))

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176"
        ).split(",") 
        if origin.strip()
    ]

settings = Settings()
