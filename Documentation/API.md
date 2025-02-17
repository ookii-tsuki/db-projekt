# API Documentation

## Table of Contents

1. [User Authentication API](#user-authentication-api)
    1. [POST /api/auth/user/register](#post-apiauthuserregister)
    2. [POST /api/auth/user/login](#post-apiauthuserlogin)
    3. [POST /api/auth/user/logout](#post-apiauthuserlogout)
    4. [GET /api/auth/user](#get-apiauthuser)
    5. [POST /api/auth/restaurant/register](#post-apiauthrestaurantregister)
    6. [POST /api/auth/restaurant/login](#post-apiauthrestaurantlogin)
    7. [POST /api/auth/restaurant/logout](#post-apiauthrestaurantlogout)
    8. [GET /api/auth/restaurant](#get-apiauthrestaurant)
2. [Main API](#main-api)
    1. [GET /api/main/search](#get-apimainsearch)
    2. [POST /api/main/restaurant/add_favorite](#post-apimainrestaurantadd_favorite)
    3. [GET /api/main/restaurant/favorite](#get-apimainrestaurantfavorite)
    4. [GET /api/main/restaurant/](#get-apimainrestaurant)
3. [Order API](#order-api)
    1. [POST /api/order/add_cart](#post-apiorderadd_cart)
    2. [GET /api/order/cart](#get-apiordercart)
    3. [POST /api/order/checkout](#post-apiordercheckout)
    4. [GET /api/order/history](#get-apiorderhistory)
    5. [GET /api/order/status](#get-apiorderstatus)
4. [Restaurant API](#restaurant-api)
    1. [POST /api/restaurant/add_item](#post-apirestaurantadd_item)
    2. [GET /api/restaurant/items](#get-apirestaurantitems)
    3. [PUT /api/restaurant/item/{item_id}](#put-apirestaurantitemitem_id)
    4. [DELETE /api/restaurant/item/{item_id}](#delete-apirestaurantitemitem_id)
    5. [GET /api/restaurant/orders](#get-apirestaurantordersstatus)
    6. [PUT /api/restaurant/order/{order_id}](#put-apirestaurantordersorderorder_id)
    7. [GET /api/restaurant/order_history](#get-apirestaurantordershistory)
    8. [GET /api/restaurant/stats](#get-apirestaurantstats)

## User Authentication API

### POST /api/auth/user/register

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

### POST /api/auth/user/login

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

### POST /api/auth/user/logout

**Description:**
Logs out a user.

**Response:**

* `200 OK`
  ```json
  {
    "message": "User successfully logged out."
  }
  ```

### GET /api/auth/user

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
    "wallet": 100.00
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

### POST /api/auth/restaurant/resgister

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
  "delivery_radius": 5,
  "opening_hours": [
        {
            "day_of_week": 0,
            "open_time": "09:00",
            "close_time": "17:00"
        },
        {
            "day_of_week": 1,
            "open_time": "09:00",
            "close_time": "17:00"
        }
    ],
    "cuisine": 1
}
```

> 🗒 Note: The cuisine values mean: 0: Sonstiges, 1: Pizza, 2: Sushi, 3: Burger, 4: Döner, 5: Pasta, 6: Italienisch, 7: Asiatisch, 8: Indisch, 9: Mexikanisch

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

> 🗒 Note: The `banner` field is a base64-encoded image data and the image should not exceed 1MB.

### POST /api/auth/restaurant/login

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

### POST /api/auth/restaurant/logout

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

### GET /api/auth/restaurant

**Description:**
Returns the restaurant's information.

**Response:**

* `200 OK`
  ```json
  {
    "address": "Doge Street 24",
    "banner": "image",
    "city": "Doge City",
    "cuisine": 1,
    "description": "The best pizza in town.",
    "email": "dogespizza@biteandsavor.com",
    "name": "Doges Pizza",
    "opening_hours": [
      {
        "close_time": "17:00",
        "day_of_week": 0,
        "open_time": "09:00"
      },
      {
        "close_time": "17:00",
        "day_of_week": 1,
        "open_time": "09:00"
      }
    ],
    "restaurant_id": 1,
    "wallet": 0.0,
    "zip": "12345"
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

### GET /api/main/search

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

### POST /api/main/restaurant/add_favorite

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

### GET /api/main/restaurant/favorite

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


### GET /api/main/restaurant/

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


### POST /api/order/add_cart

**Description:**
Adds an item to the user's cart.

**Request Body:**  

```json
{
  "item_id": "1000",
  "restaurant_id": "1999",
  "quantity": 2,
  "notes": "Extra cheese."
}
```

**Response:**

* `201 Created`
  ```json
  {
    "message": "Item successfully added to cart."
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
    "message": "Item not found."
  }
  ```

### GET /api/order/cart

**Description:**
Returns the user's cart.

**Response:**

* `200 OK`
  ```json
  {
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
  ```

* `402 Payment required`
  ```json
  {
    "message": "Insufficient funds."
  }
  ```

* `404 Not found`
  ```json
  {
    "message": "Cart is empty."
  }
  ```

### POST /api/order/checkout

**Description:**
Checks out the user's cart.

**Request Body:**  

```json
{
  "action": "place_order"
}
```

**Response:**

* `201 Created`
  ```json
  {
    "message": "Order successfully placed."
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
    "message": "Cart is empty."
  }
  ```

### GET /api/order/history

**Description:**
Returns the user's order history.

**Response:**

* `200 OK`
  ```json
  [
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
  ```

* `404 Not found`
  ```json
  {
    "message": "No order history found."
  }
  ```

> 🗒 Note: The `date` field is a Unix timestamp.

> 🗒 Note: The `status` field could be any of the following values: 0: "Pending", 1: "Preparing", 2: "Being delivered", 3: "Delivered", 4: "Rejected"

### GET /api/order/status

**Description:**
Returns the status of all active orders.

**Response:**

* `200 OK`
  ```json
  [
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
  ```
* `404 Not found`
  ```json
  {
    "message": "No active orders found."
  }
  ```

### POST /api/restaurant/add_item

**Description:**
Adds a new item to the restaurant's menu.

**Request Body:**  

```json
{
  "name": "Shoyu Ramen",
  "price": 14.99,
  "description": "A soy sauce-based noodle soup with a clear brown broth, thin wheat noodles, and toppings like green onions, bamboo shoots, boiled egg, and fish cake.",
  "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
}
```

**Response:**

* `201 Created`
  ```json
  {
    "message": "Item successfully added to the menu."
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

### GET /api/restaurant/items

**Description:**
Returns the restaurant's menu items.

**Response:**

* `200 OK`
  ```json
  [
    {
      "item_id": "1090",
      "name": "Shoyu Ramen",
      "price": 14.99,
      "description": "A soy sauce-based noodle soup with a clear brown broth, thin wheat noodles, and toppings like green onions, bamboo shoots, boiled egg, and fish cake.",
      "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
    }
  ]
  ```

* `404 Not found`
  ```json
  {
    "message": "No items found."
  }
  ```

### PUT /api/restaurant/item/{item_id}

**Description:**
Updates an item in the restaurant's menu.

**Request Body:**  

```json
{
  "name": "Shoyu Ramen",
  "price": 15.99,
  "description": "A soy sauce-based noodle soup with a clear brown broth, thin wheat noodles, and toppings like green onions, bamboo shoots, boiled egg, and fish cake.",
  "image": "/9j/4AAQSkZJRgABAQEAAAAAAAD/... (base64-encoded image data)"
}
```

**Response:**

* `200 OK`
  ```json
  {
    "message": "Item successfully updated."
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
    "message": "Item not found."
  }
  ```

### DELETE /api/restaurant/item/{item_id}

**Description:**
Deletes an item from the restaurant's menu.

**Response:**

* `200 OK`
  ```json
  {
    "message": "Item successfully deleted."
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "Item not found."
  }
  ```

### GET /api/restaurant/orders/status

**Description:**
Returns the restaurant's active orders.

**Response:**

* `200 OK`
  ```json
  [
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
  ```

* `404 Not found`
  ```json
  {
    "message": "No active orders found."
  }
  ```

### PUT /api/restaurant/orders/order/{order_id}

**Description:**
Updates the status of an order.

**Request Body:**  

```json
{
  "status": 1
}
```

**Response:**

* `200 OK`
  ```json
  {
    "message": "Order status successfully updated."
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
    "message": "Order not found."
  }
  ```

### GET /api/restaurant/orders/history

**Description:**
Returns the restaurant's order history.

**Response:**

* `200 OK`
  ```json
  [
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
  ```
* `404 Not found`
  ```json
  {
    "message": "No order history found."
  }
  ```

### GET /api/restaurant/stats

**Description:**
Returns the restaurant's statistics.

**Response:**

* `200 OK`
  ```json
  {
    "total_orders": 100,
    "total_revenue": 10000.00,
    "average_rating": 4.5
  }
  ```
* `404 Not found`
  ```json
  {
    "message": "No statistics found."
  }
  ```

