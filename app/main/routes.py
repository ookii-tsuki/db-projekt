from flask import render_template, Blueprint

# Import the blueprint
from app.main import main_bp

# Define the routes for the main blueprint
@main_bp.route("/")
def index():
    return render_template("index.html")

@main_bp.route("/search")
def search():
    return render_template("search.html")