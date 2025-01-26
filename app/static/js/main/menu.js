// Funktion: Restaurantdetails dynamisch anzeigen (inkl. Bewertung)
function displayRestaurantDetails(restaurantData) {
    const headerContainer = document.querySelector('.header');
    headerContainer.querySelector('h1').textContent = restaurantData.name;
    headerContainer.querySelector('span').textContent = restaurantData.address;
    headerContainer.querySelector('.header-buttons').innerHTML = `
        <span>${'★'.repeat(Math.round(restaurantData.rating))} (${restaurantData.rating.toFixed(1)})</span>
    `;
}

// Funktion: Menü-Items dynamisch anzeigen (ohne Bewertung)
function displayMenuItems(menuItems) {
    const menuContainer = document.querySelector('.menu');
    menuContainer.innerHTML = ''; // Container leeren

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('item');
        menuItem.innerHTML = `
            <img class="photo" src="${item.image || '#'}" alt="${item.name}">
            <div class="item-details">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <p>Preis: ${item.price.toFixed(2).replace('.', ',')} €</p>
            </div>
            <div class="button-container">
                <button class="button item-button" data-item="${item.name}" data-price="${item.price}">+</button>
            </div>
        `;
        menuContainer.appendChild(menuItem);
    });

    // Event Listener für die Buttons hinzufügen
    document.querySelectorAll('.item-button').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-item');
            const itemPrice = parseFloat(button.getAttribute('data-price'));
            addToCart(itemName, itemPrice);
        });
    });
}

// Funktion: Artikel zum Warenkorb hinzufügen
const cart = [];
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// Funktion: Warenkorb aktualisieren
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    cartContainer.innerHTML = '';
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach(item => {
            const cartItem = document.createElement('li');
            cartItem.textContent = `${item.name} (x${item.quantity}) - ${(item.price * item.quantity).toFixed(2).replace('.', ',')} €`;
            cartContainer.appendChild(cartItem);
        });
    }
}

// Initialisierung der Seite
document.addEventListener('DOMContentLoaded', async () => {
    const restaurantId = 1; // Beispiel: Restaurant-ID
    try {
        const response = await fetch(`/api/main/restaurant?id=${restaurantId}`);
        if (response.ok) {
            const restaurantData = await response.json();
            displayRestaurantDetails(restaurantData); // Restaurantdetails anzeigen
            displayMenuItems(restaurantData.menu); // Menü anzeigen
        } else {
            console.error('Fehler beim Laden der Restaurantdaten.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Restaurantdaten:', error);
    }
});
