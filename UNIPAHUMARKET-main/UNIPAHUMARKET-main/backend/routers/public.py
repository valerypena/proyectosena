from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload, joinedload
from typing import List, Optional
import models
import schemas
from database import get_db

router = APIRouter(tags=["Catálogo Público"])

# LISTAR CATEGORIAS
@router.get("/categorias", response_model=List[schemas.CategoriaOut])
def listar_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()

# LISTAR EMPRENDIMIENTOS
@router.get("/emprendimientos", response_model=List[schemas.EmprendimientoOut])
def listar_emprendimientos(db: Session = Depends(get_db)):
    return db.query(models.Emprendimiento).all()

from fastapi.encoders import jsonable_encoder
from redis_client import cache

# SUGERENCIAS DE AUTOPROMPTED
@router.get("/sugerencias", response_model=List[str])
def obtener_sugerencias(q: str = "", db: Session = Depends(get_db)):
    if not q or len(q) < 2:
        return []
    
    # Intentar obtener de caché
    cache_key = f"sugerencias:{q.lower()}"
    cached = cache.get(cache_key)
    if cached:
        return cached

    search_fmt = f"%{q}%"
    productos = db.query(models.Producto.nombre).filter(
        models.Producto.nombre.ilike(search_fmt)
    ).limit(10).all()
    
    sugerencias = [p[0] for p in productos]
    
    # Guardar en caché
    cache.set(cache_key, sugerencias, expire=600) # 10 min
    
    return sugerencias

# LISTAR PRODUCTOS (Con filtros)
@router.get("/productos", response_model=List[schemas.ProductoOut])
def listar_productos(
    db: Session = Depends(get_db),
    categoria_id: Optional[int] = None,
    emprendimiento_id: Optional[int] = None,
    busqueda: Optional[str] = None,
    precio_min: Optional[float] = None,
    precio_max: Optional[float] = None,
    orden: Optional[str] = Query(None, description="price_asc, price_desc, newest"),
    skip: int = 0, 
    limit: int = 50
):
    # Intentar obtener de caché
    cache_key = f"productos:list:{categoria_id}:{emprendimiento_id}:{busqueda}:{precio_min}:{precio_max}:{orden}:{skip}:{limit}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    query = db.query(models.Producto).options(
        selectinload(models.Producto.resenas).joinedload(models.Resena.usuario),
        selectinload(models.Producto.preguntas).joinedload(models.Pregunta.usuario),
        selectinload(models.Producto.categoria)
    )
    
    if categoria_id:
        query = query.filter(models.Producto.categoria_id == categoria_id)
    
    if emprendimiento_id:
        query = query.filter(models.Producto.emprendimiento_id == emprendimiento_id)
    
    if busqueda:
        search_fmt = f"%{busqueda}%"
        query = query.filter(
            (models.Producto.nombre.ilike(search_fmt)) | 
            (models.Producto.descripcion.ilike(search_fmt))
        )

    if precio_min is not None:
        query = query.filter(models.Producto.precio >= precio_min)
    if precio_max is not None:
        query = query.filter(models.Producto.precio <= precio_max)

    # Ordenamiento
    if orden == "price_asc":
        query = query.order_by(models.Producto.precio.asc())
    elif orden == "price_desc":
        query = query.order_by(models.Producto.precio.desc())
    elif orden == "newest":
        query = query.order_by(models.Producto.creado_en.desc())
        
    productos = query.offset(skip).limit(limit).all()

    # Calcular promedios y asignar nombres de categorías para el schema
    for p in productos:
        # Promedio calificaciones
        if p.resenas:
            p.promedio_calificacion = sum(r.calificacion for r in p.resenas) / len(p.resenas)
        else:
            p.promedio_calificacion = 0
            
        # Nombre de categoría (para el campo del schema ProductoOut)
        if p.categoria:
            p.nombre_categoria = p.categoria.nombre

    # Guardar en caché antes de retornar
    # Usamos jsonable_encoder para manejar tipos no serializables como Decimal
    data_to_cache = jsonable_encoder(productos)
    cache.set(cache_key, data_to_cache, expire=300) # 5 minutos

    return productos

# DETALLE DE PRODUCTO
@router.get("/productos/{producto_id}", response_model=schemas.ProductoOut)
def obtener_producto(producto_id: int, db: Session = Depends(get_db)):
    producto = db.query(models.Producto).filter(models.Producto.id == producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
        
    if producto.resenas:
        producto.promedio_calificacion = sum(r.calificacion for r in producto.resenas) / len(producto.resenas)
    else:
        producto.promedio_calificacion = 0
        
    return producto
