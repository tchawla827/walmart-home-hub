import os
import random
from datetime import datetime
from flask import Flask
from backend.models import db, User, PantryItem, GiftPrompt, GiftBundle


def seed():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        db.create_all()

        # Create or get test user
        user = User.query.filter_by(email='test@demo.com').first()
        if not user:
            user = User(email='test@demo.com', name='Test User')
            db.session.add(user)
            db.session.commit()

        # Clear existing data
        PantryItem.query.delete()
        GiftBundle.query.delete()
        GiftPrompt.query.delete()
        db.session.commit()

        categories = ['Grocery', 'Electronics', 'Home', 'Toys', 'Fashion', 'Sports']
        unit_map = {
            'Grocery': ['g', 'ml', 'pcs'],
            'Electronics': ['pcs'],
            'Home': ['pcs'],
            'Toys': ['pcs'],
            'Fashion': ['pcs'],
            'Sports': ['pcs']
        }

        items = []
        now = datetime.utcnow()
        for category in categories:
            for i in range(50):
                unit = random.choice(unit_map[category])
                quantity = random.randint(1, 100)
                rate = round(random.uniform(0.1, 1.0), 2) if category in ['Grocery', 'Fashion'] else 0
                item = PantryItem(
                    user_id=user.id,
                    name=f'{category} Item {i+1}',
                    quantity=quantity,
                    unit=unit,
                    rate=rate,
                    category=category,
                    created_at=now,
                    updated_at=now
                )
                items.append(item)
        db.session.add_all(items)
        db.session.commit()

        prompts = []
        for i in range(10):
            parsed_data = {
                'recipient': f'Recipient {i+1}',
                'occasion': random.choice(['Birthday', 'Anniversary', 'Graduation']),
                'interests': random.choice(['Tech', 'Fashion', 'Sports', 'Home']),
                'budget': random.choice([25, 50, 100, 150])
            }
            prompt_text = f"Gift ideas for {parsed_data['recipient']} on {parsed_data['occasion']}"
            prompt = GiftPrompt(
                user_id=user.id,
                prompt=prompt_text,
                created_at=now
            )
            prompts.append(prompt)
        db.session.add_all(prompts)
        db.session.commit()

        bundles = []
        for prompt in prompts:
            for _ in range(random.randint(1, 2)):
                num_items = random.randint(1, 4)
                bundle_items = []
                total_price = 0
                for j in range(num_items):
                    price = round(random.uniform(5, 50), 2)
                    bundle_items.append({'name': f'Item {j+1}', 'price': price})
                    total_price += price
                bundle = GiftBundle(
                    user_id=user.id,
                    prompt_id=prompt.id,
                    title=f'Bundle for {prompt.prompt}',
                    items=bundle_items,
                    total_price=round(total_price, 2),
                    created_at=now
                )
                bundles.append(bundle)
        db.session.add_all(bundles)
        db.session.commit()

        print('✅ Mock data seeded successfully')


if __name__ == '__main__':
    seed()
