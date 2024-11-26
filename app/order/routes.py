from flask import render_template, Blueprint

# Import the blueprint
from app.order import order_bp

# Define the routes for the order blueprint
@order_bp.route("/cart")
def cart():
    return render_template("cart.html")

@order_bp.route("/checkout")
def checkout():
    return render_template("checkout.html")

@order_bp.route("/order-history")
def order_history():
    return render_template("order_history.html")

@order_bp.route("/track-order")
def track_order():
    return render_template("track_order.html")
