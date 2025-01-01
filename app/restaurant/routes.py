from flask import render_template, Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, NotFound

# Import the blueprint
from app.restaurant import restaurant_bp


########################################################################
############################ PAGE ROUTES ###############################
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


########################################################################
############################ API ROUTES ################################
########################################################################

# This section is still under construction
# It will only return dummy data for now


# A route for the restaurant existing items API
# Returns the restaurant existing menu items
@restaurant_bp.route("/api/restaurant/items", methods=["GET"])
def api_menu():
    try:

        # Dummy data
        menu = [
          {
            "item_id": "1090",
            "name": "Shoyu Ramen",
            "price": 14.99,
            "description": "A soy sauce-based noodle soup with a clear brown broth, thin wheat noodles, and toppings like green onions, bamboo shoots, boiled egg, and fish cake.",
            "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
          }
        ]

        if len(menu) == 0:
            raise NotFound(description="Menu is empty.")

        return jsonify(menu), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant new item API
# Adds a new item to the restaurant menu
@restaurant_bp.route("/api/restaurant/add_item", methods=["POST"])
def api_add_item():
    try:
        data = request.get_json()

        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        image = data.get("image")

        required_fields = [name, price]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")

        return jsonify({"message": "Item successfully added to the menu."}), 201
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant update item API
# Updates an existing item in the restaurant menu
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["PUT"])
def api_update_item(item_id):
    try:
        item_exists = True

        if not item_exists or not item_id:
            raise NotFound("Item not found.")
        
        data = request.get_json()

        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        image = data.get("image")

        required_fields = [name, price]

        if not all(required_fields):
            raise BadRequest("Missing required fields.")

        return jsonify({"message": "Item successfully updated."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant delete item API
# Deletes an existing item from the restaurant menu
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["DELETE"])
def api_delete_item(item_id):
    try:
        item_exists = True

        if not item_exists or not item_id:
            raise NotFound("Item not found.")

        return jsonify({"message": "Item successfully deleted."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant orders status API
# Returns the restaurant's active orders.
@restaurant_bp.route("/api/restaurant/orders/status", methods=["GET"])
def api_orders_status():
    try:

        # Dummy data
        orders = [
          {
            "order_id": "1000",
            "user_id": "1000",
            "name": "Doge Mustermann",
            "address": "Doge Street 23",
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

        if len(orders) == 0:
            raise NotFound(description="No active orders.")

        return jsonify(orders), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for the update order status API
# Updates the status of an order
@restaurant_bp.route("/api/restaurant/orders/order/<order_id>", methods=["PUT"])
def api_update_order_status(order_id):
    try:
        order_exists = True

        if not order_exists or not order_id:
            raise NotFound("Order not found.")
        
        data = request.get_json()

        status = data.get("status")

        if not status:
            raise BadRequest("Missing required fields.")

        return jsonify({"message": "Order status successfully updated."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant order history API
# Returns the restaurant's order history
@restaurant_bp.route("/api/restaurant/orders/history", methods=["GET"])
def api_order_history():
    try:

        # Dummy data
        orders = [
          {
            "order_id": "1000",
            "user_id": "1000",
            "name": "Doge Mustermann",
            "address": "Doge Street 23",
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
            "status": 3,
            "date": 1734600213
          }
        ]
        if len(orders) == 0:
            raise NotFound(description="No order history.")

        return jsonify(orders), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for the restaurant statistics API
# Returns the restaurant's statistics
@restaurant_bp.route("/api/restaurant/stats", methods=["GET"])
def api_stats():
    try:

        # Dummy data
        stats = {
          "total_orders": 100,
          "total_revenue": 10000.00,
          "average_rating": 4.5
        }

        return jsonify(stats), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500