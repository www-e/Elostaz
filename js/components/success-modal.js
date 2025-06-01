export class SuccessModal {
    constructor() {
        this.createModal();
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
                        <div class="receipt-info-group">
                            <p class="section-info" style="display: none"><strong>الشعبة:</strong> <span class="section-name"></span></p>
                            <p class="group-info" style="display: none"><strong>المجموعة:</strong> <span class="group-name"></span></p>
                            <p class="time-info" style="display: none"><strong>الموعد:</strong> <span class="time-name"></span></p>
                            <p class="timestamp"></p>
                        </div>
                        <button class="receipt-btn prev-btn">
                            <i class="fas fa-arrow-right"></i>
                            <span>السابق</span>
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
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    attachEventListeners() {
        const closeBtn = this.modal.querySelector('.close-btn');
        const nextBtn = this.modal.querySelector('.next-btn');
        const prevBtn = this.modal.querySelector('.prev-btn');
        const whatsappBtn = this.modal.querySelector('.whatsapp-btn');

        closeBtn.addEventListener('click', () => this.hide());
        nextBtn.addEventListener('click', () => this.showStep(2));
        prevBtn.addEventListener('click', () => this.showStep(1));
        whatsappBtn.addEventListener('click', () => this.shareReceipt());
    }

    showStep(step) {
        this.modal.querySelector('.step-1').classList.remove('active');
        this.modal.querySelector('.step-2').classList.remove('active');
        this.modal.querySelector('.step-' + step).classList.add('active');
    }

    async shareReceipt() {
        try {
            const successContent = this.modal.querySelector('.success-content');
            const blob = await this.captureReceipt(successContent);
            const file = new File([blob], 'receipt.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'تأكيد التسجيل',
                    text: 'إيصال التسجيل في مركز أ/ أشرف حسن للرياضيات'
                });
            } else {
                // Fallback for browsers that don't support sharing
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'receipt.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error sharing:', error);
            alert('حدث خطأ أثناء مشاركة الإيصال. يرجى المحاولة مرة أخرى.');
        }
    }

    async captureReceipt(element) {
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: null,
                width: element.offsetWidth * 2,
                height: element.offsetHeight * 2
            });

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create blob'));
                    }
                }, 'image/png', 1.0);
            });
        } catch (error) {
            console.error('Error capturing receipt:', error);
            throw error;
        }
    }

    show(registrationData) {
        // Update modal content with registration data
        this.modal.querySelector('.student-name').textContent = registrationData.studentName;
        this.modal.querySelector('.grade-name').textContent = registrationData.gradeName;
        this.modal.querySelector('.student-phone').textContent = registrationData.studentPhone;
        this.modal.querySelector('.parent-phone').textContent = registrationData.parentPhone;

        const sectionInfo = this.modal.querySelector('.section-info');
        if (registrationData.sectionName) {
            sectionInfo.style.display = 'block';
            this.modal.querySelector('.section-name').textContent = registrationData.sectionName;
        } else {
            sectionInfo.style.display = 'none';
        }

        const groupInfo = this.modal.querySelector('.group-info');
        if (registrationData.groupName) {
            groupInfo.style.display = 'block';
            this.modal.querySelector('.group-name').textContent = registrationData.groupName;
        } else {
            groupInfo.style.display = 'none';
        }

        const timeInfo = this.modal.querySelector('.time-info');
        if (registrationData.timeSlot) {
            timeInfo.style.display = 'block';
            this.modal.querySelector('.time-name').textContent = registrationData.timeSlot;
        } else {
            timeInfo.style.display = 'none';
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

        this.modal.style.display = 'flex';
        this.showStep(1);
    }

    hide() {
        this.modal.style.display = 'none';
    }
} 