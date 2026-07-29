from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models
import schemas
import auth
from database import get_db
from models import EstadoCompra

router = APIRouter(prefix="/compras", tags=["Compras y Carrito"])

# --- CARRITO DE COMPRAS ---

@router.get("/carrito", response_model=List[schemas.ItemCarritoOut])
def ver_carrito(
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    return current_user.items_carrito

@router.post("/carrito", response_model=schemas.ItemCarritoOut)
def agregar_al_carrito(
    item: schemas.ItemCarritoCreate,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    # Verificar si el producto existe
    producto = db.query(models.Producto).filter(models.Producto.id == item.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Verificar stock
    if producto.cantidad_stock < item.cantidad:
         raise HTTPException(status_code=400, detail="No hay suficiente stock disponible")

    # Verificar si ya existe en el carrito del usuario
    item_existente = db.query(models.ItemCarrito).filter(
        models.ItemCarrito.usuario_id == current_user.id,
        models.ItemCarrito.producto_id == item.producto_id
    ).first()

    if item_existente:
        # Actualizar cantidad
        item_existente.cantidad += item.cantidad
        db.commit()
        db.refresh(item_existente)
        return item_existente
    else:
        # Crear nuevo item
        nuevo_item = models.ItemCarrito(
            usuario_id=current_user.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad
        )
        db.add(nuevo_item)
        db.commit()
        db.refresh(nuevo_item)
        return nuevo_item

@router.delete("/carrito/{item_id}")
def eliminar_del_carrito(
    item_id: int,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    item = db.query(models.ItemCarrito).filter(
        models.ItemCarrito.id == item_id,
        models.ItemCarrito.usuario_id == current_user.id
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado en el carrito")
    
    db.delete(item)
    db.commit()
    return {"mensaje": "Item eliminado del carrito"}

@router.delete("/carrito")
def vaciar_carrito(
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    # Eliminar todos los items del usuario
    db.query(models.ItemCarrito).filter(models.ItemCarrito.usuario_id == current_user.id).delete()
    db.commit()
    return {"mensaje": "Carrito vaciado"}


# --- ORDENES / CHECKOUT ---

@router.post("/checkout", response_model=schemas.CompraOut)
def realizar_compra(
    checkout_data: schemas.CheckoutRequest,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    # 1. Obtener items del carrito
    items_carrito = db.query(models.ItemCarrito).filter(models.ItemCarrito.usuario_id == current_user.id).all()
    
    if not items_carrito:
        raise HTTPException(status_code=400, detail="El carrito está vacío")
    
    # 2. Calcular total y validar stock nuevamente
    monto_total = 0
    items_compra_data = []
    
    for item in items_carrito:
        producto = item.producto # Usamos la relación
        if producto.cantidad_stock < item.cantidad:
            raise HTTPException(
                status_code=400, 
                detail=f"Stock insuficiente para {producto.nombre}. Disponible: {producto.cantidad_stock}"
            )
        
        monto_total += (producto.precio * item.cantidad)
        items_compra_data.append({
            "producto": producto,
            "cantidad": item.cantidad,
            "precio": producto.precio
        })
    
    # 3. Crear la Compra
    nueva_compra = models.Compra(
        usuario_id=current_user.id,
        monto_total=monto_total,
        estado=EstadoCompra.PENDIENTE,
        direccion_id=checkout_data.direccion_id,
        metodo_pago=checkout_data.metodo_pago
    )
    db.add(nueva_compra)
    db.flush() # Para obtener el ID de la compra antes de commit
    
    # 4. Crear Items de Compra y Descontar Stock
    for data in items_compra_data:
        # Item de Compra
        nuevo_item_compra = models.ItemCompra(
            compra_id=nueva_compra.id,
            producto_id=data["producto"].id,
            cantidad=data["cantidad"],
            precio_al_comprar=data["precio"]
        )
        db.add(nuevo_item_compra)
        
        # Descontar Stock
        data["producto"].cantidad_stock -= data["cantidad"]
        db.add(data["producto"]) # Marcar como modificado
        
    # 5. Vaciar Carrito
    for item in items_carrito:
        db.delete(item)
        
    db.commit()
    db.refresh(nueva_compra)
    return nueva_compra

@router.get("/mis-ordenes", response_model=List[schemas.CompraOut])
def mis_ordenes(
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    return current_user.compras

@router.get("/{orden_id}", response_model=schemas.CompraOut)
def ver_orden(
    orden_id: int,
    current_user: models.Usuario = Depends(auth.obtener_usuario_actual),
    db: Session = Depends(get_db)
):
    orden = db.query(models.Compra).filter(models.Compra.id == orden_id).first()
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
        
    # Validar que sea del usuario (o admin)
    if orden.usuario_id != current_user.id and current_user.rol != models.RolUsuario.ADMINISTRADOR:
         raise HTTPException(status_code=403, detail="No tienes permiso para ver esta orden")
         
    return orden

# --- ENDPOINTS PARA VENDEDOR ---

@router.get("/vendedor/mis-ventas", response_model=List[schemas.CompraOut])
def ver_ventas_vendedor(
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    # Obtener todas las compras que contienen productos de este vendedor
    from sqlalchemy.orm import selectinload, joinedload
    ventas = db.query(models.Compra).options(
        selectinload(models.Compra.items).joinedload(models.ItemCompra.producto)
    ).join(models.ItemCompra).join(models.Producto).join(models.Emprendimiento).filter(
        models.Emprendimiento.usuario_id == current_user.id
    ).distinct().all()
    
    return ventas

@router.put("/vendedor/ordenes/{orden_id}/estado", response_model=schemas.CompraOut)
def actualizar_estado_orden(
    orden_id: int,
    nuevo_estado: models.EstadoCompra,
    current_user: models.Usuario = Depends(auth.obtener_usuario_vendedor),
    db: Session = Depends(get_db)
):
    orden = db.query(models.Compra).filter(models.Compra.id == orden_id).first()
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    # Validar que al menos un producto de la orden sea de este vendedor
    # (En un sistema multi-vendedor real, una orden podria tener productos de varios, 
    # pero aqui simplificamos asumiendo que el vendedor gestiona la orden si tiene items en ella)
    propios = [item for item in orden.items if item.producto.emprendimiento.usuario_id == current_user.id]
    if not propios:
        raise HTTPException(status_code=403, detail="No tienes permiso sobre esta orden")
        
    orden.estado = nuevo_estado
    db.commit()
    db.refresh(orden)
    return orden
