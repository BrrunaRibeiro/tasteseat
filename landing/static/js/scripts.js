document.addEventListener("DOMContentLoaded", function() {
    function captureTimezoneOffset() {
        const timezoneOffset = new Date().getTimezoneOffset(); // in minutes
        document.getElementById('timezone_offset').value = timezoneOffset;
    }

    captureTimezoneOffset();
    // Access the hidden div to get available times data
    const availableTimesData = document.getElementById("available-times-data");
    if (availableTimesData) {
        const availableTimes = JSON.parse(availableTimesData.textContent);
        initializeTimeSlots(availableTimes);
    } else {
        console.error("No available Tables for this Restaurant.");
    }
});


// Function to update availability based on the selected date and guest count
// function updateAvailability() {
//     let selectedDate = document.getElementById('date-picker').value;
//     window.location.href = window.location.pathname + `?guests=${guestCount}&date=${selectedDate}`;
// }

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
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-primary');
    });

    // Update the guestCount variable
    guestCount = button.value; // Set the selected guest count
    
    // Mark the selected button
    button.classList.remove('btn-primary');
    button.classList.add('btn-secondary');

    // Log the selected value
    console.log("Number of guests selected: " + guestCount);
    
    // Call the function to update availability
    updateAvailability();
}