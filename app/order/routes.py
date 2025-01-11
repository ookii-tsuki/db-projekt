from flask import render_template, Blueprint, request, session, jsonify
from werkzeug.exceptions import BadRequest, NotFound
from app.models import db, Cart, MenuItem, Restaurant, User, Order, OrderItem
from datetime import datetime
# Import the blueprint
from app.order import order_bp


########################################################################
############################ PAGE ROUTES ###############################
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
@order_bp.route("/past_orders")
def order_history():
    return render_template("past_orders.html")



########################################################################
############################ API ROUTES ################################
########################################################################


# A route for the cart API
# Returns the user cart
@order_bp.route("/api/order/cart", methods=["GET"])
def api_cart():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        cart = Cart.query.filter_by(user_id=user_id).first()

        if not cart or not cart.cart_items:
            raise NotFound("Cart is empty.")

        cart_items = [
            {
                "item_id": item.item_id,
                "name": item.menu_item.name,
                "price": item.menu_item.price,
                "quantity": item.quantity,
                "notes": item.notes
            } for item in cart.cart_items
        ]

        return jsonify(cart_items), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500
    

# A route for adding an item to the cart
# Returns confirmation message
@order_bp.route("/api/order/add_cart", methods=["POST"])
def api_add_cart():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        data = request.get_json()
        item_id = data.get("item_id")
        quantity = data.get("quantity", 1)
        notes = data.get("notes", "")

        if not item_id:
            raise BadRequest("Item ID is required.")

        menu_item = MenuItem.query.get(item_id)
        if not menu_item:
            raise NotFound("Menu item not found.")

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            db.session.add(cart)
            db.session.flush()  # Ensure cart_id is generated

        order_item = OrderItem(
            cart_id=cart.cart_id,
            item_id=item_id,
            restaurant_id=menu_item.restaurant_id,
            quantity=quantity,
            notes=notes
        )
        db.session.add(order_item)
        db.session.commit()

        return jsonify({"message": "Item added to cart."}), 201
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500

# A route for removing an item from the cart
# Returns confirmation message
@order_bp.route("/api/order/remove_cart", methods=["POST"])
def api_remove_cart():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        data = request.get_json()
        item_id = data.get("item_id")

        if not item_id:
            raise BadRequest("Item ID is required.")

        cart = Cart.query.filter_by(user_id=user_id).first()
        if not cart:
            raise NotFound("Cart not found.")

        order_item = OrderItem.query.filter_by(cart_id=cart.cart_id, item_id=item_id).first()
        if not order_item:
            raise NotFound("Item not found in cart.")

        db.session.delete(order_item)
        db.session.commit()

        return jsonify({"message": "Item removed from cart."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500


@order_bp.route("/api/order/checkout", methods=["POST"])
def api_checkout():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        cart = Cart.query.filter_by(user_id=user_id).first()

        if not cart or not cart.cart_items:
            raise NotFound("Cart is empty.")

        # Group cart items by restaurant_id
        cart_items_by_restaurant = {}
        for item in cart.cart_items:
            if item.restaurant_id not in cart_items_by_restaurant:
                cart_items_by_restaurant[item.restaurant_id] = []
            cart_items_by_restaurant[item.restaurant_id].append(item)

        # Create an order for each restaurant
        for restaurant_id, items in cart_items_by_restaurant.items():
            total = sum(item.menu_item.price * item.quantity for item in items)
            order = Order(
                user_id=user_id,
                restaurant_id=restaurant_id,
                total=total,
                status=0
            )
            db.session.add(order)
            db.session.flush()  # Ensure order_id is generated

            # Transfer cart items to order items
            for item in items:
                item.order_id = order.order_id
                item.cart_id = None

        db.session.commit()

        # Clear the cart after placing the orders
        db.session.delete(cart)
        db.session.commit()

        return jsonify({"message": "Orders placed successfully."}), 201
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500
    


# A route for getting the order history
# Returns the order history
@order_bp.route("/api/order/history", methods=["GET"])
def api_order_history():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        orders = Order.query.filter_by(user_id=user_id).all()

        if not orders:
            raise NotFound("No orders found.")

        order_history = []
        for order in orders:
            items = [
                {
                    "item_id": item.item_id,
                    "name": item.menu_item.name,
                    "price": item.menu_item.price,
                    "quantity": item.quantity,
                    "notes": item.notes
                } for item in order.order_items
            ]
            order_history.append({
                "order_id": order.order_id,
                "restaurant_id": order.restaurant_id,
                "name": order.restaurant.name,
                "address": order.restaurant.address,
                "city": order.restaurant.city,
                "zip": order.restaurant.zip_code,
                "items": items,
                "total": order.total,
                "status": order.status,
                "date": int(order.date.timestamp())
            })

        return jsonify(order_history), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500


# A route for getting the order status
# Returns the status of all active orders
@order_bp.route("/api/order/status", methods=["GET"])
def api_order_status():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        # Fetch orders with status not equal to 3 (delivered) or 4 (rejected)
        orders = Order.query.filter(Order.user_id == user_id, Order.status.notin_([3, 4])).all()

        if not orders:
            raise NotFound("No active orders found.")

        order_status = []
        for order in orders:
            items = [
                {
                    "item_id": item.item_id,
                    "name": item.menu_item.name,
                    "price": item.menu_item.price,
                    "quantity": item.quantity,
                    "notes": item.notes
                } for item in order.order_items
            ]
            order_status.append({
                "order_id": order.order_id,
                "restaurant_id": order.restaurant_id,
                "name": order.restaurant.name,
                "address": order.restaurant.address,
                "city": order.restaurant.city,
                "zip": order.restaurant.zip_code,
                "items": items,
                "total": order.total,
                "status": order.status,
                "timestamp": int(order.date.timestamp())
            })

        return jsonify(order_status), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500