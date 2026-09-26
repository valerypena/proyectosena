import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, public, vendors, orders, reviews, user_details, questions

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Crear tablas si no existen
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"[!] Error creando tablas en startup: {e}")
    # 2. Poblar datos iniciales si la base de datos está vacía
    try:
        from database import SessionLocal
        from models import Categoria
        from seed_data import seed_data
        with SessionLocal() as db:
            if db.query(Categoria).count() == 0:
                print("--> Despliegue detectado con catálogo vacío. Inicializando seed_data()...")
                seed_data()
    except Exception as e:
        print(f"[!] Aviso al poblar datos iniciales: {e}")
    yield

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
    title="🛒 SENAMARKET ULTIMATE API",
    description="""
    ## API de Alto Rendimiento para SenaMarket.
    
    Esta plataforma integra una arquitectura moderna con:
    * **Búsquedas Rápidas**: Conexión a catálogo y filtros dinámicos.
    * **Autocompletado Inteligente**: Sugerencias en tiempo real basadas en inventario.
    * **Gestión de Ventas**: Panel completo para vendedores con seguimiento de estados.
    * **Seguridad Robusta**: Autenticación JWT y Roles jerárquicos.
    """,
    version="1.2.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan,
    contact={
        "name": "Soporte Técnico SenaMarket",
        "url": "https://senamarket-web.onrender.com",
    }
)

from config import settings
import os
from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

# Configuración de CORS amplia y compatible para desarrollo y producción
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://.*(localhost|127\.0\.0\.1|onrender\.com)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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

# Servir archivos estáticos del Frontend si existen
frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    @app.get("/", include_in_schema=False)
    def root():
        return {"status": "ok", "api": "SenaMarket", "docs": "/docs", "productos": "/productos"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"
    reload = os.environ.get("ENV", "production").lower() != "production"
    uvicorn.run("main:app", host=host, port=port, reload=reload)

