document.getElementById('logo').addEventListener('click', function() {
    window.location.href = '/search';
});
document.getElementById('bell-button').addEventListener('click', function() {
    var notifications = document.getElementById('notifications');
    if (notifications.style.display === 'none' || notifications.style.display === '') {
        notifications.style.display = 'block';
        fetchOrderStatus();
    } else {
        notifications.style.display = 'none';
    }
    this.classList.remove('new-notification');   // Der rote Punkt wird entfernt, wenn die Benachrichtigungen gelesen werden
});

document.getElementById('cart-button').addEventListener('click', function() {
    window.location.href = '/cart';
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

document.getElementById('profile-button').addEventListener('click', function() {
    var guthabenContainer = document.getElementById('guthaben-container');
    var ausloggenButton = document.getElementById('ausloggen-button');
    if (guthabenContainer.style.display === 'none' || guthabenContainer.style.display === '') {
        guthabenContainer.style.display = 'block';
        ausloggenButton.style.display = 'block';
    } else {
        guthabenContainer.style.display = 'none';
        ausloggenButton.style.display = 'none';
    }
});

document.getElementById('ausloggen-button').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/auth/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            window.location.href = '/'; // zur Index-Seite weiterleiten
        } else {
            const data = await response.json();
            console.error('Ausloggen fehlgeschlagen:', data.message);
        }
    } catch (error) {
        console.error('Fehler beim Ausloggen:', error);
    }
});

async function loadRestaurantData() {
    try {
        const response = await fetch('/api/main/restaurant_data'); 
        if (!response.ok) throw new Error('Fehler beim Abrufen der Restaurantdaten.');

        const restaurantData = await response.json();
        displayRestaurantBanner(restaurant_data.banner); // Dynamischen Banner laden
    } catch (error) {
        console.error(error);
    }
}

// Lade die Daten beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    loadRestaurantData();
});

