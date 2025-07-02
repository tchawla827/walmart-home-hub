import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return jsonify({
        "message": "SmartPantry backend running!",
        "openai_key_loaded": bool(os.getenv("OPENAI_API_KEY"))
    })

if __name__ == "__main__":
    app.run(debug=True)
