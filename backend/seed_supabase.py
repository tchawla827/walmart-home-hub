import os
import uuid
import random

from flask import Flask
from dotenv import load_dotenv

from models import db, User, Product, GiftPrompt, GiftBundle, GiftSearchHistory

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SUPABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize db
# db is imported from models
# but we need to call db.init_app
# because this script runs standalone


def seed_products():
    categories = ['groceries', 'fashion', 'electronics', 'home', 'beauty', 'toys']
    products = []
    product_id = 1
    for category in categories:
        for i in range(25):
            product = Product(
                id=product_id,
                name=f"{category.capitalize()} Item {i+1}",
                price=round(random.uniform(5.0, 200.0), 2),
                image_url=f"https://example.com/images/{category}{i+1}.jpg",
                category=category,
                description=f"Description for {category} item {i+1}."
            )
            db.session.merge(product)
            products.append(product)
            product_id += 1
    db.session.commit()
    print("Seeded 150 products across 6 categories")
    return products


def seed_user():
    user = User(id=uuid.uuid4(), email="demo@walmartapp.com", name="Demo User")
    db.session.merge(user)
    db.session.commit()
    print("Created demo user: demo@walmartapp.com")
    return user


def seed_gift_prompts(user):
    prompts_text = [
        "Gift for mom’s birthday",
        "Fitness gift under $100",
        "Gaming bundle for teenager",
        "Self-care package",
        "Tech gadgets for dad",
        "Budget-friendly kitchen tools",
        "Outdoor adventure kit",
        "Beauty essentials",
        "New baby welcome",
        "Cozy home accessories"
    ]
    gift_prompts = []
    for text in prompts_text:
        prompt = GiftPrompt(id=uuid.uuid4(), user_id=user.id, prompt=text)
        db.session.merge(prompt)
        gift_prompts.append(prompt)
    db.session.commit()
    return gift_prompts


def seed_gift_bundles(user, prompts, products):
    bundles = []
    for prompt in prompts:
        for _ in range(random.randint(1, 2)):
            items = random.sample(products, random.randint(3, 5))
            item_dicts = [
                {
                    'id': p.id,
                    'name': p.name,
                    'price': float(p.price),
                    'image_url': p.image_url,
                    'category': p.category,
                }
                for p in items
            ]
            total_price = sum(p.price for p in items)
            bundle = GiftBundle(
                id=uuid.uuid4(),
                user_id=user.id,
                prompt_id=prompt.id,
                title=f"Bundle for {prompt.prompt[:20]}",
                items=item_dicts,
                total_price=float(total_price)
            )
            db.session.merge(bundle)
            bundles.append(bundle)
    db.session.commit()
    return bundles


def seed_search_history(user, prompts, bundles):
    count = 0
    for prompt in prompts:
        related_bundles = [b for b in bundles if b.prompt_id == prompt.id]
        results_data = [
            {'id': str(b.id), 'title': b.title, 'total_price': b.total_price}
            for b in related_bundles
        ]
        history = GiftSearchHistory(
            id=uuid.uuid4(),
            user_id=user.id,
            query=prompt.prompt,
            results=results_data
        )
        db.session.merge(history)
        count += 1
    db.session.commit()
    return count


def seed_all():
    db.create_all()
    products = seed_products()
    user = seed_user()
    prompts = seed_gift_prompts(user)
    bundles = seed_gift_bundles(user, prompts, products)
    history_count = seed_search_history(user, prompts, bundles)
    print(
        f"Generated {len(prompts)} gift prompts, {len(bundles)} gift bundles, {history_count} search history entries")


if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        seed_all()
