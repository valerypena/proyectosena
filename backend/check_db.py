from database import engine
from sqlalchemy import inspect

def check_db():
    ins = inspect(engine)
    print("--- DATABASE SCHEMA ---")
    for table_name in ins.get_table_names():
        columns = [c["name"] for c in ins.get_columns(table_name)]
        print(f"Table: {table_name}")
        print(f"Columns: {', '.join(columns)}")
        print("-" * 20)

if __name__ == "__main__":
    check_db()
