from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

# db will be initialized by the main Flask app
# Example:
# from backend.models import db
# db.init_app(app)

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    #updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    pantry_items = db.relationship('PantryItem', back_populates='user', cascade='all, delete-orphan')
    purchases = db.relationship('PurchaseHistory', back_populates='user', cascade='all, delete-orphan')
    reorders = db.relationship('ReorderLog', back_populates='user', cascade='all, delete-orphan')
    streaks = db.relationship('Streak', back_populates='user', cascade='all, delete-orphan')
    gift_prompts = db.relationship('GiftPrompt', back_populates='user', cascade='all, delete-orphan')
    gift_bundles = db.relationship('GiftBundle', back_populates='user', cascade='all, delete-orphan')
    gift_search_history = db.relationship('GiftSearchHistory', back_populates='user', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan')

class PantryItem(db.Model):
    __tablename__ = 'pantry_items'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    quantity = db.Column(db.Float, nullable=False, default=0)
    unit = db.Column(db.String(50))
    rate = db.Column(db.Float)
    frequency = db.Column(db.String(20))
    category = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='pantry_items')
    reorder_logs = db.relationship('ReorderLog', back_populates='pantry_item', cascade='all, delete-orphan')

class PurchaseHistory(db.Model):
    __tablename__ = 'purchase_history'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    item_name = db.Column(db.String(120))
    quantity = db.Column(db.Float)
    price = db.Column(db.Float)
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='purchases')

class ReorderLog(db.Model):
    __tablename__ = 'reorder_log'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    pantry_item_id = db.Column(UUID(as_uuid=True), db.ForeignKey('pantry_items.id'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    quantity = db.Column(db.Float)
    status = db.Column(db.String(50))
    order_details = db.Column(db.JSON)
    ordered_at = db.Column(db.DateTime, default=datetime.utcnow)

    pantry_item = db.relationship('PantryItem', back_populates='reorder_logs')
    user = db.relationship('User', back_populates='reorders')

class Streak(db.Model):
    __tablename__ = 'streaks'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    streak_type = db.Column(db.String(50))
    count = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='streaks')

class GiftPrompt(db.Model):
    __tablename__ = 'gift_prompts'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    prompt = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='gift_prompts')
    bundles = db.relationship('GiftBundle', back_populates='prompt', cascade='all, delete-orphan')

class GiftBundle(db.Model):
    __tablename__ = 'gift_bundles'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    prompt_id = db.Column(UUID(as_uuid=True), db.ForeignKey('gift_prompts.id'), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    items = db.Column(db.JSON)
    total_price = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='gift_bundles')
    prompt = db.relationship('GiftPrompt', back_populates='bundles')

class GiftSearchHistory(db.Model):
    __tablename__ = 'gift_search_history'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    query = db.Column(db.String(255))
    results = db.Column(db.JSON)
    searched_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='gift_search_history')

class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    read = db.Column(db.Boolean, default=False)
    data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', back_populates='notifications')

class Product(db.Model):
    """Product available for purchase."""

    __tablename__ = 'products'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False, default=0)
    image_url = db.Column(db.String(512))
    description = db.Column(db.Text)
    category = db.Column(db.String(120))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
