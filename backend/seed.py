import httpx
import os
import asyncio
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Record, User, Order, OrderItem, Cart, CartItem
from auth import hash_password
from decimal import Decimal

load_dotenv()

DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")
HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_TOKEN}",
    "User-Agent": "MyMusicRecordStoreProject/1.0"
}

ALBUM_IDS = [
    1873013,  # Pink Floyd - Dark Side of the Moon
    2607424,  # The Beatles - Abbey Road
    526351,   # Fleetwood Mac - Rumours
    2911293,  # Michael Jackson - Thriller
    1813006,  # Nirvana - Nevermind
    2879,     # Daft Punk - Discovery
    6276183,  # Miles Davis - Kind of Blue
    4950798,  # Radiohead - OK Computer
    2893139,  # Led Zeppelin - IV
    825438    # Amy Winehouse - Back To Black
]

async def seed_database():
    db: Session = SessionLocal()
    print("--- Starting Database Seed ---")

    print("Seeding Users...")

    admin_email = os.getenv("ADMIN_EMAIL")
    admin_pass = os.getenv("ADMIN_PASSWORD")
    admin_user = os.getenv("ADMIN_USERNAME")
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    
    if not existing_admin:
        print(f"Seeding admin user: {admin_email}")
        new_admin = User(
            username=admin_user,
            email=admin_email,
            hashed_password=hash_password(admin_pass),
            is_active=True,
            is_admin=True
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        print(f"Admin user created.")
    else:
        print("Admin user already exists.")

    customer_email = "customer@example.com"
    customer = db.query(User).filter(User.email == customer_email).first()

    if not customer:
        customer = User(
            username="test_customer",
            email=customer_email,
            hashed_password=hash_password("password123"),
            is_admin=False
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)
        print(f"Customer user created.")
    else:
        print("Customer user already exists.")

    print("Seeding Records from Discogs...")

    records_list = []

    async with httpx.AsyncClient() as client:
        for release_id in ALBUM_IDS:
            existing = db.query(Record).filter(Record.discogs_id == release_id).first()
            if existing:
                print(f"Skipping: {existing.title} by {existing.artist} (Already in DB)")
                records_list.append(existing)
                continue

            response = await client.get(f"https://api.discogs.com/releases/{release_id}", headers=HEADERS)
            
            if response.status_code == 200:
                data = response.json()

                new_record = Record(
                    discogs_id=data.get('id'),
                    title=data.get('title'),
                    artist=data.get('artists')[0].get('name') if data.get('artists') else "Unknown",
                    genre=data.get('genres')[0] if data.get('genres') else "Unknown",
                    year=data.get('year'),
                    cover_image=data.get('images')[0].get('resource_url') if data.get('images') else None,
                    price=Decimal(str(data.get('lowest_price') or 25.00)),
                    stock_quantity=10,
                    description=f"Format: {data.get('formats')[0].get('name') if data.get('formats') else 'Vinyl'}"
                )

                db.add(new_record)
                records_list.append(new_record)
                print(f"Added: {new_record.title} by {new_record.artist}")
            else:
                print(f"Failed to fetch ID {release_id}: {response.status_code}")

    db.commit()

    if customer and records_list:
        print("Seeding Cart and CartItems...")
        
        user_cart = db.query(Cart).filter(Cart.user_id == customer.id).first()
        if not user_cart:
            user_cart = Cart(user_id=customer.id)
            db.add(user_cart)
            db.flush()

        for record in records_list[:5]:
            existing_item = db.query(CartItem).filter(
                CartItem.cart_id == user_cart.id,
                CartItem.record_id == record.id
            ).first()
            
            if not existing_item:
                cart_item = CartItem(
                    cart_id=user_cart.id, 
                    record_id=record.id, 
                    quantity=1
                )
                db.add(cart_item)
                print(f"Added '{record.title}' to {customer.username}'s cart.")

    if customer and len(records_list) >= 5:
        print("Seeding Order History...")
        existing_orders = db.query(Order).filter(Order.user_id == customer.id).first()
        if not existing_orders:
            past_records = records_list[-5:]
            order_total = sum(Decimal(str(r.price)) for r in past_records)
            demo_order = Order(
                user_id=customer.id,
                total_price=order_total,
                status="shipped"
            )
            db.add(demo_order)
            db.flush()

            for record in past_records:
                order_item = OrderItem(
                    order_id=demo_order.id,
                    record_id=record.id,
                    quantity=1,
                    unit_price=Decimal(str(record.price))
                )
                db.add(order_item)
            
            print(f"Created order for {customer.username} with 5 items. Total: ${order_total}")

    db.commit()
    db.close()
    print("--- Seeding Complete! ---")

if __name__ == "__main__":
    asyncio.run(seed_database())
