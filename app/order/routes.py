from flask import render_template, Blueprint

# Import the blueprint
from app.order import order_bp


########################################################################
############################ PAGE ROUTES ##############################
########################################################################

# Create a route for the cart page
# The route will return the cart.html template
@order_bp.route("/cart")
def cart():
    return render_template("cart.html")

# Create a route for the checkout page
# The route will return the checkout.html template
@order_bp.route("/checkout")
def checkout():
    return render_template("checkout.html")

# Create a route for the order history page
# The route will return the order_history.html template
@order_bp.route("/order-history")
def order_history():
    return render_template("order_history.html")