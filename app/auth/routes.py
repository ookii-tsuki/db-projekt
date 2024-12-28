from flask import jsonify, render_template, Blueprint, request
from werkzeug.exceptions import BadRequest

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

# This section is still under construction
# It will only return dummy data for now


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
            
        user_exists = False

        # Check if the user already exists
        if user_exists:
            return jsonify({"message": "User already exists."}), 409

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
            
        correct_credentials = True

        # Check if the credentials are correct
        if not correct_credentials:
            return jsonify({"message": "Invalid credentials."}), 401

        # User exists, log the user in
        return jsonify({"message": "User successfully logged in."}), 200


    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    


# A route for getting the user profile
# returns the user profile
@auth_bp.route("/api/auth/user/profile", methods=["GET"])
def api_user_profile():
    try:
        user_logged_in = True

        # Check if the user is logged in
        if not user_logged_in:
            return jsonify({"message": "User not logged in."}), 401
        
        # Dummy data for now
        user_data = {
          "user_id": "1000",
          "first_name": "Doge",
          "last_name": "Mustermann",
          "email": "doge.mustermann@gmail.com",
          "address": "Doge Street 23",
          "city": "Doge City",
          "zip": "12345",
          "wallet": 100.00
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

        required_fields = [name, email, password, address, city, zip_code]

        # Check if any of the required fields are empty
        if not all(required_fields):
            raise BadRequest("Not all required fields are filled.")
            
        restaurant_exists = False

        # Check if the restaurant already exists
        if restaurant_exists:
            return jsonify({"message": "Restaurant already exists."}), 409

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
            
        correct_credentials = True

        # Check if the credentials are correct
        if not correct_credentials:
            return jsonify({"message": "Invalid credentials."}), 401

        # Restaurant exists, log the restaurant in
        return jsonify({"message": "Restaurant successfully logged in."}), 200


    except BadRequest as e:
        print(e)
        return jsonify({"message": e.description}), 400
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
    

# A route for getting the restaurant profile
# returns the restaurant profile
@auth_bp.route("/api/auth/restaurant/profile", methods=["GET"])
def api_restaurant_profile():
    try:
        restaurant_logged_in = True

        # Check if the restaurant is logged in
        if not restaurant_logged_in:
            return jsonify({"message": "Restaurant not logged in."}), 401
        
        # Dummy data for now
        restaurant_data = {
          "restaurant_id": "1999",
          "name": "Doge's Pizza",
          "email": "dogespizza@biteandsavor.com",
          "address": "Doge Street 24",
          "city": "Doge City",
          "zip": "12345",
          "description": "The best pizza in town.",
          "wallet": 100.00,
          "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
        }

        return jsonify(restaurant_data), 200
    
    except Exception as e:
        print(e)
        return jsonify({"message": "An error occured."}), 500
