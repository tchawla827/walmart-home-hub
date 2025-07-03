import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request, g
from functools import wraps
import re
from flask_cors import CORS
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
import jwt

try:
    from .models import db, User  # type: ignore
except ImportError:
    from models import db, User  # type: ignore

load_dotenv()  # Load variables from .env

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
app.config['JWT_EXPIRY_SECONDS'] = int(os.getenv('JWT_EXPIRY_SECONDS', '3600'))

CORS(app)
db.init_app(app)
bcrypt = Bcrypt(app)


def generate_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(seconds=app.config["JWT_EXPIRY_SECONDS"]),
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401
        token = auth_header.split(" ")[1]
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            user = User.query.get(data.get("user_id"))
            if not user:
                raise Exception("User not found")
            g.current_user = user
        except Exception:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)

    return decorated

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
        token = generate_token(str(user.id))
        return jsonify({"token": token})
    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400
    if not re.match(r"^[^@]+@[^@]+\.[^@]+$", email):
        return jsonify({"error": "Invalid email"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already exists"}), 400

    pw_hash = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    token = generate_token(str(user.id))
    return jsonify({"token": token})


@app.route("/api/me", methods=["GET"])
@token_required
def me():
    user = g.current_user
    return jsonify({"id": str(user.id), "email": user.email})

if __name__ == "__main__":
    app.run(debug=True)

