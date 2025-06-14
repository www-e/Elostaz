import { supabase } from '../supabase-client.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData) {
        window.location.href = '/pages/signin.html';
        return;
    }

    // Initialize profile
    initializeProfile(userData);

    // Initialize file upload
    initializeFileUpload();

    // Initialize payment status
    updatePaymentStatus(userData.payment_status);

    // Initialize logout handler
    initializeLogout();

    // Check and display existing payment proof
    await checkExistingPaymentProof();
});

function initializeProfile(userData) {
    // Set user information
    document.getElementById('studentName').textContent = userData.student_name;
    document.getElementById('studentPhone').textContent = userData.student_phone;
    document.getElementById('parentPhone').textContent = userData.parent_phone;
    document.getElementById('schoolType').textContent = getSchoolTypeText(userData.school_type);
    document.getElementById('attendanceType').textContent = getAttendanceTypeText(userData.attendance_type);
}

function initializeFileUpload() {
    const form = document.getElementById('paymentProofForm');
    const fileInput = document.getElementById('paymentProof');
    const uploadArea = document.getElementById('uploadArea');
    const previewContainer = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removeButton = document.getElementById('removeImage');
    const submitButton = form.querySelector('.submit-btn');

    // Make the entire upload area clickable
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== removeButton && e.target !== submitButton) {
            fileInput.click();
        }
    });

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.addEventListener('change', handleFiles, false);

    // Handle form submission
    form.addEventListener('submit', handleSubmit);

    // Handle remove button click
    removeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetUpload();
    });

    // Check for existing payment proof
    checkExistingPaymentProof();
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.add('highlight');
}

function unhighlight(e) {
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles({ target: { files } });
}

function handleFiles(e) {
    const files = e.target.files;
    if (files && files[0]) {
        const file = files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showError('يرجى اختيار صورة صالحة');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const uploadArea = document.getElementById('uploadArea');
            const previewImage = document.getElementById('previewImage');
            const removeButton = document.getElementById('removeImage');
            const submitButton = document.querySelector('.submit-btn');
            
            // Update preview image
            previewImage.src = e.target.result;
            
            // Show preview and remove button
            uploadArea.classList.add('has-preview');
            removeButton.style.display = 'block';
            
            // Enable submit button
            submitButton.disabled = false;
        };
        reader.readAsDataURL(file);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const fileInput = document.getElementById('paymentProof');
    const submitButton = e.target.querySelector('.submit-btn');
    const file = fileInput.files[0];

    if (!file) {
        showError('يرجى اختيار صورة');
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    // Check if user already has a payment proof
    if (userData.payment_proof_url) {
        const confirmReupload = await showConfirmDialog(
            'تأكيد إعادة الرفع',
            'لديك بالفعل إثبات دفع مرفوع. هل تريد استبدال الصورة الحالية بصورة جديدة؟'
        );
        if (!confirmReupload) {
            return;
        }
        
        // Delete old file if it exists
        try {
            const oldFileName = userData.payment_proof_url.split('/').pop();
            const supabaseClient = await supabase();
            await supabaseClient.storage
                .from('statisticsrevision')
                .remove([`payment_proofs/${oldFileName}`]);
        } catch (error) {
            console.error('Error deleting old file:', error);
            // Continue anyway as this is not critical
        }
    }

    try {
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

        const studentCode = `std-${userData.id.substring(0, 8)}`;
        const fileExtension = file.name.split('.').pop();
        const fileName = `payment_proofs/${studentCode}-${Date.now()}.${fileExtension}`;

        // Get Supabase client
        const supabaseClient = await supabase();

        // Upload file
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('statisticsrevision')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData, error: urlError } = await supabaseClient.storage
            .from('statisticsrevision')
            .getPublicUrl(fileName);

        if (urlError) throw urlError;

        const publicUrl = urlData.publicUrl;

        // Update user record with retries
        let updateError;
        for (let i = 0; i < 3; i++) {
            console.log('Attempting to update record, attempt:', i + 1);
            
            // First verify the record exists
            const { data: records, error: fetchError } = await supabaseClient
                .from('stats_review_2025')
                .select('id')
                .eq('id', userData.id)
                .order('created_at', { ascending: false })
                .limit(1);
            
            if (fetchError) {
                console.error('Error fetching record:', fetchError);
                continue;
            }

            if (!records || records.length === 0) {
                throw new Error('Record not found');
            }

            // Then update with new URL
            const { data: updateData, error: err } = await supabaseClient
                .from('stats_review_2025')
                .update({
                    payment_proof_url: publicUrl,
                    payment_status: 'under_review'
                })
                .eq('id', userData.id)
                .select();
            
            if (!err && updateData && updateData.length > 0) {
                console.log('Update successful:', updateData[0]);
                updateError = null;
                break;
            }
            updateError = err;
            console.error('Update attempt failed:', err);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        }

        if (updateError) {
            console.error('All update attempts failed. Last error:', updateError);
            throw updateError;
        }

        // Update session storage
        userData.payment_proof_url = publicUrl;
        userData.payment_status = 'under_review';
        sessionStorage.setItem('user', JSON.stringify(userData));

        // Update UI
        const uploadArea = document.getElementById('uploadArea');
        const previewImage = document.getElementById('previewImage');
        const removeButton = document.getElementById('removeImage');

        previewImage.src = publicUrl;
        uploadArea.classList.add('has-preview');
        removeButton.style.display = 'flex';
        submitButton.disabled = true;

        updatePaymentStatus('under_review');
        showSuccess('تم رفع إثبات الدفع بنجاح');

    } catch (error) {
        console.error('Error uploading payment proof:', error);
        showError('حدث خطأ أثناء رفع الملف');
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.innerHTML = '<i class="fas fa-upload ms-2"></i>رفع إثبات الدفع';
    }
}

function resetUpload() {
    const fileInput = document.getElementById('paymentProof');
    const uploadArea = document.getElementById('uploadArea');
    const previewImage = document.getElementById('previewImage');
    const removeButton = document.getElementById('removeImage');
    const submitButton = document.querySelector('.submit-btn');

    fileInput.value = '';
    previewImage.src = '';
    uploadArea.classList.remove('has-preview');
    removeButton.style.display = 'none';
    submitButton.disabled = true;
}

async function checkExistingPaymentProof() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (!userData) return;

        // Get fresh data from Supabase
        const supabaseClient = await supabase();
        const { data, error } = await supabaseClient
            .from('stats_review_2025')
            .select('payment_proof_url, payment_status')
            .eq('id', userData.id)
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            const record = data[0];
            // Update session storage
            userData.payment_proof_url = record.payment_proof_url;
            userData.payment_status = record.payment_status;
            sessionStorage.setItem('user', JSON.stringify(userData));

            // Update UI
            const uploadArea = document.getElementById('uploadArea');
            const previewImage = document.getElementById('previewImage');
            const removeButton = document.getElementById('removeImage');
            const submitButton = document.querySelector('.submit-btn');

            if (record.payment_proof_url) {
                previewImage.src = record.payment_proof_url;
                uploadArea.classList.add('has-preview');
                removeButton.style.display = 'flex';
                submitButton.disabled = true;

                // Update payment status
                updatePaymentStatus(record.payment_status);
            }
        }
    } catch (error) {
        console.error('Error checking payment proof:', error);
        showError('حدث خطأ أثناء تحميل إثبات الدفع');
    }
}

function updatePaymentStatus(status) {
    const statusElement = document.getElementById('paymentStatus');
    const statusMap = {
        'pending': {
            icon: 'fa-clock',
            text: 'قيد الانتظار',
            class: 'pending'
        },
        'under_review': {
            icon: 'fa-spinner',
            text: 'قيد المراجعة',
            class: 'under-review'
        },
        'accepted': {
            icon: 'fa-check-circle',
            text: 'تم القبول',
            class: 'accepted'
        }
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    statusElement.innerHTML = `
        <i class="fas ${statusInfo.icon}"></i>
        <span>${statusInfo.text}</span>
    `;
    statusElement.className = `payment-status ${statusInfo.class}`;
}

function showError(message) {
    const errorElement = document.querySelector('.error-message');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => errorElement.classList.remove('show'), 5000);
}

function showSuccess(message) {
    const successElement = document.querySelector('.success-message');
    successElement.textContent = message;
    successElement.classList.add('show');
    setTimeout(() => successElement.classList.remove('show'), 5000);
}

function getSchoolTypeText(type) {
    const types = {
        'azhar': 'ثانوي أزهري',
        'general_arts': 'ثانوي عام/أدبي'
    };
    return types[type] || type;
}

function getAttendanceTypeText(type) {
    const types = {
        'zoom': 'Zoom',
        'offline': 'حضوري'
    };
    return types[type] || type;
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('user');
        window.location.href = '/pages/signin.html';
    });
}

async function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.innerHTML = `
            <div class="confirm-dialog-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <div class="confirm-dialog-buttons">
                    <button class="confirm-btn">نعم</button>
                    <button class="cancel-btn">لا</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);

        const confirmBtn = dialog.querySelector('.confirm-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => {
            resolve(true);
            dialog.remove();
        });

        cancelBtn.addEventListener('click', () => {
            resolve(false);
            dialog.remove();
        });
    });
} 