import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
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

if __name__ == "__main__":
    app.run(debug=True)
