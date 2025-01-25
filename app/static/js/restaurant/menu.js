let currentEditingItem = null;
let uploadedImage = null;

function previewImage(event, previewId) {
  const input = event.target;
  const preview = document.getElementById(previewId);

  if (input.files && input.files[0]) {
    const file = input.files[0];
    if (file.size > 1048576) { // 1MB = 1048576 bytes
      alert('The file size exceeds 1MB. Please choose a smaller file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = 'block';
      uploadedImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function showEditOverlay(item) {
  currentEditingItem = item;

  document.getElementById('editName').value = item.name;
  document.getElementById('editDescription').value = item.description;
  document.getElementById('editPrice').value = item.price;

  const editPreview = document.getElementById('editImagePreview');
  editPreview.src = item.image;
  importedImage = item.image;
  editPreview.style.display = 'block';

  document.getElementById('editOverlay').style.display = 'flex';
}

function showAddOverlay() {
  uploadedImage = null;
  document.getElementById('addName').value = '';
  document.getElementById('addDescription').value = '';
  document.getElementById('addPrice').value = '';
  document.getElementById('addImagePreview').style.display = 'none';

  document.getElementById('addOverlay').style.display = 'flex';
}

function closeOverlay(overlayId) {
  document.getElementById(overlayId).style.display = 'none';
}

async function fetchMenu() {
  try {
    const response = await fetch('/api/restaurant/items');
    if (response.status === 200) {
      const menuItems = await response.json();
      renderMenu(menuItems);
    } else if (response.status === 404) {
      const error = await response.json();
      console.log(`Error ${response.status}: ${error.message}`);
      clearMenu();
    } else {
      console.log(`Error ${response.status}: Unexpected error occurred.`);
    }
  } catch (error) {
    alert('An error occurred while fetching the menu.');
  }
}

function renderMenu(menuItems) {
  const container = document.getElementById('foodItemsContainer');
  container.innerHTML = '';
  menuItems.forEach(item => {
    const foodItemHTML = `
      <div class="food-item">
        <div class="food-header">
          <h2>${item.name} - €${item.price.toFixed(2)}</h2>
          <img src="{{ url_for('static', filename='images/pen1.png') }}" alt="Edit" class="edit-icon" style="width: 20px; height: 20px;" onclick='showEditOverlay(${JSON.stringify(item)})'>
        </div>
        <div class="food-details">
          <div class="food-description">
            <strong>${item.name}</strong>
            <p>${item.description}</p>
          </div>
          <img src="${item.image}" alt="Food Photo" class="food-photo">
        </div>
      </div>`;
    container.insertAdjacentHTML('beforeend', foodItemHTML);
  });
}

function clearMenu() {
  const container = document.getElementById('foodItemsContainer');
  container.innerHTML = '<p class="text-center">Keine Items verfügbar.</p>';
}

async function saveEditItem() {
  if (!currentEditingItem) return;

  const updatedItem = {
    name: document.getElementById('editName').value,
    description: document.getElementById('editDescription').value,
    price: parseFloat(document.getElementById('editPrice').value),
    image: uploadedImage,
  };

  sendUpdatedItem(updatedItem);
  
}

function sendUpdatedItem(updatedItem) {
  fetch(`/api/restaurant/item/${currentEditingItem.item_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedItem),
  })
    .then(response => {
      if (response.status === 200) {
        closeOverlay('editOverlay');
        fetchMenu();
      } else {
        response.json().then(error => {
          console.log(`Error ${response.status}: ${error.message}`);
        });
      }
    })
    .catch(error => {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
}

async function deleteItem() {
  if (!currentEditingItem) return;

  const confirmDeletion = confirm('Sind Sie sicher, dass Sie dieses Item löschen möchten?');
  if (!confirmDeletion) return;

  try {
    const response = await fetch(`/api/restaurant/item/${currentEditingItem.item_id}`, {
      method: 'DELETE',
    });

    if (response.status === 200) {
      const result = await response.json();
      closeOverlay('editOverlay');
      fetchMenu(); // Refresh the menu
    } else if (response.status === 404) {
      const error = await response.json();
      console.log(`Error ${response.status}: ${error.message}`);
    } else {
      console.log(`Error ${response.status}: Unexpected error occurred.`);
    }
  } catch (error) {
    alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
  }
}

async function addNewItem() {
  const newItem = {
    name: document.getElementById('addName').value,
    description: document.getElementById('addDescription').value,
    price: parseFloat(document.getElementById('addPrice').value),
    image: uploadedImage,
  };

  sendNewItem(newItem);
}

function sendNewItem(newItem) {
  fetch('/api/restaurant/add_item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  })
    .then(response => {
      if (response.status === 201) {
        closeOverlay('addOverlay');
        fetchMenu();
      } else {
        response.json().then(error => {
          console.log(`Error ${response.status}: ${error.message}`);
        });
      }
    })
    .catch(error => {
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchMenu();
});