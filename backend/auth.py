from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from database import get_db
from models import Usuario
import schemas

load_dotenv()

# Configuración
SECRET_KEY = os.getenv("SECRET_KEY", "secreto_super_seguro_por_defecto")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# La URL del token debe ser absoluta o correcta relativa
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# --- UTILIDADES DE HASH DE CONTRASEÑA ---
def verificar_contrasena(plain_password, hashed_password):
    # Bcrypt requiere bytes
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_password, hashed_password)

def hash_contrasena(password):
    if isinstance(password, str):
        password = password.encode('utf-8')
    # Generar salt y hashear
    return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

# --- CREACIÓN DE TOKENS ---
def crear_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- DEPENDENCIA PARA OBTENER USUARIO ACTUAL ---
async def obtener_usuario_actual(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(Usuario).filter(Usuario.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

async def obtener_usuario_vendedor(current_user: Usuario = Depends(obtener_usuario_actual)):
    if current_user.rol != "VENDEDOR" and current_user.rol != "ADMINISTRADOR":
        raise HTTPException(status_code=403, detail="Permisos insuficientes. Se requiere rol de Vendedor.")
    return current_user
