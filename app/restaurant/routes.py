from flask import render_template, Blueprint, request, jsonify, session
from werkzeug.exceptions import BadRequest, NotFound
from app.models import MenuItem, Order, db  # Import der benötigten Modelle

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

@restaurant_bp.route("/restaurant/order-history")
def order_history():
    return render_template("order_history.html")

########################################################################
############################ API ROUTES ################################
########################################################################

# API-Route für das Abrufen der Menü-Items
@restaurant_bp.route("/api/restaurant/items", methods=["GET"])
def api_menu():
    try:
        menu_items = MenuItem.query.all()
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

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500


@restaurant_bp.route("/api/restaurant/add_item", methods=["POST"])
def api_add_item():
    try:
        # Temporäre Testzuweisung für die Restaurant-ID (für Debugging)
        session["restaurant_id"] = 1
        print("Set restaurant_id in session:", session.get("restaurant_id"))

        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise BadRequest("No restaurant is logged in.")

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

        # Neues Menü-Item erstellen, inklusive restaurant_id
        new_item = MenuItem(
            name=name,
            price=price,
            description=description,
            image=image,
            restaurant_id=restaurant_id  # Restaurant-Zuordnung hinzufügen
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


# API-Route für das Aktualisieren eines Menü-Items
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["PUT"])
def api_update_item(item_id):
    try:
        item = MenuItem.query.get(item_id)
        if not item:
            raise NotFound("Item not found.")

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

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500


# API-Route für das Löschen eines Menü-Items
@restaurant_bp.route("/api/restaurant/item/<item_id>", methods=["DELETE"])
def api_delete_item(item_id):
    try:
        menu_item = MenuItem.query.get(item_id)
        if not menu_item:
            raise NotFound("Item not found.")

        db.session.delete(menu_item)
        db.session.commit()
        return jsonify({"message": "Item successfully deleted."}), 200

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500


# API-Route für aktive Bestellungen
@restaurant_bp.route("/api/restaurant/orders/status", methods=["GET"])
def api_orders_status():
    try:
        # Temporäre Zuweisung für Debugging (nur für Testzwecke)
        session["restaurant_id"] = 1
        print("Set restaurant_id in session:", session.get("restaurant_id"))

        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise BadRequest("No restaurant is logged in.")

        # Suche aktive Bestellungen (Status: 0) in der Datenbank
        orders = Order.query.filter_by(restaurant_id=restaurant_id, status=0).all()
        if not orders:
            raise NotFound("No active orders.")

        # Formatiere die Antwort
        orders_data = [
            {
                "order_id": order.order_id,
                "user_id": order.user_id,
                "total": order.total,
                "status": order.status,
                "date": order.date.strftime("%Y-%m-%d %H:%M:%S"),
                "items": [
                    {
                        "item_id": item.menu_item.item_id,
                        "name": item.menu_item.name,
                        "price": item.menu_item.price,
                        "quantity": item.quantity
                    }
                    for item in order.order_items
                ]
            }
            for order in orders
        ]

        return jsonify(orders_data), 200

    except BadRequest as e:
        print("BadRequest Error:", e)
        return jsonify({"message": e.description}), 400
    except NotFound as e:
        print("NotFound Error:", e)
        return jsonify({"message": e.description}), 404
    except Exception as e:
        print("General Error:", e)
        return jsonify({"message": "An error occurred."}), 500

# API-Route für das Aktualisieren des Bestellstatus
@restaurant_bp.route("/api/restaurant/orders/order/<order_id>", methods=["PUT"])
def api_update_order_status(order_id):
    try:
        order = Order.query.get(order_id)
        if not order:
            raise NotFound("Order not found.")

        data = request.get_json()
        status = data.get("status")
        if status is None:
            raise BadRequest("Missing required fields.")

        order.status = status
        db.session.commit()
        return jsonify({"message": "Order status successfully updated."}), 200

    except NotFound as e:
        return jsonify({"message": e.description}), 404
    except BadRequest as e:
        return jsonify({"message": e.description}), 400
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500


# API-Route für die Statistiken
@restaurant_bp.route("/api/restaurant/stats", methods=["GET"])
def api_stats():
    try:
        session["restaurant_id"] = 1  # Temporär für Debugging
        print("Set restaurant_id in session:", session.get("restaurant_id"))

        # Sicherstellen, dass die restaurant_id in der Session existiert
        restaurant_id = session.get("restaurant_id")
        print("Restaurant ID:", restaurant_id)  # Debugging
        if not restaurant_id:
            raise BadRequest("No restaurant is logged in.")

        # Berechne die Statistiken
        total_orders = Order.query.filter_by(restaurant_id=restaurant_id).count()
        print("Total Orders:", total_orders)  # Debugging
        total_revenue = (
            db.session.query(db.func.sum(Order.total))
            .filter_by(restaurant_id=restaurant_id)
            .scalar()
            or 0.0
        )
        print("Total Revenue:", total_revenue)  # Debugging

        stats = {
            "total_orders": total_orders,
            "total_revenue": float(total_revenue),
        }

        return jsonify(stats), 200

    except BadRequest as e:
        print("BadRequest Error:", e)
        return jsonify({"message": e.description}), 400
    except Exception as e:
        import traceback
        print("General Error:", e)
        print(traceback.format_exc())
        return jsonify({"message": "An error occurred."}), 500



# API-Route für die Bestellhistorie
@restaurant_bp.route("/api/restaurant/orders/history", methods=["GET"])
def api_order_history():
    try:
        # Temporäre Testzuweisung für die Restaurant-ID (für Debugging)
        session["restaurant_id"] = 1
        print("Set restaurant_id in session:", session.get("restaurant_id"))

        # Aktuelles Restaurant aus der Session abrufen
        restaurant_id = session.get("restaurant_id")
        if not restaurant_id:
            raise BadRequest("No restaurant is logged in.")

        # Suche abgeschlossene Bestellungen (Status: 1) in der Datenbank
        orders = Order.query.filter_by(restaurant_id=restaurant_id, status=1).all()
        if not orders:
            raise NotFound("No order history available.")

        # Formatiere die Antwort
        order_history = [
            {
                "order_id": order.order_id,
                "user_id": order.user_id,
                "total": order.total,
                "status": order.status,
                "date": order.date.strftime("%Y-%m-%d %H:%M:%S"),
                "items": [
                    {
                        "item_id": item.menu_item.item_id,
                        "name": item.menu_item.name,
                        "price": item.menu_item.price,
                        "quantity": item.quantity
                    }
                    for item in order.order_items
                ]
            }
            for order in orders
        ]

        return jsonify(order_history), 200

    except BadRequest as e:
        print("BadRequest Error:", e)
        return jsonify({"message": e.description}), 400
    except NotFound as e:
        print("NotFound Error:", e)
        return jsonify({"message": e.description}), 404
    except Exception as e:
        import traceback
        print("General Error:", e)
        return jsonify({"message": "An error occurred."}), 500
