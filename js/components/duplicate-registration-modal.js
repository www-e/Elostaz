export class DuplicateRegistrationModal {
    constructor() {
        this.modal = null;
    }

    show(studentPhone) {
        if (this.modal) {
            this.hide();
        }

        this.modal = document.createElement('div');
        this.modal.className = 'info-modal duplicate-modal';
        this.modal.innerHTML = `
            <div class="info-modal-content">
                <div class="info-modal-header">
                    <h3 class="info-modal-title">طالب مسجل بالفعل</h3>
                    <button class="info-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="info-modal-body">
                    <div class="info-icon duplicate-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="info-section">
                        <p class="duplicate-message">
                            <strong>هذا الطالب مسجل بالفعل!</strong>
                        </p>
                        <p>
                            رقم الهاتف <span class="phone-number">${studentPhone || ''}</span> مسجل مسبقاً في نظامنا.
                        </p>
                        <p>
                            إذا كنت تريد تعديل بيانات التسجيل، يرجى التواصل مع إدارة المركز.
                        </p>
                        <div class="action-buttons">
                            <button class="primary-btn try-again-btn">
                                <i class="fas fa-redo-alt"></i>
                                تسجيل طالب آخر
                            </button>
                            <button class="secondary-btn contact-btn">
                                <i class="fas fa-phone-alt"></i>
                                اتصل بالإدارة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);
        
        // Show modal with animation
        setTimeout(() => this.modal.classList.add('active'), 10);

        // Close button functionality
        const closeBtn = this.modal.querySelector('.info-modal-close');
        closeBtn.addEventListener('click', () => this.hide());
        
        // Try again button
        const tryAgainBtn = this.modal.querySelector('.try-again-btn');
        tryAgainBtn.addEventListener('click', () => {
            this.hide();
            // Reset the form
            document.getElementById('registrationForm')?.reset();
        });
        
        // Contact button - open WhatsApp with center's number
        const contactBtn = this.modal.querySelector('.contact-btn');
        contactBtn.addEventListener('click', () => {
            // Replace with actual center phone number
            const centerPhone = '+201000000000'; // Update this with the actual number
            window.open(`https://wa.me/${centerPhone}?text=استفسار بخصوص التسجيل`, '_blank');
        });
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    hide() {
        if (this.modal) {
            this.modal.classList.remove('active');
            setTimeout(() => {
                this.modal.remove();
                this.modal = null;
            }, 300);
        }
    }
}
