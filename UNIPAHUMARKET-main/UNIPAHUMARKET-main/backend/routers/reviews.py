from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db

router = APIRouter(prefix="/resenas", tags=["Reseñas"])

@router.post("/{producto_id}", response_model=schemas.ResenaOut)
def crear_resena(
    producto_id: int,
    resena_in: schemas.ResenaCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    # 1. Verificar si compró el producto y la orden está pagada/entregada
    compra = db.query(models.Compra).filter(
        models.Compra.id == resena_in.compra_id,
        models.Compra.usuario_id == current_user.id
    ).first()

    if not compra:
        raise HTTPException(status_code=400, detail="No se encontró la compra asociada")
    
    # Verificar que el producto esté en esa compra
    item_compra = db.query(models.ItemCompra).filter(
        models.ItemCompra.compra_id == compra.id,
        models.ItemCompra.producto_id == producto_id
    ).first()

    if not item_compra:
        raise HTTPException(status_code=400, detail="Este producto no forma parte de la compra especificada")

    # 2. Verificar si ya dejó reseña para este producto
    existing = db.query(models.Resena).filter(
        models.Resena.usuario_id == current_user.id,
        models.Resena.producto_id == producto_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Ya has publicado una reseña para este producto")

    nueva_resena = models.Resena(
        usuario_id=current_user.id,
        producto_id=producto_id,
        calificacion=resena_in.calificacion,
        comentario=resena_in.comentario
    )
    db.add(nueva_resena)
    db.commit()
    db.refresh(nueva_resena)
    return nueva_resena

@router.get("/producto/{producto_id}", response_model=List[schemas.ResenaOut])
def ver_resenas_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    resenas = db.query(models.Resena).filter(models.Resena.producto_id == producto_id).all()
    return resenas
