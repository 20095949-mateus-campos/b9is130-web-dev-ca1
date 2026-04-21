from pydantic import BaseModel, EmailStr
from typing import Optional, List
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

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    record_ids: List[int]

class OrderItemOut(BaseModel):
    record_id: int
    unit_price: float
    quantity: int
    record_title: Optional[str] = None 

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    total_price: float
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
