import os
import uuid
from datetime import datetime, timezone
from typing import Dict, List

import requests
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORY_MAP: Dict[str, str] = {
    "electronics": "electronics",
    "jewelery": "fashion",
    "men's clothing": "fashion",
    "women's clothing": "fashion",
}


def chunked(seq: List[Dict], size: int):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def normalize_product(p: Dict) -> Dict:
    return {
        "id": str(uuid.uuid4()),
        "name": p.get("title", ""),
        "description": p.get("description", ""),
        "price": float(p.get("price", 0)),
        "image_url": p.get("image", ""),
        "category": CATEGORY_MAP.get(p.get("category", ""), "home"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def fetch_products(limit: int = 50) -> List[Dict]:
    resp = requests.get("https://fakestoreapi.com/products")
    resp.raise_for_status()
    return resp.json()[:limit]


def main():
    try:
        raw = fetch_products(50)
        print(f"Fetched {len(raw)} items")
    except Exception as e:
        print(f"Error fetching products: {e}")
        return

    products = [normalize_product(p) for p in raw]

    inserted = 0
    for chunk in chunked(products, 25):
        try:
            resp = supabase.table("products").insert(chunk).execute()
            data = resp.data or []
            inserted += len(data)
            names = [p["name"] for p in data]
            print(f"Inserted {len(data)} products: {names}")
        except Exception as e:
            print(f"Error inserting batch: {e}")

    print(f"Insertion completed. Total inserted: {inserted}")


if __name__ == "__main__":
    main()
