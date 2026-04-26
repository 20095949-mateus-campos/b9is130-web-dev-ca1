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
    discogs_id: int
    title: str
    artist: str
    genre: Optional[str] = None
    year: Optional[int] = None
    cover_image: Optional[str] = None
    price: Decimal
    stock_quantity: int = 0
    description: Optional[str] = None

class CartItemOut(BaseModel):
    record_id: int
    title: str
    price: float
    quantity: int

    class Config:
        from_attributes = True

class CartOut(BaseModel):
    items: List[CartItemOut]
    total: float

class UserListOut(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class DiscogsSearchResult(BaseModel):
    id: int
    title: str
    thumb: Optional[str] = None
    year: Optional[str] = None
    genre: List[str] = []
    resource_url: str
