document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Clear all previous error messages
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.textContent = '');

    // Collect form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        zip: document.getElementById('plz').value.trim(),
        city: document.getElementById('ort').value.trim(),
        description: document.getElementById('description').value.trim(),
        password: document.getElementById('password').value.trim(),
        banner: '', // Default empty if no image is uploaded
    };

    let isValid = true;

    // Validation logic
    if (!formData.name) {
        document.getElementById('nameError').textContent = 'Name darf nicht leer sein.';
        isValid = false;
    }
    if (!formData.description) {
        document.getElementById('descriptionError').textContent = 'Beschreibung darf nicht leer sein.';
        isValid = false;
    }
    if (!formData.address) {
        document.getElementById('adressError').textContent = 'Adresse darf nicht leer sein.';
        isValid = false;
    }
    if (!formData.city) {
        document.getElementById('ortError').textContent = 'Ort darf nicht leer sein.';
        isValid = false;
    }
    if (!formData.email) {
        document.getElementById('emailError').textContent = 'E-Mail darf nicht leer sein.';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        document.getElementById('emailError').textContent = 'E-Mail ist nicht gültig.';
        isValid = false;
    }
    if (!formData.zip || !/^\d{5}$/.test(formData.zip)) {
        document.getElementById('plzError').textContent = 'PLZ muss 5 Ziffern enthalten.';
        isValid = false;
    }

    if (formData.password.length < 8) {
        document.getElementById('passwordError').textContent = 'Passwort darf nicht kleiner als 8 Zeichen sein.';
        isValid = false;
    }
    if (formData.password !== document.getElementById('confirm-password').value.trim()) {
        document.getElementById('confirmPasswordError').textContent = 'Passwörter stimmen nicht überein.';
        isValid = false;
    }

    // Check image size
    const bannerInput = document.getElementById('banner');
    if (bannerInput.files && bannerInput.files[0]) {
        if (bannerInput.files[0].size > 1048576) {
            alert('Die Bildgröße darf 1 MB nicht überschreiten.');
            isValid = false;
            return;
        }

        const reader = new FileReader();
        reader.onloadend = function() {
            formData.banner = reader.result; // Store Base64 image
            submitForm(isValid, formData);
        };
        reader.readAsDataURL(bannerInput.files[0]);
    } else {
        submitForm(isValid, formData);
    }
});

function submitForm(isValid, formData) {
    if (isValid) {
        fetch('/api/auth/restaurant/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            // Check specific status codes
            switch (response.status) {
                case 201: // Created
                    alert('Registrierung erfolgreich! Ihr Account wurde erstellt.');
                    // Redirect URL - place your link here
                    window.location.href = '/restaurant/login'; // Replace '/dashboard' with the actual redirect link
                    break;
                case 400: // Bad Request
                    alert('Fehler: Ungültige Eingaben. Bitte überprüfen Sie Ihre Daten.');
                    return response.json().then(data => console.log(data));
                case 409: // Conflict (e.g., email already exists)
                    alert('Die E-Mail-Adresse ist bereits registriert.');
                    return response.json().then(data => console.log(data));
                case 500: // Internal Server Error
                    alert('Serverfehler: Bitte versuchen Sie es später erneut.');
                    return response.json().then(data => console.log(data));
                default: // Other cases
                    alert(`Unbekannter Fehler: ${response.status}`);
                    throw new Error(`Unexpected status code: ${response.status}`);
            }
        })
        .then(data => console.log(data))
        .catch(error => {
            console.error('Error:', error.message); // Logs errors with detailed messages
            alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        });
    }
}

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        document.getElementById('imagePreview').innerHTML = 
            '<img src="' + reader.result + '" class="photo" alt="Image Preview">';
    };
    reader.readAsDataURL(event.target.files[0]);
}
