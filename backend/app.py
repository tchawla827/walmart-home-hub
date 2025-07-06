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



# Limited subset of DummyJSON products used for gift bundle generation
DUMMY_PRODUCTS: Dict[int, Dict[str, any]] = {
    1: {"id": 1, "name": "Essence Mascara Lash Princess", "price": 9.99},
    5: {"id": 5, "name": "Red Nail Polish", "price": 8.99},
    6: {"id": 6, "name": "Calvin Klein CK One", "price": 49.99},
    7: {"id": 7, "name": "Chanel Coco Noir Eau De", "price": 129.99},
    8: {"id": 8, "name": "Dior J'adore", "price": 89.99},
    104: {"id": 104, "name": "Apple iPhone Charger", "price": 19.99},
    107: {"id": 107, "name": "Beats Flex Wireless Earphones", "price": 49.99},
    111: {"id": 111, "name": "Selfie Stick Monopod", "price": 12.99},
    83: {"id": 83, "name": "Blue & Black Check Shirt", "price": 29.99},
    93: {"id": 93, "name": "Brown Leather Belt Watch", "price": 89.99},
    163: {"id": 163, "name": "Girl Summer Dress", "price": 19.99},
}




def generate_curated_bundles(prompt: str, budget_range: Optional[Dict[str, float]] = None) -> List[Dict]:
    """Return curated bundles for predefined prompts filtered by budget range."""
    normalized = prompt.lower()

    if "sister" in normalized and "birthday" in normalized:
        # Watch + perfume + beauty item under a typical budget
        base = [
            {
                "title": "Stylish Birthday Picks",
                "items": [
                    DUMMY_PRODUCTS[6],  # perfume
                    DUMMY_PRODUCTS[93],  # watch
                    DUMMY_PRODUCTS[1],  # mascara
                ],
            },
            {
                "title": "Fragrance & Fashion",
                "items": [
                    DUMMY_PRODUCTS[8],  # perfume
                    DUMMY_PRODUCTS[163],  # dress
                    DUMMY_PRODUCTS[5],  # nail polish
                ],
            },
        ]
    elif "brother" in normalized and "wedding" in normalized:
        base = [
            {
                "title": "Groom Essentials",
                "items": [
                    DUMMY_PRODUCTS[93],  # watch
                    DUMMY_PRODUCTS[83],  # shirt
                    DUMMY_PRODUCTS[6],  # cologne
                ],
            },
            {
                "title": "Wedding Prep Kit",
                "items": [
                    DUMMY_PRODUCTS[93],  # watch
                    DUMMY_PRODUCTS[83],  # shirt
                    DUMMY_PRODUCTS[8],  # premium cologne
                ],
            },

        ]
    else:
        # Default fallback using SAMPLE_PRODUCTS
        base = []
        dummy_values = list(DUMMY_PRODUCTS.values())
        for idx in range(2):
            items = random.sample(dummy_values, k=3)
            base.append({"title": f"Bundle {idx + 1}", "items": items})

    min_budget = budget_range.get("min") if budget_range else None
    max_budget = budget_range.get("max") if budget_range else None

    bundles: List[Dict] = []
    for bundle in base:
        total = sum(item["price"] for item in bundle["items"])
        if (min_budget is not None and total < min_budget) or (
            max_budget is not None and total > max_budget
        ):
            continue
        bundles.append({"title": bundle["title"], "items": bundle["items"], "totalPrice": round(total, 2)})
    if not bundles:
        # If nothing met the budget criteria, return all bundles unfiltered
        bundles = [
            {
                "title": b["title"],
                "items": b["items"],
                "totalPrice": round(sum(i["price"] for i in b["items"]), 2),
            }
            for b in base
        ]


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


@app.route("/api/products/search", methods=["GET"])
def search_products():
    """Search products by query string using DummyJSON."""
    query = (request.args.get("q") or "").strip()
    if not query:
        return jsonify([])
    try:
        resp = requests.get(
            "https://dummyjson.com/products/search", params={"q": query}
        )
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException:
        return jsonify({"error": "Failed to search products"}), 500

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


@app.route("/api/gift-bundles", methods=["POST"])
def gift_bundles():
    """Generate curated gift bundles based on prompt and budget range."""
    data = request.get_json() or {}
    prompt = (data.get("prompt") or "").strip()
    budget_range = data.get("budgetRange") or {}

    if not prompt:
        return jsonify({"error": "Prompt required"}), 400

    try:
        br = {
            "min": float(budget_range.get("min", 0)),
            "max": float(budget_range.get("max", 0)),
        }
    except (TypeError, ValueError):
        br = {}

    bundles = generate_curated_bundles(prompt, br)
    return jsonify({"bundles": bundles})




if __name__ == "__main__":
    app.run(debug=True)
