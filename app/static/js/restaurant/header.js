// Replace the existing Set with localStorage management
function getSeenOrderIds() {
    const stored = localStorage.getItem('seenOrderIds');
    return new Set(stored ? JSON.parse(stored) : []);
}

function addSeenOrderId(id) {
    const ids = getSeenOrderIds();
    ids.add(id);
    localStorage.setItem('seenOrderIds', JSON.stringify([...ids]));
}

function clearSeenOrderIds() {
    localStorage.removeItem('seenOrderIds');
}

// Replace original line with
let seenOrderIds = getSeenOrderIds();

const bellButton = document.getElementById('bell-button');
const bellIcon = document.querySelector('.fa-bell');
const notificationDot = document.createElement('div');
notificationDot.className = 'notification-dot';

// Append dot to button instead of bell icon
bellButton.appendChild(notificationDot);

function toggleMessage() {
    var panel = document.getElementById('notificationPanel');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
    // Hide dot when bell is clicked
    notificationDot.style.display = 'none';
}

// Remove this line since we're using onclick attribute
// bellIcon.addEventListener('click', toggleMessage);

function fetchOrders() {
    fetch('/api/restaurant/orders/status')
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    const notificationsContainer = document.getElementById('notificationsContainer');
                    notificationsContainer.innerHTML = '<p class="card-text text-muted" id="noNotifications">Es gibt keine neuen Benachrichtigungen</p>';
                    throw new Error('No notifications found (404)');
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const notificationsContainer = document.getElementById('notificationsContainer');
            notificationsContainer.innerHTML = ''; // Clear previous notifications

            // Filter active orders and sort by date descending
            const activeOrders = data
                .filter(order => order.status === 0)
                .sort((a, b) => b.date - a.date);  // Sort by timestamp descending

            let hasNewOrders = false;

            if (activeOrders.length === 0) {
                notificationsContainer.innerHTML = '<p class="card-text text-muted" id="noNotifications">Es gibt keine neuen Benachrichtigungen</p>';
            } else {
                activeOrders.forEach(order => {
                    if (!seenOrderIds.has(order.order_id)) {
                        hasNewOrders = true;
                        addSeenOrderId(order.order_id);
                    }
                    const notificationTemplate = `
                        <div class="notification-template mb-3 p-2 border rounded">
                            <p class="card-text mb-1">${order.name} hat eine Bestellung aufgegeben</p>
                            <a href="/restaurant/orders?order_id=${order.order_id}" class="btn btn-link text-muted text-decoration-none">Details</a>
                        </div>
                    `;
                    notificationsContainer.innerHTML += notificationTemplate;
                });
            }

            if (hasNewOrders) {
                notificationDot.style.display = 'block';
                bellIcon.classList.add('shake-bell');
                setTimeout(() => {
                    bellIcon.classList.remove('shake-bell');
                }, 500);
            }
        })
        .catch(error => {
            // Handle the error without logging it to the console
            const notificationsContainer = document.getElementById('notificationsContainer');
            notificationsContainer.innerHTML = '<p class="card-text text-muted" id="noNotifications">Es gibt keine neuen Benachrichtigungen</p>';
        });
}

setInterval(fetchOrders, 5000); // Fetch orders every 5 seconds
fetchOrders();