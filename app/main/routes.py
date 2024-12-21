from flask import render_template, Blueprint

# Import the blueprint
from app.main import main_bp



#######################################################################
############################ PAGE ROUTES ##############################
#######################################################################

# Create a route for the index page
# The route will return the index.html template
@main_bp.route("/")
def index():
    return render_template("index.html")

# Create a route for the about page
# The route will return the about.html template
@main_bp.route("/search")
def search():
    return render_template("search.html")

# Create a route for the menu page
# The route will return the menu.html template
@main_bp.route("/menu")
def menu():
    return render_template("menu.html")