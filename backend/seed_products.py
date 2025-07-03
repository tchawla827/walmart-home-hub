import os
import uuid
import random
from datetime import datetime
from typing import List, Dict

from supabase import create_client, Client
from faker import Faker
from dotenv import load_dotenv

load_dotenv()

# Toggle to clear existing rows before inserting
clear_existing = True

# Configuration from environment variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

fake = Faker()
fake.unique.clear()

categories: Dict[str, tuple] = {
    "grocery": (1, 30),
    "electronics": (50, 500),
    "home": (10, 200),
    "toys": (5, 100),
    "fashion": (10, 150),
    "sports": (15, 250),
}


def chunked(seq: List[Dict], size: int):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def generate_products() -> List[Dict]:
    products = []
    for category, (min_price, max_price) in categories.items():
        for _ in range(25):
            name = fake.unique.catch_phrase()
            product = {
                "id": str(uuid.uuid4()),
                "name": name,
                "description": fake.sentence(nb_words=8),
                "price": round(random.uniform(min_price, max_price), 2),
                "image_url": f"https://source.unsplash.com/random/400x400/?{category}",
                "category": category,
                "created_at": datetime.utcnow().isoformat(),
            }
            products.append(product)
    return products


def main():
    if clear_existing:
        try:
            resp = supabase.table("products").delete().neq("id", "").execute()
            print(f"Cleared existing rows: {len(resp.data) if resp.data else 0}")
        except Exception as e:
            print(f"Error clearing table: {e}")

    products = generate_products()
    inserted = 0
    for chunk in chunked(products, 50):
        try:
            resp = supabase.table("products").insert(chunk).execute()
            data = resp.data or []
            inserted += len(data)
            names = [p["name"] for p in data]
            print(f"Inserted {len(data)} products: {names}")
        except Exception as e:
            print(f"Error inserting batch: {e}")
    print(f"Seeding completed. Total inserted: {inserted}")


if __name__ == "__main__":
    main()

