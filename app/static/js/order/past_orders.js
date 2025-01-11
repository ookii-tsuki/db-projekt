// JSON Daten
    const jsonData = [
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
    ];

    // Funktion für vergangene Bestellungen
    function displayPastOrders(data) {
        const mainArea = document.querySelector('.mainarea');
        if (data.length === 0) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('order-item');
            errorMessage.innerHTML = `<p>No order history found.</p>`;
            mainArea.appendChild(errorMessage);
        } else {
            data.forEach(order => {
                const orderItemDiv = document.createElement('div');
                orderItemDiv.classList.add('order-item');
                orderItemDiv.innerHTML = `
                    <div class="order-header">
                        <p>Date: ${new Date(order.date * 1000).toLocaleString()}</p>
                        <p>Order ID: ${order.order_id}</p>
                        <p>Status: ${order.status}</p>
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
                            <p>Total: $${order.total}</p>
                        </div>
                    </div>
                `;
                mainArea.appendChild(orderItemDiv);
            });
        }
    }

    displayPastOrders(jsonData);

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
        location.reload();
    });

    document.getElementById('past-orders-back-button').addEventListener('click', function() {
        var pastOrders = document.getElementById('past-orders');
        pastOrders.style.display = 'none';
    });

    function toggleDetails(detailsId) {
        var details = document.getElementById(detailsId);
        if (details.style.display === 'none' || details.style.display === '') {
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }
    }

    // Profilbutton soll den Guthabenknopf auslösen
    document.getElementById('profile-button').addEventListener('click', function() {
        var guthabenButton = document.getElementById('guthaben-button');
        if (guthabenButton) {
            guthabenButton.remove();
        } else {
            var profileButton = document.getElementById('profile-button');
            guthabenButton = document.createElement('button');
            guthabenButton.classList.add('guthaben-button');
            guthabenButton.id = 'guthaben-button';
            guthabenButton.innerText = 'Guthaben';
            profileButton.parentNode.appendChild(guthabenButton);
        }
    });

    document.getElementById('logo').addEventListener('click', function() {
        window.location.href = '/search.html';
    });