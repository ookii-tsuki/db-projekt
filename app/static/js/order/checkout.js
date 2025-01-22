document.addEventListener("DOMContentLoaded", () => {
    const mainArea = document.querySelector('.mainarea');

document.addEventListener("DOMContentLoaded", () => {
    fetchCart(); // Warenkorb-Inhalt beim Laden der Seite abrufen
});   

    // Funktion zum Anzeigen von einer Fehlermeldung
    function displayErrorMessage(message) {
        const mainArea = document.querySelector('.mainarea');
        const summaryArea = document.querySelector('.summary-area');
        mainArea.innerHTML = ''; // Clear previous content
        summaryArea.innerHTML = ''; // Clear previous content
    
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('order-item');
        errorMessage.innerHTML = `<p>${message}</p>`;
        mainArea.appendChild(errorMessage);
    }

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

    document.getElementById('past-orders-button').addEventListener('click', function() {
        window.location.href = '/past_orders';
    });

    document.getElementById('more-button').addEventListener('click', function () {
        const moreButtons = document.getElementById('more-buttons');
        moreButtons.style.display = moreButtons.style.display === 'none' || moreButtons.style.display === '' ? 'flex' : 'none';
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

    document.getElementById('logo').addEventListener('click', function () {
        window.location.href = '/search';
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
    
    // zurück Knopf oben links
    document.getElementById('back-button').addEventListener('click', function(event) {
        event.preventDefault();
        window.history.back();
    });

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
            orderItemDiv.innerHTML = `
                <p>Deine Bestellung von ${order.name} hat den Status ${getStatusText(order.status)}.</p>
            `;
            notifications.appendChild(orderItemDiv);
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
                }
            } else if (response.status === 404) {
                console.log('keine aktiven Bestellungen gefunden'); // ist optional, habe ich eingebaut um sicher zu gehen dass die API-Route funktioniert
                lastOrderStatus = null;
                document.getElementById('bell-button').classList.remove('new-notification');
            } else if (response.status === 401) {
                console.log('Benutzer nicht angemeldet'); // ebenfalls optional
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

    // Funktion zum Anzeigen des Inhalts des Warenkorbs
    async function fetchCart() {
        try {
            const response = await fetch('/api/order/cart', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                displayCart(data.cart);
            } else {
                const errorData = await response.json();
                displayErrorMessage(errorData.message);
            }
        } catch (error) {
            console.error('Fehler beim Abrufen des Warenkorbs:', error);
            displayErrorMessage('Fehler beim Abrufen des Warenkorbs. Bitte versuchen Sie es später erneut.');
        }
    }

    // zeige den Inhalt des Warenkorbs an
    function displayCart(cart) {
        const mainArea = document.querySelector('.mainarea');
        mainArea.innerHTML = '';
    
        if (cart.length === 0) {
            displayErrorMessage('Der Warenkorb ist leer.');
            return;
        }
        
        let totalSum = 0;

        cart.forEach(item => {
            totalSum += item.price * item.quantity;   // Gesamtpreis berechnen

            const card = document.createElement('div');
            card.classList.add('cart-item-card');
            card.innerHTML = `
                <div class="cart-item-content">
                    <h3>${item.name}</h3>
                    <p>${item.price.toFixed(2)} EUR</p>
                    <textarea placeholder="Notiz hinzufügen">${item.notes}</textarea>
                    <p>Anzahl: ${item.quantity}</p>
                </div>
                <div class="cart-item-image">
                    <img src="/path/to/image/${item.item_id}.jpg" alt="${item.name}">
                </div>
            `;
            mainArea.appendChild(card);
        });

        displaySummary(totalSum);
    }

    // zeige das aktuelle Guthaben sowie die Gesamtsumme an
    async function displaySummary(totalSum) {
        const wallet = await fetchWallet();
        const summaryArea = document.querySelector('.summary-area');
        if (totalSum === 0) {
            summaryArea.innerHTML = `
                <p>Dein aktuelles Guthaben: ${wallet} EUR</p>
                <p>Der Warenkorb ist leer.</p>
            `;
        } else {
            summaryArea.innerHTML = `
                <p>Dein aktuelles Guthaben: ${wallet} EUR</p>
                <p>Summe: ${totalSum.toFixed(2).replace('.', ',')} EUR</p>
            `;
        }
    }
});