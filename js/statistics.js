import { submitStatisticsRegistration } from './statistics-service.js';
import { StatisticsSuccessModal } from './components/statistics-success-modal.js';
import { DuplicateRegistrationModal } from './components/duplicate-registration-modal.js';
import { validatePhoneNumber } from './form-validation.js';

// --- START: Custom Dropdown Logic ---

// Global dropdown management
let activeDropdown = null;

function getPlaceholderText(selectId) {
    const placeholders = {
        'schoolType': 'اختر نوع الثانوية',
        'attendanceType': 'اختر نوع الحضور'
    };
    return placeholders[selectId] || 'اختر';
}

function closeAllDropdowns() {
    document.querySelectorAll('.custom-dropdown-container.active').forEach(container => {
        container.classList.remove('active');
        const options = container.querySelector('.dropdown-options');
        if (options) options.classList.remove('show');
        const selected = container.querySelector('.selected-option');
        if (selected) selected.setAttribute('aria-expanded', 'false');
    });
    activeDropdown = null;
}

function createCustomDropdown(selectElement) {
    if (!selectElement) return;

    const container = selectElement.parentElement;
    const existingCustom = container.querySelector('.custom-dropdown-container');
    if (existingCustom) existingCustom.remove();

    const customDropdown = document.createElement('div');
    customDropdown.className = 'custom-dropdown-container';

    const selectedOptionDisplay = document.createElement('div');
    selectedOptionDisplay.className = 'selected-option';
    selectedOptionDisplay.textContent = getPlaceholderText(selectElement.id);
    selectedOptionDisplay.setAttribute('tabindex', '0');

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'dropdown-options';

    Array.from(selectElement.options).forEach((option, index) => {
        // This is the fix for the placeholder issue!
        if (index === 0 && !option.value) return; 

        const dropdownOption = document.createElement('div');
        dropdownOption.className = 'dropdown-option';
        dropdownOption.textContent = option.textContent;
        dropdownOption.dataset.value = option.value;
        optionsContainer.appendChild(dropdownOption);

        dropdownOption.addEventListener('click', (e) => {
            e.stopPropagation();
            selectedOptionDisplay.textContent = option.textContent;
            selectElement.value = option.value;
            selectElement.dispatchEvent(new Event('change'));
            closeAllDropdowns();
        });
    });

    customDropdown.append(selectedOptionDisplay, optionsContainer);
    selectElement.style.display = 'none';
    container.appendChild(customDropdown);

    selectedOptionDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        if (optionsContainer.classList.contains('show')) {
            closeAllDropdowns();
        } else {
            closeAllDropdowns();
            optionsContainer.classList.add('show');
            customDropdown.classList.add('active');
            activeDropdown = customDropdown;
        }
    });
}

document.addEventListener('click', () => closeAllDropdowns());

// --- END: Custom Dropdown Logic ---

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const successModal = new StatisticsSuccessModal();
    const duplicateRegistrationModal = new DuplicateRegistrationModal();
    
    // Get form elements
    const nameInput = document.getElementById('studentName');
    const phoneInput = document.getElementById('studentPhone');
    const parentPhoneInput = document.getElementById('parentPhone');
    const schoolTypeSelect = document.getElementById('schoolType');
    const attendanceTypeSelect = document.getElementById('attendanceType');

    // --- FIX: Initialize the custom dropdowns ---
    createCustomDropdown(schoolTypeSelect);
    createCustomDropdown(attendanceTypeSelect);
    // ------------------------------------------

    // Prevent numbers in student name field
    if (nameInput) {
        nameInput.addEventListener('keypress', (e) => {
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        nameInput.addEventListener('paste', (e) => {
            let pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (/[0-9]/.test(pastedText)) {
                e.preventDefault();
            }
        });
    }

    // Phone number validation
    [phoneInput, parentPhoneInput].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                // Remove any non-digit characters
                e.target.value = e.target.value.replace(/\D/g, '');
                
                // Limit to 11 digits
                if (e.target.value.length > 11) {
                    e.target.value = e.target.value.slice(0, 11);
                }
            });
        }
    });

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                return;
            }

            const formData = new FormData(this);
            
            try {
                const result = await submitStatisticsRegistration(formData);
                
                if (!result.success) {
                    if (result.errorCode === 'DUPLICATE_STUDENT' || 
                        result.errorCode === '23505' || 
                        result.error.includes('duplicate key value')) {
                        duplicateRegistrationModal.show(formData.get('student_phone'));
                        return;
                    }
                    throw new Error(result.error);
                }

                // Show success modal with registration data
                successModal.show({
                    studentName: formData.get('student_name'),
                    studentPhone: formData.get('student_phone'),
                    parentPhone: formData.get('parent_phone'),
                    schoolType: getSchoolTypeText(formData.get('school_type')),
                    attendanceType: getAttendanceTypeText(formData.get('attendance_type')),
                    username: result.data.username,
                    password: result.data.password
                });

                form.reset();
                // Reset custom dropdowns to their placeholder text
                document.querySelectorAll('.selected-option').forEach(el => {
                    const selectId = el.parentElement.previousElementSibling.id;
                    el.textContent = getPlaceholderText(selectId);
                });


            } catch (error) {
                console.error('Error submitting form:', error);
                alert(error.message || 'حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
            }
        });
    }
});

function validateForm() {
    const studentName = document.getElementById('studentName').value;
    const studentPhone = document.getElementById('studentPhone').value;
    const parentPhone = document.getElementById('parentPhone').value;
    const schoolType = document.getElementById('schoolType').value;
    const attendanceType = document.getElementById('attendanceType').value;

    // Name validation
    if (studentName.trim().length < 3) {
        alert('يرجى إدخال اسم صحيح');
        return false;
    }

    // Phone number validation
    if (!validatePhoneNumber(studentPhone)) {
        alert('يرجى إدخال رقم هاتف صحيح للطالب');
        return false;
    }

    if (!validatePhoneNumber(parentPhone)) {
        alert('يرجى إدخال رقم هاتف صحيح لولي الأمر');
        return false;
    }

    // School type validation
    if (!schoolType) {
        alert('يرجى اختيار نوع الثانوية');
        return false;
    }

    // Attendance type validation
    if (!attendanceType) {
        alert('يرجى اختيار نوع الحضور');
        return false;
    }

    return true;
}

function getSchoolTypeText(type) {
    const types = {
        'azhar': 'ثانوي أزهري',
        'general_arts': 'ثانوي عام/أدبي'
    };
    return types[type] || type;
}

function getAttendanceTypeText(type) {
    const types = {
        'zoom': 'Zoom',
        'offline': 'حضوري'
    };
    return types[type] || type;
}