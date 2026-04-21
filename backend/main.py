from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine, get_db
from typing import List
import models, schemas, auth
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Music Record Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
