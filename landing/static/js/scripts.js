document.addEventListener("DOMContentLoaded", function () {

    // Password validation for the registration form
    const currentPath = window.location.pathname;

    // Password validation for the registration form
    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) {
        const password1 = document.getElementById("id_password1");
        const password2 = document.getElementById("id_password2");
        const emailField = document.getElementById("id_email");
        const registerButton = registrationForm.querySelector('button[type="submit"]');

        // Initially disable the register button
        if (registerButton) {
            registerButton.disabled = true;
            registerButton.classList.add("disabled");
        }

        // Create error message containers if not present
        function ensureErrorContainer(field) {
            let errorContainer = field.nextElementSibling;
            if (!errorContainer || !errorContainer.classList.contains("errorlist")) {
                errorContainer = document.createElement("div");
                errorContainer.classList.add("errorlist");
                field.after(errorContainer);
            }
            return errorContainer;
        }

        // Real-time email validation via AJAX
        if (emailField) {
            emailField.addEventListener("blur", function () {
                const email = emailField.value.trim();
                const errorContainer = ensureErrorContainer(emailField);

                if (email) {
                    fetch('/check_email/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                        },
                        body: JSON.stringify({ email: email })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.exists) {
                            errorContainer.textContent = "This email is already registered.";
                            emailField.style.borderColor = "red";
                        } else {
                            errorContainer.textContent = "";
                            emailField.style.borderColor = "green";
                        }
                        validateForm(); // Re-check form validity
                    })
                    .catch(error => {
                        errorContainer.textContent = "Error checking email. Please try again.";
                        emailField.style.borderColor = "red";
                    });
                } else {
                    errorContainer.textContent = "Email cannot be empty.";
                    emailField.style.borderColor = "red";
                    validateForm(); // Re-check form validity
                }
            });
        }

        // Password matching validation
        if (password2 && password1) {
            const passwordErrorContainer = ensureErrorContainer(password2);
            password2.addEventListener("input", function () {
                if (password1.value !== password2.value) {
                    passwordErrorContainer.innerHTML = "<li>Passwords must match.</li>";
                } else {
                    passwordErrorContainer.innerHTML = "";
                }
                validateForm(); // Re-check form validity
            });
        }

        // General validation for all fields
        const fields = registrationForm.querySelectorAll("input");
        fields.forEach((field) => {
            const errorContainer = ensureErrorContainer(field);

            // Validate field on blur
            if (field) {
                field.addEventListener("blur", function () {
                    if (!field.checkValidity()) {
                        errorContainer.textContent = field.validationMessage;
                    } else {
                        errorContainer.textContent = "";
                    }
                    validateForm(); // Re-check form validity
                });

                // Revalidate form on input for dynamic fields
                field.addEventListener("input", validateForm);
            }
        });

        // Validate the form and toggle the register button
        function validateForm() {
            let isValid = true;

            fields.forEach((field) => {
                const errorContainer = ensureErrorContainer(field);

                if (!field.checkValidity()) {
                    errorContainer.textContent = field.validationMessage;
                    isValid = false;
                } else if (field === emailField && emailField.style.borderColor === "red") {
                    // Special case for email if validation is ongoing
                    isValid = false;
                }
            });

            // Enable or disable the register button based on form validity
            if (registerButton) {
                registerButton.disabled = !isValid;
                if (isValid) {
                    registerButton.classList.remove("disabled");
                } else {
                    registerButton.classList.add("disabled");
                }
            }
        }

        // Prevent multiple submissions
        if (registrationForm) {
            registrationForm.addEventListener("submit", function (e) {
                const isValid = !registerButton.disabled;
                if (!isValid) {
                    e.preventDefault(); // Stop submission if form is invalid
                } else {
                    // Disable the button to prevent multiple submissions
                    registerButton.disabled = true;
                }
            });
        }
    }

    // Function to handle selection of a time slot  
    // This is necessary to ensure that the user can select a valid time for booking.
    function selectTime(element, available) {
        if (available) {
            // Set the selected booking time  
            const bookingStartTime = document.getElementById('booking_start_time');
            if (bookingStartTime && element) {
                bookingStartTime.value = element.getAttribute('data-time');
            }

            // Highlight the selected time slot (make it green)
            const timeSlots = document.querySelectorAll('.time-slot');
            element.classList.remove('btn-primary'); // Remove blue background from selected
            element.classList.add('btn-success'); // Apply green background to selected time slot
            // Show the booking form  
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.style.display = 'block';
                bookingForm.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            alert('This time is not available. Please select another time.'); // Inform the user
        }
    }

    // Function to ensure that only valid times can be selected and submitted
    function validateSelectedTime() {
        const selectedTime = document.getElementById('booking_start_time').value;
        const availableTimesData = document.getElementById('available-times-data');
        const availableTimes = JSON.parse(availableTimesData.textContent);

        if (!availableTimes[selectedTime]) {
            alert("The selected time is no longer available. Please choose another time.");
            return false;
        }

        return true;
    }

    // Prevent form submission if an invalid time is selected
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (event) {
            if (!validateSelectedTime()) {
                event.preventDefault(); // Stop form submission if time is not valid
            }
        });
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
        function captureTimezoneOffset() {
            const timezoneOffset = new Date().getTimezoneOffset(); // in minutes  
            const timezoneOffsetInput = document.getElementById('timezone-offset');  
            if (timezoneOffsetInput) {
                timezoneOffsetInput.value = timezoneOffset;
            }
        }

        captureTimezoneOffset();

        // Function to set the default date in the date picker
        function setDefaultDate() {
            const datePicker = document.getElementById('date-picker');

            // If the value is empty or undefined, set it to today's date
            if (datePicker && !datePicker.value) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                datePicker.value = `${year}-${month}-${day}`; 
            }
        }

        setDefaultDate();

        function fetchAvailableTimes(date, guests) {
            // Fetch available times for the selected date and guests from the backend
            const availableTimesData = document.getElementById("available-times-data");
            if (availableTimesData) {
                const availableTimes = JSON.parse(availableTimesData.textContent);
                initializeTimeSlots(availableTimes); // Initialize time slots with the available times
            } else {
                alert("No available Tables for this Restaurant.");
            }
        }

        // Function to update availability based on the selected date
        function updateAvailability() {
            const selectedDate = document.getElementById('date-picker').value;
            if (selectedDate) {
                const newUrl = window.location.pathname + `?guests=${guestCount}&date=${selectedDate}`;
                history.pushState({ path: newUrl }, '', newUrl);
                // Dynamically update the time slots or other UI components based on guestCount and selectedDate
                fetchAvailableTimes(selectedDate, guestCount);
            } else {
                alert("No date selected.");
            }
        }

        // Event listener for date change  
        const datePicker = document.getElementById('date-picker');
        if (datePicker) {
            datePicker.addEventListener('change', updateAvailability);
        }

        const guestButtons = document.querySelectorAll('#guest-selection button');
        guestButtons.forEach(button => {
            button.addEventListener('click', function () {
                selectGuest(this);
            });
        });

        const availableTimesData = document.getElementById("available-times-data");
        if (availableTimesData) {
            const availableTimes = JSON.parse(availableTimesData.textContent);
            initializeTimeSlots(availableTimes); 
        } else {
            alert("No available Tables for this Restaurant.");
        }
    }

    const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const resultsContainer = document.createElement('div');  
        resultsContainer.classList.add('search-results');
        document.querySelector('.search-bar').appendChild(resultsContainer); 

        searchInput.addEventListener('input', function () {
            const query = searchInput.value.trim(); 
            if (query.length >= 2) {
                const encodedQuery = encodeURIComponent(query);
                fetch(`/search/?q=${encodedQuery}`, {
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            alert("Error fetching data.");
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        resultsContainer.innerHTML = ''; 
                        if (data.length > 0) {
                            resultsContainer.style.display = 'block'; 
                            data.forEach(restaurant => {
                                const resultItem = document.createElement('div');
                                resultItem.classList.add('search-result-item');
                                resultItem.textContent = restaurant.name;
                                resultItem.dataset.id = restaurant.id;  
                                resultItem.addEventListener('click', function () {
                                    window.location.href = `/restaurant/${restaurant.id}/`;  
                                });
                                resultsContainer.appendChild(resultItem);
                            });
                        } else {
                            resultsContainer.style.display = 'block'; 
                            resultsContainer.innerHTML = '<div>No restaurants found</div>';
                        }
                    })
                    .catch(error => {
                        alert("Error fetching data.");
                    });
            } else {
                resultsContainer.innerHTML = ''; 
                resultsContainer.style.display = 'none'; 
            }
        });
    }

    let guestCount;

    function initializeGuestCount() {
        const guestButtons = document.querySelectorAll('#guest-selection button');
        guestButtons.forEach(button => {
            if (button.classList.contains('btn-secondary')) {
                guestCount = button.value;
            }
        });

        if (!guestCount) {
            guestCount = 2;
        }
    }

    initializeGuestCount();

    function initializeTimeSlots(availableTimes) {
        const timeSlotsContainer = document.getElementById('time-slots');
        timeSlotsContainer.innerHTML = '';

        for (const [time, available] of Object.entries(availableTimes)) {
            const timeSlot = document.createElement('span');
            timeSlot.className = 'time-slot ' + (available ? 'btn btn-primary' : 'btn btn-secondary disabled');
            timeSlot.textContent = time;

            if (available) {
                timeSlot.setAttribute('data-time', time);
                timeSlot.onclick = function () {
                    selectTime(this, true); 
                };
            } else {
                timeSlot.style.cursor = 'not-allowed';
                timeSlot.onclick = function (event) {
                    event.stopPropagation(); 
                    return false;
                };
            }

            timeSlotsContainer.appendChild(timeSlot);
        }
    }

    function selectGuest(button) {
        const buttons = document.querySelectorAll('#guest-selection button');
        buttons.forEach(btn => {
            btn.classList.remove('btn-success'); 
            btn.classList.add('btn-primary');
        });

        guestCount = button.value; 

        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        // Dynamically update the value of the hidden "guests" input field
        const guestCountInput = document.querySelector('input[name="guests"]');
        if (guestCountInput) {
            guestCountInput.value = guestCount; // Set the correct guest count
        }

        updateAvailability();
    }

    let isListenerAttached = false;

    function showModal(button) {
        const restaurantName = button.getAttribute('data-restaurant-name');
        const bookingTime = button.getAttribute('data-booking-time');
        const modalMessage = document.getElementById('modal-message');
        const confirmButton = document.getElementById('confirm-delete');
        const cancelButton = document.getElementById('cancel-delete');
        const bookingToDeleteUrl = button.getAttribute('data-delete-url');
        const modalElement = document.getElementById('delete-modal');
        const outsideContent = document.querySelectorAll('body > *:not(#delete-modal)');
        document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });

        modalMessage.textContent = `Are you sure you want to delete the booking for ${restaurantName} on ${bookingTime}?`;

        if (!isListenerAttached) {
            confirmButton.addEventListener('click', async function handleDelete(event) {
                if (bookingToDeleteUrl) {
                    confirmButton.disabled = true;
        
                    try {
                        const response = await fetch(bookingToDeleteUrl, {
                            method: 'POST',
                            headers: {
                                'X-CSRFToken': csrftoken,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                booking_id: button.getAttribute('data-booking-id')
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            alert(data.message || "Booking cancelled successfully.");
                            const modal = bootstrap.Modal.getInstance(modalElement);
                            modal.hide();
                            location.reload();
                        } else {
                            const errorData = await response.json();
                            alert(errorData.error || "Error deleting booking.");
                        }
                    } catch (error) {
                        alert("An unexpected error occurred. Please try again.");
                    } finally {
                        confirmButton.disabled = false;
                        confirmButton.removeEventListener('click', handleDelete);
                        isListenerAttached = false;
                    }
                }
            });

            cancelButton.addEventListener('click', function (event) {
                event.preventDefault();
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
            });

            isListenerAttached = true;
        }

        outsideContent.forEach(el => el.setAttribute('inert', 'true'));
        modalElement.removeAttribute('inert'); 

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        modalElement.addEventListener('hidden.bs.modal', () => {
            outsideContent.forEach(el => el.removeAttribute('inert'));
            modalElement.setAttribute('inert', 'true');
        });
    }
});
