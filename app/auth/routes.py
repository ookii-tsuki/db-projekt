from datetime import datetime
import random
from flask import jsonify, render_template, Blueprint, request, session
from werkzeug.exceptions import BadRequest
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User, Restaurant, OpeningHour
from app import db

# Import the blueprint
from app.auth import auth_bp


########################################################################
############################# PAGE ROUTES ##############################
########################################################################

# Create a route for the login page
# The route will return the login.html template
@auth_bp.route("/users/login")
def user_login():
    return render_template("user_login.html")

# Create a route for the register page
# The route will return the user_register.html template 
@auth_bp.route("/users/register")
def user_register():
    return render_template("user_register.html")

# Create a route for the restaurant login page
# The route will return the restaurant_login.html template
@auth_bp.route("/restaurant/login")
def restaurant_login():
    return render_template("restaurant_login.html")

# Create a route for the restaurant register page
# The route will return the restaurant_register.html template
@auth_bp.route("/restaurant/register")
def restaurant_register():
    return render_template("restaurant_register.html")



########################################################################
############################# API ROUTES ###############################
########################################################################


# A route for the user register API
# registers in the user
@auth_bp.route("/api/auth/user/register", methods=["POST"])
def api_user_register():
    try:
        # Get the data from the request
        data = request.get_json()

        first_name = data.get("first_name")
        last_name = data.get("last_name")
        email = data.get("email")
        password = data.get("password")
        address = data.get("address")
        city = data.get("city")
        zip_code = data.get("zip")

        required_fields = [first_name, last_name, email, password, address, city, zip_code]

        # Check if any of the required fields are empty
        if not all(required_fields):
            raise BadRequest("Not all required fields are filled.")
            
        user_exists = User.query.filter_by(email=email).first()

        # Check if the user already exists
        if user_exists:
            return jsonify({"message": "User already exists."}), 409
        

        new_user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password_hash=generate_password_hash(password=password, method='pbkdf2:sha256', salt_length=16),
            address=address,
            city=city,
            zip_code=zip_code,
            wallet=100.00
        )
        # Add the user to the database

        db.session.add(new_user)
        db.session.commit()

        # User does not exist, create the user
        return jsonify({"message": "User successfully registered."}), 201


    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500


# A route for the user login API
# logs in the user
@auth_bp.route("/api/auth/user/login", methods=["POST"])
def api_user_login():
    try:
        # Get the data from the request
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        required_fields = [email, password]

        # Check if any of the required fields are empty
        if not all(required_fields):
            raise BadRequest("Not all required fields are filled.")
        
        # Check if the user exists
        user = User.query.filter_by(email=email).first()

        if user:
            password_correct = check_password_hash(user.password_hash, password)

        correct_credentials = user and password_correct

        # Check if the credentials are correct
        if not correct_credentials:
            return jsonify({"message": "Invalid credentials."}), 401
        
        session["user_id"] = user.user_id

        # User exists, log the user in
        return jsonify({"message": "User successfully logged in."}), 200


    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for the user logout API
# logs out the user
@auth_bp.route("/api/auth/user/logout", methods=["POST"])
def api_user_logout():
    try:
        session.pop("user_id", None)
        return jsonify({"message": "User successfully logged out."}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500

# A route for getting the user profile
# returns the user profile
@auth_bp.route("/api/auth/user", methods=["GET"])
def api_user_profile():
    try:
        
        user_logged_in = session.get("user_id")

        if not user_logged_in:
            return jsonify({"message": "User not logged in."}), 401
        
        user = User.query.get(user_logged_in)
        
        user_data = {
          "user_id": user.user_id,
          "first_name": user.first_name,
          "last_name": user.last_name,
          "email": user.email,
          "address": user.address,
          "city": user.city,
          "zip": user.zip_code,
          "wallet": user.wallet
        }

        

        return jsonify(user_data), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500


# A route for the restaurant register API
# registers in the restaurant
@auth_bp.route("/api/auth/restaurant/register", methods=["POST"])
def api_restaurant_register():
    try:
        # Get the data from the request
        data = request.get_json()

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        address = data.get("address")
        city = data.get("city")
        zip_code = data.get("zip")
        description = data.get("description")
        banner = data.get("banner")
        opening_hours = data.get("opening_hours")
        cuisine = data.get("cuisine")
        delivery_radius = data.get("delivery_radius")

        required_fields = [name, email, password, address, city, zip_code, opening_hours, delivery_radius]

        # Check if any of the required fields are empty
        if not all(required_fields):
            raise BadRequest("Not all required fields are filled.")
        
        if not isinstance(opening_hours, list) or len(opening_hours) == 0 or not all(isinstance(oh, dict) for oh in opening_hours):
            raise BadRequest("Opening hours must be a non-empty list.")
            
        restaurant_exists = Restaurant.query.filter_by(email=email).first()

        # Check if the restaurant already exists
        if (restaurant_exists):
            return jsonify({"message": "Restaurant already exists."}), 409
        
        def biased_random_rating(min_val, max_val, bias_min, bias_max):
            while True:
                value = random.uniform(min_val, max_val)
                if bias_min <= value <= bias_max:
                    return value
                if random.random() < 0.1:
                    return value
        
        new_restaurant = Restaurant(
            name=name,
            email=email,
            password_hash=generate_password_hash(password=password, method='pbkdf2:sha256', salt_length=16),
            address=address,
            city=city,
            zip_code=zip_code,
            description=description,
            wallet=0.00,
            banner=banner,
            cuisine=cuisine,
            delivery_radius=delivery_radius,
            rating=biased_random_rating(1.0, 5.0, 4.0, 4.9)
        )
        # Add the restaurant to the database
        db.session.add(new_restaurant)
        db.session.commit()

        # Add opening hours to the database
        for oh in opening_hours:
            new_opening_hour = OpeningHour(
                day_of_week=oh.get("day_of_week"),
                open_time=datetime.strptime(oh.get("open_time"), "%H:%M").time(),
                close_time=datetime.strptime(oh.get("close_time"), "%H:%M").time(),
                restaurant_id=new_restaurant.restaurant_id
            )
            db.session.add(new_opening_hour)

        db.session.commit()

        # Restaurant does not exist, create the restaurant
        return jsonify({"message": "Restaurant successfully registered."}), 201

    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500


# A route for the restaurant login API
# logs in the restaurant
@auth_bp.route("/api/auth/restaurant/login", methods=["POST"])
def api_restaurant_login():
    try:
        # Get the data from the request
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        required_fields = [email, password]

        # Check if any of the required fields are empty
        if not all(required_fields):
            raise BadRequest("Not all required fields are filled.")
        
        # Check if the restaurant exists
        restaurant = Restaurant.query.filter_by(email=email).first()

        # Check if the password is correct
        if restaurant:
            password_correct = check_password_hash(restaurant.password_hash, password)

        correct_credentials = password_correct and restaurant

        # Check if the credentials are correct
        if not correct_credentials:
            return jsonify({"message": "Invalid credentials."}), 401
        
        session["restaurant_id"] = restaurant.restaurant_id

        # Restaurant exists, log the restaurant in
        return jsonify({"message": "Restaurant successfully logged in."}), 200


    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for the restaurant logout API
# logs out the restaurant
@auth_bp.route("/api/auth/restaurant/logout", methods=["POST"])
def api_restaurant_logout():
    try:
        session.pop("restaurant_id", None)
        return jsonify({"message": "Restaurant successfully logged out."}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for getting the restaurant profile
# returns the restaurant profile
@auth_bp.route("/api/auth/restaurant", methods=["GET"])
def api_restaurant_profile():
    try:
        restaurant_logged_in = session.get("restaurant_id")

        # Check if the restaurant is logged in
        if not restaurant_logged_in:
            return jsonify({"message": "Restaurant not logged in."}), 401
        
        restaurant = Restaurant.query.get(restaurant_logged_in)
        
        opening_hours = restaurant.opening_hours
        opening_hours_data = [
            {
                "day_of_week": oh.day_of_week,
                "open_time": oh.open_time.strftime("%H:%M"),
                "close_time": oh.close_time.strftime("%H:%M")
            } for oh in opening_hours
        ]
        
        restaurant_data = {
          "restaurant_id": restaurant.restaurant_id,
          "name": restaurant.name,
          "email": restaurant.email,
          "address": restaurant.address,
          "city": restaurant.city,
          "zip": restaurant.zip_code,
          "description": restaurant.description,
          "wallet": restaurant.wallet,
          "banner": restaurant.banner,
          "opening_hours": opening_hours_data,
          "cuisine": restaurant.cuisine
        }

        return jsonify(restaurant_data), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
