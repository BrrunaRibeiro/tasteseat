document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

    // Function to handle selection of a time slot  
    // This is necessary to ensure that the user can select a valid time for booking.
    function selectTime(element, available) {
        if (available) {
            // Set the selected booking time  
            document.getElementById('booking_start_time').value = element.getAttribute('data-time');

            // Show the booking form  
            document.getElementById('booking-form').style.display = 'block';
        } else {
            alert('This time is not available. Please select another.'); // Inform the user
        }
    }

    // Attach click listeners to the container of buttons
    document.querySelectorAll('.delete-booking-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action
            showModal(button); // Show modal with this button's details
        });
    });

    // Function to show confirmation modal for booking deletion
    // This is necessary to confirm the user's intent before performing a destructive action.
    function showModal(button) {
        const restaurantName = button.getAttribute('data-restaurant-name');
        const bookingTime = button.getAttribute('data-booking-time');

        // Update modal message
        modalMessage.textContent = `Are you sure you want to delete the booking for ${restaurantName} on ${bookingTime}?`;

        // Show the modal to confirm the booking deletion
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }

    if (currentPath.startsWith('/restaurant/') && !isNaN(currentPath.split('/')[2])) {
        // Function to capture the user's timezone offset
        // This is essential for correctly managing booking times across different time zones.
        function captureTimezoneOffset() {
            const timezoneOffset = new Date().getTimezoneOffset(); // in minutes  
            const timezoneOffsetInput = document.getElementById('timezone-offset'); // Fix the ID here  
            if (timezoneOffsetInput) {
                timezoneOffsetInput.value = timezoneOffset;
            }
        }

        captureTimezoneOffset();

        // Function to set the default date in the date picker
        // This ensures that users have a sensible starting point when selecting a date.
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

        // Function to update availability based on the selected date
        // This is crucial for ensuring that the user can only book available slots.
        function updateAvailability() {
            const selectedDate = document.getElementById('date-picker').value;
            if (selectedDate) {
                window.location.href = window.location.pathname + `?guests=${guestCount}&date=${selectedDate}`;
            } else {
                alert("No date selected."); // Inform the user
            }
        }

        // Event listener for date change  
        document.getElementById('date-picker').addEventListener('change', updateAvailability);

        const guestButtons = document.querySelectorAll('#guest-selection button');
        guestButtons.forEach(button => {
            // Attach event listeners to update the guest count when a button is clicked
            button.addEventListener('click', function () {
                selectGuest(this);
            });
        });

        // Access the hidden div to get available times data  
        const availableTimesData = document.getElementById("available-times-data");
        if (availableTimesData) {
            const availableTimes = JSON.parse(availableTimesData.textContent);
            initializeTimeSlots(availableTimes); // Initialize time slots based on available data
        } else {
            alert("No available Tables for this Restaurant."); // Inform the user
        }
    }

    if (currentPath.includes('/restaurant_list')) {
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.createElement('div'); // A container for showing results  
        resultsContainer.classList.add('search-results');
        document.querySelector('.search-bar').appendChild(resultsContainer); // Add to search bar  

        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim(); // Use trim to remove whitespace

            if (query.length >= 2) { // To start searching after 2 characters  
                const encodedQuery = encodeURIComponent(query);

                fetch(`/search/?q=${encodedQuery}`, {
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            alert("Error fetching data."); // Inform the user
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        resultsContainer.innerHTML = ''; // Clear previous results  
                        if (data.length > 0) {
                            resultsContainer.style.display = 'block'; // Show results container  
                            data.forEach(restaurant => {
                                const resultItem = document.createElement('div');
                                resultItem.classList.add('search-result-item');
                                resultItem.textContent = restaurant.name;
                                resultItem.dataset.id = restaurant.id; // Store restaurant ID for further actions  
                                resultItem.addEventListener('click', function () {
                                    window.location.href = `/restaurant/${restaurant.id}/`; // Redirect to restaurant detail page  
                                });
                                resultsContainer.appendChild(resultItem);
                            });
                        } else {
                            resultsContainer.style.display = 'none'; // Hide if no results  
                        }
                    })
                    .catch(error => {
                        alert("Error fetching data."); // Inform the user
                    });
            } else {
                resultsContainer.innerHTML = ''; // Clear results if less than 2 characters  
                resultsContainer.style.display = 'none'; // Hide results container  
            }
        });
    }

    // Get the CSRF token 
    const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Initialize guestCount based on the default selected button
    let guestCount; // Declare the variable without initializing it

    // This function will run to initialize the guest count
    // It ensures that the application starts with a valid guest count based on user selection.
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

    // Function to initialize time slots with available times  
    // This is necessary for displaying the available booking times to the user.
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
                timeSlot.onclick = function () {
                    selectTime(this, true); // Allow selection of available time slots
                };
            } else {
                timeSlot.style.cursor = 'not-allowed';
                timeSlot.onclick = function (event) {
                    event.stopPropagation(); // Prevent interaction with unavailable slots
                    return false;
                };
            }

            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    // Function to handle guest selection
    // This updates the selected guest count and ensures the UI reflects the current selection.
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

        // Call the function to update availability
        updateAvailability();
    }

    // Function to show confirmation modal for booking deletion
    // This is necessary to confirm the user's intent before performing a destructive action.
    function showModal(button) {
        const restaurantName = button.getAttribute('data-restaurant-name');
        const bookingTime = button.getAttribute('data-booking-time');

        // Update modal message
        modalMessage.textContent = `Are you sure you want to delete the booking for ${restaurantName} on ${bookingTime}?`;

        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById('delete-modal'));
        modal.show();
    }

    if (document.body.classList.contains('my_bookings')) {
        const deleteButtons = document.querySelectorAll('.delete-booking-button');
        const modalMessage = document.getElementById('modal-message');
        const confirmButton = document.getElementById('confirm-delete');
        const cancelButton = document.getElementById('cancel-delete');
        let bookingToDeleteUrl; // Store the URL for deletion


        confirmButton.addEventListener('click', function () {
            if (bookingToDeleteUrl) {
                const formData = new FormData(); // Create a new FormData object
                formData.append('csrfmiddlewaretoken', csrftoken); // Append CSRF token

                // Send the fetch request to cancel the booking
                fetch(bookingToDeleteUrl, {
                    method: 'POST',
                    body: formData
                })
                    .then(response => {
                        if (!response.ok) {
                            alert("Error deleting booking."); // Inform the user
                            return response.text().then(text => {
                                throw new Error('Network response was not ok');
                            });
                        }
                        return response.json(); // Parse the JSON response
                    })
                    .then(data => {
                        alert("Deletion successful."); // Inform the user
                        const modal = bootstrap.Modal.getInstance(document.getElementById('delete-modal'));
                        modal.hide(); // Hide the modal
                        document.getElementById('alert-deleted').style.display = 'block'; // Show success alert
                        location.reload(); // Refresh the page
                    })
                    .catch(error => {
                        alert("There was a problem with the deletion."); // Inform the user
                    });
            }
        });

        cancelButton.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action
            const modal = bootstrap.Modal.getInstance(document.getElementById('delete-modal'));
            modal.hide(); // Hide the modal
        });
    }
});