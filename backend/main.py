from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from typing import List
import models
import schemas

from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Music Record Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {app.title}"}

@app.get("/records", response_model=List[schemas.RecordSchema])
def get_records(db: Session = Depends(get_db)):
    records = db.query(models.Record).all()
    return records

@app.get("/records/{record_id}")
def get_record(record_id: int):
    return {
        "id": record_id,
        "title": "Sample Record",
        "artist": "Sample Artist",
        "status": "Success"
    }
