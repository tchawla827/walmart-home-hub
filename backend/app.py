import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import jwt
import requests
from sqlalchemy import inspect, text
import random
from typing import List, Dict, Optional

try:
    from .models import db, User , Product # type: ignore
except ImportError:
    from models import db, User , Product  # type: ignore

load_dotenv()  # Load variables from .env

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['JWT_EXPIRY_SECONDS'] = int(os.getenv('JWT_EXPIRY_SECONDS', '3600'))

CORS(app)
db.init_app(app)
# db.init_app(app) #uncomment this
bcrypt = Bcrypt(app)


def ensure_user_schema() -> None:
    """Add missing columns in the users table if they are absent."""
    with app.app_context():
        inspector = inspect(db.engine)
        if inspector.has_table("users"):
            columns = [c["name"] for c in inspector.get_columns("users")]
            if "hashed_password" not in columns:
                with db.engine.begin() as conn:
                    conn.execute(
                        text(
                            "ALTER TABLE users ADD COLUMN hashed_password VARCHAR(255)"
                        )
                    )
        else:
            # Table doesn't exist yet; create all tables based on models
            db.create_all()


ensure_user_schema()

# Sample product catalog used for mock gift bundle generation
SAMPLE_PRODUCTS: List[Dict[str, any]] = [
    {
        "name": "Organic Apples",
        "price": 3.99,
        "imageUrl": "https://via.placeholder.com/300?text=Apples",
        "description": "Crisp organic apples picked fresh from local farms.",
    },
    {
        "name": "Wireless Headphones",
        "price": 59.99,
        "imageUrl": "https://via.placeholder.com/300?text=Headphones",
        "description": "Bluetooth headphones with noise cancellation.",
    },
    {
        "name": "Smart LED TV",
        "price": 399.99,
        "imageUrl": "https://via.placeholder.com/300?text=TV",
        "description": "40-inch smart TV with built-in streaming apps.",
    },
    {
        "name": "Comforter Set",
        "price": 79.99,
        "imageUrl": "https://via.placeholder.com/300?text=Comforter",
        "description": "Plush queen-size comforter set to keep you cozy.",
    },
    {
        "name": "Action Figure",
        "price": 14.99,
        "imageUrl": "https://via.placeholder.com/300?text=Action+Figure",
        "description": "Collectible action figure with movable joints.",
    },
    {
        "name": "Women's Sneakers",
        "price": 49.99,
        "imageUrl": "https://via.placeholder.com/300?text=Sneakers",
        "description": "Comfortable sneakers perfect for everyday wear.",
    },
    {
        "name": "Yoga Mat",
        "price": 19.99,
        "imageUrl": "https://via.placeholder.com/300?text=Yoga+Mat",
        "description": "Non-slip yoga mat providing excellent grip.",
    },
    {
        "name": "Blender",
        "price": 29.99,
        "imageUrl": "https://via.placeholder.com/300?text=Blender",
        "description": "High-speed blender ideal for smoothies.",
    },
    {
        "name": "Kids T-shirt",
        "price": 9.99,
        "imageUrl": "https://via.placeholder.com/300?text=Tshirt",
        "description": "Soft cotton T-shirt with fun prints.",
    },
    {
        "name": "Chocolate Cookies",
        "price": 2.99,
        "imageUrl": "https://via.placeholder.com/300?text=Cookies",
        "description": "Rich chocolate chip cookies baked to perfection.",
    },
]


def generate_mock_bundles(prompt: str, budget: Optional[float] = None) -> List[Dict]:
    """Generate mock gift bundles."""
    bundles: List[Dict] = []
    num_bundles = random.randint(2, 3)

    for idx in range(num_bundles):
        num_items = random.randint(3, 5)
        items = random.sample(SAMPLE_PRODUCTS, k=min(num_items, len(SAMPLE_PRODUCTS)))

        total = sum(item["price"] for item in items)

        if budget is not None:
            # Remove expensive items until under budget
            items_sorted = sorted(items, key=lambda i: i["price"])
            while total > budget and len(items_sorted) > 1:
                removed = items_sorted.pop()
                total -= removed["price"]
            items = items_sorted

        bundles.append(
            {
                "title": f"Bundle {idx + 1}",
                "items": items,
                "totalPrice": round(total, 2),
            }
        )

    if budget is not None:
        bundles = [b for b in bundles if b["totalPrice"] <= budget * 1.05] or bundles

    return bundles

@app.route("/")
def hello():
    return jsonify({
        "message": "SmartPantry backend running!",
        "openai_key_loaded": bool(os.getenv("OPENAI_API_KEY"))
    })


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.hashed_password, password):
        payload = {
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(seconds=app.config["JWT_EXPIRY_SECONDS"]),
        }
        token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, hashed_password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return (
        jsonify({"id": str(user.id), "email": user.email}),
        201,
    )

@app.route("/api/products", methods=["GET"])
def get_products():
    """Fetch the first 100 products from DummyJSON."""
    try:
        resp = requests.get(
            "https://dummyjson.com/products", params={"limit": 100, "skip": 0}
        )
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException:
        return jsonify({"error": "Failed to fetch products"}), 500

    return jsonify(data.get("products", []))


@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id: int):
    """Fetch a single product by id from DummyJSON."""
    try:
        resp = requests.get(f"https://dummyjson.com/products/{product_id}")
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException:
        return jsonify({"error": "Failed to fetch product"}), 500

    return jsonify(data)


@app.route("/api/giftgenius/chat", methods=["POST"])
def giftgenius_chat():
    data = request.get_json() or {}
    prompt = (data.get("prompt") or "").strip()
    budget = data.get("budget")
    if not prompt:
        return jsonify({"error": "Prompt required"}), 400

    try:
        budget_val: Optional[float] = float(budget) if budget is not None else None
    except (TypeError, ValueError):
        budget_val = None

    bundles = generate_mock_bundles(prompt, budget_val)
    return jsonify({"bundles": bundles})

if __name__ == "__main__":
    app.run(debug=True)
