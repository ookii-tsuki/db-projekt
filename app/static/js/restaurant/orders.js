function displayOrders(orders) {
    const urlParams = new URLSearchParams(window.location.search);
    const order_id = urlParams.get('order_id');

    const ordersContainer = document.getElementById('ordersContainer');
    ordersContainer.innerHTML = ''; 
    
    if (orders.length === 0) {
      ordersContainer.innerHTML = '<p class="text-center animate__animated animate__fadeIn">No orders found.</p>';
      return;
    }
    
    orders.forEach((order, index) => {
      const orderCard = document.createElement('div');
      orderCard.className = 'card shadow mb-4 animate__animated animate__fadeIn';
      // Add animation delay for cascade effect
      orderCard.style.animationDelay = `${index * 0.1}s`;
      let statusText = '';
      let statusClass = '';
      switch (order.status) {
        case 0: statusText = 'nicht bestätigt'; statusClass = 'text-danger'; break;
        case 1: statusText = 'in Zubereitung'; statusClass = 'text-warning'; break;
        case 2: statusText = 'in Lieferung'; statusClass = 'text-primary'; break;
        case 3: statusText = 'abgeschlossen'; statusClass = 'text-success'; break;
        case 4: statusText = 'abgelehnt'; statusClass = 'text-danger'; break;
        default: statusText = 'Unbekannter Status'; statusClass = 'text-secondary'; break;
      }

      orderCard.innerHTML = `  
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>Bestellung ${order.order_id}</h5>
            <span class="${statusClass}">${statusText}</span>
          </div>
          <p class="mb-2"><strong>Datum:</strong> ${new Date(order.date * 1000).toLocaleString()}</p>
          <div class="mb-3">
            ${order.items.map(item => `  
              <div class="d-flex justify-content-between">
                <span>${item.name}</span>
                <span>${item.price.toFixed(2)} EUR x ${item.quantity}</span>
              </div>
            `).join('')}

          </div>
          <p class="mb-3"><strong>Summe:</strong> ${order.total.toFixed(2)} EUR</p>
          <button class="btn btn-outline-dark" onclick="showOverlay(${JSON.stringify(order).replace(/"/g, '&quot;')})">Details</button>
        </div>
      `;

      if (order_id && order_id === order.order_id.toString()) {
        showOverlay(order);
      }
      ordersContainer.appendChild(orderCard);
    });
  }

  async function fetchOrderData(type) {
    try {
      const response = await fetch(`/api/restaurant/orders/${type}`);
      if (response.status === 200) {
        const data = await response.json();
        displayOrders(data);
      } else if (response.status === 404) {
        const error = await response.json();
        showError(error.message || 'No active orders found.');
      } else {
        showError('An unexpected error occurred.');
      }
    } catch (error) {
      showError('Failed to fetch orders. Please try again later.');
    } finally {
      document.getElementById('ordersLoading').style.display = 'none';
      document.getElementById('exampleOrder').style.display = 'none';
    }
  }



  function showError(message) {
    const errorMessageElement = document.getElementById('errorMessage');
    errorMessageElement.innerText = message;
    errorMessageElement.style.display = 'block';
  }


