from fastapi import FastAPI
import requests

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Music Record Store API"}

@app.get("/records/{record_id}")
def get_record(record_id: int):

    return {
        "id": record_id,
        "title": "Sample Record",
        "artist": "Sample Artist",
        "status": "Success"
    }
