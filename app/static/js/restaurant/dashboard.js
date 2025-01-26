function showGuthabenModal() {
    fetch('/api/restaurant/stats')
      .then(response => {
        if (!response.ok) {
          alert(`HTTP error! status: ${response.status}`);
          return response.json().then(error => { throw new Error(error.message); });
        }
        return response.json();
      })
      .then(data => {
        document.getElementById('totalOrders').innerText = data.total_orders;
        document.getElementById('totalRevenue').innerText = data.total_revenue + ' EUR';
        document.getElementById('averageRating').innerText = data.average_rating;
        document.getElementById('guthabenModal').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
      })
      .catch(error => {
        alert(error.message);
      });
  }

  function hideGuthabenModal() {
    document.getElementById('guthabenModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
  }