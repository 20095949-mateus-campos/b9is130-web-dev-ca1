import httpx
import os
import asyncio
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Record

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

    async with httpx.AsyncClient() as client:
        for release_id in ALBUM_IDS:
            response = await client.get(f"https://api.discogs.com/releases/{release_id}", headers=HEADERS)
            
            if response.status_code == 200:
                data = response.json()
                
                existing = db.query(Record).filter(Record.discogs_id == release_id).first()
                if existing:
                    print(f"Skipping: {data['title']} (Already in DB)")
                    continue

                new_record = Record(
                    discogs_id=data.get('id'),
                    title=data.get('title'),
                    artist=data.get('artists')[0].get('name') if data.get('artists') else "Unknown",
                    genre=data.get('genres')[0] if data.get('genres') else "Unknown",
                    year=data.get('year'),
                    price=data.get('lowest_price'),
                    stock_quantity=5,
                    description=f"Format: {data.get('formats')[0].get('name') if data.get('formats') else 'Vinyl'}"
                )

                db.add(new_record)
                print(f"Added: {new_record.title} by {new_record.artist}")
            else:
                print(f"Failed to fetch ID {release_id}: {response.status_code}")

    db.commit()
    db.close()
    print("--- Seeding Complete! ---")

if __name__ == "__main__":
    asyncio.run(seed_database())
