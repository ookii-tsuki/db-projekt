// Logo-Klick-Event
document.getElementById('logo').addEventListener('click', function () {
    window.location.href = '/search';
});

// Glocken-Button-Event (Benachrichtigungen anzeigen/verstecken)
document.getElementById('bell-button').addEventListener('click', function () {
    var notifications = document.getElementById('notifications');
    if (notifications.style.display === 'none' || notifications.style.display === '') {
        notifications.style.display = 'block';
        fetchOrderStatus(); // Dummy-Funktion (hier kannst du weitere Logik hinzufügen)
    } else {
        notifications.style.display = 'none';
    }
    this.classList.remove('new-notification'); // Entfernt den roten Punkt
});

// Warenkorb-Button-Event
document.getElementById('cart-button').addEventListener('click', function () {
    window.location.href = '/cart';
});

// Mehr-Button-Event
document.getElementById('more-button').addEventListener('click', function () {
    var moreButtons = document.getElementById('more-buttons');
    if (moreButtons.style.display === 'none' || moreButtons.style.display === '') {
        moreButtons.style.display = 'flex';
    } else {
        moreButtons.style.display = 'none';
    }
});

// Vergangene Bestellungen anzeigen/verstecken
document.getElementById('past-orders-button').addEventListener('click', function () {
    var pastOrders = document.getElementById('past-orders');
    if (pastOrders.style.display === 'none' || pastOrders.style.display === '') {
        pastOrders.style.display = 'block';
        fetchPastOrders(); // Dummy-Funktion (hier kannst du weitere Logik hinzufügen)
    } else {
        pastOrders.style.display = 'none';
    }
});

// Profil-Button-Event (Guthaben anzeigen/verstecken)
document.getElementById('profile-button').addEventListener('click', function () {
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

// Ausloggen-Button-Event
document.getElementById('ausloggen-button').addEventListener('click', async function () {
    try {
        const response = await fetch('/api/auth/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            window.location.href = '/'; // Zur Index-Seite weiterleiten
        } else {
            const data = await response.json();
            console.error('Ausloggen fehlgeschlagen:', data.message);
        }
    } catch (error) {
        console.error('Fehler beim Ausloggen:', error);
    }
});

// Funktion zum Abrufen der Menü-Items
async function fetchMenuItems() {
    try {
        const response = await fetch('/api/restaurant/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayMenuItems(data); // Menü anzeigen
        } else {
            console.error('Fehler beim Abrufen der Menü-Items.');
        }
    } catch (error) {
        console.error('Fehler:', error);
    }
}

// Funktion zum Darstellen der Menü-Items
function displayMenuItems(menu) {
    const container = document.getElementById('menu-container');
    container.innerHTML = ''; // Container leeren

    menu.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>Preis: ${item.price.toFixed(2).replace('.', ',')} EUR</p>
        `;
        container.appendChild(itemDiv);
    });
}

// Abrufen der Menü-Items beim Laden der Seite
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM vollständig geladen"); // Debugging-Ausgabe
    fetchMenuItems();
});

// Funktion für Fehleranzeige
function handleError(error) {
    const container = document.getElementById('error-container');
    container.innerHTML = `<p>${error.message}</p>`;
}
