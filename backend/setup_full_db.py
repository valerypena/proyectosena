import sys
import os
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
import pymysql
import bcrypt
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import (
    Usuario, Emprendimiento, Categoria, Producto, 
    RolUsuario, Direccion, Tarjeta, Compra, 
    ItemCompra, Resena, Pregunta, EstadoCompra
)
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@127.0.0.1:3306/unimarket")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "") 
DB_NAME = os.getenv("DB_NAME", "unimarket")

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def reset_database():
    print(f"--- 🔄 Preparando Base de Datos: {DB_NAME} ---")
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error al verificar/crear la base de datos MySQL: {e}")
        return False
    
    try:
        # Recrear tablas sin bloquear la base de datos completa
        with engine.connect() as conn:
            conn.exec_driver_sql("SET FOREIGN_KEY_CHECKS = 0;")
            Base.metadata.drop_all(bind=engine)
            Base.metadata.create_all(bind=engine)
            conn.exec_driver_sql("SET FOREIGN_KEY_CHECKS = 1;")
            conn.commit()
        print("✅ Tablas de la base de datos creadas/recreadas limpias.")
        return True
    except Exception as e:
        print(f"❌ Error al recrear tablas: {e}")
        return False

# --- GENERADORES DE DATOS ---

DATA_CONFIG = {
    "Tecnología": {
        "keywords": ["smartphone", "laptop", "tech", "gadget", "computer"],
        "price_range": (500_000, 8_000_000),
        "prefixes": ["Smartphone", "Laptop", "Tablet", "Monitor", "Teclado", "Mouse", "Auriculares", "Reloj Inteligente", "Cámara", "Consola"],
        "adjectives": ["Pro", "Ultra", "Slim", "Gamer", "4K", "Inalámbrico", "Alta Gama", "Económico", "Portátil", "5G"]
    },
    "Moda": {
        "keywords": ["fashion", "clothing", "shirt", "pants", "dress"],
        "price_range": (40_000, 450_000),
        "prefixes": ["Camiseta", "Pantalón", "Vestido", "Chaqueta", "Zapatos", "Gorra", "Bufanda", "Sudadera", "Blusa", "Jeans"],
        "adjectives": ["Casual", "Elegante", "Deportivo", "Vintage", "de Cuero", "Slim Fit", "Estampado", "Verano", "Invierno", "Urbano"]
    },
    "Hogar y Muebles": {
        "keywords": ["furniture", "sofa", "chair", "table", "decor"],
        "price_range": (80_000, 2_500_000),
        "prefixes": ["Sofá", "Mesa", "Silla", "Lámpara", "Escritorio", "Estantería", "Alfombra", "Espejo", "Cojín", "Cortina"],
        "adjectives": ["Moderno", "Rústico", "Minimalista", "Industrial", "de Roble", "de Metal", "Confortable", "Decorativo", "Vintage", "Ergonómico"]
    },
    "Vehículos": {
        "keywords": ["car", "motorcycle", "vehicle", "truck"],
        "price_range": (15_000_000, 150_000_000),
        "prefixes": ["Camioneta", "Automóvil", "Motocicleta", "Cuatrimoto", "Furgoneta"],
        "adjectives": ["4x4", "Deportivo", "Familiar", "Híbrido", "Eléctrico", "Todo Terreno", "Clásico", "Automático", "Mecánico", "Full Equipo"]
    },
    "Deportes y Fitness": {
        "keywords": ["fitness", "gym", "sport", "yoga"],
        "price_range": (50_000, 1_200_000),
        "prefixes": ["Balón", "Pesas", "Bicicleta", "Colchoneta", "Raqueta", "Guantes", "Botella", "Cinta de Correr", "Elíptica", "Ropa Deportiva"],
        "adjectives": ["Profesional", "de Resistencia", "Ajustable", "Olímpico", "de Entrenamiento", "Transpirable", "Antideslizante", "Ligero", "Durable"]
    },
    "Supermercado": {
        "keywords": ["food", "grocery", "fruit", "drink"],
        "price_range": (5_000, 80_000),
        "prefixes": ["Arroz", "Aceite", "Café", "Vino", "Cereal", "Leche", "Galletas", "Detergente", "Jabón", "Chocolate"],
        "adjectives": ["Premium", "Integral", "Orgánico", "Importado", "Familiar", "Sin Gluten", "Artesanal", "Descremado", "Extra Virgen", "Gourmet"]
    },
    "Juegos y Juguetes": {
        "keywords": ["toy", "game", "lego", "doll"],
        "price_range": (30_000, 600_000),
        "prefixes": ["Muñeca", "Figura de Acción", "Juego de Mesa", "Rompecabezas", "Peluche", "Carro a Control", "Bloques", "Pista de Carreras", "Dron"],
        "adjectives": ["Coleccionable", "Educativo", "Interactivo", "Gigante", "Electrónico", "de Madera", "Didáctico", "para Niños", "Estrategia"]
    },
    "Belleza y Cuidado Personal": {
        "keywords": ["makeup", "skincare", "perfume", "beauty"],
        "price_range": (25_000, 350_000),
        "prefixes": ["Perfume", "Crema", "Maquillaje", "Shampoo", "Labial", "Mascarilla", "Serum", "Plancha de Pelo", "Secador", "Brochas"],
        "adjectives": ["Hidratante", "Anti-edad", "Natural", "Matte", "Larga Duración", "Profesional", "Orgánico", "Dermatológico", "Revitalizante"]
    },
    "Herramientas": {
        "keywords": ["tools", "drill", "hammer", "construction"],
        "price_range": (40_000, 900_000),
        "prefixes": ["Taladro", "Martillo", "Destornillador", "Sierra", "Lijadora", "Set de Llaves", "Metro", "Caja de Herramientas", "Alicate", "Nivel"],
        "adjectives": ["Inalámbrico", "Industrial", "de Precisión", "Multifuncional", "de Acero", "Profesional", "de Impacto", "Ergonómico", "Resistente"]
    },
    "Mascotas": {
        "keywords": ["pet", "dog", "cat", "animal"],
        "price_range": (15_000, 300_000),
        "prefixes": ["Cama", "Collar", "Alimento", "Juguete", "Rascador", "Correa", "Transportadora", "Champú", "Plato", "Ropa"],
        "adjectives": ["Ortopédica", "Premium", "Reflectivo", "Interactivo", "para Perros", "para Gatos", "Natural", "Antipulgas", "Suave"]
    },
    "Electrodomésticos": {
        "keywords": ["appliance", "kitchen", "electronic"],
        "price_range": (100_000, 3_500_000),
        "prefixes": ["Licuadora", "Batidora", "Microondas", "Aspiradora", "Cafetera", "Tostadora", "Freidora de Aire", "Plancha", "Ventilador", "Horno"],
        "adjectives": ["Digital", "Automático", "de Acero Inox", "Programable", "Silencioso", "Potente", "Bajo Consumo", "Inteligente", "Multifunción"]
    },
    "Bebés": {
        "keywords": ["baby", "infant", "toy"],
        "price_range": (20_000, 800_000),
        "prefixes": ["Coche", "Cuna", "Pañalera", "Monitor", "Silla de Auto", "Ropa", "Biberón", "Juguete", "Bañera", "Andador"],
        "adjectives": ["Seguro", "Ergonómico", "Suave", "Plegable", "Evolutivo", "Hipoalergénico", "de Algodón", "Musical", "Portátil"]
    },
    "Farmacia": {
        "keywords": ["medicine", "health", "pharmacy"],
        "price_range": (10_000, 150_000),
        "prefixes": ["Vitaminas", "Suplemento", "Protector Solar", "Termómetro", "Tensiómetro", "Vendas", "Mascarillas", "Gel Antibacterial", "Botiquín"],
        "adjectives": ["Digital", "Certificado", "Natural", "Pediátrico", "para Adultos", "Ortopédico", "Dermatológico", "Multivitamínico"]
    },
    "Construcción": {
        "keywords": ["construction", "building", "materials"],
        "price_range": (50_000, 500_000),
        "prefixes": ["Pintura", "Cemento", "Grifería", "Cerámica", "Tejas", "Ladrillos", "Estuco", "Impermeabilizante", "Tubería"],
        "adjectives": ["Impermeable", "Acrílico", "Blanco", "Negro", "Resistente", "de Exteriores", "de Interiores", "Alta Calidad"]
    }
}

def seed_everything():
    db = SessionLocal()
    print("\n🚀 Iniciando Carga Masiva (50 productos/categoría)...")

    try:
        # 1. CATEGORIAS
        print("📁 Creando Categorías...")
        cats_db = {}
        for name in DATA_CONFIG.keys():
            cat = Categoria(nombre=name, descripcion=f"Todo lo relacionado con {name}")
            db.add(cat)
            cats_db[name] = cat
        db.commit()

        # 2. VENDEDORES
        print("🧑‍💼 Creando 20 Usuarios Vendedores...")
        vendedores = []
        for i in range(1, 21):
            user = Usuario(
                nombre_completo=f"Vendedor {i}",
                email=f"vendedor{i}@unimarket.com",
                contrasena_hash=hash_password("123456"),
                rol=RolUsuario.VENDEDOR
            )
            db.add(user)
            db.flush() 
            
            # Crear Emprendimiento
            marcas = ["Tech", "Style", "Home", "Super", "Mega", "Ultra", "Global", "Max", "Prime", "Elite"]
            sufijos = ["Store", "Shop", "Market", "Ventas", "Distribuciones", "Outlet", "Boutique"]
            nombre_marca = f"{random.choice(marcas)} {random.choice(sufijos)} {i}"
            
            emp = Emprendimiento(
                usuario_id=user.id,
                nombre_marca=nombre_marca,
                descripcion="Expertos en brindar la mejor calidad y servicio.",
                url_logo=f"https://loremflickr.com/200/200/business,logo?lock={i}"
            )
            db.add(emp)
            vendedores.append(emp)
        db.commit()

        # 3. PRODUCTOS MASIVOS (50 por categoría)
        total_productos = 0
        print("📦 Generando productos...")
        
        for cat_name, config in DATA_CONFIG.items():
            print(f"   -> Generando 50 para: {cat_name}")
            cat_obj = cats_db[cat_name] # Need proper ID after commit, better query or refresh
            
            # Refresh category object to ensure ID is populated if needed (usually it is after flush/commit)
            # Actually cat objects from cats_db dict might be detached if not carefully handled, but here in same session it's fine.
            # To be safe, reload IDs
            cat_id = cat_obj.id

            for _ in range(50):
                prefix = random.choice(config["prefixes"])
                adj = random.choice(config["adjectives"])
                nombre = f"{prefix} {adj} {random.randint(100, 999)}"
                
                min_p, max_p = config["price_range"]
                precio = random.randint(min_p, max_p)
                precio = (precio // 1000) * 1000 # Redondear a miles
                
                # Imagen dinámica coherente
                keyword = random.choice(config["keywords"])
                img_lock = random.randint(1, 10000)
                img_url = f"https://loremflickr.com/500/500/{keyword}?lock={img_lock}"

                prod = Producto(
                    emprendimiento_id=random.choice(vendedores).id,
                    categoria_id=cat_id,
                    nombre=nombre,
                    descripcion=f"Este {nombre} es la mejor opción del mercado. Cuenta con garantía y envío rápido.",
                    precio=precio,
                    cantidad_stock=random.randint(5, 200),
                    url_imagen=img_url
                )
                db.add(prod)
                total_productos += 1
            
            db.commit() # Commit por bloque de categoría para no saturar
        
        print(f"✅ Total Productos Creados: {total_productos}")

        # 4. COMPRADORES Y ACTIVIDAD
        print("👥 Creando Compradores y Actividad...")
        compradores = []
        for i in range(1, 11):
            c = Usuario(
                nombre_completo=f"Cliente {i}",
                email=f"cliente{i}@gmail.com",
                contrasena_hash=hash_password("123456"),
                rol=RolUsuario.COMPRADOR
            )
            db.add(c)
            compradores.append(c)
        db.commit()

        # Generar compras aleatorias para poblar 'Lo más vendido' o historial
        all_products = db.query(Producto).all()
        
        for _ in range(50): # 50 transacciones
            cliente = random.choice(compradores)
            prod = random.choice(all_products)
            
            # Crear Orden
            compra = Compra(
                usuario_id=cliente.id,
                monto_total=prod.precio,
                estado=EstadoCompra.ENTREGADO,
                metodo_pago="Tarjeta Crédito"
            )
            db.add(compra)
            db.flush()
            
            item = ItemCompra(
                compra_id=compra.id,
                producto_id=prod.id,
                cantidad=1,
                precio_al_comprar=prod.precio
            )
            db.add(item)

            # Reseña (50% de probabilidad)
            if random.random() > 0.5:
                resena = Resena(
                    usuario_id=cliente.id,
                    producto_id=prod.id,
                    calificacion=random.randint(3, 5),
                    comentario=random.choice(["Excelente producto", "Muy bueno", "Recomendado", "Llegó a tiempo", "Calidad aceptable"])
                )
                db.add(resena)
        
        db.commit()
        print("✅ Actividad simulada correctamente.")
        print("\n✨ ¡PROCESO COMPLETADO! LA BD ESTÁ LISTA.")

    except Exception as e:
        print(f"❌ Error crítico: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if reset_database():
        seed_everything()
