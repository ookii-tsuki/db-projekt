from flask import render_template, Blueprint

# Import the blueprint
from app.auth import auth_bp

# Define the routes for the main blueprint
@auth_bp.route("/login")
def login():
    return render_template("login.html")

@auth_bp.route("/signup")
def signup():
    return render_template("signup.html")