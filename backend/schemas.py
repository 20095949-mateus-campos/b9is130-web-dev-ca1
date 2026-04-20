from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecordSchema(BaseModel):
    id: int
    discogs_id: Optional[int]
    title: str
    artist: str
    genre: Optional[str]
    year: Optional[int]
    price: float
    stock_quantity: int
    description: Optional[str]

    class Config:
        from_attributes = True
