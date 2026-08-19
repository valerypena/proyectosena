from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    # pool_pre_ping ayuda a reconectar si la conexión se pierde
    pool_pre_ping=True 
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependencia para obtener la sesión de BD en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
