import httpx
import os
from dotenv import load_dotenv

load_dotenv()

DISCOGS_TOKEN = os.getenv("DISCOGS_TOKEN")
BASE_URL = "https://api.discogs.com"

HEADERS = {
    "Authorization": f"Discogs token={DISCOGS_TOKEN}",
    "User-Agent": "MyMusicRecordStoreProject/1.0"
}

async def get_discogs_metadata(release_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/releases/{release_id}", headers=HEADERS)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            print(f"Release {release_id} not found.")
        else:
            print(f"Error: {response.status_code}")
        return None
