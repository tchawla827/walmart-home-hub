import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import requests

app = Flask(__name__)
# Determine database URL from environment
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SUPABASE_URL') or os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

if not app.config['SQLALCHEMY_DATABASE_URI']:
    raise RuntimeError('Database URL not configured. Set SUPABASE_URL or DATABASE_URL environment variable.')

db = SQLAlchemy(app)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    image_url = db.Column(db.Text)
    category = db.Column(db.Text)
    description = db.Column(db.Text)

def fetch_products():
    """Fetch product data from FakeStore API."""
    resp = requests.get('https://fakestoreapi.com/products', timeout=10)
    resp.raise_for_status()
    return resp.json()

def seed_products():
    """Seed fetched products into the database."""
    products = fetch_products()
    for item in products:
        product = Product(
            id=item.get('id'),
            name=item.get('title'),
            price=item.get('price'),
            image_url=item.get('image'),
            category=item.get('category'),
            description=item.get('description'),
        )
        db.session.merge(product)
    db.session.commit()
    print(f'Seeded {len(products)} products.')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_products()
