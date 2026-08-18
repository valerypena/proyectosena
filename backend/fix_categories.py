from sqlalchemy.orm import Session
from database import SessionLocal
from models import Producto, Categoria

def check_and_fix_null_categories():
    db = SessionLocal()
    try:
        # Check for products with NULL category_id
        null_cat_products = db.query(Producto).filter(Producto.categoria_id == None).all()
        
        print(f"Total productos sin categoría: {len(null_cat_products)}")
        
        if len(null_cat_products) > 0:
            # Get a default category (e.g., 'Otros' or create one)
            default_cat = db.query(Categoria).filter(Categoria.nombre == "Otros").first()
            if not default_cat:
                default_cat = Categoria(nombre="Otros", descripcion="Categoría general")
                db.add(default_cat)
                db.commit()
                db.refresh(default_cat)
            
            print(f"Asignando categoría 'Otros' (ID: {default_cat.id}) a los productos huérfanos...")
            
            for prod in null_cat_products:
                # Try to guess category by name if possible, otherwise Other
                # simple keyword matching
                name_lower = prod.nombre.lower()
                target_cat = default_cat
                
                # Simple heuristic to fix known ones if they drifted
                if "telefono" in name_lower or "celular" in name_lower or "laptop" in name_lower:
                    c = db.query(Categoria).filter(Categoria.nombre == "Tecnología").first()
                    if c: target_cat = c
                elif "camiseta" in name_lower or "pantalon" in name_lower or "ropa" in name_lower:
                    c = db.query(Categoria).filter(Categoria.nombre == "Moda").first()
                    if c: target_cat = c
                
                prod.categoria_id = target_cat.id
                print(f"  - Actualizado: {prod.nombre} -> {target_cat.nombre}")
                
            db.commit()
            print("Corrección completada.")
        else:
            print("Todos los productos ya tienen categoría asignada.")
            
    finally:
        db.close()

if __name__ == "__main__":
    check_and_fix_null_categories()
