from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
import auth
import models
import schemas
from database import get_db
import os
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import secrets
import string

router = APIRouter(prefix="/auth", tags=["Auth"])

# REGISTRO
@router.post("/registro", response_model=schemas.UsuarioOut)
def registrar_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar si email ya existe
    db_user = db.query(models.Usuario).filter(models.Usuario.email == usuario.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Crear usuario
    hashed_password = auth.hash_contrasena(usuario.contrasena)
    nuevo_usuario = models.Usuario(
        email=usuario.email,
        nombre_completo=usuario.nombre_completo,
        contrasena_hash=hashed_password,
        rol=usuario.rol
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

# LOGIN (Endpoint estandar para OAuth2)
@router.post("/token", response_model=schemas.Token)
def login_para_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.email == form_data.username).first()
    if not usuario or not auth.verificar_contrasena(form_data.password, usuario.contrasena_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.crear_access_token(data={"sub": usuario.email})
    return {"access_token": access_token, "token_type": "bearer"}

# INFO USUARIO ACTUAL
@router.get("/me", response_model=schemas.UsuarioOut)
def leer_usuario_actual(current_user: models.Usuario = Depends(auth.obtener_usuario_actual)):
    return current_user

@router.put("/me", response_model=schemas.UsuarioOut)
def actualizar_usuario(
    usuario_update: schemas.UsuarioUpdate, 
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    if usuario_update.nombre_completo:
        current_user.nombre_completo = usuario_update.nombre_completo
    
    if usuario_update.documento:
        current_user.documento = usuario_update.documento
        
    if usuario_update.ocupacion:
        current_user.ocupacion = usuario_update.ocupacion

    if usuario_update.rol is not None and usuario_update.rol != current_user.rol:
        if current_user.rol != models.RolUsuario.ADMINISTRADOR:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para modificar tu rol de usuario"
            )
        current_user.rol = usuario_update.rol
    
    if usuario_update.email and usuario_update.email != current_user.email:
        # Verificar si ya existe otro usuario con ese email
        existe = db.query(models.Usuario).filter(models.Usuario.email == usuario_update.email).first()
        if existe:
            raise HTTPException(status_code=400, detail="Este email ya está en uso")
        current_user.email = usuario_update.email
        
    if usuario_update.contrasena:
        current_user.contrasena_hash = auth.hash_contrasena(usuario_update.contrasena)
        
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/social-login", response_model=schemas.Token)
def social_login(login_request: schemas.SocialLoginRequest, db: Session = Depends(get_db)):
    email = None
    nombre = None

    if login_request.provider == "google":
        try:
            # Intentar verificar como ID Token (JWT)
            client_id = os.getenv("GOOGLE_CLIENT_ID") 
            # Si el token no es un JWT, esto fallará rápido
            idinfo = id_token.verify_oauth2_token(login_request.token, google_requests.Request(), client_id)
            email = idinfo['email']
            nombre = idinfo.get('name')
        except ValueError:
            # Si falla, intentar como Access Token llamando a userinfo
            try:
                response = requests.get(f"https://www.googleapis.com/oauth2/v1/userinfo?access_token={login_request.token}")
                if response.status_code == 200:
                    data = response.json()
                    email = data.get('email')
                    nombre = data.get('name')
                else:
                     raise HTTPException(status_code=400, detail="Token de Google inválido (Access Token)")
            except Exception:
                 raise HTTPException(status_code=400, detail="Token de Google inválido")
    
    elif login_request.provider == "facebook":
        # Para Facebook, el token enviado es el access_token
        try:
            response = requests.get(f"https://graph.facebook.com/me?access_token={login_request.token}&fields=id,name,email")
            if response.status_code != 200:
                raise HTTPException(status_code=400, detail="Token de Facebook inválido")
            data = response.json()
            email = data.get('email')
            nombre = data.get('name')
            if not email:
                 # Facebook a veces no devuelve email si el usuario no lo verifica o usa telefono
                 raise HTTPException(status_code=400, detail="No se pudo obtener el email de Facebook. Asegúrate de tener un email verificado.")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error validando Facebook: {str(e)}")
            
    else:
        raise HTTPException(status_code=400, detail="Proveedor no soportado")

    if not email:
        raise HTTPException(status_code=400, detail="No se pudo obtener el email del proveedor")

    # Verificar si existe el usuario
    user = db.query(models.Usuario).filter(models.Usuario.email == email).first()
    if not user:
        # Crear usuario si no existe
        alphabet = string.ascii_letters + string.digits
        password = ''.join(secrets.choice(alphabet) for i in range(16))
        hashed_password = auth.hash_contrasena(password)
        
        user = models.Usuario(
            email=email,
            nombre_completo=nombre or email.split('@')[0],
            contrasena_hash=hashed_password,
            rol=schemas.RolUsuarioEnum.COMPRADOR
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    access_token = auth.crear_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
