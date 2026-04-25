from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class RecordSchema(BaseModel):
    id: int
    discogs_id: Optional[int]
    title: str
    artist: str
    genre: Optional[str]
    year: Optional[int]
    cover_image: Optional[str] = None
    price: Decimal
    stock_quantity: int
    description: Optional[str]

    class Config:
        from_attributes = True

class RecordUpdate(BaseModel):
    title: Optional[str] = None
    artist: Optional[str] = None
    genre: Optional[str] = None
    year: Optional[int] = None
    cover_image: Optional[str] = None
    price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    description: Optional[str] = None

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
    unit_price: Decimal
    quantity: int
    record_title: Optional[str] = None 

    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    total_price: Decimal
    status: str
    created_at: datetime
    items: List[OrderItemOut]

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CartAdd(BaseModel):
    record_id: int
    quantity: int = 1

class RecordCreate(BaseModel):
    title: str
    artist: str
    genre: Optional[str] = None
    year: Optional[int] = None
    cover_image: Optional[str] = None
    price: Decimal
    stock_quantity: int = 0
    description: Optional[str] = None