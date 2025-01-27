function formatOpeningHours(openingHours) {
    const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    
    if (!openingHours || !Array.isArray(openingHours) || openingHours.length === 0) {
        return 'Nicht verfügbar';
    }

    const formattedHours = openingHours
        .sort((a, b) => a.day_of_week - b.day_of_week)
        .map(hours => `${dayNames[hours.day_of_week]}: ${hours.open_time} - ${hours.close_time}`)
        .join('<br>');

    return '<br>' + formattedHours;
}

fetch('/api/auth/restaurant')  // Replace with actual URL to fetch JSON
.then(response => {
  if (response.status === 200) {
    return response.json();
  } else if (response.status === 401) {
    alert('Unauthorized: Please log in.');
    return null;
  } else if (response.status === 404) {
    alert('Restaurant not found.');
    return null;
  }
})
.then(data => {
  if (data) {
    // Dynamically populate data
    document.getElementById('restaurantDescription').textContent = data.description ;
    document.getElementById('restaurantNameDisplay').textContent = data.name;
    document.getElementById('restaurantAddress').textContent = `${data.address}, ${data.zip} ${data.city}`;
    document.getElementById('restaurantOpeningHours').innerHTML = formatOpeningHours(data.opening_hours);
    // If there's an image, display it (assuming it could be a URL or base64)
    if (data.banner && data.banner.length > 0 && data.banner.startsWith('data:image/')) {
      document.getElementById('restaurantImage').src = data.banner;
    }
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
  alert('An error occurred while loading restaurant data.');
});
