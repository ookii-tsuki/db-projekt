from flask import render_template, Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, NotFound
from app.models import MenuItem

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
        # Menü-Items aus der Datenbank abrufen
        menu_items = MenuItem.query.all()

        # Wenn keine Menü-Items gefunden wurden
        if not menu_items:
            raise NotFound(description="Menu is empty.")

        # JSON-Antwort formatieren
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

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    except Exception as e:
        return jsonify({"message": "An error occurred."}), 500

    


# A route for the restaurant new item API
# Adds a new item to the restaurant menu
@restaurant_bp.route("/api/restaurant/add_item", methods=["POST"])
def api_add_item():
    try:
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
            image=image
        )

        # Das Menü-Item zur Datenbank hinzufügen und speichern
        db.session.add(new_item)
        db.session.commit()

        # Erfolgsmeldung zurückgeben
        return jsonify({"message": "Item successfully added to the menu."}), 201
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500

# A route for the restaurant update item API
# Updates an existing item in the restaurant menu
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["PUT"])
def api_update_item(item_id):
    try:
        # Prüfen, ob das Item existiert
        item = MenuItem.query.get(item_id)

        if not item:
            raise NotFound("Item not found.")
        
        # JSON-Daten vom Client abrufen
        data = request.get_json()

        # Neue Werte aus den Eingaben abrufen
        name = data.get("name")
        price = data.get("price")
        description = data.get("description")
        image = data.get("image")

        # Überprüfen, ob die erforderlichen Felder vorhanden sind
        required_fields = [name, price]
        if not all(required_fields):
            raise BadRequest("Missing required fields.")

        # Das bestehende Menü-Item aktualisieren
        item.name = name
        item.price = price
        item.description = description
        item.image = image

        # Änderungen in der Datenbank speichern
        db.session.commit()

        return jsonify({"message": "Item successfully updated."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500

# A route for the restaurant delete item API
# Deletes an existing item from the restaurant menu
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["DELETE"])
def api_delete_item(item_id):
    try:
        # Suche das Menü-Item in der Datenbank basierend auf item_id
        menu_item = MenuItem.query.get(item_id)

        # Wenn das Menü-Item nicht existiert, löse eine NotFound-Exception aus
        if not menu_item:
            raise NotFound("Item not found.")

        # Menü-Item löschen
        db.session.delete(menu_item)
        db.session.commit()

        return jsonify({"message": "Item successfully deleted."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500
    


# A route for the restaurant orders status API
# Returns the restaurant's active orders.
@restaurant_bp.route("/api/restaurant/orders/status", methods=["GET"])
def api_orders_status():
    try:
        # Suche aktive Bestellungen in der Datenbank (Status: 0)
        orders = Order.query.filter_by(status=0).all()

        # Wenn keine aktiven Bestellungen gefunden wurden, löse eine NotFound-Exception aus
        if not orders:
            raise NotFound(description="No active orders.")

        # Formatiere die Antwort als JSON
        orders_data = []
        for order in orders:
            orders_data.append({
                "order_id": order.order_id,
                "user_id": order.user_id,
                "name": f"{order.user.first_name} {order.user.last_name}",
                "address": order.user.address,
                "city": order.user.city,
                "zip": order.user.zip_code,
                "items": [
                    {
                        "item_id": item.menu_item.item_id,
                        "name": item.menu_item.name,
                        "price": item.menu_item.price,
                        "quantity": item.quantity,
                        "notes": item.notes,
                    } for item in order.order_items
                ],
                "total": order.total,
                "status": order.status,
                "date": order.date.timestamp()  # Unix-Timestamp
            })

        return jsonify(orders_data), 200

    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500
    

# A route for the update order status API
# Updates the status of an order
@restaurant_bp.route("/api/restaurant/orders/order/<order_id>", methods=["PUT"])
def api_update_order_status(order_id):
    try:
        # Überprüfen, ob die Bestellung existiert
        order = Order.query.get(order_id)

        if not order:
            raise NotFound("Order not found.")
        
        # JSON-Daten aus der Anfrage abrufen
        data = request.get_json()
        status = data.get("status")

        if status is None:  # Sicherstellen, dass ein Status übergeben wurde
            raise BadRequest("Missing required fields.")

        # Status aktualisieren
        order.status = status
        db.session.commit()

        return jsonify({"message": "Order status successfully updated."}), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500

# A route for the restaurant order history API
# Returns the restaurant's order history
@restaurant_bp.route("/api/restaurant/orders/history", methods=["GET"])
def api_order_history():
    try:
        # Bestellhistorie aus der Datenbank abrufen
        orders = Order.query.all()

        if not orders:
            raise NotFound(description="No order history.")

        # JSON-Antwort formatieren
        order_history = [
            {
                "order_id": order.order_id,
                "user_id": order.user_id,
                "restaurant_id": order.restaurant_id,
                "total": order.total,
                "status": order.status,
                "date": order.date,
                "items": [
                    {
                        "item_id": item.item_id,
                        "name": item.menu_item.name,
                        "price": item.menu_item.price,
                        "quantity": item.quantity,
                        "notes": item.notes,
                    }
                    for item in order.order_items
                ],
            }
            for order in orders
        ]

        return jsonify(order_history), 200

    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500

    


# A route for the restaurant statistics API
# Returns the restaurant's statistics
@restaurant_bp.route("/api/restaurant/stats", methods=["GET"])
def api_stats():
    try:
        # Gesamtzahl der Bestellungen berechnen
        total_orders = Order.query.count()

        # Gesamtumsatz berechnen
        total_revenue = db.session.query(db.func.sum(Order.total)).scalar() or 0.0

        # Durchschnittliche Bewertung berechnen
        average_rating = db.session.query(db.func.avg(Restaurant.rating)).scalar() or 0.0

        # JSON-Antwort formatieren
        stats = {
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
            "average_rating": round(float(average_rating), 2),
        }

        return jsonify(stats), 200

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occurred."}), 500
