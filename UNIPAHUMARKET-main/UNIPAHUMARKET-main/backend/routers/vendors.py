from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db
from redis_client import cache

router = APIRouter(prefix="/vendedor", tags=["Vendedores"])

# CREAR EMPRENDIMIENTO (Solo si no tiene uno o permitir múltiples?)
# Asumiremos 1 emprendimiento por usuario por simplicidad ahora, o multiples validando.
@router.post("/emprendimientos", response_model=schemas.EmprendimientoOut)
def crear_emprendimiento(
    emprendimiento: schemas.EmprendimientoCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    nuevo_emp = models.Emprendimiento(**emprendimiento.dict(), usuario_id=current_user.id)
    db.add(nuevo_emp)
    db.commit()
    db.refresh(nuevo_emp)
    return nuevo_emp

# MIS EMPRENDIMIENTOS
@router.get("/mis-emprendimientos", response_model=List[schemas.EmprendimientoOut])
def mis_emprendimientos(
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    return current_user.emprendimientos

# CREAR PRODUCTO
@router.post("/productos", response_model=schemas.ProductoOut)
def crear_producto(
    producto: schemas.ProductoCreate,
    emprendimiento_id: int, # El ID del emprendimiento al que pertenece el producto
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    # Validar que el emprendimiento pertenezca al usuario logueado
    emp = db.query(models.Emprendimiento).filter(
        models.Emprendimiento.id == emprendimiento_id,
        models.Emprendimiento.usuario_id == current_user.id
    ).first()
    
    if not emp:
        raise HTTPException(status_code=404, detail="Emprendimiento no encontrado o no te pertenece")
    
    nuevo_prod = models.Producto(**producto.dict(), emprendimiento_id=emprendimiento_id)
    db.add(nuevo_prod)
    db.commit()
    db.refresh(nuevo_prod)
    cache.invalidate_all_products()
    return nuevo_prod

# ACTUALIZAR PRODUCTO
@router.put("/productos/{producto_id}", response_model=schemas.ProductoOut)
def actualizar_producto(
    producto_id: int,
    producto_update: schemas.ProductoCreate, # Reusamos Create o creamos uno Update con optionals
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    # Buscar producto
    producto_db = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
        
    # Verificar que el emprendimiento del producto pertenezca al usuario
    emp = db.query(models.Emprendimiento).filter(
        models.Emprendimiento.id == producto_db.emprendimiento_id,
        models.Emprendimiento.usuario_id == current_user.id
    ).first()
    
    if not emp:
        raise HTTPException(status_code=403, detail="No tienes permiso para editar este producto")
         
    # Actualizar campos
    producto_db.nombre = producto_update.nombre
    producto_db.descripcion = producto_update.descripcion
    producto_db.precio = producto_update.precio
    producto_db.cantidad_stock = producto_update.cantidad_stock
    producto_db.url_imagen = producto_update.url_imagen
    producto_db.categoria_id = producto_update.categoria_id
    
    db.commit()
    db.refresh(producto_db)
    cache.invalidate_all_products()
    return producto_db

# ELIMINAR PRODUCTO
@router.delete("/productos/{producto_id}")
def eliminar_producto(
    producto_id: int,
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    producto_db = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
        
    # Verificar permisos
    emp = db.query(models.Emprendimiento).filter(
        models.Emprendimiento.id == producto_db.emprendimiento_id,
        models.Emprendimiento.usuario_id == current_user.id
    ).first()
    
    if not emp:
         raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este producto")
         
    db.delete(producto_db)
    db.commit()
    cache.invalidate_all_products()
    return {"mensaje": "Producto eliminado exitosamente"}
