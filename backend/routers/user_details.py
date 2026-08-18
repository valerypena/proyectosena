from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/perfil", tags=["Perfil de Usuario"])

# --- DIRECCIONES ---

@router.get("/direcciones", response_model=List[schemas.DireccionOut])
def listar_direcciones(
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    return current_user.direcciones

@router.post("/direcciones", response_model=schemas.DireccionOut)
def crear_direccion(
    direccion: schemas.DireccionCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    nueva_direccion = models.Direccion(
        usuario_id=current_user.id,
        calle=direccion.calle,
        numero=direccion.numero,
        piso_depto=direccion.piso_depto,
        ciudad=direccion.ciudad,
        provincia=direccion.provincia,
        codigo_postal=direccion.codigo_postal,
        referencias=direccion.referencias,
        telefono_contacto=direccion.telefono_contacto
    )
    db.add(nueva_direccion)
    db.commit()
    db.refresh(nueva_direccion)
    return nueva_direccion

@router.delete("/direcciones/{id}")
def eliminar_direccion(
    id: int,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    direccion = db.query(models.Direccion).filter(
        models.Direccion.id == id, 
        models.Direccion.usuario_id == current_user.id
    ).first()
    
    if not direccion:
        raise HTTPException(status_code=404, detail="Dirección no encontrada")
        
    db.delete(direccion)
    db.commit()
    return {"mensaje": "Dirección eliminada correctamente"}


# --- TARJETAS ---

@router.get("/tarjetas", response_model=List[schemas.TarjetaOut])
def listar_tarjetas(
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    return current_user.tarjetas

@router.post("/tarjetas", response_model=schemas.TarjetaOut)
def agregar_tarjeta(
    tarjeta: schemas.TarjetaCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    # Simulación de validación simple
    if len(tarjeta.numero_completo) < 13:
        raise HTTPException(status_code=400, detail="Número de tarjeta inválido")
        
    last_four = tarjeta.numero_completo[-4:]
    
    nueva_tarjeta = models.Tarjeta(
        usuario_id=current_user.id,
        numero_ultimos_4=last_four,
        marca=tarjeta.marca,
        nombre_titular=tarjeta.nombre_titular
    )
    db.add(nueva_tarjeta)
    db.commit()
    db.refresh(nueva_tarjeta)
    return nueva_tarjeta

@router.delete("/tarjetas/{id}")
def eliminar_tarjeta(
    id: int,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    tarjeta = db.query(models.Tarjeta).filter(
        models.Tarjeta.id == id,
        models.Tarjeta.usuario_id == current_user.id
    ).first()
    
    if not tarjeta:
        raise HTTPException(status_code=404, detail="Tarjeta no encontrada")
        
    db.delete(tarjeta)
    db.commit()
    return {"mensaje": "Tarjeta eliminada correctamente"}
