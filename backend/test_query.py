from database import SessionLocal
import models
from sqlalchemy.orm import joinedload

def test_query():
    db = SessionLocal()
    try:
        # User ID 13 as seen in logs
        user_id = 13
        print(f"Testing query for user_id: {user_id}")
        ventas = db.query(models.Compra).join(models.ItemCompra).join(models.Producto).join(models.Emprendimiento).filter(
            models.Emprendimiento.usuario_id == user_id
        ).distinct().all()
        print(f"Found {len(ventas)} ventas")
    except Exception as e:
        print(f"ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_query()
