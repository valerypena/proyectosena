from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum
from decimal import Decimal

# Enums
class RolUsuarioEnum(str, Enum):
    COMPRADOR = "COMPRADOR"
    VENDEDOR = "VENDEDOR"
    ADMINISTRADOR = "ADMINISTRADOR"

# --- SCEMAS COMUNES ---

# --- USUARIOS ---
class UsuarioBase(BaseModel):
    email: EmailStr
    nombre_completo: str
    rol: RolUsuarioEnum = RolUsuarioEnum.COMPRADOR
    documento: Optional[str] = None
    ocupacion: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    contrasena: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    contrasena: str

class UsuarioUpdate(BaseModel):
    nombre_completo: Optional[str] = None
    email: Optional[EmailStr] = None
    contrasena: Optional[str] = None
    documento: Optional[str] = None
    ocupacion: Optional[str] = None
    rol: Optional[RolUsuarioEnum] = None

class UsuarioOut(UsuarioBase):
    id: int
    creado_en: datetime

    class Config:
        from_attributes = True

# --- DIRECCIONES ---
class DireccionBase(BaseModel):
    calle: str
    numero: str
    piso_depto: Optional[str] = None
    ciudad: str
    provincia: str
    codigo_postal: Optional[str] = None
    referencias: Optional[str] = None
    telefono_contacto: str

class DireccionCreate(DireccionBase):
    pass

class DireccionOut(DireccionBase):
    id: int
    usuario_id: int
    creado_en: datetime

    class Config:
        from_attributes = True

# --- TARJETAS ---
class TarjetaCreate(BaseModel):
    numero_completo: str # Solo para "validar" y extraer ultimos 4
    marca: str
    nombre_titular: str
    fecha_vencimiento: str # MM/YY
    cvv: str

class TarjetaOut(BaseModel):
    id: int
    numero_ultimos_4: str
    marca: str
    nombre_titular: str
    creado_en: datetime

    class Config:
        from_attributes = True

# --- CATEGORIAS ---
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class CategoriaOut(CategoriaBase):
    id: int

    class Config:
        from_attributes = True

# --- EMPRENDIMIENTOS ---
class EmprendimientoBase(BaseModel):
    nombre_marca: str
    descripcion: Optional[str] = None
    url_logo: Optional[str] = None

class EmprendimientoCreate(EmprendimientoBase):
    pass

class EmprendimientoOut(EmprendimientoBase):
    id: int
    usuario_id: int
    creado_en: datetime

    class Config:
        from_attributes = True

# --- PRODUCTOS ---
class ProductoBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: Decimal
    cantidad_stock: int
    url_imagen: Optional[str] = None
    categoria_id: Optional[int] = None

class ProductoCreate(ProductoBase):
    # El emprendimiento se asocia automáticamente al usuario vendedor logueado
    pass

    class Config:
        from_attributes = True

# --- PREGUNTAS ---
class PreguntaBase(BaseModel):
    pregunta: str

class PreguntaCreate(PreguntaBase):
    pass

class PreguntaResponder(BaseModel):
    respuesta: str

class PreguntaOut(PreguntaBase):
    id: int
    usuario_id: int
    producto_id: int
    respuesta: Optional[str] = None
    creado_en: datetime
    respondido_en: Optional[datetime] = None
    usuario: UsuarioOut

    class Config:
        from_attributes = True

class ProductoOut(ProductoBase):
    id: int
    emprendimiento_id: int
    creado_en: datetime
    nombre_categoria: Optional[str] = None 
    categoria: Optional[CategoriaOut] = None 
    resenas: List['ResenaOut'] = []
    preguntas: List[PreguntaOut] = []
    promedio_calificacion: Optional[float] = 0
    
    class Config:
        from_attributes = True

# Token JWT
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class SocialLoginRequest(BaseModel):
    token: str
    provider: str # google o facebook

# --- CARRITO DE COMPRAS ---
class ItemCarritoBase(BaseModel):
    producto_id: int
    cantidad: int

class ItemCarritoCreate(ItemCarritoBase):
    pass

class ItemCarritoOut(ItemCarritoBase):
    id: int
    usuario_id: int
    agregado_en: datetime
    # Opcional: Incluir detalles del producto para mostrar en el frontend
    producto: Optional[ProductoOut] = None

    class Config:
        from_attributes = True

# --- COMPRAS (ORDENES) ---
class ItemCompraBase(BaseModel):
    producto_id: int
    cantidad: int
    precio_al_comprar: Decimal

    class Config:
        from_attributes = True

class ItemCompraOut(ItemCompraBase):
    id: int
    producto: Optional[ProductoOut] = None
    
    class Config:
        from_attributes = True

class CompraBase(BaseModel):
    pass

class CheckoutRequest(BaseModel):
    direccion_id: int
    metodo_pago: str
    tarjeta_id: Optional[int] = None # Opcional si es tarjeta guardada

class CompraOut(CompraBase):
    id: int
    usuario_id: int
    monto_total: Decimal
    estado: str # Enum como str
    creado_en: datetime
    direccion_id: Optional[int] = None
    metodo_pago: Optional[str] = None
    direccion: Optional[DireccionOut] = None
    items: List[ItemCompraOut] = []

    class Config:
        from_attributes = True

# --- RESEÑAS ---
class ResenaBase(BaseModel):
    calificacion: int
    comentario: Optional[str] = None

class ResenaCreate(ResenaBase):
    compra_id: int # Para validar que compró el producto

class ResenaOut(ResenaBase):
    id: int
    usuario_id: int
    producto_id: int
    creado_en: datetime
    usuario: UsuarioOut # Para mostrar quien comentó

    class Config:
        from_attributes = True
