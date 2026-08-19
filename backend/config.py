import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Base de datos con normalización automática de dialectos
    _raw_db_url: str = os.getenv(
        "DATABASE_URL", 
        "mysql+pymysql://root:@127.0.0.1:3306/unimarket"
    )
    if _raw_db_url.startswith("mysql://"):
        DATABASE_URL = _raw_db_url.replace("mysql://", "mysql+pymysql://", 1)
    elif _raw_db_url.startswith("postgres://"):
        DATABASE_URL = _raw_db_url.replace("postgres://", "postgresql+psycopg2://", 1)
    else:
        DATABASE_URL = _raw_db_url

    # JWT & Seguridad
    SECRET_KEY: str = os.getenv("SECRET_KEY", "senamarket_secret_key_prod_2026")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

    # Google OAuth
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    # Redis Cache (opcional en Render)
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB: int = int(os.getenv("REDIS_DB", 0))

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5176,http://127.0.0.1:5176,https://senamarket.onrender.com"
        ).split(",") 
        if origin.strip()
    ]

settings = Settings()
