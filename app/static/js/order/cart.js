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

document.getElementById('back-button').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = '/search';
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

// Funktion zum Abrufen des Warenkorbs vom Server
async function fetchCart() {
    try {
        const response = await fetch('/api/order/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                displayCart([]);
            } else {
                throw new Error(`unerwarteter Fehler: ${response.status}`);
            }
            return;
        }

     const data = await response.json();
     displayCart(data.cart);
    } catch (error) {
        console.error("Fehler beim Abrufen des Warenkorbs.", error);
        const cartContainer = document.getElementById('cart-container');
        cartContainer.innerHTML = '<p>Fehler beim Abrufen des Warenkorbs. Bitte versuchen Sie es später erneut.</p>';
    }
}

// Funktion zum Anzeigen des Warenkorbs
function displayCart(cart) {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Der Warenkorb ist leer.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Preis: ${item.price} €</p>
            <p>Menge: ${item.quantity}</p>
            <p>Notizen: ${item.notes}</p>
        `;
        cartContainer.appendChild(cartItemDiv);
    });
}

// Abrufen des Warenkorbs, wenn die Seite geladen wird
fetchCart();

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