from flask import render_template, Blueprint

# Import the blueprint
from app.restaurant import restaurant_bp


########################################################################
############################ PAGE ROUTES ##############################
########################################################################


# Create a route for the restaurant dashboard page
# The route will return the dashboard.html template
@restaurant_bp.route("/restaurant/dashboard")
def dashboard():
    return render_template("dashboard.html")

# Create a route for the restaurant menu page
# The route will return the menu.html template
@restaurant_bp.route("/restaurant/menu")
def menu():
    return render_template("menu.html")

# Create a route for the restaurant orders page
# The route will return the orders.html template
@restaurant_bp.route("/restaurant/orders")
def orders():
    return render_template("orders.html")

# Create a route for the restaurant order history page
# The route will return the order_history.html template
@restaurant_bp.route("/restaurant/order-history")
def order_history():
    return render_template("order_history.html")