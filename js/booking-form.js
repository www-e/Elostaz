import { validateBookingForm } from './form-validation.js';
import { sendToGoogleSheets } from './google-sheets.js';

// Multi-step Form Handling
export function initializeMultiStepForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return; // Exit if form doesn't exist
    
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = form.querySelectorAll('.progress-step');
    const prevBtn = form.querySelector('.btn-prev');
    const nextBtn = form.querySelector('.btn-next');
    const submitBtn = form.querySelector('.btn-submit');
    let currentStep = 0;

    // Initialize buttons
    updateButtons();

    // Next button click handler
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep === steps.length - 2) {
                    updateSummary();
                }
                currentStep++;
                updateForm();
            }
        });
    }

    // Previous button click handler
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentStep--;
            updateForm();
        });
    }

    // Form submission handler
    form.addEventListener('submit', handleBookingSubmit);

    function updateForm() {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            progressSteps[index].classList.remove('active', 'completed');
        });

        steps[currentStep].classList.add('active');
        progressSteps[currentStep].classList.add('active');

        for (let i = 0; i < currentStep; i++) {
            progressSteps[i].classList.add('completed');
        }

        updateButtons();
    }

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'block';
        submitBtn.style.display = currentStep === steps.length - 1 ? 'block' : 'none';
    }

    function validateStep(step) {
        const currentStepEl = steps[step];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                showError(input);
            } else {
                clearError(input);
            }
        });

        return isValid;
    }

    function showError(input) {
        input.classList.add('is-invalid');
        const formGroup = input.closest('.form-group');
        let errorDiv = formGroup.querySelector('.invalid-feedback');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = 'هذا الحقل مطلوب';
            formGroup.appendChild(errorDiv);
        }
    }

    function clearError(input) {
        input.classList.remove('is-invalid');
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function updateSummary() {
        document.getElementById('summary-name').textContent = document.getElementById('studentName').value;
        document.getElementById('summary-phone').textContent = document.getElementById('studentPhone').value;
        
        const grade = document.getElementById('studentGrade');
        document.getElementById('summary-grade').textContent = grade.options[grade.selectedIndex].text;
        
        const date = new Date(document.getElementById('sessionDate').value);
        const time = document.getElementById('sessionTime');
        const timeText = time.options[time.selectedIndex].text;
        
        document.getElementById('summary-datetime').textContent = `${date.toLocaleDateString('ar-EG')} - ${timeText}`;
    }
}

export async function handleBookingSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        studentName: document.getElementById('studentName').value,
        studentPhone: document.getElementById('studentPhone').value,
        parentPhone: document.getElementById('parentPhone').value,
        country: document.getElementById('country').value,
        studentGrade: document.getElementById('studentGrade').value,
        sessionDate: document.getElementById('sessionDate').value,
        sessionTime: document.getElementById('sessionTime').value,
        notes: document.getElementById('notes').value
    };

    // Validate form data
    if (!validateBookingForm(formData)) {
        return;
    }

    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;

        // Prepare data for Google Sheets
        const sheetData = [
            [
                new Date().toISOString(),
                formData.studentName,
                formData.studentPhone,
                formData.parentPhone,
                formData.country,
                formData.studentGrade,
                formData.sessionDate,
                formData.sessionTime,
                formData.notes
            ]
        ];

        // Send to Google Sheets
        await sendToGoogleSheets(sheetData);

        // Hide booking modal
        const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        bookingModal.hide();

        // Show success modal
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();

        // Reset form
        e.target.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> إرسال الطلب';
        submitBtn.disabled = false;
    }
}
