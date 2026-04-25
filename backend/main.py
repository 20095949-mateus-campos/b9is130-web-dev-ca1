from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from typing import List, Optional
import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user, get_current_admin
from fastapi.security import OAuth2PasswordRequestForm
from discogs import get_discogs_metadata
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Music Record Store API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

origins = [
    FRONTEND_URL,
    "http://b9is130-record-store-api-frontend.s3-website-eu-west-1.amazonaws.com",
    "https://b9is130-web-dev-ca1.duckdns.org",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {app.title}"}

@app.get("/records", response_model=List[schemas.RecordSchema])
def get_records(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    genre: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None
):
    query = db.query(models.Record)

    if search:
        query = query.filter(
            (models.Record.title.ilike(f"%{search}%")) | 
            (models.Record.artist.ilike(f"%{search}%"))
        )

    if genre:
        query = query.filter(models.Record.genre == genre)

    if min_price is not None:
        query = query.filter(models.Record.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Record.price <= max_price)

    return query.all()

@app.get("/records/{record_id}")
async def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.Record).filter(models.Record.id == record_id).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Record not found in our store")

    external_data = {}
    if record.discogs_id:
        external_data = await get_discogs_metadata(record.discogs_id)

    return {
        "store_details": record,
        "discogs_metadata": external_data
    }

@app.post("/orders", status_code=201)
def create_order(
    order_data: schemas.OrderCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    total_price = 0
    order_items = []
    
    for rid in order_data.record_ids:
        record = db.query(models.Record).filter(models.Record.id == rid).first()
        
        if not record:
            raise HTTPException(status_code=404, detail=f"Record ID {rid} not found")
        if record.stock_quantity < 1:
            raise HTTPException(status_code=400, detail=f"'{record.title}' is out of stock")
        
        record.stock_quantity -= 1
        total_price += record.price
        
        item = models.OrderItem(
            record_id=record.id,
            unit_price=record.price,
            quantity=1
        )
        order_items.append(item)

    new_order = models.Order(
        user_id=current_user.id,
        total_price=total_price,
        items=order_items
    )
    
    try:
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return {"message": "Order successful", "order_id": new_order.id, "total": total_price}
    except Exception as e:
        db.rollback()
        print(f"DATABASE ERROR: {e}") 
        raise HTTPException(status_code=500, detail="Could not process order")

@app.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user_data.email) | 
        (models.User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=400, 
            detail="Username or Email already registered"
        )

    hashed_pass = auth.hash_password(user_data.password)

    new_user = models.User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_pass
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.get("/api/orders/my-history", response_model=List[schemas.OrderOut])
def get_my_order_history(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@app.post("/orders/{order_id}/cancel")
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status == "cancelled":
        raise HTTPException(status_code=400, detail="Order is already cancelled")

    try:
        for item in order.items:
            record = db.query(models.Record).filter(models.Record.id == item.record_id).first()
            if record:
                record.stock_quantity += item.quantity
        
        order.status = "cancelled"
        
        db.commit()
        return {"message": "Order cancelled and stock restored", "order_id": order_id}
        
    except Exception as e:
        db.rollback()
        print(f"CANCELLATION ERROR: {e}")
        raise HTTPException(status_code=500, detail="Failed to cancel order")

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = auth.create_access_token(data={"user_id": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.patch("/admin/records/{record_id}")
def patch_record(
    record_id: int, 
    update_data: schemas.RecordUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    record = db.query(models.Record).filter(models.Record.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)
    
    for key, value in update_dict.items():
        setattr(record, key, value)
    
    db.commit()
    db.refresh(record)
    return record

@app.delete("/admin/records/{record_id}")
def delete_record(
    record_id: int, 
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    record = db.query(models.Record).filter(models.Record.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    
    db.delete(record)
    db.commit()
    return {"message": "Record deleted from inventory"}

@app.post("/cart/add")
def add_to_cart(
    data: schemas.CartAdd,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 1. Check record exists
    record = db.query(models.Record).filter(models.Record.id == data.record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    # 2. Get or create cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    
    if not cart:
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    # 3. Check if item already in cart
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.record_id == data.record_id
    ).first()

    if cart_item:
        cart_item.quantity += data.quantity
    else:
        cart_item = models.CartItem(
            cart_id=cart.id,
            record_id=data.record_id,
            quantity=data.quantity
        )
        db.add(cart_item)

    db.commit()

    return {"message": "Item added to cart"}