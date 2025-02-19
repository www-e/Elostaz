// Form Input Validation
export function validatePhoneNumber(phone) {
    const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
    return phoneRegex.test(phone);
}

export function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

export function validateBookingForm(formData) {
    // Name validation
    if (formData.studentName.trim().length < 3) {
        alert('يرجى إدخال اسم صحيح');
        return false;
    }

    // Phone number validation (Egyptian format)
    const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
    if (!phoneRegex.test(formData.studentPhone)) {
        alert('يرجى إدخال رقم هاتف صحيح');
        return false;
    }

    if (!phoneRegex.test(formData.parentPhone)) {
        alert('يرجى إدخال رقم هاتف ولي الأمر صحيح');
        return false;
    }

    // Country validation
    if (!formData.country) {
        alert('يرجى اختيار الدولة');
        return false;
    }

    // Grade validation
    if (!formData.studentGrade) {
        alert('يرجى اختيار الصف الدراسي');
        return false;
    }

    // Date validation
    const selectedDate = new Date(formData.sessionDate);
    const today = new Date();
    if (selectedDate < today) {
        alert('يرجى اختيار تاريخ صحيح');
        return false;
    }

    // Time validation
    const [hours, minutes] = formData.sessionTime.split(':');
    if (hours < 9 || hours > 21) {
        alert('يرجى اختيار وقت بين الساعة 9 صباحاً و 9 مساءً');
        return false;
    }

    return true;
}
