document.addEventListener("DOMContentLoaded", function() {  
    if (document.body.classList.contains('restaurant-details')) {  
        function captureTimezoneOffset() {  
            const timezoneOffset = new Date().getTimezoneOffset(); // in minutes  
            const timezoneOffsetInput = document.getElementById('timezone-offset'); // Fix the ID here  
            if (timezoneOffsetInput) {  
                timezoneOffsetInput.value = timezoneOffset;  
            }  
        }  

        captureTimezoneOffset(); // Call it here  
    }  

    // Access the hidden div to get available times data  
    const availableTimesData = document.getElementById("available-times-data");  
    if (availableTimesData) {  
        const availableTimes = JSON.parse(availableTimesData.textContent);  
        initializeTimeSlots(availableTimes);  
    } else {  
        console.error("No available Tables for this Restaurant.");  
    }  

    if (document.body.classList.contains('restaurant-details')) {
        // Get CSRF token  
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;  
        const searchInput = document.querySelector('.search-bar input[type="search"]');  
        const resultsContainer = document.createElement('div'); // A container for showing results  
        resultsContainer.classList.add('search-results');  
        document.querySelector('.search-bar').appendChild(resultsContainer); // Add to search bar  

        searchInput.addEventListener('input', function() {  
            const query = searchInput.value;  

            if (query.length >= 2) { // Start searching after 2 characters  
                const encodedQuery = encodeURIComponent(query);  
                console.log(`Searching for: ${encodedQuery}`); // Logging search query  

                fetch(`/search/?q=${encodedQuery}`, {  
                    headers: {  
                        'X-CSRFToken': csrftoken,  
                        'X-Requested-With': 'XMLHttpRequest'  
                    }  
                })  
                .then(response => {  
                    console.log(`Response status: ${response.status}`); // Log response status  
                    return response.json();  
                })  
                .then(data => {  
                    console.log('Search results:', data); // Log response data  
                    resultsContainer.innerHTML = ''; // Clear previous results  
                    if (data.length > 0) {  
                        resultsContainer.style.display = 'block'; // Show results container  
                        data.forEach(restaurant => {  
                            const resultItem = document.createElement('div');  
                            resultItem.classList.add('search-result-item');  
                            resultItem.textContent = restaurant.name;  
                            resultItem.dataset.id = restaurant.id; // Store restaurant ID for further actions  
                            resultItem.addEventListener('click', function() {  
                                window.location.href = `/restaurant/${restaurant.id}/`; // Redirect to restaurant detail page  
                            });  
                            resultsContainer.appendChild(resultItem);  
                        });  
                    } else {  
                        resultsContainer.style.display = 'none'; // Hide if no results  
                    }  
                })  
                .catch(error => console.error('Error fetching data:', error));  
            } else {  
                resultsContainer.innerHTML = ''; // Clear results if less than 2 characters  
                resultsContainer.style.display = 'none'; // Hide results container  
            }  
        });  
    }
});  


// Initialize guestCount based on the default selected button
let guestCount; // Declare the variable without initializing it

// This function will run to initialize the guest count
function initializeGuestCount() {
    const guestButtons = document.querySelectorAll('#guest-selection button');
    guestButtons.forEach(button => {
        if (button.classList.contains('btn-secondary')) { // Check for the active button
            guestCount = button.value; // Set guestCount to the value of this button
        }
    });

    // If no button is found with 'btn-secondary', fall back to 2 as default.
    if (!guestCount) {
        guestCount = 2; // Fallback default
    }
}

initializeGuestCount();

function setDefaultDate() {
    const datePicker = document.getElementById('date-picker');
    
    // If the value is empty or undefined, set it to today's date
    if (!datePicker.value) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(today.getDate()).padStart(2, '0');
        datePicker.value = `${year}-${month}-${day}`; // Set the value in YYYY-MM-DD format
    }
}

setDefaultDate(); 

// Function to initialize time slots with available times  
function initializeTimeSlots(availableTimes) {  
    const timeSlotsContainer = document.getElementById('time-slots');  

    // Clear the container first  
    timeSlotsContainer.innerHTML = '';  

    // Populate the time slots  
    for (const [time, available] of Object.entries(availableTimes)) {  
        const timeSlot = document.createElement('span');  
        timeSlot.className = 'time-slot ' + (available ? 'btn btn-primary' : 'btn btn-secondary disabled');  
        timeSlot.textContent = time;  

        if (available) {  
            timeSlot.setAttribute('data-time', time);  
            timeSlot.onclick = function() {  
                selectTime(this, true);  
            };  
        } else {  
            timeSlot.style.cursor = 'not-allowed';  
            timeSlot.onclick = function(event) {  
                event.stopPropagation();  
                return false;  
            };  
        }  

        timeSlotsContainer.appendChild(timeSlot);  
    }  
}  

// Function to handle selection of a time slot  
function selectTime(element, available) {  
    if (available) {  
        // Set the selected booking time  
        document.getElementById('booking_start_time').value = element.getAttribute('data-time');  
        
        // Show the booking form  
        document.getElementById('booking-form').style.display = 'block';  
    } else {  
        alert('This time is not available. Please select another.');  
    }  
}  

// Function to handle guest selection
function selectGuest(button) {
    // Deselect all buttons
    const buttons = document.querySelectorAll('#guest-selection button');
    buttons.forEach(btn => {
        btn.classList.remove('btn-secondary');  // Unselect previous buttons
        btn.classList.add('btn-primary');
    });

    // Update the guestCount variable from the clicked button
    guestCount = button.value; // Set the selected guest count

    // Mark the selected button
    button.classList.remove('btn-primary');
    button.classList.add('btn-secondary');

    // Log the selected value
    console.log("Number of guests selected: " + guestCount);

    // Call the function to update availability
    updateAvailability();
}

function updateAvailability() {
    const selectedDate = document.getElementById('date-picker').value;  // Get selected date
    if (selectedDate) {
        console.log("Selected Date: " + selectedDate);  // Log the selected date for debugging
        window.location.href = window.location.pathname + `?guests=${guestCount}&date=${selectedDate}`;  // Redirect to URL
    } else {
        console.error("No date selected.");
    }
}