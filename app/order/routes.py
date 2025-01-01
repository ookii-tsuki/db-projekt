from flask import render_template, Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, NotFound

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

        # Dummy data
        cart = {
            "cart": [
                    {
                      "item_id": "1000",
                      "restaurant_id": "1999",
                      "name": "Cheese Pizza",
                      "price": 10.99,
                      "quantity": 2,
                      "notes": "Extra cheese."
                    }
                  ]
        }

        # check if the cart is empty
        if len(cart["cart"]) == 0:
            raise NotFound(description="Cart is empty.")

        return jsonify(cart), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for adding an item to the cart
# Returns confirmation message
@order_bp.route("/api/order/add_cart", methods=["POST"])
def api_add_cart():
    try:
        data = request.get_json()

        # Dummy data
        item_id = data.get("item_id")
        restaurant_id = data.get("restaurant_id")
        quantity = data.get("quantity")
        notes = data.get("notes")

        required_fields = [item_id, restaurant_id, quantity]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")
        
        item_exists = True

        if not item_exists:
            raise NotFound("Item not found.")

        return jsonify({"message": "Item added to cart."}), 201
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for removing an item from the cart
# Returns confirmation message
@order_bp.route("/api/order/remove_cart", methods=["POST"])
def api_remove_cart():
    try:
        data = request.get_json()

        # Dummy data
        item_id = data.get("item_id")
        restaurant_id = data.get("restaurant_id")

        required_fields = [item_id, restaurant_id]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")
        
        item_exists = True

        if not item_exists:
            raise NotFound("Item not found.")

        return jsonify({"message": "Item removed from cart."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for placing an order
# Returns confirmation message
@order_bp.route("/api/order/checkout", methods=["POST"])
def api_checkout():
    try:

        cart = []

        if len(cart) == 0:
            raise NotFound("Cart is empty.")
        
        return jsonify({"message": "Order placed successfully."}), 201
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for getting the order history
# Returns the order history
@order_bp.route("/api/order/history", methods=["GET"])
def api_order_history():
    try:

        # Dummy data
        order_history = [
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
        if len(order_history) == 0:
            raise NotFound("No orders found.")

        return jsonify(order_history), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


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