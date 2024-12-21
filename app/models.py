from app import db


class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(60), nullable=False)
    last_name = db.Column(db.String(60), nullable=False)
    address = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    wallet = db.Column(db.Float, nullable=False, default=0.0)

    favorites = db.relationship(
        'Restaurant',
        secondary='favorites',
        backref=db.backref('favorited_by', lazy='dynamic')
    )

    def __repr__(self):
        return (
            f"<User ID: {self.user_id}, "
            f"Name: {self.first_name} {self.last_name}, "
            f"Email: {self.email}, "
            f"Address: {self.address}, {self.city} {self.zip_code}, "
            f"Wallet: {self.wallet:.2f}>"
        )


favorites = db.Table(
    'favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.user_id'), primary_key=True),
    db.Column('restaurant_id', db.Integer, db.ForeignKey('restaurants.restaurant_id'), primary_key=True)
)


class Restaurant(db.Model):
    __tablename__ = 'restaurants'

    restaurant_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    address = db.Column(db.String(120), nullable=False)
    city = db.Column(db.String(60), nullable=False)
    zip_code = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    wallet = db.Column(db.Float, nullable=False, default=0.0)
    banner = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, nullable=True)  # Bewertung (z. B. 4.5)
    approx_delivery_time = db.Column(db.String(50), nullable=True)  # Lieferzeit als String
    is_favorite = db.Column(db.Boolean, default=False)  # Favorit
    cuisine = db.Column(db.String(100), nullable=True)  # Art der Küche (z. B. "Pizza")

    # Beziehung zu MenuItem
    menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True)

    def to_dict(self):
        return {
            "restaurant_id": self.restaurant_id,
            "name": self.name,
            "address": self.address,
            "city": self.city,
            "zip": self.zip_code,
            "description": self.description,
            "rating": self.rating,
            "approx_delivery_time": self.approx_delivery_time,
            "is_favorite": self.is_favorite,
            "banner": self.banner,
            "cuisine": self.cuisine
        }


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.Text, nullable=True)

    # Fremdschlüssel zu Restaurant
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)

    def to_dict(self):
        return {
            "item_id": self.item_id,
            "name": self.name,
            "price": self.price,
            "description": self.description,
            "image": self.image
        }
