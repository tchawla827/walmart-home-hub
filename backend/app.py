import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import jwt

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
    if user and bcrypt.check_password_hash(user.password_hash, password):
        payload = {
            "user_id": str(user.id),
            "exp": datetime.utcnow() + timedelta(seconds=app.config["JWT_EXPIRY_SECONDS"]),
        }
        token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route("/api/products", methods=["GET"])
def get_products():
    """Return all products."""
    rows = (
        Product.query.with_entities(
            Product.id,
            Product.name,
            Product.price,
            Product.image_url,
            Product.description,
            Product.category,
        ).all()
    )
    products = [
        {
            "id": str(row.id),
            "name": row.name,
            "price": row.price,
            "image_url": row.image_url,
            "description": row.description,
            "category": row.category,
        }
        for row in rows
    ]
    return jsonify(products)


@app.route("/api/products/<uuid:product_id>", methods=["GET"])
def get_product(product_id):
    """Return a single product by id."""
    row = (
        Product.query.with_entities(
            Product.id,
            Product.name,
            Product.price,
            Product.image_url,
            Product.description,
            Product.category,
        )
        .filter_by(id=product_id)
        .first()
    )
    if not row:
        return jsonify({"error": "Product not found"}), 404
    product = {
        "id": str(row.id),
        "name": row.name,
        "price": row.price,
        "image_url": row.image_url,
        "description": row.description,
        "category": row.category,
    }
    return jsonify(product)

if __name__ == "__main__":
    app.run(debug=True)
