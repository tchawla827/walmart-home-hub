import os
import uuid
from datetime import datetime, timezone
from typing import Dict, List, Iterable
import secrets

import requests
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TARGET_CATEGORIES = [
    "groceries",
    "electronics",
    "home",
    "toys",
    "fashion",
]

CATEGORY_MAP: Dict[str, str] = {
    "electronics": "electronics",
    "jewelery": "fashion",
    "men's clothing": "fashion",
    "women's clothing": "fashion",
}


def chunked(seq: Iterable[Dict], size: int) -> Iterable[List[Dict]]:
    seq = list(seq)
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def ensure_quantity(base: List[Dict], category: str, quantity: int) -> List[Dict]:
    items: List[Dict] = []
    idx = 0
    while len(items) < quantity:
        tmpl = base[idx % len(base)]
        item = tmpl.copy()
        item["id"] = str(uuid.uuid4())
        rand = secrets.token_hex(4)
        item["name"] = f"{tmpl['name']} {category}-{rand}"
        item["category"] = category
        item["created_at"] = datetime.now(timezone.utc).isoformat()
        items.append(item)
        idx += 1
    return items


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


def fetch_products() -> List[Dict]:
    resp = requests.get("https://fakestoreapi.com/products")
    resp.raise_for_status()
    return resp.json()


def main():
    try:
        raw = fetch_products()
        print(f"Fetched {len(raw)} items")
    except Exception as e:
        print(f"Error fetching products: {e}")
        return

    base_products = [normalize_product(p) for p in raw[:50]]
    category_buckets: List[Dict] = []
    for category in TARGET_CATEGORIES:
        items = ensure_quantity(base_products, category, 25)
        category_buckets.extend(items)

    inserted = 0
    for chunk in chunked(category_buckets, 25):
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