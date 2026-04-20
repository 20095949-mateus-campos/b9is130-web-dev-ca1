from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from database import Base

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
