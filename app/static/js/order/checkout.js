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
    this.classList.remove('new-notification');
});

document.getElementById('back-button').addEventListener('click', function(event) {
    event.preventDefault();
    window.history.back();
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

// Polling zum regelmäßigen Abrufen des Bestellstatus
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

// Polling alle 5 Sekunden
setInterval(pollOrderStatus, 5000);

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
            } else if (response.status === 401) {
                alert('Sie sind nicht autorisiert. Bitte melden Sie sich an.');
                window.location.href = '/';
            } else {
                throw new Error(`unerwarteter Fehler: ${response.status}`);
            }
            return;
        }

     const data = await response.json();
     displayCart(data);
    } catch (error) {
        console.error("Fehler beim Abrufen des Warenkorbs.", error);
        const cartContainer = document.getElementById('cart-box');
        cartContainer.innerHTML = '<p>Fehler beim Abrufen des Warenkorbs. Bitte versuchen Sie es später erneut.</p>';
    }
}

function displayCart(cart) {
    const cartBox = document.getElementById('cart-box');
    cartBox.innerHTML = '';

    if (cart.length === 0) {
        cartBox.innerHTML = '<p>Der Warenkorb ist leer.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <button class="remove-item-button" data-item-id="${item.item_id}">X</button>
            <h3>${item.name}</h3>
            <p class="item-price">Preis: ${item.price.toFixed(2).replace('.', ',')} €</p>
            <label for="quantity-${item.item_id}" class="form-label">Menge:</label>
            <select id="quantity-${item.item_id}" class="form-control item-quantity" data-item-id="${item.item_id}">
                <option value="1" ${item.quantity == 1 ? 'selected' : ''}>1</option>
                <option value="2" ${item.quantity == 2 ? 'selected' : ''}>2</option>
                <option value="3" ${item.quantity == 3 ? 'selected' : ''}>3</option>
                <option value="4" ${item.quantity == 4 ? 'selected' : ''}>4</option>
                <option value="5" ${item.quantity == 5 ? 'selected' : ''}>5</option>
            </select>
            <label for="notes-${item.item_id}" class="form-label">Notizen:</label>
            <input type="text" id="notes-${item.item_id}" class="form-control item-notes" data-item-id="${item.item_id}" value="${item.notes}" maxlength="200">
        `;
        cartBox.appendChild(cartItemDiv);

        cartItemDiv.querySelector('.remove-item-button').addEventListener('click', async function() {
            const isConfirmed = confirm('Soll das Item wirklich vom Warenkorb entfernt werden?');
            if (!isConfirmed) {
                return; // Wenn Nutzer nicht bestätigt, dann nicht entfernen
            }

            try {
                const itemId = item.item_id;
                const requestBody = { item_id: itemId };

                const response = await fetch('/api/order/remove_cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    fetchCart(); // nach dem entfernen vom Artikel den Warenkorb neu laden
                } else {
                    console.error('Fehler beim Entfernen des Artikels:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Entfernen des Artikels:', error);
            }
        });

        cartItemDiv.querySelector('.item-quantity').addEventListener('change', async function() {
            const newQuantity = this.value;

            try {
                const itemId = item.item_id;
                const requestBody = { item_id: itemId, quantity: parseInt(newQuantity), restaurant_id: item.restaurant_id, notes: item.notes };

                const response = await fetch('/api/order/add_cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    fetchCart(); // nach dem ändern der Menge den Warenkorb neu laden
                } else {
                    console.error('Fehler beim Ändern der Menge:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Ändern der Menge:', error);
            }
        });

        cartItemDiv.querySelector('.item-notes').addEventListener('change', async function() {
            const newNotes = this.value;

            try {
                const itemId = item.item_id;
                const requestBody = { item_id: itemId, quantity: item.quantity, restaurant_id: item.restaurant_id, notes: newNotes };

                const response = await fetch('/api/order/add_cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    fetchCart(); // nach dem ändern der Notizen den Warenkorb neu laden
                } else {
                    console.error('Fehler beim Ändern der Notizen:', response.statusText);
                }
            } catch (error) {
                console.error('Fehler beim Ändern der Notizen:', error);
            }
        });
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

// Funktion für etwaige errors
function handleError(error) {
    const container = document.getElementById('error-container');
    container.innerHTML = `<p>${error.message}</p>`;
}

async function fetchWallet() {
    try {
        const response = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            const formattedWallet = parseFloat(data.wallet).toFixed(2).replace('.', ','); 
            const walletContainer = document.getElementById('wallet-container');
            walletContainer.innerHTML = `<p>Ihr aktuelles Guthaben: ${formattedWallet} EUR</p>`;
            return data.wallet;
        } else {
            throw new Error('Fehler beim Abrufen der Guthaben-Informationen.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Guthaben-Informationen:', error);
        const walletContainer = document.getElementById('wallet-container');
        walletContainer.innerHTML = '<p>Fehler beim Abrufen der Guthaben-Informationen. Bitte versuchen Sie es später erneut.</p>';
        return null;
    }
}

document.getElementById('pay-button').addEventListener('click', async function() {
    const cartContainer = document.getElementById('cart-box');
    const cartItems = cartContainer.getElementsByClassName('cart-item');
    let totalSum = 0;

    if (cartItems.length === 0) {
        const paymentMessage = document.getElementById('payment-message');
        paymentMessage.innerHTML = 'Der Warenkorb ist leer.';
        alert('Der Warenkorb ist leer. Bitte fügen Sie ihrem Warenkorb zuerst Artikel hinzu.');
        window.location.href = '/search';
    } else {
        for (let item of cartItems) {
            const priceElement = item.querySelector('.item-price');
            const quantityElement = item.querySelector('.item-quantity');
            if (priceElement && quantityElement) {
                const priceText = priceElement.innerText;
                const price = parseFloat(priceText.replace('Preis: ', '').replace(' €', '').replace(',', '.'));
                const quantity = parseInt(quantityElement.value);
                totalSum += price * quantity;
            } else {
                console.error('Preis oder Menge nicht gefunden:', item);
            }
        }

        const formattedTotalSum = totalSum.toFixed(2).replace('.', ',');
        const paymentMessage = document.getElementById('payment-message');
        paymentMessage.innerHTML = `Gesamtsumme der Artikel: ${formattedTotalSum} EUR`;
    }

    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'block';
});

fetchWallet();

document.getElementById('close-payment-modal').addEventListener('click', function() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'none';
});

document.getElementById('complete-payment-button').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/order/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'place_order' })
        });

        if (response.ok) {
            alert('Die Bestellung wurde erfolgreich aufgegeben!');
            const paymentModal = document.getElementById('payment-modal');
            paymentModal.style.display = 'none';

            fetchCart();
            window.location.href = '/search';
        } else if (response.status === 400) {
            alert('Sie haben nicht genug Guthaben, um die Bestellung abzuschließen.');
        } else if (response.status === 401) {
            alert('Sie sind nicht autorisiert. Bitte melden Sie sich an.');
            window.location.href = '/';
        } else if (response.status === 402) {
            alert('Zahlung fehlgeschlagen. Sie haben nicht genügend Guthaben.');
        } else if (response.status === 404) {
            alert('Der Warenkorb ist leer.');
            window.location.href = '/search';
        } else {
            throw new Error('Unerwarteter Fehler.');
        }
    } catch (error) {
        console.error('Fehler bei der Bezahlung:', error);
        alert('Fehler beim Abschließen der Bezahlung. Bitte versuchen Sie es später erneut.');
    }
});