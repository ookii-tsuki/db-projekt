document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Clear all previous error messages
  const errorFields = document.querySelectorAll('.error');
  errorFields.forEach(field => field.textContent = '');

  // Collect form data
  const formData = {
      first_name: document.getElementById('vorname').value.trim(),
      last_name: document.getElementById('nachname').value.trim(),
      email: document.getElementById('email').value.trim(),
      address: document.getElementById('adresse').value.trim(),
      zip: document.getElementById('plz').value.trim(),
      city: document.getElementById('ort').value.trim(),
      password: document.getElementById('passwort').value.trim(),
  };

  let isValid = true;

  // Validate each field
  if (!formData.first_name) {
      document.getElementById('vornameError').textContent = 'Vorname darf nicht leer sein.';
      isValid = false;
  }

  if (!formData.last_name) {
      document.getElementById('nachnameError').textContent = 'Nachname darf nicht leer sein.';
      isValid = false;
  }

  if (!formData.email) {
      document.getElementById('emailError').textContent = 'E-Mail darf nicht leer sein.';
      isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      document.getElementById('emailError').textContent = 'E-Mail ist nicht gültig.';
      isValid = false;
  }

  if (!formData.address) {
      document.getElementById('adresseError').textContent = 'Adresse darf nicht leer sein.';
      isValid = false;
  }

  if (!formData.zip) {
      document.getElementById('plzError').textContent = 'PLZ darf nicht leer sein.';
      isValid = false;
  } else if (!/^[0-9]{5}$/.test(formData.zip)) {
      document.getElementById('plzError').textContent = 'PLZ nicht gültig.';
      isValid = false;
  }

  if (!formData.city) {
      document.getElementById('ortError').textContent = 'Ort darf nicht leer sein.';
      isValid = false;
  }

  if (!formData.password) {
      document.getElementById('passwortError').textContent = 'Passwort darf nicht leer sein.';
      isValid = false;
  } else if (formData.password.length < 8) {
      document.getElementById('passwortError').textContent = 'Passwort darf nicht kleiner als 8 Zeichen sein.';
      isValid = false;
  }

  const passwordBestatigen = document.getElementById('passwort-bestatigen').value.trim();
  if (!passwordBestatigen) {
      document.getElementById('confirmPasswordError').textContent = 'Passwort Bestätigen darf nicht leer sein.';
      isValid = false;
  } else if (formData.password !== passwordBestatigen) {
      document.getElementById('confirmPasswordError').textContent = 'Passwörter stimmen nicht überein.';
      isValid = false;
  }

  if (isValid) {
      // If all validations pass, prepare JSON
      console.log(JSON.stringify(formData));
      fetch('/api/auth/user/register', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
      })
          .then(response => {
              // Check specific status codes and show alerts
              switch (response.status) {
                  case 201: // Created
                      alert('Registrierung erfolgreich! Sie werden zur Anmeldeseite weitergeleitet.');
                      window.location.href = "/users/login"; // Redirect link
                      break;
                  case 400: // Bad Request
                      alert('Registrierungsfehler: Ungültige Daten. Bitte überprüfen Sie Ihre Eingaben.');
                      return response.json().then(data => console.log(data));
                  case 409: // Conflict (e.g., email already exists)
                      alert('Die E-Mail-Adresse ist bereits registriert.');
                      return response.json().then(data => console.log(data));
                  case 500: // Internal Server Error
                      alert('Ein interner Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
                      return response.json().then(data => console.log(data));
                  default: // Other cases
                      alert(`Unerwarteter Fehler: Status ${response.status}`);
                      throw new Error(`Unexpected status code: ${response.status}`);
              }
          })
          .catch(error => {
              console.error('Fehler:', error.message); // Logs errors with detailed messages
              alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
          });
  }
});
