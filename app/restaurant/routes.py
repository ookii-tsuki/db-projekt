from flask import render_template, Blueprint, request, jsonify, session
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from app.models import MenuItem, Order, db, Restaurant, User  # Import der benötigten Modelle
from app.order_services import dispatch_order_schedule
import traceback

# Import the blueprint
from app.restaurant import restaurant_bp

########################################################################
############################ PAGE ROUTES ###############################
########################################################################

@restaurant_bp.route("/restaurant/dashboard")
def dashboard():
    return render_template("dashboard.html")

@restaurant_bp.route("/restaurant/menu")
def menu():
    return render_template("menu.html")

@restaurant_bp.route("/restaurant/orders")
def orders():
    return render_template("orders.html")

# Create a route for the restaurant order history page
# The route will return the order_history.html template
@restaurant_bp.route("/restaurant/order_history")
def order_history():
    return render_template("order_history.html")

########################################################################
############################ API ROUTES ################################
########################################################################

# API-Route für das Abrufen der Menü-Items
@restaurant_bp.route("/api/restaurant/items", methods=["GET"])
def api_menu():
    try:
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")

        menu_items = MenuItem.query.filter_by(restaurant_id=restaurant_id).all()
        if not menu_items:
            raise NotFound("Menu is empty.")

        menu = [
            {
                "item_id": item.item_id,
                "name": item.name,
                "price": item.price,
                "description": item.description,
                "image": item.image,
            }
            for item in menu_items
        ]
        return jsonify(menu), 200

    except Unauthorized as e:
        return jsonify({"message": str(e)}), 401
    except NotFound as e:
        return jsonify({"message": "No items found."}), 404
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500
    
# API-Route für das Hinzufügen eines Menü-Items
@restaurant_bp.route("/api/restaurant/add_item", methods=["POST"])
def api_add_item():
    try:
       
        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")

        # JSON-Daten aus der Anfrage abrufen
        data = request.get_json()

        # Benötigte Felder aus den Daten extrahieren
        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        image = data.get("image")

        # Überprüfen, ob die erforderlichen Felder vorhanden sind
        required_fields = [name, price]
        if not all(required_fields):
            raise BadRequest("Missing required fields.")

        # Neues Menü-Item erstellen
        new_item = MenuItem(
            name=name,
            price=price,
            description=description,
            image=image,
            restaurant_id=restaurant_id
        )

        # Das Menü-Item zur Datenbank hinzufügen und speichern
        db.session.add(new_item)
        db.session.commit()

        # Erfolgsmeldung zurückgeben
        return jsonify({"message": "Item successfully added to the menu."}), 201

    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401

    except NotFound as e:
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500

# API-Route für das Aktualisieren eines Menü-Items
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["PUT"])
def api_update_item(item_id):
    try:

        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")
        
        item = MenuItem.query.get(item_id)
        if not item:
            raise NotFound("Item not found.")
        
        if item.restaurant_id != restaurant_id:
            raise Unauthorized("Not authorized to update this item.")

        data = request.get_json()
        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        image = data.get("image")

        if not all([name, price]):
            raise BadRequest("Missing required fields.")

        item.name = name
        item.price = price
        item.description = description
        item.image = image

        db.session.commit()

        return jsonify({"message": "Item successfully updated."}), 200

    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401

    except NotFound as e:
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500
    
# API-Route für das Löschen eines Menü-Items
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["DELETE"])
def api_delete_item(item_id):
    try:
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")
        
        menu_item = MenuItem.query.get(item_id)
        if not menu_item:
            raise NotFound("Item not found.")
        
        if menu_item.restaurant_id != restaurant_id:
            raise Unauthorized("Not authorized to delete this item.")

        db.session.delete(menu_item)
        db.session.commit()
        return jsonify({"message": "Item successfully deleted."}), 200

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500

# API-Route für aktive Bestellungen
@restaurant_bp.route("/api/restaurant/orders/status", methods=["GET"])
def api_orders_status():
    try:
        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")

        # Suche abgeschlossene Bestellungen (Status: 1) in der Datenbank
        orders = Order.query.filter(Order.restaurant_id == restaurant_id, Order.status.in_([1, 2, 3])).all()
        if not orders:
            raise NotFound("No order history available.")

        # Formatiere die Antwort
        order_history = [
        {
            "order_id": order.order_id,
            "user_id": order.user_id,
            "name": f"{order.user.first_name} {order.user.last_name}",
            "address": order.user.address,
            "city": order.user.city,
            "zip": order.user.zip_code,
            "items": [
                {
                    "item_id": order_item.item_id,
                    "name": order_item.menu_item.name,
                    "price": order_item.menu_item.price,
                    "quantity": order_item.quantity,
                    "notes": order_item.notes
                }
                for order_item in order.order_items
            ],
            "total": order.total,
            "status": order.status,
            "date": int(order.date.timestamp())
        }
        for order in orders
    ]

        return jsonify(order_history), 200

    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401
    
    except NotFound as e:
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        return jsonify({"message": "An error occurred."}), 500
    
# API-Route für das Aktualisieren des Bestellstatus
@restaurant_bp.route("/api/restaurant/orders/order/<order_id>", methods=["PUT"])
def api_update_order_status(order_id):
    try:
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")
        
        order = Order.query.get(order_id)
        if not order:
            raise NotFound("Order not found.")
        
        if order.restaurant_id != restaurant_id:
            raise Unauthorized("Not authorized to update this order.")

        data = request.get_json()
        status = data.get("status")
        if status is None:
            raise BadRequest("Missing required fields.")

        order.status = status
        db.session.commit()

        if status == 1:
            dispatch_order_schedule(order_id)
            
        return jsonify({"message": "Order status successfully updated."}), 200

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401
    
    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500

# API-Route für die Statistiken
@restaurant_bp.route("/api/restaurant/stats", methods=["GET"])
def api_stats():
    try:
        # Sicherstellen, dass die restaurant_id in der Session existiert
        restaurant_id = session.get("restaurant_id")

        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")

        # Get the total number of orders for the restaurant
        total_orders = Order.query.filter_by(restaurant_id=restaurant_id).count()


        # Get the total revenue from the restaurant's wallet field
        restaurant = Restaurant.query.get(restaurant_id)
        total_revenue = restaurant.wallet if restaurant and restaurant.wallet else 0.0


        # Get the rating from the restaurant's rating field
        rating = restaurant.rating if restaurant and restaurant.rating else 0.0

        stats = {
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "average_rating": float(rating),
        }

        return jsonify(stats), 200

    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401
    
    except NotFound as e:
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500
    
# API-Route für die Bestellhistorie
@restaurant_bp.route("/api/restaurant/orders/history", methods=["GET"])
def api_order_history():
    try:
        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise Unauthorized("No restaurant is logged in.")

        # Suche abgeschlossene Bestellungen (Status: 1) in der Datenbank
        orders = Order.query.filter(Order.restaurant_id == restaurant_id, Order.status.in_([3, 4])).all()
        if not orders:
            raise NotFound("No order history available.")

        # Formatiere die Antwort
        order_history = [
        {
            "order_id": order.order_id,
            "user_id": order.user_id,
            "name": f"{order.user.first_name} {order.user.last_name}",
            "address": order.user.address,
            "city": order.user.city,
            "zip": order.user.zip_code,
            "items": [
                {
                    "item_id": order_item.item_id,
                    "name": order_item.menu_item.name,
                    "price": order_item.menu_item.price,
                    "quantity": order_item.quantity,
                    "notes": order_item.notes
                }
                for order_item in order.order_items
            ],
            "total": order.total,
            "status": order.status,
            "date": int(order.date.timestamp())
        }
        for order in orders
    ]

        return jsonify(order_history), 200

    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        return jsonify({"message": e.description}), 401
    
    except NotFound as e:
        return jsonify({"message": e.description}), 404
    
    except Exception as e:
        return jsonify({"message": "An error occurred."}), 500