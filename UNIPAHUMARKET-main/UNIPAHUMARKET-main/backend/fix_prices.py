from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, Categoria
import random

def fix_prices():
    db = SessionLocal()
    try:
        # Buscar productos con precios sospechosamente bajos para COP (menos de 2000 pesos)
        # Asumiendo que ningún producto real de la tienda cuesta menos que un dulce pequeño.
        low_price_products = db.query(Producto).filter(Producto.precio < 2000).all()
        
        print(f"Encontrados {len(low_price_products)} productos con precios incorrectos (posiblemente generados como USD).")
        
        for prod in low_price_products:
            old_price = prod.precio
            
            # Ajuste inteligente basado en categoría si es posible
            cat = db.query(Categoria).filter(Categoria.id == prod.categoria_id).first()
            cat_name = cat.nombre if cat else ""
            
            new_price = 0
            
            if "Inmuebles" in cat_name:
                new_price = random.randint(150000000, 800000000)
            elif "Vehículos" in cat_name:
                 new_price = random.randint(20000000, 100000000)
            elif "Tecnología" in cat_name:
                 new_price = random.randint(500000, 5000000)
            else:
                # Genérico: Entre 50k y 1M
                new_price = random.randint(50000, 1000000)
                
            prod.precio = new_price
            print(f"Corrigiendo {prod.nombre}: ${old_price} -> ${new_price}")
            
        if low_price_products:
            db.commit()
            print("¡Precios corregidos exitosamente!")
        else:
            print("No se requirieron correcciones.")
            
    finally:
        db.close()

if __name__ == "__main__":
    fix_prices()
