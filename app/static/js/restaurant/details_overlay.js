function showOverlay(details) {
    const overlay = document.getElementById('orderOverlay');
    overlay.classList.remove('fadeOut');
    overlay.classList.add('fadeIn', 'active', 'animate__animated', 'animate__fadeIn');
    document.getElementById('overlayOrderId').innerText = `Bestellung ${details.order_id}`;
    document.getElementById('overlayname').innerText = details.name ;
    document.getElementById('overlaylieferadresse').innerText = details.address + ', ' + details.zip + ' ' + details.city;
    document.getElementById('overlayOrderDate').innerText = new Date(details.date * 1000).toLocaleString();
    document.getElementById('overlayTotal').innerText = details.total.toFixed(2) + ' EUR';
    document.getElementById('overlayStatus').innerText = ['nicht bestätigt', 'in Zubereitung', 'in Lieferung', 'abgeschlossen', 'abgelehnt'][details.status] || 'Unbekannter Status';

    const overlayItemsContainer = document.getElementById('overlayItems');
    overlayItemsContainer.innerHTML = details.items.map(item => `  
      <div class="d-flex justify-content-between">
        <span>${item.name}</span>
        <span>${item.price.toFixed(2)} EUR x ${item.quantity}</span>
      </div>
      <div class="d-flex justify-content-between">
        <span class="small text-muted">${item.notes}</span>
      </div>
    `).join('');

    document.getElementById('orderOverlay').classList.add('active');
  }

  function closeOverlay() {
    const overlay = document.getElementById('orderOverlay');
    overlay.classList.remove('fadeIn');
    overlay.classList.add('fadeOut', 'animate__animated', 'animate__fadeOut');
    setTimeout(() => {
      overlay.classList.remove('active');
    }, 500); // Match the duration of the fadeOut animation
  }

  async function confirmOrder() {
    const orderId = document.getElementById('overlayOrderId').innerText.replace('Bestellung ', '');
    const data = { status: 1 }; // Status for "in Zubereitung" (in preparation)
    
    try {
      const response = await fetch(`/api/restaurant/orders/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        closeOverlay();
        fetchOrderData(); // Refresh the order list
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(errorData.message); // Error message
      } else if (response.status === 404) {
        const errorData = await response.json();
        alert(errorData.message); // Error message
      } else {
        alert('An unexpected error occurred.');
      }
    } catch (error) {
      alert('Failed to confirm the order. Please try again later.');
    }
  }

  async function cancelOrder() {
    const orderId = document.getElementById('overlayOrderId').innerText.replace('Bestellung ', '');
    const data = { status: 4 }; // Status for "abgelehnt" (rejected)
    
    try {
      const response = await fetch(`/api/restaurant/orders/order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        closeOverlay();
        fetchOrderData(); // Refresh the order list
      } else if (response.status === 400) {
        const errorData = await response.json();
        alert(errorData.message); // Error message
      } else if (response.status === 404) {
        const errorData = await response.json();
        alert(errorData.message); // Error message
      } else {
        alert('An unexpected error occurred.');
      }
    } catch (error) {
      alert('Failed to cancel the order. Please try again later.');
    }
  }