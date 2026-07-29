from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/preguntas", tags=["Preguntas y Respuestas"])

@router.post("/{producto_id}", response_model=schemas.PreguntaOut)
def hacer_pregunta(
    producto_id: int,
    pregunta_in: schemas.PreguntaCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # El vendedor no puede preguntarse a sí mismo
    if producto.emprendimiento.usuario_id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes hacer preguntas en tu propio producto")

    nueva_pregunta = models.Pregunta(
        usuario_id=current_user.id,
        producto_id=producto_id,
        pregunta=pregunta_in.pregunta
    )
    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)
    return nueva_pregunta

@router.put("/responder/{pregunta_id}", response_model=schemas.PreguntaOut)
def responder_pregunta(
    pregunta_id: int,
    respuesta_in: schemas.PreguntaResponder,
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    pregunta = db.query(models.Pregunta).filter(models.Pregunta.id == pregunta_id).first()
    if not pregunta:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    
    # Validar que sea el vendedor el que responde
    if pregunta.producto.emprendimiento.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para responder esta pregunta")

    pregunta.respuesta = respuesta_in.respuesta
    pregunta.respondido_en = models.func.now()
    
    db.commit()
    db.refresh(pregunta)
    return pregunta

@router.get("/vendedor/pendientes", response_model=List[schemas.PreguntaOut])
def preguntas_pendientes_vendedor(
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    # Preguntas de productos del vendedor que no tengan respuesta
    from sqlalchemy.orm import selectinload
    return db.query(models.Pregunta).options(
        selectinload(models.Pregunta.usuario)
    ).join(models.Producto).join(models.Emprendimiento).filter(
        models.Emprendimiento.usuario_id == current_user.id,
        models.Pregunta.respuesta == None
    ).all()
