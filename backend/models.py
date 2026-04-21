from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    orders = relationship("Order", back_populates="user")

class Record(Base):
    __tablename__ = "records"

    id = Column(Integer, primary_key=True, index=True)
    
    discogs_id = Column(Integer, unique=True, index=True, nullable=True)
    
    title = Column(String(255), nullable=False)
    artist = Column(String(255), nullable=False)
    genre = Column(String(100))
    year = Column(Integer)
    
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0)
    condition = Column(String(50))
    
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Record(title='{self.title}', artist='{self.artist}', price={self.price})>"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_price = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    record_id = Column(Integer, ForeignKey("records.id"))
    
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False) 

    order = relationship("Order", back_populates="items")
    record = relationship("Record")

    @property
    def record_title(self):
        return self.record.title if self.record else None
