from flask import render_template, Blueprint

# Import the blueprint
from app.auth import auth_bp


########################################################################
############################# PAGE ROUTES ##############################
########################################################################

# Create a route for the login page
# The route will return the login.html template
@auth_bp.route("/users/login")
def user_login():
    return render_template("user_login.html")

# Create a route for the register page
# The route will return the user_register.html template 
@auth_bp.route("/users/register")
def user_register():
    return render_template("user_register.html")

# Create a route for the restaurant login page
# The route will return the restaurant_login.html template
@auth_bp.route("/restaurant/login")
def restaurant_login():
    return render_template("restaurant_login.html")

# Create a route for the restaurant register page
# The route will return the restaurant_register.html template
@auth_bp.route("/restaurant/register")
def restaurant_register():
    return render_template("restaurant_register.html")