export class SuccessModal {
    constructor() {
        this.createModal();
        this.addCustomStyles(); // Add styles for the new section
        this.attachEventListeners();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'success-message';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="success-content">
                <button class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
                <i class="fas fa-check-circle success-icon"></i>
                <h3>تم تسجيل بياناتك بنجاح</h3>
                <div class="receipt-info">
                    <div class="receipt-step step-1 active">
                        <div class="receipt-info-group">
                            <p><strong>اسم الطالب:</strong> <span class="student-name"></span></p>
                            <p><strong>الصف:</strong> <span class="grade-name"></span></p>
                            <p><strong>رقم الطالب:</strong> <span class="student-phone"></span></p>
                            <p><strong>رقم ولي الأمر:</strong> <span class="parent-phone"></span></p>
                            <p class="timestamp"></p>
                        </div>
                        <button class="receipt-btn next-btn">
                            <span>التالي</span>
                            <i class="fas fa-arrow-left"></i>
                        </button>
                    </div>
                    <div class="receipt-step step-2">
                        <!-- NEW Compact Summary -->
                        <div class="compact-summary">
                            <div class="summary-item" id="section-info-compact" style="display: none;">
                                <i class="fas fa-book-open"></i> <span class="section-name"></span>
                            </div>
                            <div class="summary-item" id="group-info-compact" style="display: none;">
                                <i class="fas fa-users"></i> <span class="group-name"></span>
                            </div>
                            <div class="summary-item" id="time-info-compact" style="display: none;">
                                <i class="fas fa-clock"></i> <span class="time-name"></span>
                            </div>
                        </div>

                        <!-- Confirmation Details (Main Focus) -->
                        <div class="confirmation-details">
                            <h4 class="confirmation-title"><i class="fas fa-exclamation-circle"></i> خطوة هامة لتأكيد الحجز</h4>
                            <p>لإتمام عملية التسجيل، يرجى تأكيد الحجز بالحضور إلى السنتر.</p>
                            <p><strong>الموعد:</strong> من السبت 7/12 حتى السبت 7/22، من الساعة 4:00 عصرًا حتى 8:00 مساءً.</p>
                            <p><strong>المبلغ المطلوب:</strong> <span id="confirmation-fee" class="fee-highlight"></span></p>
                            <p><strong>العنوان:</strong> الاهرام ش الاستاد الشارع المقابل لسيتي كلوب امام مدرسة الثانويه بنات</p>
                            <a href="https://www.google.com/maps/search/?api=1&query=30.468833,31.184222" target="_blank" class="receipt-btn location-btn">
                                <i class="fas fa-map-marker-alt"></i>
                                عرض موقع السنتر
                            </a>
                        </div>
                        
                        <button class="receipt-btn prev-btn">
                            <i class="fas fa-arrow-right"></i>
                            <span>السابق</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .compact-summary {
                display: flex;
                flex-wrap: wrap;
                gap: var(--space-sm);
                background-color: rgba(var(--primary-rgb), 0.05);
                padding: var(--space-sm);
                border-radius: var(--radius-lg);
                margin-bottom: var(--space-base);
                justify-content: center;
            }
            .summary-item {
                display: flex;
                align-items: center;
                gap: var(--space-xs);
                font-size: var(--font-size-xs);
                color: var(--text-secondary);
                padding: var(--space-xs) var(--space-sm);
                background-color: var(--card-bg);
                border-radius: var(--radius-full);
                border: 1px solid var(--border-color);
            }
            .summary-item i {
                color: var(--primary);
            }
            .confirmation-details {
                margin-top: 1.5rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
                text-align: right;
            }
            .confirmation-title {
                font-size: 1.1rem;
                font-weight: 600;
                color: var(--primary);
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .confirmation-details p {
                font-size: 0.95rem;
                margin-bottom: 0.5rem;
                line-height: 1.6;
            }
            .location-btn {
                display: inline-flex !important;
                align-items: center;
                gap: 0.5rem;
                margin-top: 1rem;
                background: var(--accent) !important;
                border-color: var(--accent-dark) !important;
            }
            .location-btn:hover {
                 background: var(--accent-dark) !important;
            }
            .fee-highlight {
                font-weight: 700;
                color: var(--success-color);
                background-color: var(--success-bg);
                padding: 2px 8px;
                border-radius: var(--radius-sm);
            }
        `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.close-btn');
        const nextBtn = this.modal.querySelector('.next-btn');
        const prevBtn = this.modal.querySelector('.prev-btn');

        closeBtn.addEventListener('click', () => this.hide());
        nextBtn.addEventListener('click', () => this.showStep(2));
        prevBtn.addEventListener('click', () => this.showStep(1));
    }

    showStep(step) {
        this.modal.querySelector('.step-1').classList.remove('active');
        this.modal.querySelector('.step-2').classList.remove('active');
        this.modal.querySelector('.step-' + step).classList.add('active');
    }
    show(registrationData) {
        // Update modal content with registration data
        this.modal.querySelector('.student-name').textContent = registrationData.studentName;
        this.modal.querySelector('.grade-name').textContent = registrationData.gradeName;
        this.modal.querySelector('.student-phone').textContent = registrationData.studentPhone;
        this.modal.querySelector('.parent-phone').textContent = registrationData.parentPhone;

        const sectionInfoCompact = this.modal.querySelector('#section-info-compact');
        if (registrationData.sectionName) {
            sectionInfoCompact.style.display = 'flex';
            this.modal.querySelector('.section-name').textContent = registrationData.sectionName;
        } else {
            sectionInfoCompact.style.display = 'none';
        }

        const groupInfoCompact = this.modal.querySelector('#group-info-compact');
        if (registrationData.groupName) {
            groupInfoCompact.style.display = 'flex';
            this.modal.querySelector('.group-name').textContent = registrationData.groupName;
        } else {
            groupInfoCompact.style.display = 'none';
        }

        const timeInfoCompact = this.modal.querySelector('#time-info-compact');
        if (registrationData.timeSlot) {
            timeInfoCompact.style.display = 'flex';
            this.modal.querySelector('.time-name').textContent = registrationData.timeSlot;
        } else {
            timeInfoCompact.style.display = 'none';
        }

        // Set timestamp
        const timestamp = new Intl.DateTimeFormat('ar-EG', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(new Date());

        this.modal.querySelectorAll('.timestamp').forEach(el => {
            el.textContent = `تاريخ التسجيل: ${timestamp}`;
        });
        // --- Dynamic Confirmation Fee Logic ---
        const feeElement = this.modal.querySelector('#confirmation-fee');
        let fee = '';

        if (registrationData.grade === 'first') {
            fee = '115 جنيهًا';
        } else if (registrationData.grade === 'second') {
            fee = '140 جنيهًا';
        } else if (registrationData.grade === 'third') {
            if (registrationData.section === 'general') {
                fee = '400 جنيهًا';
            } else if (registrationData.section === 'statistics') {
                fee = '150 جنيهًا';
            }
        }

        if (fee) {
            feeElement.textContent = fee;
            feeElement.parentElement.style.display = 'block';
        } else {
            // Hide the fee line if no fee is applicable
            feeElement.parentElement.style.display = 'none';
        }
        // --- End of Dynamic Logic ---
        this.modal.style.display = 'flex';
        this.showStep(1);
    }

    hide() {
        this.modal.style.display = 'none';
    }
}