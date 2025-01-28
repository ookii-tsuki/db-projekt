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

// Öffnen des Fensters und Abrufen der Guthaben-Informationen
document.getElementById('guthaben-button').addEventListener('click', async function () {

    const modal = document.getElementById('modal');
    const overlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');

    try {
        const response = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            const formattedWallet = parseFloat(data.wallet).toFixed(2).replace('.', ',');  // Formatierung des Geldbetrags
            modalContent.innerHTML = `
                <p>Ihr aktuelles Guthaben bei Lieferspatz: ${formattedWallet} EUR.</p>
                <button id="close-modal">Schließen</button>
            `;
        } else if (response.status === 401) {
            modalContent.innerHTML = `
                <p>Unauthorisiert. Bitte melden Sie sich an.</p>
                <button id="close-modal">Schließen</button>
            `;
        } else if (response.status === 404) {
            modalContent.innerHTML = `
                <p>Nutzer nicht gefunden.</p>
                <button id="close-modal">Schließen</button>
            `;
        } else {
            modalContent.innerHTML = `
                <p>Fehler beim Abrufen der Guthaben-Informationen. Bitte versuchen Sie es später erneut.</p>
                <button id="close-modal">Schließen</button>
            `;
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Guthaben-Informationen:', error);
        modalContent.innerHTML = `
            <p>Fehler beim Abrufen der Guthaben-Informationen. Bitte versuchen Sie es später erneut.</p>
            <button id="close-modal">Schließen</button>
        `;
    }

    modal.style.display = 'block';
    overlay.style.display = 'block';

    document.getElementById('close-modal').addEventListener('click', function () {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    });

    overlay.addEventListener('click', function () {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    });
});

// Funktion zum Abrufen des Status der Bestellungen vom Server
async function fetchOrderStatus() {
    try {
        const response = await fetch('/api/order/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayOrderStatus(data);
        } else if (response.status === 404) {
            displayOrderStatus([]);
        } else {
            throw new Error(`unerwarteter Fehler: ${response.status}`);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen des Bestellstatus.", error);
    }
}


// Logik, um die Zahlen in Text umzuwandeln
function getStatusText(status) {
    const statusMap = {
        0: "ausstehend",
        1: "in Zubereitung",
        2: "in Zustellung",
        3: "geliefert",
        4: "storniert"
    };
    return statusMap[status] || "unbekannt";
}

// Funktion zum Anzeigen des Bestellstatus
function displayOrderStatus(orders) {
    const notifications = document.getElementById('notifications');
    const bellButton = document.getElementById('bell-button');
    notifications.innerHTML = '';

    if (orders.length === 0) {
        notifications.innerHTML = '<div class="notification-item">Keine neuen Benachrichtigungen.</div>';
        bellButton.classList.remove('new-notification');
        return;
    }

    orders.forEach(order => {
        const orderItemDiv = document.createElement('div');
        orderItemDiv.classList.add('notification-item');
        if (order.message) {
            orderItemDiv.innerHTML = `<p>${order.message}</p>`;
        } else {
            orderItemDiv.innerHTML = `
                <p>Deine Bestellung von ${order.name} hat den Status ${getStatusText(order.status)}.</p>
            `;
        }
        notifications.prepend(orderItemDiv); // prepend, um die neuesten Benachrichtigungen zuerst anzuzeigen
    });

    bellButton.classList.add('new-notification');
}

let lastOrderStatus = null;
async function pollOrderStatus() {
    try {
        const response = await fetch('/api/order/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (JSON.stringify(data) !== JSON.stringify(lastOrderStatus)) {
                lastOrderStatus = data;
                document.getElementById('bell-button').classList.add('new-notification');
                displayOrderStatus(data);
            }
        } else if (response.status === 404) {
            console.log('keine aktiven Bestellungen gefunden'); // ist optional, habe ich eingebaut um sicher zu gehen dass die API-Route funktioniert
            lastOrderStatus = null;
            document.getElementById('bell-button').classList.remove('new-notification');
            displayOrderStatus([]);
        } else if (response.status === 401) {
            console.log('Benutzer nicht angemeldet'); // ebenfalls optional
            lastOrderStatus = null;
            document.getElementById('bell-button').classList.remove('new-notification');
            displayOrderStatus([{ message: 'Bitte melden Sie sich an, um Benachrichtigungen zu sehen.' }]);
        } else {
            throw new Error(`unerwarteter Fehler: ${response.status}`);
        }
    } catch (error) {
        console.error("Fehler beim Abrufen des Bestellstatus.", error);
    }
}

setInterval(pollOrderStatus, 5000);

function handleError(error) {
    const container = document.getElementById('error-container');
    container.innerHTML = `<p>${error.message}</p>`;
}

function displayPastOrders(data) {
    const pastOrdersDiv = document.getElementById('past-orders');
    pastOrdersDiv.innerHTML = '';

    // wenn keine vergangenen Bestellungen vorhanden sind
    if (data.length === 0) {     
        pastOrdersDiv.innerHTML = '<p>Keine vergangenen Bestellungen gefunden.</p>';
        return;
    }

    data.sort((a, b) => b.date - a.date); // sortieren nach aktuellstem Datum (absteigend)

    data.forEach((order, index) => {
        const orderItemDiv = document.createElement('div');
        orderItemDiv.classList.add('order-item');
        orderItemDiv.innerHTML = `
            <div style="flex-grow: 1;">
                <p style="font-size: 14px;">Datum: ${new Date(order.date * 1000).toLocaleString()}</p>
                <p style="font-size: 16px;">Restaurant: ${order.name}</p>
                <p style="font-size: 18px;">Summe: ${order.total.toFixed(2).replace('.', ',')} EUR </p>
            </div>
            <button class="arrow-button" onclick="window.location.href='/past_orders?order_id=${order.order_id}'">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pastOrdersDiv.appendChild(orderItemDiv);
    });
}

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

function updateCart() {
    fetch('/api/order/cart')
        .then(response => {
            if (response.status === 404) {
                throw new Error('Cart empty');
            }
            return response.json();
        })
        .then(items => {
            // Hide empty cart message and show cart section
            document.getElementById('empty-cart').style.display = 'none';
            const cartItemsContainer = document.getElementById('cart-items');
            cartItemsContainer.style.display = 'block';

            // Clear existing items but keep checkout section
            const checkoutSection = document.getElementById('checkout-section');
            cartItemsContainer.innerHTML = '';
            
            // Calculate total
            let total = 0;

            // Add each item to cart
            items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                const itemHtml = `
                    <div class="cart-item mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-bold">${item.name}</span>
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${item.item_id})">-</button>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-muted">${item.price.toFixed(2)}€</span>
                            <span class="badge bg-secondary">${item.quantity}x</span>
                        </div>
                        ${item.notes ? `<small class="d-flex text-muted">${item.notes}</small>` : ''}
                    </div>
                `;
                cartItemsContainer.innerHTML += itemHtml;
            });

            // Add back checkout section and update total
            cartItemsContainer.appendChild(checkoutSection);
            const priceSpan = document.getElementById('price-element');
            priceSpan.textContent = total.toFixed(2) + '€';
        })
        .catch(error => {
            // Show empty cart state and hide cart items
            document.getElementById('empty-cart').style.display = 'block';
            document.getElementById('cart-items').style.display = 'none';
        });
}
// Initial cart load
updateCart();


async function loadRestaurantData() {
    // Get restaurant ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurant_id = urlParams.get('restaurant_id');
    
    if (!restaurant_id) {
        console.error('No restaurant ID provided');
        return;
    }

    try {
        // Fetch restaurant data
        const response = await fetch(`/api/main/restaurant?id=${restaurant_id}`);
        const data = await response.json();

        if (response.status === 404) {
            document.getElementById('restaurant-menu').style.display = 'none';
            document.getElementById('no-restaurant').style.display = 'block';
            return;
        }

        // Update restaurant header info
        document.getElementById('restaurant_name').textContent = data.name;
        document.getElementById('restaurant_rating').textContent = data.rating.toFixed(1);
        document.getElementById('restaurant_address').textContent = `${data.address}, ${data.zip} ${data.city}`;
        document.getElementById('restaurant_approx_delv_time').textContent = data.approx_delivery_time;

        // Update banner image if provided
        document.querySelector('.card-img-top').src = data.banner && data.banner.startsWith("data:image") ? data.banner : no_image;

        // Get container for menu items
        const menuContainer = document.querySelector('.col-9');

        // Remove existing menu item template
        const existingMenuItems = menuContainer.querySelectorAll('.card.mb-3');
        existingMenuItems.forEach(item => item.remove());

        // Create menu items
        data.menu.forEach(item => {
            const menuItem = `
<div class="card mb-3" style="height: 200px;">
    <div class="row g-0 h-100">
        <div class="col-md-3">
            <div style="height: 200px; width: 100%; overflow: hidden; border-radius: 0.375rem 0 0 0.375rem;">
                <img src="${item.image && item.image.startsWith("data:image") ? item.image : no_image}" 
                     class="w-100 h-100" 
                     alt="${item.name}"
                     style="object-fit: cover; object-position: center;">
            </div>
        </div>
        <div class="col-md-8">
            <div class="card-body py-0 h-100 d-flex flex-column justify-content-center text-start">
                <h5 class="card-title mb-1">${item.name}</h5>
                <p class="card-text">${item.description}</p>
                <p class="card-text"><strong>€${item.price.toFixed(2)}</strong></p>
            </div>
        </div>
        <div class="col-md-1 d-flex align-items-center justify-content-end">
            <button class="btn btn-dark me-2" onclick="openItemModal(${JSON.stringify(item).replace(/'/g, "&apos;").replace(/"/g, "&quot;")})">+</button>
        </div>
    </div>
</div>`;
            menuContainer.insertAdjacentHTML('beforeend', menuItem);
        });

    } catch (error) {
        console.error('Error loading restaurant data:', error);
    }
}

function incrementQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

async function addToCart(item) {
    const quantity = document.getElementById('quantity').value;
    const notes = document.getElementById('orderNotes').value;

    const urlParams = new URLSearchParams(window.location.search);
    const restaurant_id = urlParams.get('restaurant_id');
    
    try {
        const response = await fetch('/api/order/add_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                item_id: item.item_id,
                restaurant_id: restaurant_id,
                quantity: parseInt(quantity),
                notes: notes
            })
        });

        const data = await response.json();

        if (response.status === 201) {
            // Success
            showNotification(`${item.name} wurde zum Warenkorb hinzugefügt!`, 'success');
            // Optional: Refresh cart display here
        } else if (response.status === 400) {
            showNotification('Fehler: Ungültige Anfrage. Bitte versuchen Sie es erneut.', 'danger');
        } else if (response.status === 404) {
            showNotification('Fehler: Restaurant oder Item nicht gefunden.', 'danger');
        } else if (response.status === 401) {
            showNotification('Fehler: Benutzer nicht angemeldet.', 'danger');
        } else {
            showNotification('Fehler: Unerwarteter Fehler. Bitte versuchen Sie es erneut.', 'danger');
        }
    } catch (error) {
        showNotification('Fehler: Bitte versuchen Sie es später erneut.', 'danger');
        console.error('Error:', error);
    }
    updateCart();

    // Close modal after attempt
    const modal = bootstrap.Modal.getInstance(document.getElementById('menuItemModal'));
    modal.hide();
}

// Add after the openItemModal function

async function removeFromCart(item_id) {
    try {
        const response = await fetch('/api/order/remove_cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                item_id: item_id
            })
        });

        if (response.status === 200) {
            showNotification('Item wurde aus dem Warenkorb entfernt!', 'success');
        } else if (response.status === 404) {
            showNotification('Fehler: Item nicht im Warenkorb gefunden.', 'danger');
        } else if (response.status === 401) {
            showNotification('Fehler: Benutzer nicht angemeldet.', 'danger');
        } else {
            showNotification('Fehler: Unerwarteter Fehler. Bitte versuchen Sie es erneut.', 'danger');
        }
    } catch (error) {
        showNotification('Fehler: Bitte versuchen Sie es später erneut.', 'danger');
        console.error('Error:', error);
    }
    
    updateCart();
}

// Function to open modal with item details
function openItemModal(item) {
    const modal = document.getElementById('menuItemModal');
    document.getElementById('menuItemImage').src = item.image && item.image.startsWith("data:image") ? item.image : no_image;
    document.getElementById('menuItemName').textContent = item.name;
    document.getElementById('menuItemDescription').textContent = item.description;
    document.getElementById('quantity').value = 1;
    document.getElementById('orderNotes').value = '';
    document.getElementById('addToCartButton').setAttribute('onclick', `addToCart(${JSON.stringify(item)})`);
    new bootstrap.Modal(modal).show();
}


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadRestaurantData);

function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastBody = document.getElementById('toastMessage');
    const toastInstance = new bootstrap.Toast(toast, { delay: 3000 });
    
    // Set message
    toastBody.textContent = message;
    
    // Set toast background color based on type
    toast.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'bg-info');
    toast.classList.add(`bg-${type}`, 'text-white');
    
    // Show toast
    toastInstance.show();
}