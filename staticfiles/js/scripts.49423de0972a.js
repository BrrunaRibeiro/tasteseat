document.addEventListener("DOMContentLoaded", function () {
    const currentPath = window.location.pathname;

     // Password validation for the registration form
     const registrationForm = document.getElementById("registration-form");
    if (registrationForm) {
        const password1 = document.getElementById("id_password1");
        const password2 = document.getElementById("id_password2");
        const errorContainer = document.createElement("div");

        errorContainer.classList.add("errorlist");
        password2.after(errorContainer);

        password2.addEventListener("input", function () {
            if (password1.value !== password2.value) {
                errorContainer.innerHTML = "<li>Passwords must match.</li>";
            } else {
                errorContainer.innerHTML = "";
            }
        });

        // Validation logic for displaying errors dynamically
        const fields = registrationForm.querySelectorAll("input");
        fields.forEach((field) => {
            const errorContainer = field.nextElementSibling; // Assumes error container is next to the input field

            // Add blur event listener to validate fields individually
            field.addEventListener("blur", function () {
                if (!field.checkValidity()) {
                    errorContainer?.classList.remove("hidden");
                    errorContainer.textContent = field.validationMessage;
                } else {
                    errorContainer?.classList.add("hidden");
                    errorContainer.textContent = "";
                }
            });
        });

        // Validate all fields on form submission
        registrationForm.addEventListener("submit", function (e) {
            let isValid = true;
            fields.forEach((field) => {
                const errorContainer = field.nextElementSibling;
                if (!field.checkValidity()) {
                    errorContainer?.classList.remove("hidden");
                    errorContainer.textContent = field.validationMessage;
                    isValid = false;
                } else {
                    errorContainer?.classList.add("hidden");
                    errorContainer.textContent = "";
                }
            });

            if (!isValid) {
                e.preventDefault(); // Prevent form submission if validation fails
            }
        });
    }

    // Function to handle selection of a time slot  
    // This is necessary to ensure that the user can select a valid time for booking.
    function selectTime(element, available) {
        if (available) {
            // Set the selected booking time  
            document.getElementById('booking_start_time').value = element.getAttribute('data-time');

            // Show the booking form  
            document.getElementById('booking-form').style.display = 'block';
        } else {
            alert('This time is not available. Please select another time.'); // Inform the user
        }
    }

    // Attach click listeners to the container of buttons
    document.querySelectorAll('.delete-booking-button').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default action
            showModal(button); // Show modal with this button's details
        });
    });


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
        const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        const searchInput = document.getElementById('search-input');
        const resultsContainer = document.createElement('div'); // A container for showing results  
        resultsContainer.classList.add('search-results');
        document.querySelector('.search-bar').appendChild(resultsContainer); // Add to search bar  

        //Conditionally set the placeholder for input field based on media queries
        function updatePlaceholder() {
            if (window.matchMedia('(max-width: 768px)').matches) {
                searchInput.setAttribute('placeholder', 'Search');
            }
        }
        updatePlaceholder();

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
                            // Display "No Restaurants Found"
                            resultsContainer.style.display = 'block'; // Ensure it's visible
                            resultsContainer.innerHTML = '<div>No restaurants found</div>';
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
    let guestCount; 

    // Initialize the guest count
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

    let isListenerAttached = false; // To avoid multiple event listeners

    // Function to show confirmation modal for booking deletion
    function showModal(button) {
        const restaurantName = button.getAttribute('data-restaurant-name');
        const bookingTime = button.getAttribute('data-booking-time');
        const modalMessage = document.getElementById('modal-message');
        const confirmButton = document.getElementById('confirm-delete');
        const cancelButton = document.getElementById('cancel-delete');
        const bookingToDeleteUrl = button.getAttribute('data-delete-url');
        const modalElement = document.getElementById('delete-modal');
        const outsideContent = document.querySelectorAll('body > *:not(#delete-modal)');

        // Update modal message
        modalMessage.textContent = `Are you sure you want to delete the booking for ${restaurantName} on ${bookingTime}?`;

        // Add click listener for "Confirm Delete" button
        if (!isListenerAttached) {
            confirmButton.addEventListener('click', async function handleDelete() {
                if (bookingToDeleteUrl) {
                    confirmButton.disabled = true; // Disable the button to prevent multiple clicks

                    try {
                        // Send the fetch request to cancel the booking
                        const response = await fetch(bookingToDeleteUrl, {
                            method: 'POST',
                            headers: { 'X-CSRFToken': csrftoken },
                        });

                        // Check if the response is successful
                        if (response.ok) {
                            const data = await response.json();
                            alert(data.message || "Deletion successful."); // Show success message

                            // Close the modal and refresh the page
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            modal.hide();
                            location.reload();
                        } else {
                            // Handle server-side errors
                            const errorData = await response.json();
                            alert(errorData.error || "Error deleting booking.");
                        }
                    } catch (error) {
                        // Handle network or unexpected errors
                        alert("An unexpected error occurred. Please try again.");
                    } finally {
                        confirmButton.disabled = false; // Re-enable the button after completion
                        confirmButton.removeEventListener('click', handleDelete); // Clean up event listener
                        isListenerAttached = false; // Reset listener attachment flag
                    }
                }
            });

            // Add click listener for "Cancel" button
            cancelButton.addEventListener('click', function (event) {
                event.preventDefault(); // Prevent default action
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide(); // Hide the modal
            });

            isListenerAttached = true; // Mark listener as attached
        }

        // Manage accessibility: Disable outside content
        outsideContent.forEach(el => el.setAttribute('inert', 'true'));
        modalElement.removeAttribute('inert'); // Enable interaction with the modal

        // Show the modal
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Remove the "inert" attribute when the modal is hidden
        modalElement.addEventListener('hidden.bs.modal', () => {
            outsideContent.forEach(el => el.removeAttribute('inert')); // Re-enable outside content
            modalElement.setAttribute('inert', 'true'); // Disable the modal content
        });
    }
});
