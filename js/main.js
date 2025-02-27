import { initializeContactForm } from './contact-form.js';
import { initializeMultiStepForm } from './booking-form.js';
import { initializeModalHandlers } from './modal-handler.js';
// Import welcome message but don't initialize it here
import './welcome-message.js';

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact form
    initializeContactForm();

    // Initialize booking form if it exists
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        initializeMultiStepForm();
    }

    // Initialize modal handlers
    initializeModalHandlers();

    // Note: Welcome message is self-initializing only on index page

    // Initialize date picker with min date
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});