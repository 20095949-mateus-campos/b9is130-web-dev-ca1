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
from decimal import Decimal
from discogs import search_discogs, get_discogs_metadata

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


# --------- Login ---------
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


# --------- User Endpoints ---------
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

@app.get("/users/me")
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/admin/users", response_model=List[schemas.UserListOut])
def get_all_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    users = db.query(models.User).all()
    return users

@app.patch("/users/me", response_model=schemas.UserOut)
def update_user(
    update_data: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    update_dict = update_data.model_dump(exclude_unset=True)

    #Handle password separately
    if "password" in update_dict:
        update_dict["hashed_password"] = auth.hash_password(update_dict["password"])
        del update_dict["password"]

    # Update fields dynamically
    for key, value in update_dict.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return current_user

# --------- Records Endpoints ---------
@app.get("/records", response_model=List[schemas.RecordSchema])
def get_records(
    db: Session = Depends(get_db),
    search: Optional[str] = None,
    genre: Optional[str] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None
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
async def get_record_by_id(record_id: int, db: Session = Depends(get_db)):
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

@app.get("/genres")
def get_genres(db: Session = Depends(get_db)):
    genres = db.query(models.Record.genre).distinct().all()

    # Extract values from tuples and remove None
    return [g[0] for g in genres if g[0] is not None]

@app.post("/admin/records", response_model=schemas.RecordSchema)
def create_record(
    record_data: schemas.RecordCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    new_record = models.Record(
        discogs_id=record_data.discogs_id,
        title=record_data.title,
        artist=record_data.artist,
        genre=record_data.genre,
        year=record_data.year,
        cover_image=record_data.cover_image,
        price=record_data.price,
        stock_quantity=record_data.stock_quantity,
        description=record_data.description
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record

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

@app.get("/admin/discogs/search")
async def search_external_records(
    q: str, 
    admin: models.User = Depends(get_current_admin)
):
    results = await search_discogs(q)
    if not results:
        return {"results": []}
    return results.get("results", [])

@app.post("/admin/records/import/{discogs_id}", response_model=schemas.RecordSchema)
async def import_record_from_discogs(
    discogs_id: int,
    price: Decimal,
    stock: int = 1,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin)
):
    existing = db.query(models.Record).filter(models.Record.discogs_id == discogs_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Record already exists in store")

    data = await get_discogs_metadata(discogs_id)
    if not data:
        raise HTTPException(status_code=404, detail="Could not find release on Discogs")

    artist_name = data.get('artists', [{}])[0].get('name', 'Unknown Artist')
    
    new_record = models.Record(
        discogs_id=discogs_id,
        title=data.get('title'),
        artist=artist_name,
        genre=data.get('genres', ['Unknown'])[0],
        year=data.get('year'),
        cover_image=data.get('images', [{}])[0].get('resource_url'),
        price=price,
        stock_quantity=stock,
        description=f"Imported from Discogs. Format: {data.get('formats', [{}])[0].get('name')}"
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


# --------- Cart Endpoints ---------
@app.post("/cart/add")
def add_to_cart(
    data: schemas.CartAdd,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    #Check record exists
    record = db.query(models.Record).filter(models.Record.id == data.record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    #Get or create cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()
    
    if not cart:
        cart = models.Cart(user_id=current_user.id)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    #Check if item already in cart
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

@app.get("/cart", response_model=schemas.CartOut)
def get_cart(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    #Get user's cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()

    # If no cart → return empty
    if not cart:
        return {"items": [], "total": 0}

    items = []
    total = 0

    #Loop through cart items
    for item in cart.items:
        record = item.record

        if not record:
            continue

        item_total = record.price * item.quantity
        total += item_total

        items.append({
            "record_id": record.id,
            "title": record.title,
            "price": record.price,
            "quantity": item.quantity
        })

    return {
        "items": items,
        "total": total
    }

@app.delete("/cart/remove/{record_id}")
def remove_item_from_cart(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get user's cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()

    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")

    #Find cart item
    cart_item = db.query(models.CartItem).filter(
        models.CartItem.cart_id == cart.id,
        models.CartItem.record_id == record_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Item not found in cart")

    #Delete item
    db.delete(cart_item)
    db.commit()

    return {"message": "Item removed from cart"}


# --------- Order Endpoints ---------
@app.post("/orders", status_code=201)
def create_order(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    #Get user's cart
    cart = db.query(models.Cart).filter(models.Cart.user_id == current_user.id).first()

    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_price = 0
    order_items = []


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

@app.get("/orders/{order_id}", response_model=schemas.OrderOut)
def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    #Get order
    order = db.query(models.Order).filter(models.Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    #Security check
    if order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return order