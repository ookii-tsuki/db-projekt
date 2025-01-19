from flask import Blueprint

# Initialize the blueprint for the main module
main_bp = Blueprint("main", __name__, template_folder="templates")

# Import routes after the Blueprint is defined
from app.main import routes

from app.main import nearby_finder