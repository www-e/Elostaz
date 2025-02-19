import { initializeContactForm } from './contact-form.js';
import { initializeMultiStepForm } from './booking-form.js';
import { initializeModalHandlers } from './modal-handler.js';

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

    // Initialize date picker with min date
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});