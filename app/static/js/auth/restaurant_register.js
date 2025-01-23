let importedImage = null;

// Attach an event listener to the form's submit event
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior (page reload)

    // Clear all previous error messages from the form
    const errorFields = document.querySelectorAll('.error');  // Select all elements with class 'error'
    errorFields.forEach(field => field.textContent = '');  // Remove text content (error messages)

    // Collect form data, trimming any extra spaces
    const formData = {
        name: document.getElementById('name').value.trim(),  // Name input value
        email: document.getElementById('email').value.trim(),  // Email input value
        address: document.getElementById('address').value.trim(),  // Address input value
        zip: document.getElementById('plz').value.trim(),  // Postal code input value
        city: document.getElementById('ort').value.trim(),  // City input value
        description: document.getElementById('description').value.trim(),  // Description input value
        password: document.getElementById('password').value.trim(),  // Password input value
        banner: importedImage,
        cuisine: document.getElementById('cuisine').selectedIndex,
        opening_hours: []
    };

    // Variable to keep track of form validity (if all fields are valid)
    let isValid = true;

    // Validation checks for required fields
    if (!formData.name) {
        document.getElementById('nameError').textContent = 'Name darf nicht leer sein.';  // Display error for name
        isValid = false;  // Set form to invalid if name is empty
    }

    // Validate description field
    if (!formData.description) {
        document.getElementById('descriptionError').textContent = 'Beschreibung darf nicht leer sein.';  // Display error for description
        isValid = false;  // Set form to invalid if description is empty
    }

    // Validate address field
    if (!formData.address) {
        document.getElementById('adressError').textContent = 'Adresse darf nicht leer sein.';  // Display error for address
        isValid = false;
    }

    // Validate city field
    if (!formData.city) {
        document.getElementById('ortError').textContent = 'Ort darf nicht leer sein.';  // Display error for city
        isValid = false;
    }

    // Validate email field (not empty and follows a proper email format)
    if (!formData.email) {
        document.getElementById('emailError').textContent = 'E-Mail darf nicht leer sein.';  // Display error for email if empty
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        document.getElementById('emailError').textContent = 'E-Mail ist nicht gültig.';  // Display error for invalid email format
        isValid = false;
    }

    // Validate zip code (must be exactly 5 digits)
    if (!formData.zip || !/^\d{5}$/.test(formData.zip)) {
        document.getElementById('plzError').textContent = 'PLZ muss 5 Ziffern enthalten.';  // Display error for invalid zip code
        isValid = false;
    }

    // Validate password length (must be at least 8 characters)
    if (formData.password.length < 8) {
        document.getElementById('passwordError').textContent = 'Passwort darf nicht kleiner als 8 Zeichen sein.';  // Display error for short password
        isValid = false;
    }

    // Check if password and confirm password match
    if (formData.password !== document.getElementById('confirm-password').value.trim()) {
        document.getElementById('confirmPasswordError').textContent = 'Passwörter stimmen nicht überein.';  // Display error for mismatched passwords
        isValid = false;
    }


    // Collect opening hours
    const usedDays = new Set();
    const rows = document.querySelectorAll('#openingHoursContainer .row');

    if (rows.length === 0) {
        document.getElementById('openingHoursError').textContent = 'Bitte fügen Sie mindestens einen Öffnungstag hinzu.';
        isValid = false;
    }

    rows.forEach(row => {
        const daySelect = row.querySelector('select');
        const openInput = row.querySelectorAll('input[type="time"]')[0];
        const closeInput = row.querySelectorAll('input[type="time"]')[1];

        const dayIndex = daySelect.selectedIndex;
        if (dayIndex !== null) {
            // Check if opening and closing times are set
            if (!openInput.value || !closeInput.value) {
                document.getElementById('openingHoursError').textContent = `Bitte Öffnungs- und Schließzeit für ${daySelect.value} eingeben.`;

                isValid = false;
                return;
            }

            // Compare opening and closing times
            const [openHour, openMin] = openInput.value.split(':').map(Number);
            const [closeHour, closeMin] = closeInput.value.split(':').map(Number);
            const openTotal = openHour * 60 + openMin;
            const closeTotal = closeHour * 60 + closeMin;        

            if (usedDays.has(dayIndex)) {
                document.getElementById('openingHoursError').textContent = `Der Tag ${daySelect.value} wurde bereits hinzugefügt.`;
                isValid = false;
            }
            else if (closeTotal <= openTotal) {
                document.getElementById('openingHoursError').textContent = `Die Schließzeit für ${daySelect.value} muss später als die Öffnungszeit sein.`;
                isValid = false;
                return;
            } else {
                usedDays.add(dayIndex);
                formData.opening_hours.push({
                    day_of_week: dayIndex,
                    open_time: openInput.value,
                    close_time: closeInput.value
                });
            }
        }
    });

    // Only submit if valid
    if (!isValid) {
        return;
    }

    submitForm(formData);
});

// Function to handle form submission (only if the form is valid)
function submitForm(formData) {

    fetch('/api/auth/restaurant/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // Specify the content type as JSON
        },
        body: JSON.stringify(formData),  // Send the form data as a JSON object
    })
    .then(response => {
        // Handle different response status codes from the server
        switch (response.status) {
            case 201:  // Created
                alert('Registrierung erfolgreich! Ihr Account wurde erstellt.');  // Success message
                window.location.href = '/restaurant/login';  // Redirect to login page
                break;
            case 400:  // Bad Request (invalid input)
                alert('Fehler: Ungültige Eingaben. Bitte überprüfen Sie Ihre Daten.');
                return response.json().then(data => console.log(data));  // Log server response for debugging
            case 409:  // Conflict (e.g., email already exists)
                alert('Die E-Mail-Adresse ist bereits registriert.');
                return response.json().then(data => console.log(data));  // Log server response for debugging
            case 500:  // Internal Server Error
                alert('Serverfehler: Bitte versuchen Sie es später erneut.');
                return response.json().then(data => console.log(data));  // Log server response for debugging
            default:  // Any other unknown error
                alert(`Unbekannter Fehler: ${response.status}`);
                throw new Error(`Unexpected status code: ${response.status}`);
        }
    })
    .then(data => console.log(data))  // Log the response data for further debugging
    .catch(error => {
        console.error('Error:', error.message);  // Log the error message for debugging
        alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');  // Show a generic error message
    });
    
}

// Function to handle image preview (triggered when user selects an image)
function previewImage(event) {
    if (event.target.files[0]) {
        if (event.target.files[0].size > 1048576) {  // 1 MB = 1048576 bytes
            alert('Die Bildgröße darf 1 MB nicht überschreiten.');  // Alert the user if the image is too large
            return;  // Stop further execution if the image is too large
        }
        const reader = new FileReader();  // Create a new FileReader instance
        reader.onload = function() {
            // Display the preview image in the 'imagePreview' element
            document.getElementById('imagePreview').innerHTML = 
                '<img src="' + reader.result + '" class="photo" alt="Image Preview">';  // Set the image source to the Base64 data
                importedImage = reader.result;
        };
        reader.readAsDataURL(event.target.files[0]);  // Read the selected file as Data URL (Base64)
    }
    else {
        document.getElementById('imagePreview').innerHTML = '';  // Clear the image preview if no file is selected
        importedImage = null;
    }
}

function addOpeningHour() {
    document.getElementById('openingHoursError').textContent = '';

    const container = document.getElementById('openingHoursContainer');
    const row = document.createElement('div');
    row.classList.add('row', 'mb-2');
  
    const dayWrapper = document.createElement('div');
    dayWrapper.classList.add('col');
    const daySelect = document.createElement('select');
    daySelect.classList.add('form-control');
    const days = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
    days.forEach(day => {
      const option = document.createElement('option');
      option.value = day.toLowerCase();
      option.textContent = day;
      daySelect.appendChild(option);
    });
    dayWrapper.appendChild(daySelect);
  
    const openWrapper = document.createElement('div');
    openWrapper.classList.add('col');
    const openInput = document.createElement('input');
    openInput.type = 'time';
    openInput.classList.add('form-control');
    openWrapper.appendChild(openInput);
  
    const closeWrapper = document.createElement('div');
    closeWrapper.classList.add('col');
    const closeInput = document.createElement('input');
    closeInput.type = 'time';
    closeInput.classList.add('form-control');
    closeWrapper.appendChild(closeInput);
  
    row.appendChild(dayWrapper);
    row.appendChild(openWrapper);
    row.appendChild(closeWrapper);
    container.appendChild(row);
  }