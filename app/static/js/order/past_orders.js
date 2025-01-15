document.addEventListener("DOMContentLoaded", () => {
    const mainArea = document.querySelector('.mainarea');

    // Funktion zum Anzeigen von einer Fehlermeldung
    function displayErrorMessage(message) {
        mainArea.innerHTML = ''; // Vorherige Inhalte löschen
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('order-item');
        errorMessage.innerHTML = `<p>${message}</p>`;
        mainArea.appendChild(errorMessage);
    }

    // Funktion zum Anzeigen vergangener Bestellungen anzuzeigen
    function displayPastOrders(data) {
        mainArea.innerHTML = ''; // Vorherige Inhalte löschen
        if (data.length === 0) {
            displayErrorMessage("keine vergangenen Bestellungen gefunden.");
        } else {
            data.forEach(order => {
                const orderItemDiv = document.createElement('div');
                orderItemDiv.classList.add('order-item');
                orderItemDiv.innerHTML = `
                    <div class="order-header">
                        <p>Date: ${new Date(order.date * 1000).toLocaleString()}</p>
                        <p>Order ID: ${order.order_id}</p>
                        <p>Status: ${getStatusText(order.status)}</p>
                    </div>
                    <hr>
                    <div class="order-details">
                        <div class="left">
                            <p>Restaurant: ${order.name}</p>
                            <h3>Items:</h3>
                            <ul>
                                ${order.items.map(item => `
                                    <li>${item.name} - ${item.quantity} x $${item.price} (${item.notes})</li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="right">
                            <p>Total: $${order.total.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                mainArea.appendChild(orderItemDiv);
            });
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
                    displayErrorMessage("keine Bestellhistorie gefunden.");
                } else if (response.status === 401 || response.status === 403) {
                    displayErrorMessage("Sie sind nicht authorisiert, bitte melden Sie sich erneut an.");
                } else {
                    throw new Error(`unerwarteter Fehler: ${response.status}`);
                }
                return;
            }

            const data = await response.json();
            displayPastOrders(data);
        } catch (error) {
            console.error("Fehler beim Abrufen vergangener Bestellungen.", error);
            displayErrorMessage("Abruf vergangener Bestellungen fehlgeschlagen. Bitte versuchen Sie es später erneut.");
        }
    }

    // Bestellungen abrufen, wenn die Seite geladen wird
    fetchPastOrders();

    document.getElementById('bell-button').addEventListener('click', function () {
        const notifications = document.getElementById('notifications');
        notifications.style.display = notifications.style.display === 'none' || notifications.style.display === '' ? 'block' : 'none';
    });

    document.getElementById('more-button').addEventListener('click', function () {
        const moreButtons = document.getElementById('more-buttons');
        moreButtons.style.display = moreButtons.style.display === 'none' || moreButtons.style.display === '' ? 'flex' : 'none';
    });

    document.getElementById('past-orders-button').addEventListener('click', function () {
        location.reload();
    });

    document.getElementById('past-orders-back-button').addEventListener('click', function () {
        window.location.href = '/search';
    });

    document.getElementById('profile-button').addEventListener('click', function () {
        let guthabenButton = document.getElementById('guthaben-button');
        if (guthabenButton) {
            guthabenButton.remove();
        } else {
            const profileButton = document.getElementById('profile-button');
            guthabenButton = document.createElement('button');
            guthabenButton.classList.add('guthaben-button');
            guthabenButton.id = 'guthaben-button';
            guthabenButton.innerText = 'Guthaben';
            profileButton.parentNode.appendChild(guthabenButton);
        }
    });

    document.getElementById('logo').addEventListener('click', function () {
        window.location.href = '/search';
    });
});