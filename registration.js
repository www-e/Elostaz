document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
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
    gradeSelect.addEventListener('change', function() {
        const grade = this.value;
        
        // Show/hide section selection for 2nd and 3rd grade
        if (grade === 'second' || grade === 'third') {
            sectionGroup.style.display = 'block';
            document.getElementById('section').required = true;
        } else {
            sectionGroup.style.display = 'none';
            document.getElementById('section').required = false;
        }

        // Hide schedule for third grade
        if (grade === 'third') {
            groupSelect.parentElement.style.display = 'none';
            timeSelect.parentElement.style.display = 'none';
            groupSelect.required = false;
            timeSelect.required = false;
        } else {
            groupSelect.parentElement.style.display = 'block';
            timeSelect.parentElement.style.display = 'block';
            groupSelect.required = true;
            timeSelect.required = true;
            updateTimeOptions(grade, groupSelect.value);
        }
    });

    // Handle group change
    groupSelect.addEventListener('change', function() {
        const grade = gradeSelect.value;
        updateTimeOptions(grade, this.value);
    });

    function updateTimeOptions(grade, group) {
        timeSelect.innerHTML = '<option value="">اختر الموعد</option>';
        
        if (!schedules[grade] || !schedules[grade][group]) return;

        schedules[grade][group].forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }

    // Add success message HTML to the page
    const successMessageHTML = `
        <div class="success-message" style="display: none">
            <div class="success-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>تم التسجيل بنجاح!</h3>
                <p>سيتم التواصل معك قريباً</p>
                <button class="ok-btn">حسناً</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', successMessageHTML);

    const successMessage = document.querySelector('.success-message');
    const okButton = document.querySelector('.ok-btn');

    okButton.addEventListener('click', () => {
        successMessage.style.display = 'none';
    });

    // Add after the success message HTML
    const receiptModalHTML = `
        <div class="receipt-modal" style="display: none">
            <div class="receipt-content">
                <div class="receipt-header">
                    <h2>تأكيد التسجيل</h2>
                    <p>مركز أ/ أشرف حسن للرياضيات</p>
                </div>
                <div class="receipt-data">
                    <!-- Data will be inserted here -->
                </div>
                <div class="receipt-actions">
                    <button class="receipt-btn save-btn">
                        <i class="fas fa-download"></i>
                        حفظ كصورة
                    </button>
                    <button class="receipt-btn whatsapp-btn">
                        <i class="fab fa-whatsapp"></i>
                        إرسال عبر واتساب
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', receiptModalHTML);

    const receiptModal = document.querySelector('.receipt-modal');
    const saveBtn = document.querySelector('.save-btn');
    const whatsappBtn = document.querySelector('.whatsapp-btn');

    function generateReceiptData(formData) {
        const receiptData = document.querySelector('.receipt-data');
        
        // Format timestamp in Arabic with date and time
        const now = new Date();
        const timeOptions = { 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric', 
            hour12: true 
        };
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        
        const timeString = now.toLocaleTimeString('ar-EG', timeOptions);
        const dateString = now.toLocaleDateString('ar-EG', dateOptions);
        const timestamp = `${dateString} ${timeString}`;
        
        receiptData.innerHTML = `
            <div class="data-row">
                <span class="data-label">تاريخ التسجيل:</span>
                <span class="data-value">${timestamp}</span>
            </div>
            <div class="data-row">
                <span class="data-label">اسم الطالب:</span>
                <span class="data-value">${formData.get('entry.704942904')}</span>
            </div>
            <div class="data-row">
                <span class="data-label">رقم الطالب:</span>
                <span class="data-value">${formData.get('entry.1530055795')}</span>
            </div>
            <div class="data-row">
                <span class="data-label">رقم ولي الأمر:</span>
                <span class="data-value">${formData.get('entry.14816919')}</span>
            </div>
            <div class="data-row">
                <span class="data-label">الصف الدراسي:</span>
                <span class="data-value">${formData.get('entry.1185658655')}</span>
            </div>
            ${formData.get('entry.1819611279') ? `
            <div class="data-row">
                <span class="data-label">الشعبة:</span>
                <span class="data-value">${formData.get('entry.1819611279')}</span>
            </div>
            ` : ''}
            ${formData.get('entry.1957842203') ? `
            <div class="data-row">
                <span class="data-label">المجموعة:</span>
                <span class="data-value">${formData.get('entry.1957842203')}</span>
            </div>
            ` : ''}
            ${formData.get('entry.869564185') ? `
            <div class="data-row">
                <span class="data-label">الموعد:</span>
                <span class="data-value">${formData.get('entry.869564185')}</span>
            </div>
            ` : ''}
        `;
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show loading state
        const submitBtn = e.target.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التسجيل...';

        try {
            // Create form data with Arabic labels
            const formData = new FormData();
            formData.append('entry.704942904', document.getElementById('studentName').value); // اسم الطالب
            formData.append('entry.1530055795', document.getElementById('studentPhone').value); // رقم الطالب
            formData.append('entry.14816919', document.getElementById('parentPhone').value); // رقم ولي الأمر
            formData.append('entry.1185658655', gradeNames[document.getElementById('grade').value]); // الصف الدراسي
            formData.append('entry.1819611279', sectionNames[document.getElementById('section').value] || ''); // الشعبة
            formData.append('entry.1957842203', groupNames[groupSelect.value] || ''); // المجموعة
            formData.append('entry.869564185', timeSelect.value || ''); // الموعد

            // Submit form using iframe to prevent redirect
            const iframe = document.createElement('iframe');
            iframe.name = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            form.target = 'hidden_iframe';
            form.action = googleFormURL;
            form.method = 'POST';
            form.submit();

            // Show success message
            setTimeout(() => {
                successMessage.style.display = 'flex';
                generateReceiptData(formData);
                receiptModal.style.display = 'flex';
                form.reset();
                document.body.removeChild(iframe);
            }, 1000);

        } catch (error) {
            console.error('Error:', error);
            alert('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane ms-2"></i> تسجيل';
        }
    });

    // Add this helper function at the top of your file
    function captureReceipt(element, options = {}) {
        return new Promise(async (resolve) => {
            // Create a clone of the element to avoid modifying the original
            const clone = element.cloneNode(true);
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.appendChild(clone);
            document.body.appendChild(container);

            // Get device pixel ratio
            const dpr = window.devicePixelRatio || 1;
            
            // Calculate optimal dimensions
            const width = 1200; // Fixed width for consistency
            const height = Math.floor((clone.offsetHeight * width) / clone.offsetWidth);
            
            // Apply styles for high-quality capture
            clone.style.width = `${width}px`;
            clone.style.margin = '0';
            clone.style.transform = 'none';
            clone.style.backgroundColor = getComputedStyle(element).backgroundColor;

            // Enhanced capture settings
            const canvas = await html2canvas(clone, {
                scale: dpr * 2, // Adjust scale based on device pixel ratio
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: getComputedStyle(element).backgroundColor,
                width: width,
                height: height,
                imageTimeout: 0,
                removeContainer: true,
                foreignObjectRendering: false,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    // Ensure text remains sharp
                    const style = clonedDoc.createElement('style');
                    style.innerHTML = `
                        * {
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            text-rendering: optimizeLegibility;
                        }
                    `;
                    clonedDoc.head.appendChild(style);
                }
            });

            // Cleanup
            document.body.removeChild(container);
            resolve(canvas);
        });
    }

    // Update the save button handler
    saveBtn.addEventListener('click', async () => {
        try {
            const receiptContent = document.querySelector('.receipt-content');
            const canvas = await captureReceipt(receiptContent, { width: '1000px' });
            
            // Convert to blob for better quality
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'تأكيد_التسجيل.png';
            link.click();
            
            // Cleanup
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error saving receipt:', error);
            alert('حدث خطأ أثناء حفظ الإيصال');
        }
    });

    // Update the WhatsApp sharing handler
    whatsappBtn.addEventListener('click', async () => {
        try {
            const receiptContent = document.querySelector('.receipt-content');
            const canvas = await captureReceipt(receiptContent);
            
            // Convert to blob
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            
            // Create text message
            const receiptData = document.querySelector('.receipt-data');
            const message = `تأكيد التسجيل - مركز أ/ أشرف حسن للرياضيات\n\n${
                Array.from(receiptData.querySelectorAll('.data-row'))
                    .map(row => `${row.querySelector('.data-label').textContent} ${row.querySelector('.data-value').textContent}`)
                    .join('\n')
            }`;

            // Try using WhatsApp Web API directly
            const whatsappURL = `https://api.whatsapp.com/send?phone=201154688628&text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');

            // After WhatsApp opens, trigger file download for manual sharing
            setTimeout(() => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'تأكيد_التسجيل.png';
                downloadLink.click();
                URL.revokeObjectURL(downloadLink.href);
            }, 1000);
        } catch (error) {
            console.error('Error sharing:', error);
            alert('حدث خطأ أثناء المشاركة');
        }
    });

    // Close receipt modal when clicking outside
    receiptModal.addEventListener('click', (e) => {
        if (e.target === receiptModal) {
            receiptModal.style.display = 'none';
        }
    });
}); 