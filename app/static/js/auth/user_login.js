document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Clear previous error messages
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => field.textContent = '');

  // Collect form data
  const formData = {
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value.trim()
  };

  let isValid = true;

  // Validate email
  if (!formData.email) {
    document.getElementById('emailError').textContent = 'E-Mail darf nicht leer sein.';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    document.getElementById('emailError').textContent = 'E-Mail ist nicht gültig.';
    isValid = false;
  }

  // Validate password
  if (!formData.password) {
    document.getElementById('passwortError').textContent = 'Passwort darf nicht leer sein.';
    isValid = false;
  }

  if (isValid) {
    // If everything is valid, prepare the JSON
    console.log(JSON.stringify(formData));

    fetch('/api/auth/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        // Check specific status codes
        switch (response.status) {
          case 200: // Created
            console.log(response.json())
            //window.location.href = "/users/login";
            break
          case 400: // Bad Request
              console.log(response.json())
              break
          case 409: // Unauthorized
              console.log(response.json())
              break
          case 500: // Internal Server Error  
              console.log(response.json())
              break
          default: // Other cases
            throw new Error(`Unexpected status code: ${response.status}`);
        }
      }).catch(error => {
          console.error('Error:', error.message); // Logs errors with detailed messages
        });
  }
});