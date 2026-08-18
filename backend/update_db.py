from database import engine, Base
import models
from sqlalchemy import text

def update_db():
    with engine.connect() as conn:
        print("Checking for missing columns...")
        
        # Table: compras
        cols_compras = [c["name"] for c in Base.metadata.tables["compras"].columns]
        for col in ["direccion_id", "metodo_pago"]:
            try:
                conn.execute(text(f"ALTER TABLE compras ADD COLUMN {col} VARCHAR(50)"))
                print(f"Added {col} to compras")
            except Exception as e:
                print(f"Column {col} might already exist or error: {e}")
        
        # Any other missing columns?
        # Let's try to just run create_all, though it usually doesn't add columns.
        Base.metadata.create_all(bind=engine)
        print("create_all executed.")
        
        conn.commit()

if __name__ == "__main__":
    update_db()
