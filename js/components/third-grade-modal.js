export class ThirdGradeModal {
    constructor() {
        this.modal = null;
    }

    show() {
        if (this.modal) {
            this.hide();
        }

        this.modal = document.createElement('div');
        this.modal.className = 'info-modal third-grade-modal';
        this.modal.innerHTML = `
            <div class="info-modal-content">
                <div class="info-modal-header">
                    <h3 class="info-modal-title">معلومات هامة للصف الثالث الثانوي</h3>
                    <button class="info-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="info-modal-body">
                    <div class="info-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </div>
                    <div class="info-section">
                        <h4>نظام الدراسة المتميز</h4>
                        <ul>
                            <li>
                                <span class="info-highlight"><i class="fas fa-calendar-alt"></i> حضور مكثف:</span>
                                <strong>ثلاثة أيام في الأسبوع</strong> لضمان التغطية الكاملة للمنهج
                            </li>
                            <li>
                                <span class="info-highlight"><i class="fas fa-clipboard-check"></i> امتحان شامل:</span>
                                يُعقد في <strong>آخر جمعة من كل شهر</strong> لتقييم مستوى الطلاب
                            </li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4>مميزات إضافية</h4>
                        <ul>
                            <li>
                                <span class="info-highlight"><i class="fas fa-book"></i> شمولية التدريس:</span>
                                المنهج يغطي متطلبات <strong>الثانوية العامة والأزهر</strong>
                            </li>
                            <li>
                                <span class="info-highlight"><i class="fas fa-chart-line"></i> متابعة مستمرة:</span>
                                تقييم دوري للمستوى وتقديم الدعم اللازم
                            </li>
                        </ul>
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