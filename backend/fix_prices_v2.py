from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, Categoria
import random

# Definición de rangos de precios coherentes por categoría (en Pesos Colombianos)
PRICE_RANGES = {
    "Vehículos": (15000000, 150000000),      # 15M - 150M
    "Inmuebles": (150000000, 800000000),     # 150M - 800M (Venta)
    "Tecnología": (500000, 6000000),         # 500k - 6M
    "Electrodomésticos": (100000, 3000000),  # 100k - 3M
    "Hogar y Muebles": (50000, 2000000),     # 50k - 2M
    "Deportes y Fitness": (30000, 1500000),  # 30k - 1.5M
    "Herramientas": (20000, 800000),         # 20k - 800k
    "Construcción": (50000, 2000000),        # 50k - 2M
    "Supermercado": (5000, 100000),          # 5k - 100k
    "Moda": (30000, 300000),                 # 30k - 300k
    "Juegos y Juguetes": (20000, 500000),    # 20k - 500k
    "Bebés": (20000, 800000),                # 20k - 800k
    "Mascotas": (15000, 300000),             # 15k - 300k
    "Belleza y Cuidado Personal": (20000, 300000), # 20k - 300k
    "Productos Sustentables": (15000, 200000), # 15k - 200k
    "Salud y Equipamiento Médico": (100000, 5000000), # 100k - 5M
    "Industrias y Oficinas": (100000, 2000000), # 100k - 2M
    "Servicios": (50000, 500000),            # 50k - 500k (Costo base servicio)
    "Accesorios para Vehículos": (50000, 1000000), # 50k - 1M
    "Farmacia": (10000, 150000),             # 10k - 150k
    "Internacional": (50000, 500000)         # 50k - 500k
}

def fix_all_prices():
    db = SessionLocal()
    try:
        print("Iniciando auditoría completa de precios...")
        products = db.query(Producto).all()
        
        count_fixed = 0
        for prod in products:
            # Obtener nombre de categoría
            cat = db.query(Categoria).filter(Categoria.id == prod.categoria_id).first()
            if not cat:
                continue
                
            cat_name = cat.nombre
            min_price, max_price = PRICE_RANGES.get(cat_name, (50000, 1000000)) # Default
            
            # Verificar si el precio está fuera de rango o parece "raro" (muy bajo o no redondo)
            # También forzamos actualización si es < 2000 (residuos de USD)
            needs_fix = False
            
            if prod.precio < min_price or prod.precio > max_price:
                needs_fix = True
            
            # También verificar si tiene decimales no redondos (ej. 123.45) que sugieran conversión automática
            if prod.precio % 100 != 0 and prod.precio > 1000:
                 # Si el precio no termina en 00 (o aprox), lo redondeamos
                 needs_fix = True

            if needs_fix:
                
                # Generar nuevo precio base
                new_price = random.randint(min_price, max_price)
                
                # Redondear a miles más cercanos para que se vea bonito (ej. 45321 -> 45000)
                if new_price > 100000:
                    new_price = round(new_price, -4) # Redondea a 10.000 más cercano
                else:
                    new_price = round(new_price, -3) # Redondea a 1.000 más cercano
                
                print(f"[{cat_name}] {prod.nombre}: ${prod.precio} -> ${new_price}")
                prod.precio = new_price
                count_fixed += 1
        
        db.commit()
        print(f"Auditoría finalizada. Se corrigieron {count_fixed} productos.")
            
    finally:
        db.close()

if __name__ == "__main__":
    fix_all_prices()
