from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, Text, Enum, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base

# Definición de Enums para restringir valores
class RolUsuario(str, enum.Enum):
    COMPRADOR = "COMPRADOR"
    VENDEDOR = "VENDEDOR"
    ADMINISTRADOR = "ADMINISTRADOR"

class EstadoCompra(str, enum.Enum):
    PENDIENTE = "PENDIENTE"
    PAGADO = "PAGADO"
    ENVIADO = "ENVIADO"
    ENTREGADO = "ENTREGADO"

# Modelo de Usuario
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre_completo = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    contrasena_hash = Column(String(255), nullable=False)
    documento = Column(String(20), nullable=True)
    ocupacion = Column(String(100), nullable=True)
    rol = Column(Enum(RolUsuario), default=RolUsuario.COMPRADOR)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    emprendimientos = relationship("Emprendimiento", back_populates="propietario", cascade="all, delete-orphan")
    items_carrito = relationship("ItemCarrito", back_populates="usuario", cascade="all, delete-orphan")
    compras = relationship("Compra", back_populates="usuario")
    resenas = relationship("Resena", back_populates="usuario")
    direcciones = relationship("Direccion", back_populates="usuario", cascade="all, delete-orphan")
    tarjetas = relationship("Tarjeta", back_populates="usuario", cascade="all, delete-orphan")
    preguntas = relationship("Pregunta", back_populates="usuario", cascade="all, delete-orphan")

# Modelo de Direccion
class Direccion(Base):
    __tablename__ = "direcciones"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    codigo_postal = Column(String(10), nullable=True)
    provincia = Column(String(50), nullable=False)
    ciudad = Column(String(50), nullable=False)
    calle = Column(String(100), nullable=False)
    numero = Column(String(10), nullable=False)
    piso_depto = Column(String(20), nullable=True)
    referencias = Column(Text, nullable=True)
    telefono_contacto = Column(String(20), nullable=False)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    
    usuario = relationship("Usuario", back_populates="direcciones")

# Modelo de Tarjeta (Simplificado para Demo)
class Tarjeta(Base):
    __tablename__ = "tarjetas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    numero_ultimos_4 = Column(String(4), nullable=False)
    marca = Column(String(20), nullable=False) # Visa, Mastercard
    nombre_titular = Column(String(100), nullable=False)
    # En un caso real, no guardamos la fecha completa ni el cvv aqui.
    # Solo guardamos token. Simularemos guardando info basica.
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    usuario = relationship("Usuario", back_populates="tarjetas")

# Modelo de Emprendimiento (Perfil Vendedor)
class Emprendimiento(Base):
    __tablename__ = "emprendimientos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre_marca = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    url_logo = Column(String(255), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    propietario = relationship("Usuario", back_populates="emprendimientos")
    productos = relationship("Producto", back_populates="emprendimiento", cascade="all, delete-orphan")

# Modelo de Categoría
class Categoria(Base):
    __tablename__ = "categorias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), unique=True, nullable=False)
    descripcion = Column(Text, nullable=True)

    # Relaciones
    productos = relationship("Producto", back_populates="categoria")

# Modelo de Producto
class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    emprendimiento_id = Column(Integer, ForeignKey("emprendimientos.id"), nullable=False)
    categoria_id = Column(Integer, ForeignKey("categorias.id"), nullable=True)
    nombre = Column(String(150), nullable=False)
    descripcion = Column(Text, nullable=True)
    precio = Column(DECIMAL(10, 2), nullable=False)
    cantidad_stock = Column(Integer, default=0, nullable=False)
    url_imagen = Column(String(255), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    emprendimiento = relationship("Emprendimiento", back_populates="productos")
    categoria = relationship("Categoria", back_populates="productos")
    items_carrito = relationship("ItemCarrito", back_populates="producto", cascade="all, delete-orphan")
    items_compra = relationship("ItemCompra", back_populates="producto")
    resenas = relationship("Resena", back_populates="producto")
    preguntas = relationship("Pregunta", back_populates="producto", cascade="all, delete-orphan")

# Modelo de Carrito de Compras
class ItemCarrito(Base):
    __tablename__ = "items_carrito"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, default=1, nullable=False)
    agregado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="items_carrito")
    producto = relationship("Producto", back_populates="items_carrito")

# Modelo de Compra (Orden)
class Compra(Base):
    __tablename__ = "compras"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    monto_total = Column(DECIMAL(10, 2), nullable=False)
    estado = Column(Enum(EstadoCompra), default=EstadoCompra.PENDIENTE)
    direccion_id = Column(Integer, ForeignKey("direcciones.id"), nullable=True)
    metodo_pago = Column(String(50), nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="compras")
    direccion = relationship("Direccion")
    items = relationship("ItemCompra", back_populates="compra", cascade="all, delete-orphan")

# Detalle de Compra
class ItemCompra(Base):
    __tablename__ = "items_compra"

    id = Column(Integer, primary_key=True, index=True)
    compra_id = Column(Integer, ForeignKey("compras.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    cantidad = Column(Integer, nullable=False)
    precio_al_comprar = Column(DECIMAL(10, 2), nullable=False)

    # Relaciones
    compra = relationship("Compra", back_populates="items")
    producto = relationship("Producto", back_populates="items_compra")

# Reseñas
class Resena(Base):
    __tablename__ = "resenas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    calificacion = Column(Integer, nullable=False) 
    comentario = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="resenas")
    producto = relationship("Producto", back_populates="resenas")

# Modelo de Preguntas y Respuestas
class Pregunta(Base):
    __tablename__ = "preguntas"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    producto_id = Column(Integer, ForeignKey("productos.id"), nullable=False)
    pregunta = Column(Text, nullable=False)
    respuesta = Column(Text, nullable=True)
    creado_en = Column(DateTime(timezone=True), server_default=func.now())
    respondido_en = Column(DateTime(timezone=True), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="preguntas")
    producto = relationship("Producto", back_populates="preguntas")
