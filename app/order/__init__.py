from flask import Blueprint

# Initialize the blueprint for the order module
order_bp = Blueprint("order", __name__, template_folder="templates")

# Import routes after the Blueprint is defined
from app.order import routes
