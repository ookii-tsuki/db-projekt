document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear all previous error messages
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.textContent = '');

    // Collect form data
    const formData = {
      vorname: document.getElementById('vorname').value.trim(),
      nachname: document.getElementById('nachname').value.trim(),
      email: document.getElementById('email').value.trim(),
      adresse: document.getElementById('adresse').value.trim(),
      plz: document.getElementById('plz').value.trim(),
      passwort: document.getElementById('passwort').value.trim(),
      passwortBestatigen: document.getElementById('passwort-bestatigen').value.trim()
    };

    let isValid = true;

    // Validate each field
    if (!formData.vorname) {
      document.getElementById('vornameError').textContent = 'Vorname darf nicht leer sein.';
      isValid = false;
    }

    if (!formData.nachname) {
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

    if (!formData.adresse) {
      document.getElementById('adresseError').textContent = 'Adresse darf nicht leer sein.';
      isValid = false;
    }

    if (!formData.plz) {
      document.getElementById('plzError').textContent = 'PLZ darf nicht leer sein.';
      isValid = false;
    }

    if (!formData.passwort) {
      document.getElementById('passwortError').textContent = 'Passwort darf nicht leer sein.';
      isValid = false;
    }
    else if (formData.passwort.length < 8) {
        document.getElementById('passwortError').textContent = 'Passwort darf nicht kleiner als 8 zeichnen sein.';
        isValid = false;
  
    }

    if (!formData.passwortBestatigen) {
      document.getElementById('confirmPasswordError').textContent = 'Passwort Bestätigen darf nicht leer sein.';
      isValid = false;
    } else if (formData.passwort !== formData.passwortBestatigen) {
      document.getElementById('confirmPasswordError').textContent = 'Passwörter stimmen nicht überein.';
      isValid = false;
    }

    if (isValid) {
      // If all validations pass, prepare JSON
      console.log(JSON.stringify(formData));
      alert('Daten erfolgreich validiert und JSON erstellt!');
    }
  });