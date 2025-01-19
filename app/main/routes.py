from datetime import datetime
from flask import render_template, Blueprint, request, session, jsonify
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from .nearby_finder import find_nearby, estimate_delivery_time_range, find_distance
from app.models import User, Restaurant, OpeningHour
from app import db


# Import the blueprint
from app.main import main_bp



#######################################################################
############################ PAGE ROUTES ##############################
#######################################################################

# Create a route for the index page
# The route will return the index.html template
@main_bp.route("/")
def index():

    is_logged_in = bool(session.get("user_id") or session.get("restaurant_id"))

    is_restaurant = bool(session.get("restaurant_id"))

    return render_template("index.html", is_logged_in=is_logged_in, is_restaurant=is_restaurant)

# Create a route for the about page
# The route will return the about.html template
@main_bp.route("/search")
def search():

    is_logged_in = bool(session.get("user_id") or session.get("restaurant_id"))

    return render_template("search.html", is_logged_in=is_logged_in)

# Create a route for the menu page
# The route will return the menu.html template
@main_bp.route("/menu")
def menu():
    return render_template("menu.html")



#######################################################################
############################ API ROUTES ###############################
#######################################################################

# This section is still under construction
# It will only return dummy data for now


# A route for the search API
# Returns a list of restaurants based on the search query
@main_bp.route("/api/main/search", methods=["GET"])
def api_search():
    try:
        user_id = session.get("user_id")
        if not user_id:
            raise Unauthorized("User not logged in.")
        
        query = request.args.get("query")
        cuisine = request.args.get("cuisine")
        

        # Get user and nearby zip codes
        user = User.query.filter_by(user_id=user_id).first()
        nearby_zips = find_nearby(user.zip_code, 5)
        if not nearby_zips:
            raise NotFound("No restaurants found nearby.")

        # Query restaurants
        restaurants_query = Restaurant.query.filter(Restaurant.zip_code.in_([z[0] for z in nearby_zips]))

        if query:
            restaurants_query = restaurants_query.filter(
                (Restaurant.name.ilike(f"%{query}%")) |
                (Restaurant.description.ilike(f"%{query}%"))
            )
        if cuisine:

            if not cuisine.isdigit():
                raise BadRequest("Invalid cuisine type.")
            
            cuisine = int(cuisine)

            if cuisine not in range(0, 10):
                raise BadRequest("Invalid cuisine type.")
            
            restaurants_query = restaurants_query.filter(Restaurant.cuisine == cuisine)

        # Filter by opening hours
        current_dt = datetime.now()
        current_day = current_dt.weekday()
        current_time = current_dt.time()

        restaurants_query = restaurants_query.join(OpeningHour).filter(
            OpeningHour.day_of_week == current_day,
            OpeningHour.open_time <= current_time,
            OpeningHour.close_time >= current_time
        )
        
        restaurants = restaurants_query.all()
        if not restaurants:
            raise NotFound("No restaurants found.")

        # Build results
        results = []
        for r in restaurants:
            is_fav = r in user.favorites
            delivery_min_time, delivery_max_time = estimate_delivery_time_range(next(z[1] for z in nearby_zips if z[0] == r.zip_code))
            results.append({
                "restaurant_id": r.restaurant_id,
                "name": r.name,
                "address": r.address,
                "city": r.city,
                "zip": r.zip_code,
                "description": r.description,
                "rating": r.rating,
                "approx_delivery_time": f"{delivery_min_time}-{delivery_max_time} Min.",
                "is_favorite": is_fav,
                "banner": r.banner,
            })

        return jsonify(results), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        print(e)
        return jsonify({"message": e.description}), 401
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500


# A route for adding or removing a restaurant from favorites
# Returns a message indicating the success of the operation
@main_bp.route("/api/main/restaurant/add_favorite", methods=["POST"])
def api_add_favorite():
    try:
        data = request.get_json()
        restaurant_id = data.get("restaurant_id")

        if not restaurant_id:
            raise BadRequest("No restaurant ID provided.")

        # Replace with logic to get the current user's ID (e.g., from session or JWT)
        user_id = session.get("user_id")

        if not user_id:
            raise Unauthorized("User not logged in.")
        
        user = User.query.get(user_id)

        restaurant = Restaurant.query.get(restaurant_id)
        if not restaurant:
            raise NotFound("Restaurant not found.")

        if restaurant in user.favorites:
            user.favorites.remove(restaurant)
            db.session.commit()
            return jsonify({"message": "Restaurant removed from favorites."}), 200
        else:
            user.favorites.append(restaurant)
            db.session.commit()
            return jsonify({"message": "Restaurant added to favorites."}), 201
        

    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Unauthorized as e:
        print(e)
        return jsonify({"message": e.description}), 401
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for getting all the favorite restaurants
# Returns a list of favorite restaurants
@main_bp.route("/api/main/restaurant/favorite", methods=["GET"])
def api_favorite_restaurants():
    try:
        user_id = session.get("user_id")
        if not user_id:
            raise Unauthorized("User not logged in.")

        user = User.query.get(user_id)

        favorited_restaurants = user.favorites
        if not favorited_restaurants:
            raise NotFound("No favorite restaurants found.")

        favorite_restaurants_data = []
        for restaurant in favorited_restaurants:
            distance = find_distance(user.zip_code, restaurant.zip_code)
            delivery_min_time, delivery_max_time = estimate_delivery_time_range(distance)
            favorite_restaurants_data.append({
                "restaurant_id": restaurant.restaurant_id,
                "name": restaurant.name,
                "address": restaurant.address,
                "city": restaurant.city,
                "zip": restaurant.zip_code,
                "description": restaurant.description,
                "rating": restaurant.rating,
                "approx_delivery_time": f"{delivery_min_time}-{delivery_max_time} Min.",
                "is_favorite": True,
                "banner": restaurant.banner
            })

        return jsonify(favorite_restaurants_data), 200

    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for getting the restaurant profile
# returns the restaurant profile and available menu items
@main_bp.route("/api/main/restaurant", methods=["GET"])
def api_restaurant_profile():
    try:
        restaurant_id = request.args.get("id")

        if not restaurant_id:
            raise BadRequest("No restaurant ID provided.")

        restaurant = Restaurant.query.filter_by(restaurant_id=restaurant_id).first()
        if not restaurant:
            raise NotFound("Restaurant not found.")

        menu_items_data = []
        for item in restaurant.menu_items:
            menu_items_data.append({
                "item_id": item.item_id,
                "name": item.name,
                "price": item.price,
                "description": item.description,
                "image": item.image
            })

        restaurant_data = {
            "restaurant_id": restaurant.restaurant_id,
            "name": restaurant.name,
            "address": restaurant.address,
            "city": restaurant.city,
            "zip": restaurant.zip_code,
            "description": restaurant.description,
            "banner": restaurant.banner,
            "menu": menu_items_data
        }

        return jsonify(restaurant_data), 200

    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404

    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400

    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
