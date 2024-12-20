from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.auth import auth_bp
from app.restaurant import restaurant_bp
from app.order import order_bp
from app.main import main_bp
from config import Config

# Initialize SQLAlchemy
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize plugins
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(restaurant_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(main_bp)

    with app.app_context():
        db.create_all()  # Create database tables (only on first run)

    return app
