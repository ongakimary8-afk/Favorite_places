// Create a Place constructor
function Place(name, location, landmarks, time, notes) {
    this.name = name;
    this.location = location;
    this.landmarks = landmarks;
    this.time = time;
    this.notes = notes;
}

// Get details of a place
Place.prototype.getDetails = function() {
    return this;
};

// Create a collection of visited places
function PlacesBeen() {
    this.places = [];
}

// Add a place
PlacesBeen.prototype.addPlace = function(place) {
    this.places.push(place);
};

// Find a place
PlacesBeen.prototype.findPlace = function(name) {
    return this.places.find(function(place) {
        return place.name.toLowerCase() === name.toLowerCase();
    });
};

// Remove a place
PlacesBeen.prototype.removePlace = function(name) {
    this.places = this.places.filter(function(place) {
        return place.name !== name;
    });
};

// Create the places collection
const myPlaces = new PlacesBeen();

// Load saved places from Local Storage
const savedPlaces = JSON.parse(localStorage.getItem("places")) || [];

savedPlaces.forEach(function(place) {
    myPlaces.addPlace(new Place(
        place.name,
        place.location,
        place.landmarks,
        place.time,
        place.notes
    ));
});

// Save places to Local Storage
function savePlaces() {
    localStorage.setItem("places", JSON.stringify(myPlaces.places));
}

// Get the form
const form = document.getElementById("placeForm");

// Add a new destination
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const location = document.getElementById("location").value.trim();
    const landmarks = document.getElementById("landmarks").value.trim();
    const time = document.getElementById("time").value.trim();
    const notes = document.getElementById("notes").value.trim();

    // Check for duplicate places
    if (myPlaces.findPlace(name)) {
        alert("This place has already been added!");
        return;
    }

    // Create a new place
    const place = new Place(
        name,
        location,
        landmarks,
        time,
        notes
    );

    // Add place to collection
    myPlaces.addPlace(place);

    // Save places
    savePlaces();

    // Update the list
    viewSavedPlaces();

    // Clear the form
    form.reset();

    alert("Place added successfully!");
});

// View all saved places
function viewSavedPlaces() {

    const list = document.getElementById("placesList");

    list.innerHTML = "";

    if (myPlaces.places.length === 0) {
        list.innerHTML = "<p>No places saved yet.</p>";
        return;
    }

    myPlaces.places.forEach(function(place) {

        const item = document.createElement("li");

        // Create place name
        const name = document.createElement("span");

        name.textContent = place.name;
        name.className = "place-name";

        // Click name to view details
        name.addEventListener("click", function() {
            viewPlaceDetails(place);
        });

        // Create delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            myPlaces.removePlace(place.name);

            savePlaces();

            viewSavedPlaces();

            document.getElementById("details").innerHTML =
                "<p>Select a place to view its details.</p>";
        });

        item.appendChild(name);
        item.appendChild(deleteButton);

        list.appendChild(item);

    });
}

// View details of a selected place
function viewPlaceDetails(place) {

    const details = document.getElementById("details");

    details.innerHTML = `
        <h3>${escapeHTML(place.name)}</h3>

        <p><strong>Location:</strong>
        ${escapeHTML(place.location)}</p>

        <p><strong>Landmarks:</strong>
        ${escapeHTML(place.landmarks || "Not specified")}</p>

        <p><strong>Time of Year:</strong>
        ${escapeHTML(place.time || "Not specified")}</p>

        <p><strong>Personal Notes:</strong>
        ${escapeHTML(place.notes || "No notes added")}</p>
    `;
}

// Safely display user-entered text
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

// Automatically display saved places when the website opens
viewSavedPlaces();