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

    # Beziehungen
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
    cuisine = db.Column(db.String(100), nullable=True)  # Art der Küche (z. B. "Pizza")

    # Beziehungen 
    menu_items = db.relationship('MenuItem', backref='restaurant', lazy=True)
    opening_hours = db.relationship('OpeningHour', backref='restaurant', lazy=True)

    def __repr__(self):
        return (
            f"<Restaurant ID: {self.restaurant_id}, "
            f"Name: {self.name}, "
            f"Address: {self.address}, {self.city} {self.zip_code}, "
            f"Cuisine: {self.cuisine}, "
            f"Rating: {self.rating}>"
        )


class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(255), nullable=True)
    image = db.Column(db.Text, nullable=True)

    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)

    def __repr__(self):
        return (
            f"<MenuItem ID: {self.item_id}, "
            f"Name: {self.name}, "
            f"Price: {self.price}, "
            f"Description: {self.description}>"
        )


class Cart(db.Model):
    __tablename__ = 'carts'

    cart_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)

    # Beziehungen
    user = db.relationship('User', backref=db.backref('cart', uselist=False))
    cart_items = db.relationship('OrderItem', backref='cart', lazy=True)

    def __repr__(self):
        return f"<Cart ID: {self.cart_id}, User ID: {self.user_id}>"
    
    
class OrderItem(db.Model):
    __tablename__ = 'order_items'

    order_item_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=True)
    cart_id = db.Column(db.Integer, db.ForeignKey('carts.cart_id'), nullable=True)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    notes = db.Column(db.String(255), nullable=True)

    # Beziehungen
    order = db.relationship('Order', backref=db.backref('order_items', lazy=True))
    menu_item = db.relationship('MenuItem', backref='order_items', lazy=True)

    def __repr__(self):
        return (
            f"<OrderItem Order ID: {self.order_id}, "
            f"Cart ID: {self.cart_id}, "
            f"Item ID: {self.item_id}, "
            f"Restaurant ID: {self.restaurant_id}, "
            f"Quantity: {self.quantity}, "
            f"Notes: {self.notes}>"
        )


class Order(db.Model):
    __tablename__ = 'orders'

    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.Integer, nullable=False, default=0)  # 0: Ausstehend, 1: In Bearbeitung, etc.
    date = db.Column(db.DateTime, nullable=False, default=db.func.now())

    # Beziehungen
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    restaurant = db.relationship('Restaurant', backref=db.backref('orders', lazy=True))

    def __repr__(self):
        return (
            f"<Order ID: {self.order_id}, "
            f"User ID: {self.user_id}, "
            f"Restaurant ID: {self.restaurant_id}, "
            f"Total: {self.total:.2f}, "
            f"Status: {self.status}, "
            f"Date: {self.date}>"
        )


class LieferspatzRevenue(db.Model):
    __tablename__ = 'lieferspatz_revenue'

    revenue_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    total_revenue = db.Column(db.Float, nullable=False, default=0.0)  # Gesamtumsatz der Plattform

    def __repr__(self):
        return f"<LieferspatzRevenue ID: {self.revenue_id}, Total Revenue: {self.total_revenue:.2f}>"
        

class OpeningHour(db.Model):
    __tablename__ = 'opening_hours'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    day_of_week = db.Column(db.Integer, nullable=False, default=0)  # 0: 'Monday' - 6: 'Sunday'
    open_time = db.Column(db.Time, nullable=False)
    close_time = db.Column(db.Time, nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.restaurant_id'), nullable=False)

    def __repr__(self):
        return (
            f"<OpeningHour ID: {self.id}, "
            f"Day: {self.day_of_week}, "
            f"Open: {self.open_time}, "
            f"Close: {self.close_time}>"
        )
