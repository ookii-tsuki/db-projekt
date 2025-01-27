# Routes Documentation

This document describes the page routes that are available in the application.

## Table of Contents

1. [Authentification Routes](#authentification-routes)
    1. [GET /users/login](#get-userslogin)
    2. [GET /users/register](#get-usersregister)
    3. [GET /restaurant/login](#get-restaurantlogin)
    4. [GET /restaurant/register](#get-restaurantregister)
2. [Main Routes](#main-routes)
    1. [GET /](#get-)
    2. [GET /search](#get-search)
    3. [GET /menu/:restaurant_id](#get-restaurant_menurestaurant_id)
3. [Order Routes](#order-routes)
    1. [GET /cart](#get-cart)
    2. [GET /order_history](#get-order_history)
    3. [GET /checkout](#get-checkout)
4. [Restaurant Routes](#restaurant-routes)
    1. [GET /restaurant/dashboard](#get-restaurantdashboard)
    2. [GET /restaurant/menu](#get-restaurantmenu)
    3. [GET /restaurant/orders](#get-restaurantorders)
    4. [GET /restaurant/order_history](#get-restaurantorder_history)

## Authentification Routes

### GET /users/login

**Description:**
Get the login page for the users.


### GET /users/register

**Description:**
Get the register page for the users.


### GET /restaurant/login

**Description:**
Get the login page for restaurants.


### GET /restaurant/register

**Description:**
Get the register page for restaurants.


## Main Routes

### GET /

**Description:**
Get the home page.

> 🗒 **Note:** This will pass a `is_logged_in` and a `is_restaurant` variable to the view.
> If the user or restaurant is not logged in, the view will show four buttons: one to login and one to register for users, and one to login and one to register for restaurants.
> If the user or restaurant is logged in, the view will show a `Search` button that will redirect to the `/search` route or a `Dashboard` button that will redirect to the `/restaurant/dashboard` route.

**Example HTML:**
```html
<body>
    {% if is_logged_in %}
        {% if is_restaurant %}
            <a href="/restaurant/dashboard">Dashboard</a>
        {% else %}
            <a href="/search">Search</a>
        {% endif %}
    {% else %}
        <a href="/users/login">Login</a>
        <a href="/users/register">Register</a>
        <a href="/restaurant/login">Restaurant Login</a>
        <a href="/restaurant/register">Restaurant Register</a>
    {% endif %}
</body>
```

### GET /search

**Description:**
Get the search page.

> 🗒 **Note:** This will pass a `is_logged_in` variable to the view.
> If the user is not logged in, the view will show a `Login` button that will redirect to the `/users/login` route.
> If the user is logged in, the view will show a `Logout` button that will redirect to the `/` route.


### GET /restaurant_menu/:restaurant_id

**Description:**
Get the menu page for a restaurant.

> 🗒 **Note:** You can get the `restaurant_id` after the page is loaded using `URLSearchParams`.
> The `restaurant_id` will be used to get the menu for the restaurant from the REST API.

**Example JavaScript:**
```javascript
const urlParams = new URLSearchParams(window.location.search);
const restaurant_id = urlParams.get('restaurant_id');
```

## Order Routes

### GET /cart

**Description:**
Get the cart page.


### GET /order_history

**Description:**
Get the order history page.


### GET /checkout

**Description:**
Get the checkout page.


## Restaurant Routes

### GET /restaurant/dashboard

**Description:**
Get the dashboard page for the restaurant.


### GET /restaurant/menu

**Description:**
Get the menu page for the restaurant where the restaurant can add, update, and delete items from the menu.


### GET /restaurant/orders

**Description:**
Get the active orders page for the restaurant where the restaurant can see the orders that have been placed.


### GET /restaurant/order_history

**Description:**
Get the order history page for the restaurant where the restaurant can see the orders that have been completed.