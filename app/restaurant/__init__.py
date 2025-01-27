from flask import Blueprint

restaurant_bp = Blueprint("restaurant", __name__, template_folder="templates")

from app.restaurant import routes

