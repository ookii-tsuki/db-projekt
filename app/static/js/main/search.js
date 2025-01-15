    document.getElementById('bell-button').addEventListener('click', function() {
        var notifications = document.getElementById('notifications');
        if (notifications.style.display === 'none' || notifications.style.display === '') {
            notifications.style.display = 'block';
        } else {
            notifications.style.display = 'none';
        }
    });

    document.getElementById('more-button').addEventListener('click', function() {
        var moreButtons = document.getElementById('more-buttons');
        if (moreButtons.style.display === 'none' || moreButtons.style.display === '') {
            moreButtons.style.display = 'flex';
        } else {
            moreButtons.style.display = 'none';
        }
    });

    document.getElementById('past-orders-button').addEventListener('click', function() {
        var pastOrders = document.getElementById('past-orders');
        if (pastOrders.style.display === 'none' || pastOrders.style.display === '') {
            pastOrders.style.display = 'block';
            fetchPastOrders();
        } else {
            pastOrders.style.display = 'none';
        }
    });

    document.getElementById('back-button').addEventListener('click', function() {
        var pastOrders = document.getElementById('past-orders');
        pastOrders.style.display = 'none';
    });

    document.getElementById('profile-button').addEventListener('click', function() {
        var guthabenContainer = document.getElementById('guthaben-container');
        if (guthabenContainer.style.display === 'none' || guthabenContainer.style.display === '') {
            guthabenContainer.style.display = 'block';
        } else {
            guthabenContainer.style.display = 'none';
        }
    });

    document.getElementById('logo').addEventListener('click', function() {
        window.location.href = '/search';
    });

    // Öffnen des Fensters
    document.getElementById('guthaben-button').addEventListener('click', function () {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('modal-overlay');

        modal.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Schließen des Fensters
    document.getElementById('close-modal').addEventListener('click', function () {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('modal-overlay');

        modal.style.display = 'none';
        overlay.style.display = 'none';
    });

    // Overlay zum Schließen
    document.getElementById('modal-overlay').addEventListener('click', function () {
        const modal = document.getElementById('modal');
        const overlay = document.getElementById('modal-overlay');

        modal.style.display = 'none';
        overlay.style.display = 'none';
    });


    
    // Funktion um die Restaurants anzuzeigen
    function displayRestaurants(data) {
        const container = document.getElementById('restaurants-container');
        container.innerHTML = '';

        const searchText = document.getElementById('searchText');
        searchText.textContent = `${data.length} Restaurants in deinem Umfeld`;   // um dynamisch die Anzahl der Restaurants im Umfeld anzuzeigen

        data.forEach(restaurant => {
            const restaurantCard = document.createElement('div');
            restaurantCard.classList.add('restaurant-card');
            restaurantCard.innerHTML = `
                <img src="data:image/jpeg;base64,${restaurant.banner}" alt="${restaurant.name}" class="restaurant-banner">
                <h3>${restaurant.name}</h3>
                <p>${restaurant.description}</p>
                <p>Rating: ${restaurant.rating}</p>
                <p>Delivery Time: ${restaurant.approx_delivery_time}</p>
                <button onclick="navigateToRestaurant('${restaurant.restaurant_id}')">zum Menü</button>
            `;
            container.appendChild(restaurantCard);
        });
    }

    // Funktion für etwaige errors
    function handleError(error) {
        const container = document.getElementById('restaurants-container');
        container.innerHTML = `<p>${error.message}</p>`;
    }

    // Funktion für Restaurant Details
    function navigateToRestaurant(restaurantId) {
        window.location.href = `/menu?restaurant_id=${restaurantId}`; // Weiterleitung zur Restaurant-Details-Seite, aber URL noch unbekannt - später updaten -
    }

    // Funktion zum Abrufen der Restaurants vom Server
    async function fetchRestaurants() {
        try {
            const response = await fetch('/api/main/search', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 400) {
                    handleError({ message: "Ungültige Abfrageparameter." });
                } else if (response.status === 404) {
                    handleError({ message: "Es wurden keine Restaurants in der Nähe gefunden." });
                } else {
                    throw new Error(`unerwarteter Fehler: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            displayRestaurants(data);
        } catch (error) {
            console.error("Fehler beim Abruf von Restaurants.", error);
            handleError({ message: "Fehler beim Abruf von Restaurants. Bitte versuchen Sie es später erneut." });
        }
    }

    // Abrufen der Restaurants, wenn die Seite geladen wird
    fetchRestaurants();

    // Funktion für vergangene Bestellungen
    function displayPastOrders(data) {
        const pastOrdersDiv = document.getElementById('past-orders');
        pastOrdersDiv.innerHTML = '';

        // wenn keine vergangenen Bestellungen vorhanden sind
        if (data.length === 0) {     
            pastOrdersDiv.innerHTML = '<p>Keine vergangenen Bestellungen gefunden.</p>';
            return;
        }

        data.forEach((order, index) => {
            const orderItemDiv = document.createElement('div');
            orderItemDiv.classList.add('order-item');
            orderItemDiv.innerHTML = `
                <div style="flex-grow: 1;">
                    <p style="font-size: 14px;">Date: ${new Date(order.date * 1000).toLocaleString()}</p>
                    <p style="font-size: 14px;">Restaurant: ${order.name}</p>
                    <p style="font-size: 14px;">Total: $${order.total}</p>
                </div>
                <button class="arrow-button" onclick="navigateToNewPage('vergangene Bestellungen Detail.html?order_id=${order.order_id}')">
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;

            pastOrdersDiv.appendChild(orderItemDiv);
        });
    }

    // Funktion zum Abrufen vergangener Bestellungen vom Server
    async function fetchPastOrders() {
        try {
            const response = await fetch('/api/order/history', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    displayPastOrders([]);
                } else {
                    throw new Error(`unerwarteter Fehler: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            displayPastOrders(data);
        } catch (error) {
            console.error("Fehler beim Abrufen vergangener Bestellungen.", error);
            const pastOrdersDiv = document.getElementById('past-orders');
            pastOrdersDiv.innerHTML = '<p>Fehler beim Abrufen vergangener Bestellungen. Bitte versuchen Sie es später erneut.</p>';
        }
    }

    document.getElementById('logo').addEventListener('click', function () {
        window.location.href = '/search';
    });