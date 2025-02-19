document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    // Only proceed if we're on a page with the registration form
    if (!form) return;
    
    const gradeSelect = document.getElementById('grade');
    const sectionGroup = document.getElementById('sectionGroup');
    const groupSelect = document.getElementById('group');
    const timeSelect = document.getElementById('time');
    
    // Google Form submission URL
    const googleFormURL = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf7hpFaBMXCJtvF_sXo9jJVL4QZB7YZ2GJve5fn6p0Suje-Fg/formResponse';

    // Schedule data
    const schedules = {
        first: {
            'sat_tue': ['٤:٠٠ مساءً', '٥:٣٠ مساءً', '٧:٠٠ مساءً'],
            'sun_wed': ['١:٠٠ مساءً', '٢:٣٠ مساءً']
        },
        second: {
            'sat_tue': ['١:٠٠ مساءً', '٢:٣٠ مساءً'],
            'sun_wed': ['٤:٠٠ مساءً', '٥:٣٠ مساءً']
        },
        third: {} // No schedules for third grade
    };

    const gradeNames = {
        'first': 'الصف الأول الثانوي',
        'second': 'الصف الثاني الثانوي',
        'third': 'الصف الثالث الثانوي'
    };

    const sectionNames = {
        'scientific': 'علمي',
        'literary': 'أدبي'
    };

    const groupNames = {
        'sat_tue': 'السبت والثلاثاء',
        'sun_wed': 'الأحد والأربعاء'
    };

    // Handle grade change
    if (gradeSelect) {
        gradeSelect.addEventListener('change', function() {
            const grade = this.value;
            
            // Show/hide section selection for 2nd and 3rd grade
            if (sectionGroup) {
                if (grade === 'second' || grade === 'third') {
                    sectionGroup.style.display = 'block';
                    if (document.getElementById('section')) {
                        document.getElementById('section').required = true;
                    }
                } else {
                    sectionGroup.style.display = 'none';
                    if (document.getElementById('section')) {
                        document.getElementById('section').required = false;
                    }
                }
            }

            // Hide schedule for third grade
            if (grade === 'third') {
                if (groupSelect) {
                    groupSelect.parentElement.style.display = 'none';
                }
                if (timeSelect) {
                    timeSelect.parentElement.style.display = 'none';
                    timeSelect.required = false;
                }
                if (groupSelect) {
                    groupSelect.required = false;
                }
            } else {
                if (groupSelect) {
                    groupSelect.parentElement.style.display = 'block';
                }
                if (timeSelect) {
                    timeSelect.parentElement.style.display = 'block';
                    timeSelect.required = true;
                }
                if (groupSelect) {
                    groupSelect.required = true;
                    updateTimeOptions(grade, groupSelect.value);
                }
            }
        });
    }

    // Handle group change
    if (groupSelect) {
        groupSelect.addEventListener('change', function() {
            const grade = gradeSelect.value;
            updateTimeOptions(grade, this.value);
        });
    }

    function updateTimeOptions(grade, group) {
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="">اختر الموعد</option>';
            
            if (!schedules[grade] || !schedules[grade][group]) return;

            schedules[grade][group].forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                timeSelect.appendChild(option);
            });
        }
    }

    // Remove the old receipt modal HTML
    const successMessageHTML = `
        <div class="success-message" style="display: none">
            <div class="success-content">
                <button class="close-btn" onclick="closeSuccessMessage()">
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
                        <button class="receipt-btn next-btn" onclick="showStep(2)">
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
                        <button class="receipt-btn prev-btn" onclick="showStep(1)">
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
        </div>
    `;

    // Remove any existing success message before adding the new one
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    document.body.insertAdjacentHTML('beforeend', successMessageHTML);

    // Function to close success message
    window.closeSuccessMessage = function() {
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    };

    // Add step navigation function
    window.showStep = function(step) {
        document.querySelector('.step-1').classList.remove('active');
        document.querySelector('.step-2').classList.remove('active');
        document.querySelector('.step-' + step).classList.add('active');
    };

    // Function to format current time in Arabic
    function formatCurrentTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return new Intl.DateTimeFormat('ar-EG', options).format(now);
    }

    // Improved image capture function
    async function captureReceipt(element) {
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

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            try {
                await fetch(googleFormURL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });

                const successMessage = document.querySelector('.success-message');
                if (successMessage) {
                    // Update content with Arabic values
                    document.querySelector('.student-name').textContent = formData.get('entry.704942904');
                    document.querySelector('.grade-name').textContent = gradeNames[formData.get('entry.1185658655')] || '';
                    document.querySelector('.student-phone').textContent = formData.get('entry.1530055795');
                    document.querySelector('.parent-phone').textContent = formData.get('entry.14816919');

                    const sectionInfo = document.querySelector('.section-info');
                    const sectionValue = formData.get('entry.1819611279');
                    if (sectionValue && sectionNames[sectionValue]) {
                        sectionInfo.style.display = 'block';
                        document.querySelector('.section-name').textContent = sectionNames[sectionValue];
                    }

                    const groupInfo = document.querySelector('.group-info');
                    const groupValue = formData.get('entry.1957842203');
                    if (groupValue && groupNames[groupValue]) {
                        groupInfo.style.display = 'block';
                        document.querySelector('.group-name').textContent = groupNames[groupValue];
                    }

                    const timeInfo = document.querySelector('.time-info');
                    const timeValue = formData.get('entry.869564185');
                    if (timeValue) {
                        timeInfo.style.display = 'block';
                        document.querySelector('.time-name').textContent = timeValue;
                    }

                    // Set timestamp
                    const timestamp = formatCurrentTime();
                    document.querySelectorAll('.timestamp').forEach(el => {
                        el.textContent = `تاريخ التسجيل: ${timestamp}`;
                    });

                    successMessage.style.display = 'flex';
                    form.reset();
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('حدث خطأ أثناء إرسال البيانات. يرجى المحاولة مرة أخرى.');
            }
        });
    }

    // Handle WhatsApp sharing
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', async () => {
            try {
                const successContent = document.querySelector('.success-content');
                const blob = await captureReceipt(successContent);
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
        });
    }
}); 