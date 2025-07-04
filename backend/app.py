import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import jwt
import requests
from sqlalchemy import inspect, text

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


ensure_user_schema()

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

if __name__ == "__main__":
    app.run(debug=True)
