import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, public, vendors, orders, reviews, user_details, questions

# Crear tablas si no existen (aunque ya usamos init_db.py, esto es un fallback seguro)
Base.metadata.create_all(bind=engine)

tags_metadata = [
    {"name": "Auth", "description": "Operaciones para registro, inicio de sesión y gestión de tokens."},
    {"name": "Catálogo Público", "description": "Exploración de productos, categorías y emprendimientos para cualquier usuario."},
    {"name": "Perfil de Usuario", "description": "Gestión de direcciones, tarjetas y datos personales."},
    {"name": "Vendedores", "description": "Herramientas para que los vendedores gestionen su tienda y productos."},
    {"name": "Compras y Carrito", "description": "Gestión del carrito de compras y realización de pedidos."},
    {"name": "Reseñas", "description": "Opiniones y calificaciones de productos comprados."},
    {"name": "Preguntas y Respuestas", "description": "Interacción entre compradores y vendedores."},
]

app = FastAPI(
    title="🛒 UNIMARKET ULTIMATE API",
    description="""
    ## API de Alto Rendimiento para Unimarket.
    
    Esta plataforma integra una arquitectura moderna con:
    * **Búsquedas Ultra Rápidas**: Implementadas con Redis Caching.
    * **Autocompletado Inteligente**: Sugerencias en tiempo real basadas en inventario.
    * **Gestión de Ventas**: Panel completo para vendedores con seguimiento de estados.
    * **Seguridad Robusta**: Autenticación JWT y Roles jerárquicos.
    """,
    version="1.2.0",
    openapi_tags=tags_metadata,
    contact={
        "name": "Soporte Técnico Unimarket",
        "url": "http://localhost:5173",
    }
)

from config import settings
import os
from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

# Configuración de CORS segura desde configuración
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manejador global para errores de base de datos
@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    return JSONResponse(
        status_code=500,
        content={"detail": "Error en la capa de persistencia de datos. Operación abortada de forma segura."}
    )
from fastapi.staticfiles import StaticFiles

# Incluir Routers
app.include_router(users.router)   # /auth/registro, /auth/token
app.include_router(public.router)  # /productos, /categorias
app.include_router(vendors.router) # /vendedor/...
app.include_router(orders.router)  # /compras/...
app.include_router(reviews.router) # /resenas/...
app.include_router(user_details.router) # /perfil/direcciones, /perfil/tarjetas
app.include_router(questions.router) # /preguntas/...

# Servir archivos estáticos del Frontend
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

