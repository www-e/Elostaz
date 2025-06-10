import { submitStatisticsRegistration } from './statistics-service.js';
import { StatisticsSuccessModal } from './components/statistics-success-modal.js';
import { DuplicateRegistrationModal } from './components/duplicate-registration-modal.js';
import { validatePhoneNumber } from './form-validation.js';

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