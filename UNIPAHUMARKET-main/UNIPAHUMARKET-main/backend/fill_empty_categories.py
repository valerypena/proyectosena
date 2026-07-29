from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, Categoria, Emprendimiento, Usuario, RolUsuario
import random

def populate_empty_categories():
    db = SessionLocal()
    try:
        # Get all categories
        categories = db.query(Categoria).all()
        
        # 1. Identify empty categories
        empty_categories = []
        for cat in categories:
            product_count = db.query(Producto).filter(Producto.categoria_id == cat.id).count()
            if product_count == 0:
                empty_categories.append(cat)
        
        print(f"Encontradas {len(empty_categories)} categorías vacías.")
        
        if not empty_categories:
            print("Todas las categorías ya tienen productos.")
            return

        # Ensure we have a generic vendor
        vendor = db.query(Emprendimiento).first()
        if not vendor:
            print("No hay vendedores. Creando uno...")
            # Create dummy user and vendor if needed (unlikely based on previous steps)
            # Short circuiting this for safety, assuming seed_data ran
            return

        # 2. Add products to empty categories
        new_products = []
        for cat in empty_categories:
            print(f"Generando productos para: {cat.nombre}")
            
            # Define some generic products for these categories
            # Keyword mapping for images
            keyword = "product"
            if "Inmuebles" in cat.nombre: keyword = "house"
            elif "Servicios" in cat.nombre: keyword = "worker"
            elif "Industrias" in cat.nombre: keyword = "factory"
            elif "Salud" in cat.nombre: keyword = "medical"
            elif "Bebés" in cat.nombre: keyword = "baby"
            elif "Farmacia" in cat.nombre: keyword = "pharmacy"
            
            for i in range(1, 6): # Add 5 products per empty category
                prod_name = f"Producto {cat.nombre} {i}"
                if "Inmuebles" in cat.nombre: prod_name = f"Apartamento Modelo {i}"
                elif "Servicios" in cat.nombre: prod_name = f"Servicio de {cat.nombre} {i}"
                
                image_url = f"https://loremflickr.com/400/400/{keyword}?lock={hash(prod_name) % 1000}"
                
                new_prod = Producto(
                    emprendimiento_id=vendor.id,
                    categoria_id=cat.id,
                    nombre=prod_name,
                    descripcion=f"Descripción genérica para el producto de la categoría {cat.nombre}. Excelente calidad.",
                    precio=random.randint(50000, 1000000),
                    cantidad_stock=random.randint(10, 100),
                    url_imagen=image_url
                )
                
                # Precios más realistas según categoría
                if "Inmuebles" in cat.nombre:
                    new_prod.precio = random.randint(150000000, 800000000) # 150M - 800M
                elif "Servicios" in cat.nombre:
                     new_prod.precio = random.randint(50000, 500000)
                elif "Bebés" in cat.nombre or "Farmacia" in cat.nombre:
                     new_prod.precio = random.randint(20000, 200000)
                elif "Industrias" in cat.nombre:
                     new_prod.precio = random.randint(500000, 5000000)
                db.add(new_prod)
                new_products.append(new_prod)
        
        db.commit()
        print(f"¡Éxito! Se añadieron {len(new_products)} productos nuevos a las categorías vacías.")
        
    finally:
        db.close()

if __name__ == "__main__":
    populate_empty_categories()
