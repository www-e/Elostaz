// Contact form handling
export function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('تم استلام رسالتك بنجاح! سنتواصل معك قريباً.');
            this.reset();
        });
    }
}
