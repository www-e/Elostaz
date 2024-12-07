// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.floating-nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Loader functionality
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
        }, 250);
    }
});

// Show loader before page unload
window.addEventListener('beforeunload', () => {
    const loader = document.querySelector('.loader-wrapper');
    if (loader) {
        loader.classList.remove('fade-out');
    }
});

// Handle active navigation state
document.addEventListener('DOMContentLoaded', () => {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    
    // Remove all active classes first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Set active class based on current page or section
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href.includes('#')) {
            // For hash links (sections within a page)
            if (currentHash && href === currentHash) {
                link.classList.add('active');
            } else if (!currentHash && href === '#home' && currentPath.endsWith('index.html')) {
                link.classList.add('active');
            }
        } else {
            // For page links
            if (currentPath.endsWith(href)) {
                link.classList.add('active');
            }
        }
    });
    
    // Handle section scrolling for index page
    if (currentPath.endsWith('index.html') || currentPath.endsWith('/')) {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});

// Smart Card Flip Functionality
document.addEventListener('DOMContentLoaded', function() {
    const flipButton = document.querySelector('.flip-button');
    const smartCard = document.querySelector('.smart-card');

    if (flipButton && smartCard) {
        flipButton.addEventListener('click', function() {
            smartCard.classList.toggle('flipped');
            flipButton.textContent = smartCard.classList.contains('flipped') ? ' وجه الكارت' : 'ضهر الكارت';
        });
    }
});

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('تم استلام رسالتك بنجاح! سنتواصل معك قريباً.');
        this.reset();
    });
}

// Multi-step Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        initializeMultiStepForm();
    }
});

function initializeMultiStepForm() {
    const form = document.getElementById('bookingForm');
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = form.querySelectorAll('.progress-step');
    const prevBtn = form.querySelector('.btn-prev');
    const nextBtn = form.querySelector('.btn-next');
    const submitBtn = form.querySelector('.btn-submit');
    let currentStep = 0;

    // Initialize buttons
    updateButtons();

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            if (currentStep === steps.length - 2) {
                updateSummary();
            }
            currentStep++;
            updateForm();
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateForm();
    });

    // Form submission handler
    form.addEventListener('submit', handleFormSubmit);

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

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

    try {
        // Google Form URL
        const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd0GuqDFenUIh6YLHXEZM31hk8wuq8TvZZwWiIfIsAtfNIL4g/formResponse';
        
        // Create hidden iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('name', 'hidden_iframe');
        iframe.setAttribute('id', 'hidden_iframe');
        iframe.setAttribute('style', 'display: none');
        document.body.appendChild(iframe);

        // Create form
        const form = document.createElement('form');
        form.setAttribute('action', FORM_URL);
        form.setAttribute('method', 'post');
        form.setAttribute('target', 'hidden_iframe');

        // Form data
        const formFields = {
            'entry.1256825568': document.getElementById('studentName').value,
            'entry.2113872397': document.getElementById('studentPhone').value,
            'entry.408825990': document.getElementById('parentPhone').value,
            'entry.433721923': document.getElementById('country').value,
            'entry.1640854366': document.getElementById('studentGrade').value,
            'entry.477566493': document.getElementById('sessionType').value,
            'entry.886530649': document.getElementById('sessionDate').value,
            'entry.863063401': document.getElementById('sessionTime').value,
            'entry.490872707': document.getElementById('notes').value || ''
        };

        // Add form fields
        Object.entries(formFields).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', name);
            input.setAttribute('value', value);
            form.appendChild(input);
        });

        // Add form to document
        document.body.appendChild(form);

        // Handle iframe load event
        iframe.onload = function() {
            // Hide booking modal
            const bookingModal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
            if (bookingModal) {
                bookingModal.hide();
            }

            // Show success modal
            setTimeout(() => {
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
            }, 500);

            // Reset form
            e.target.reset();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(form);
                document.body.removeChild(iframe);
            }, 1000);

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> تأكيد الحجز';
        };

        // Submit the form
        form.submit();

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> تأكيد الحجز';
    }
}

// Fix modal backdrop issue
document.addEventListener('DOMContentLoaded', function() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('hidden.bs.modal', function() {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        });
    });
});

// Form Input Validation
function validatePhoneNumber(phone) {
    const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;
    return phoneRegex.test(phone);
}

function validateDate(date) {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today;
}

// Initialize date picker with min date
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('sessionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
});

// Booking Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
});

async function handleBookingSubmit(e) {
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

        // Send to Google Sheets (implementation pending)
        // await sendToGoogleSheets(sheetData);

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

function validateBookingForm(formData) {
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

// Function to handle Google Sheets submission (to be implemented)
async function sendToGoogleSheets(data) {
    // Implementation pending
    // This will be implemented once Google Sheets API is set up
    console.log('Data to be sent to Google Sheets:', data);
    return new Promise(resolve => setTimeout(resolve, 1000));
}
