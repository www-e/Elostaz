export class StatisticsSuccessModal {
    constructor() {
        this.modal = null;
        this.createModal();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'info-modal';
        modal.style.display = 'none';
        
        modal.innerHTML = `
            <div class="info-modal-content">
                <button class="info-modal-close">
                    <i class="fas fa-times"></i>
                </button>
                <i class="fas fa-check-circle success-icon"></i>
                <h3 class="info-modal-title">تم تسجيل بياناتك بنجاح</h3>
                <div class="info-modal-body">
                    <div class="receipt-info">
                        <div class="receipt-step step-1 active">
                            <div class="receipt-info-group">
                                <p><strong>اسم الطالب:</strong> <span class="student-name"></span></p>
                                <p><strong>رقم الطالب:</strong> <span class="student-phone"></span></p>
                                <p><strong>رقم ولي الأمر:</strong> <span class="parent-phone"></span></p>
                                <p><strong>نوع الثانوية:</strong> <span class="school-type"></span></p>
                                <p><strong>نوع الحضور:</strong> <span class="attendance-type"></span></p>
                                <p class="timestamp"></p>
                            </div>
                            <button class="receipt-btn next-btn">
                                <span>بيانات الدخول</span>
                                <i class="fas fa-arrow-left"></i>
                            </button>
                        </div>
                        <div class="receipt-step step-2">
                            <div class="receipt-info-group credentials-group">
                                <div class="credentials-box">
                                    <p><strong>اسم المستخدم:</strong></p>
                                    <p class="username"></p>
                                </div>
                                <div class="credentials-box">
                                    <p><strong>كلمة المرور:</strong></p>
                                    <p class="password"></p>
                                </div>
                                <p class="credentials-note">
                                    <i class="fas fa-info-circle"></i>
                                    يرجى الاحتفاظ ببيانات الدخول في مكان آمن
                                </p>
                            </div>
                            <button class="receipt-btn prev-btn">
                                <i class="fas fa-arrow-right"></i>
                                <span>بيانات التسجيل</span>
                            </button>
                            <div class="receipt-actions">
                                <button class="receipt-btn whatsapp-btn">
                                    <i class="fab fa-whatsapp"></i>
                                    إرسال عبر واتساب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;

        // Add event listeners
        this.setupEventListeners();

        // Add custom styles for credentials
        this.addCustomStyles();
    }

    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .credentials-group {
                background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), rgba(var(--secondary-rgb), 0.1));
                border: 2px solid rgba(var(--primary-rgb), 0.2);
            }
            
            .credentials-box {
                background: var(--card-bg);
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .credentials-box p {
                margin: 0;
                text-align: center;
            }
            
            .credentials-box .username,
            .credentials-box .password {
                font-family: monospace;
                font-size: 1.2rem;
                color: var(--primary);
                margin-top: 0.5rem;
                padding: 0.5rem;
                background: rgba(var(--primary-rgb), 0.1);
                border-radius: 4px;
            }
            
            .credentials-note {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin-top: 1rem;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Close button
        const closeBtn = this.modal.querySelector('.info-modal-close');
        closeBtn.addEventListener('click', () => this.hide());

        // Next/Prev buttons
        const nextBtn = this.modal.querySelector('.next-btn');
        const prevBtn = this.modal.querySelector('.prev-btn');
        
        nextBtn.addEventListener('click', () => this.showStep(2));
        prevBtn.addEventListener('click', () => this.showStep(1));

        // WhatsApp button
        const whatsappBtn = this.modal.querySelector('.whatsapp-btn');
        whatsappBtn.addEventListener('click', () => {
            const registrationData = this.getRegistrationData();
            this.shareViaWhatsApp(registrationData);
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.hide();
        });
    }

    showStep(stepNumber) {
        const steps = this.modal.querySelectorAll('.receipt-step');
        steps.forEach(step => step.classList.remove('active'));
        this.modal.querySelector(`.step-${stepNumber}`).classList.add('active');
    }

    show(registrationData) {
        // Update modal content with registration data
        this.modal.querySelector('.student-name').textContent = registrationData.studentName;
        this.modal.querySelector('.student-phone').textContent = registrationData.studentPhone;
        this.modal.querySelector('.parent-phone').textContent = registrationData.parentPhone;
        this.modal.querySelector('.school-type').textContent = registrationData.schoolType;
        this.modal.querySelector('.attendance-type').textContent = registrationData.attendanceType;
        this.modal.querySelector('.username').textContent = registrationData.username;
        this.modal.querySelector('.password').textContent = registrationData.password;

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

        this.modal.style.display = 'flex';
        setTimeout(() => this.modal.classList.add('active'), 10);
        this.showStep(1);
    }

    hide() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.showStep(1);
        }, 300);
    }

    getRegistrationData() {
        return {
            studentName: this.modal.querySelector('.student-name').textContent,
            studentPhone: this.modal.querySelector('.student-phone').textContent,
            parentPhone: this.modal.querySelector('.parent-phone').textContent,
            schoolType: this.modal.querySelector('.school-type').textContent,
            attendanceType: this.modal.querySelector('.attendance-type').textContent,
            username: this.modal.querySelector('.username').textContent,
            password: this.modal.querySelector('.password').textContent
        };
    }

    shareViaWhatsApp(data) {
        const message = `
تم تسجيلك بنجاح في مراجعة الإحصائيات 🎉

👤 اسم الطالب: ${data.studentName}
📱 رقم الطالب: ${data.studentPhone}
👨‍👦 رقم ولي الأمر: ${data.parentPhone}
🏫 نوع الثانوية: ${data.schoolType}
📍 نوع الحضور: ${data.attendanceType}

بيانات الدخول:
👤 اسم المستخدم: ${data.username}
🔑 كلمة المرور: ${data.password}

يرجى الاحتفاظ ببيانات الدخول في مكان آمن 🔒
`.trim();

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
} 