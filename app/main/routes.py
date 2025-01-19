from datetime import datetime
from flask import render_template, Blueprint, request, session, jsonify
from werkzeug.exceptions import BadRequest, NotFound, Unauthorized
from .nearby_finder import find_nearby, estimate_delivery_time_range
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
                "banner": r.banner or "",
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

        # Dummy data
        restaurant_found = True

        if not restaurant_found:
            raise NotFound("Restaurant not found.")

        is_favorite = True

        if is_favorite:
            return jsonify({"message": "Restaurant added to favorites."}), 201
        
        # Restaurant is already in favorites, remove it
        return jsonify({"message": "Restaurant removed from favorites."}), 200
        

    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for getting all the favorite restaurants
# Returns a list of favorite restaurants
@main_bp.route("/api/main/restaurant/favorite", methods=["GET"])
def api_favorite_restaurants():
    try:
        # Dummy data
        favorite_restaurants = [
          {
            "restaurant_id": "1999",
            "name": "Doge's Pizza",
            "address": "Doge Street 24",
            "city": "Doge City",
            "zip": "12345",
            "description": "The best pizza in town.",
            "rating": 4.5,
            "approx_delivery_time": "30-45 minutes",
            "is_favorite": True,
            "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
          },
          {
            "restaurant_id": "2879",
            "name": "Naruto's Ramen",
            "address": "Naruto Street 42",
            "city": "Naruto City",
            "zip": "54321",
            "description": "The best ramen in town.",
            "rating": 4.8,
            "approx_delivery_time": "20-30 minutes",
            "is_favorite": True,
            "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
          }
        ]

        if len(favorite_restaurants) == 0:
            raise NotFound("No favorite restaurants found.")
        
        return jsonify(favorite_restaurants), 200
    
    except NotFound as e:
        print(e)
        return jsonify({"message": e.description}), 404
    
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
        
        restaurant_exists = True

        if not restaurant_exists:
            raise NotFound("Restaurant not found.")

        # Dummy data
        restaurant_data = {
          "restaurant_id": "1999",
          "name": "Doge's Pizza",
          "address": "Doge Street 24",
          "city": "Doge City",
          "zip": "12345",
          "description": "The best pizza in town.",
          "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
          "menu": [
            {
              "item_id": "1000",
              "name": "Cheese Pizza",
              "price": 10.99,
              "description": "A classic cheese pizza.",
              "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
            },
            {
              "item_id": "1001",
              "name": "Pepperoni Pizza",
              "price": 12.99,
              "description": "A classic pepperoni pizza.",
              "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
            }
          ]
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
