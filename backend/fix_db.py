from database import engine
from sqlalchemy import text

def fix():
    queries = [
        "ALTER TABLE compras ADD COLUMN IF NOT EXISTS direccion_id INT NULL",
        "ALTER TABLE compras ADD COLUMN IF NOT EXISTS metodo_pago VARCHAR(50) NULL",
        "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS documento VARCHAR(20) NULL",
        "ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS ocupacion VARCHAR(100) NULL"
    ]
    with engine.connect() as conn:
        for q in queries:
            try:
                # 'IF NOT EXISTS' is MariaDB 10.2+/MySQL 8.0.1+
                # For older MySQL, we might need a different check.
                # I'll just try and catch.
                conn.execute(text(q))
                print(f"Executed: {q}")
            except Exception as e:
                print(f"Skipped/Error on {q.split()[2]}: {e}")
        conn.commit()

if __name__ == "__main__":
    fix()
