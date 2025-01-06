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

        // Send the data to the server via fetch API
        fetch('/api/auth/user/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            // Redirect on successful login
            window.location.href = '/dashboard'; // Change the URL as needed
          } else {
            // Handle server-side validation or errors
            console.log(data.message); // Log error message or show it to the user
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });