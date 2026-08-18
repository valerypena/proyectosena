import pymysql
from database import engine, Base
from models import Usuario, Emprendimiento, Categoria, Producto, ItemCarrito, Compra, ItemCompra, Resena

# Configuración de conexión directa para crear la base de datos
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "" 
DB_NAME = "unimarket"

def create_database():
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        print(f"Base de datos '{DB_NAME}' eliminada (para reinicio limpio).")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"Base de datos '{DB_NAME}' creada exitosamente.")
        
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error al conectar con MySQL: {e}")
        pass

def init_tables():
    print("Creando tablas en la base de datos (con nombres en español)...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Tablas creadas exitosamente.")
    except Exception as e:
        print(f"Error al crear tablas: {e}")

if __name__ == "__main__":
    create_database()
    init_tables()
