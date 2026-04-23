import sqlalchemy
from sqlalchemy import inspect
import subprocess
import sys
import asyncio
from database import engine
from seed import seed_database
import models

def run_command(command):
    print(f"Executing: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        return False
    print(result.stdout)
    return True

def main():
    try:
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        defined_tables = Base.metadata.tables.keys()
        found_defined_tables = [t for t in defined_tables if t in existing_tables]

        if 'alembic_version' in existing_tables:
            print("Alembic history found. Running upgrade...")
            run_command("alembic upgrade head")
        elif found_defined_tables:
            print(f"Conflict: Tables {found_defined_tables} exist but no version history found.")
            print("Stamping 'head' to synchronize...")
            run_command("alembic stamp head")
        else:
            print("Fresh database detected. Initializing schema...")
            run_command("alembic upgrade head")

        if os.getenv("RESEED") == "true":
            print("Reseed flag detected. Checking for missing data...")
            asyncio.run(seed_database())
        else:
            print("Skipping seed phase (RESEED not set to true).")
            
    except Exception as e:
        print(f"Migration/Seed failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()