export class RestrictedGroupsModal {
    constructor() {
        this.modal = null;
    }

    show() {
        if (this.modal) {
            this.hide();
        }

        this.modal = document.createElement('div');
        this.modal.className = 'info-modal restricted-modal';
        this.modal.innerHTML = `
            <div class="info-modal-content">
                <div class="info-modal-header">
                    <h3 class="info-modal-title">مجموعات غير متاحة للتسجيل</h3>
                    <button class="info-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="info-modal-body">
                    <div class="info-section">
                        <div class="warning-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <p>عفواً، لا يمكن التسجيل في المجموعات التالية حيث أنها مكتملة:</p>
                        <ul>
                            <li>
                                <span class="info-highlight">الأحد والأربعاء والجمعة الساعة ١:٠٠</span>
                                <span class="group-detail">للصف الثالث الثانوي (عام)</span>
                            </li>
                            <li>
                                <span class="info-highlight">الاثنين والخميس الساعة ١٢:٠٠</span>
                                <span class="group-detail">للصف الثالث الثانوي (إحصاء)</span>
                            </li>
                        </ul>
                        <p>يرجى اختيار مجموعة أخرى متاحة للتسجيل.</p>
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
