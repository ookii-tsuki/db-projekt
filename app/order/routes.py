from flask import render_template, Blueprint, request, session, jsonify
from werkzeug.exceptions import BadRequest, NotFound
from app.models import db, CartItem, MenuItem, Restaurant, User, Order
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
@order_bp.route("/order-history")
def order_history():
    return render_template("order_history.html")



########################################################################
############################ API ROUTES ################################
########################################################################

# This section is still under construction
# It will only return dummy data for now


# A route for the cart API
# Returns the user cart
@order_bp.route("/api/order/cart", methods=["GET"])
def api_cart():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        cart_items = CartItem.query.filter_by(user_id=user_id).all()

        if not cart_items:
            raise NotFound("Cart is empty.")

        cart = {
            "cart": [
                {
                    "item_id": item.item_id,
                    "restaurant_id": item.restaurant_id,
                    "name": item.menu_item.name,
                    "price": item.menu_item.price,
                    "quantity": item.quantity,
                    "notes": item.notes
                } for item in cart_items
            ]
        }

        return jsonify(cart), 200
    
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
        data = request.get_json()

        item_id = data.get("item_id")
        restaurant_id = data.get("restaurant_id")
        quantity = data.get("quantity")
        notes = data.get("notes")
        user_id = session.get("user_id")

        required_fields = [item_id, restaurant_id, quantity, user_id]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")
        
        item = MenuItem.query.get(item_id)
        restaurant = Restaurant.query.get(restaurant_id)
        user = User.query.get(user_id)

        if not item:
            raise NotFound("Item not found.")
        
        if not restaurant:
            raise NotFound("Restaurant not found.")
        
        if not user:
            raise NotFound("User not found.")
        
        if item.restaurant_id != restaurant_id:
            raise BadRequest("Item does not belong to the specified restaurant.")

        cart_item = CartItem.query.filter_by(
            item_id=item_id,
            restaurant_id=restaurant_id,
            user_id=user_id
        ).first()

        if cart_item:
            cart_item.quantity = quantity
            cart_item.notes = notes
        else:
            cart_item = CartItem(
                item_id=item_id,
                restaurant_id=restaurant_id,
                user_id=user_id,
                quantity=quantity,
                notes=notes
            )
            db.session.add(cart_item)

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
        data = request.get_json()

        item_id = data.get("item_id")
        restaurant_id = data.get("restaurant_id")
        user_id = session.get("user_id")

        required_fields = [item_id, restaurant_id, user_id]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")
        
        cart_item = CartItem.query.filter_by(
            item_id=item_id,
            restaurant_id=restaurant_id,
            user_id=user_id
        ).first()

        if not cart_item:
            raise NotFound("Item not found in cart.")

        db.session.delete(cart_item)
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


# A route for placing an order
# Returns confirmation message
@order_bp.route("/api/order/checkout", methods=["POST"])
def api_checkout():
    try:
        user_id = session.get("user_id")

        if not user_id:
            raise BadRequest("User not logged in.")

        cart_items = CartItem.query.filter_by(user_id=user_id).all()

        if not cart_items:
            raise NotFound("Cart is empty.")

        # Group cart items by restaurant_id
        cart_items_by_restaurant = {}
        for item in cart_items:
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

        db.session.commit()

        # Clear the cart after placing the orders
        for item in cart_items:
            db.session.delete(item)

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
            restaurant = Restaurant.query.get(order.restaurant_id)
            items = MenuItem.query.filter_by(order_id=order.order_id).all()
            order_items = [
                {
                    "item_id": item.item_id,
                    "name": item.menu_item.name,
                    "price": item.menu_item.price,
                    "quantity": item.quantity,
                    "notes": item.notes
                } for item in items
            ]
            order_history.append({
                "order_id": order.order_id,
                "restaurant_id": restaurant.restaurant_id,
                "name": restaurant.name,
                "address": restaurant.address,
                "city": restaurant.city,
                "zip": restaurant.zip_code,
                "items": order_items,
                "total": order.total,
                "status": order.status,
                "date": order.date
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

        # Dummy data
        order_status = [
          {
            "order_id": "1000",
            "restaurant_id": "1999",
            "name": "Doge's Pizza",
            "address": "Doge Street 24",
            "city": "Doge City",
            "zip": "12345",
            "items": [
              {
                "item_id": "1000",
                "name": "Cheese Pizza",
                "price": 10.99,
                "quantity": 2,
                "notes": "Extra cheese."
              }
            ],
            "total": 21.98,
            "status": 0,
            "date": 1734600213
          }
        ]

        if len(order_status) == 0:
            raise NotFound("No active orders found.")

        return jsonify(order_status), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500