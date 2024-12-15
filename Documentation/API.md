# API Documentation

## Table of Contents

1. [User Authentication API](#user-authentication-api)
    1. [POST /auth/user/register](#post-authuserregister)
    2. [POST /auth/user/login](#post-authuserlogin)
    3. [POST /auth/user/logout](#post-authuserlogout)
    4. [GET /auth/user](#get-authuser)
    5. [POST /auth/restaurant/register](#post-authrestaurantregister)
    6. [POST /auth/restaurant/login](#post-authrestaurantlogin)
    7. [POST /auth/restaurant/logout](#post-authrestaurantlogout)
    8. [GET /auth/restaurant](#get-authrestaurant)
2. [Main API](#main-api)
    1. [GET /main/search](#get-mainsearch)
    2. [POST /main/restaurant/add_favorite](#post-mainrestaurantadd_favorite)
    3. [GET /main/restaurant/favorite](#get-mainrestaurantfavorite)
    4. [GET /main/restaurant/](#get-mainrestaurant)

## User Authentication API

### POST /auth/user/register

**Description:**  
Registers a new user.

**Request Body:**  

```json
{
  "first_name": "Doge",
  "last_name": "Mustermann",
  "email": "doge.mustermann@gmail.com",
  "password": "SoggyPickle23",
  "address": "Doge Street 23",
  "city": "Doge City",
  "zip": "12345",
}
```

**Response:**  

* `201 Created`
  ```json
  {
    "message": "User successfully registered."
  }
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid request body."
  }
  ```
* `409 Conflict`
  ```json
  {
    "message": "User already exists."
  }
  ```

### POST /auth/user/login

**Description:**
Logs in a user.

**Request Body:**  
```json
{
  "email": "doge.mustermann@gmail.com",
  "password": "SoggyPickle23"
}
```

**Response:**

* `200 OK`
  ```json
  {
    "message": "User successfully logged in.",
  }
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid request body."
  }
  ```
* `401 Unauthorized`
  ```json
  {
    "message": "Invalid credentials."
  }
  ```

### POST /auth/user/logout

**Description:**
Logs out a user.

**Response:**

* `200 OK`
  ```json
  {
    "message": "User successfully logged out."
  }
  ```

### GET /auth/user

**Description:**
Returns the user's information.

**Response:**

* `200 OK`
  ```json
  {
    "user_id": "1000",
    "first_name": "Doge",
    "last_name": "Mustermann",
    "email": "doge.mustermann@gmail.com",
    "address": "Doge Street 23",
    "city": "Doge City",
    "zip": "12345",
  }
  ```
* `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "User not found."
  }
  ```

### POST /auth/restaurant/resgister

**Description:**
Registers a new restaurant.

**Request Body:**  

```json
{
  "name": "Doge's Pizza",
  "email": "dogespizza@biteandsavor.com",
  "password": "CheesyCrust23",
  "address": "Doge Street 24",
  "city": "Doge City",
  "zip": "12345",
  "description": "The best pizza in town.",
  "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
}
```

**Response:**

* `201 Created`
  ```json
  {
    "message": "Restaurant successfully registered."
  }
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid request body."
  }
  ```
* `409 Conflict`
  ```json
  {
    "message": "Restaurant already exists."
  }
  ```

### POST /auth/restaurant/login

**Description:**
Logs in a restaurant.

**Request Body:**  
```json
{
  "email": "dogespizza@biteandsavor.com",
  "password": "CheesyCrust23"
}
```

**Response:**

* `200 OK`
  ```json
  {
    "message": "Restaurant successfully logged in."
  }
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid request body."
  }
  ```
* `401 Unauthorized`
  ```json
  {
    "message": "Invalid credentials."
  }
  ```

### POST /auth/restaurant/logout

**Description:**
Logs out a restaurant.

**Response:**

* `200 OK`
  ```json
  {
    "message": "Restaurant successfully logged out."
  }
  ```
* `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "Restaurant not found."
  }
  ```

### GET /auth/restaurant

**Description:**
Returns the restaurant's information.

**Response:**

* `200 OK`
  ```json
  {
    "restaurant_id": "1999",
    "name": "Doge's Pizza",
    "email": "dogespizza@biteandsavor.com",
    "address": "Doge Street 24",
    "city": "Doge City",
    "zip": "12345",
    "description": "The best pizza in town.",
    "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
  }
  ```

* `401 Unauthorized`
  ```json
  {
    "message": "Unauthorized."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "Restaurant not found."
  }
  ```

## Main API

### GET /main/search

**Description:**
Returns a list of restaurants based on the search query and filters.

**Query Parameters:**
* `query` (string): The search query.
* `zip` (string): The zip code.
* `city` (string): The city.
* `cuisine` (string): The cuisine type.

**Response:**

* `200 OK`
  ```json
  [
    {
      "restaurant_id": "1999",
      "name": "Doge's Pizza",
      "address": "Doge Street 24",
      "city": "Doge City",
      "zip": "12345",
      "description": "The best pizza in town.",
      "rating": 4.5,
      "approx_delivery_time": "30-45 minutes",
      "is_favorite": true,
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
      "is_favorite": false,
      "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
    }
  ]
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid query parameters."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "No restaurants found."
  }
  ```

### POST /main/restaurant/add_favorite

**Description:**
Adds a restaurant to the user's favorite list.

**Request Body:**  

```json
{
  "restaurant_id": "1999"
}
```

**Response:**

* `201 Created`
  ```json
  {
    "message": "Restaurant successfully added to favorites."
  }
  ```
* `400 Bad request`
  ```json
  {
    "message": "Invalid request body."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "Restaurant not found."
  }
  ```

### GET /main/restaurant/favorite

**Description:**
Returns a list of favorite restaurants.

**Response:**

* `200 OK`
  ```json
  [
    {
      "restaurant_id": "1999",
      "name": "Doge's Pizza",
      "address": "Doge Street 24",
      "city": "Doge City",
      "zip": "12345",
      "description": "The best pizza in town.",
      "rating": 4.5,
      "approx_delivery_time": "30-45 minutes",
      "is_favorite": true,
      "banner": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)",
    }
  ]
  ```
* `404 Not found`
  ```json
  {
    "message": "No favorite restaurants found."
  }
  ```


### GET /main/restaurant/

**Description:**
Returns the restaurant's information and available menu items.

**Query Parameters:**
* `id` (string): The restaurant ID.

**Response:**

* `200 OK`
  ```json 
  {
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
        "price": "10.99",
        "description": "A classic cheese pizza.",
        "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
      },
      {
        "item_id": "1001",
        "name": "Pepperoni Pizza",
        "price": "12.99",
        "description": "A classic pepperoni pizza.",
        "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
      }
    ]
  }
  ```

* `400 Bad request`
  ```json
  {
    "message": "Invalid query parameters."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "Restaurant not found."
  }
  ```