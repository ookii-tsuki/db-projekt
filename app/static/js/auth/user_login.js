document.getElementById('registrationForm').addEventListener('submit', function(event) {
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
    }

    if (!formData.password) {
      document.getElementById('passwortError').textContent = 'Passwort darf nicht leer sein.';
      isValid = false;
    }
    else if (formData.password.length < 8) {
        document.getElementById('passwortError').textContent = 'Passwort darf nicht kleiner als 8 zeichnen sein.';
        isValid = false;
  
    }

    let passwordBestatigen = document.getElementById('passwort-bestatigen').value.trim()
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
      alert('Daten erfolgreich validiert und JSON erstellt!');
    }
  });