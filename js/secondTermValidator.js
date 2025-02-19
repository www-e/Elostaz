// Form validation rules and messages
const validationRules = {
    studentName: {
        required: true,
        minLength: 3,
        pattern: /^[\u0600-\u06FF\s]+$/,  // Arabic characters and spaces only
        messages: {
            required: 'يرجى إدخال اسم الطالب',
            minLength: 'يجب أن يكون الاسم 3 أحرف على الأقل',
            pattern: 'يرجى إدخال الاسم باللغة العربية فقط'
        }
    },
    studentPhone: {
        required: true,
        pattern: /^01[0125][0-9]{8}$/,  // Egyptian phone number format
        messages: {
            required: 'يرجى إدخال رقم الطالب',
            pattern: 'يجب أن يبدأ الرقم بـ 01 ويتكون من 11 رقم'
        }
    },
    parentPhone: {
        required: true,
        pattern: /^01[0125][0-9]{8}$/,  // Egyptian phone number format
        messages: {
            required: 'يرجى إدخال رقم ولي الأمر',
            pattern: 'يجب أن يبدأ الرقم بـ 01 ويتكون من 11 رقم'
        }
    },
    grade: {
        required: true,
        messages: {
            required: 'يرجى اختيار الصف الدراسي'
        }
    },
    section: {
        requiredIf: (form) => ['second', 'third'].includes(form.grade.value),
        messages: {
            required: 'يرجى اختيار الشعبة'
        }
    },
    group: {
        required: true,
        messages: {
            required: 'يرجى اختيار المجموعة'
        }
    },
    time: {
        required: true,
        messages: {
            required: 'يرجى اختيار الموعد'
        }
    }
};

// Validate a single field
function validateField(field, rules) {
    const fieldRules = rules[field.id];
    if (!fieldRules) return true;

    // Clear previous validation messages
    const messageElement = field.parentElement.querySelector('.validation-message');
    if (messageElement) {
        messageElement.textContent = '';
        messageElement.style.display = 'none';
    }

    // Check required
    if (fieldRules.required && !field.value) {
        showError(field, fieldRules.messages.required);
        return false;
    }

    // Check requiredIf condition
    if (fieldRules.requiredIf && fieldRules.requiredIf(field.form) && !field.value) {
        showError(field, fieldRules.messages.required);
        return false;
    }

    // Check minLength
    if (fieldRules.minLength && field.value.length < fieldRules.minLength) {
        showError(field, fieldRules.messages.minLength);
        return false;
    }

    // Check pattern
    if (fieldRules.pattern && !fieldRules.pattern.test(field.value)) {
        showError(field, fieldRules.messages.pattern);
        return false;
    }

    return true;
}

// Show error message for a field
function showError(field, message) {
    const messageElement = field.parentElement.querySelector('.validation-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        field.classList.add('invalid');
    }
}

// Clear error message for a field
function clearError(field) {
    const messageElement = field.parentElement.querySelector('.validation-message');
    if (messageElement) {
        messageElement.style.display = 'none';
        field.classList.remove('invalid');
    }
}

// Validate entire form
function validateForm(form) {
    let isValid = true;
    
    // Validate each field
    for (const fieldName in validationRules) {
        const field = form.elements[fieldName];
        if (field) {
            if (!validateField(field, validationRules)) {
                isValid = false;
            }
        }
    }

    return isValid;
}

// Setup form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    // Prevent numbers in student name field
    const studentNameField = form.elements['studentName'];
    if (studentNameField) {
        studentNameField.addEventListener('keypress', (e) => {
            // Prevent if the key is a number
            if (/[0-9]/.test(e.key)) {
                e.preventDefault();
            }
        });

        studentNameField.addEventListener('paste', (e) => {
            // Get pasted text
            let pastedText = (e.clipboardData || window.clipboardData).getData('text');
            // If it contains numbers, prevent paste
            if (/[0-9]/.test(pastedText)) {
                e.preventDefault();
            }
        });
    }

    // Add real-time validation on input
    for (const fieldName in validationRules) {
        const field = form.elements[fieldName];
        if (field) {
            field.addEventListener('input', () => {
                validateField(field, validationRules);
            });

            field.addEventListener('blur', () => {
                validateField(field, validationRules);
            });
        }
    }

    // Special handling for phone numbers
    const phoneFields = ['studentPhone', 'parentPhone'];
    phoneFields.forEach(fieldId => {
        const field = form.elements[fieldId];
        if (field) {
            field.addEventListener('input', (e) => {
                // Remove any non-digit characters
                e.target.value = e.target.value.replace(/\D/g, '');
                
                // Limit to 11 digits
                if (e.target.value.length > 11) {
                    e.target.value = e.target.value.slice(0, 11);
                }
            });
        }
    });

    // Add form submission validation
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
        }
    });
});
