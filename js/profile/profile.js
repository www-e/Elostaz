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

    // NEW: Initialize the new "View Image" button and its modal functionality
    initializeModalButton();

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
        // Prevent click if target is a button inside the area
        if (e.target.closest('button')) return;
        fileInput.click();
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

    // Check for existing payment proof (This is also called on DOMContentLoaded, can be reviewed for optimization later)
    checkExistingPaymentProof();
}

// NEW: This function sets up the "View Image" button to open the Bootstrap modal.
function initializeModalButton() {
    const viewImageBtn = document.getElementById('viewImageBtn');
    if (!viewImageBtn) return;
    const previewImage = document.getElementById('previewImage');
    const modalImage = document.getElementById('modalImage');
    const imageModal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));

    viewImageBtn.addEventListener('click', () => {
        if (previewImage.src && previewImage.src !== window.location.href) {
            modalImage.src = previewImage.src;
            imageModal.show();
        }
    });
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
        
        if (!file.type.startsWith('image/')) {
            showError('يرجى اختيار صورة صالحة');
            return;
        }

        // Allow larger images before compression
        if (file.size > 10 * 1024 * 1024) {
            showError('حجم الصورة يجب أن يكون أقل من 10 ميجابايت');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('previewImage');
            document.getElementById('uploadArea').classList.add('has-preview');
            document.getElementById('removeImage').style.display = 'block';
            document.querySelector('.submit-btn').disabled = false;
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    const fileInput = document.getElementById('paymentProof');
    const submitButton = e.target.querySelector('.submit-btn');
    let file = fileInput.files[0];

    if (!file) {
        showError('يرجى اختيار صورة');
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (userData.payment_proof_url) {
        const confirmReupload = await showConfirmDialog(
            'تأكيد إعادة الرفع',
            'لديك بالفعل إثبات دفع مرفوع. هل تريد استبدال الصورة الحالية بصورة جديدة؟'
        );
        if (!confirmReupload) {
            return;
        }
        
        try {
            const oldFilePath = new URL(userData.payment_proof_url).pathname.split('/statisticsrevision/')[1];
            const supabaseClient = await supabase();
            await supabaseClient.storage.from('statisticsrevision').remove([oldFilePath]);
        } catch (error) {
            console.error('Error deleting old file:', error);
        }
    }

    submitButton.disabled = true;
    submitButton.classList.add('loading');
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري ضغط الصورة...';
    
    // NEW: Client-side image compression
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.7
    };

    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Image compressed from ${(file.size / 1024 / 1024).toFixed(2)} MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
        file = compressedFile;
    } catch (compressionError) {
        console.error('Image compression failed:', compressionError);
        showError('حدث خطأ أثناء ضغط الصورة. سيتم رفع الصورة الأصلية.');
    }
    // End of compression logic

    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الرفع...';

    try {
        const studentCode = `std-${userData.id.substring(0, 8)}`;
        const fileExtension = file.name ? file.name.split('.').pop() : 'jpg';
        const fileName = `payment_proofs/${studentCode}-${Date.now()}.${fileExtension}`;
        const supabaseClient = await supabase();

        const { error: uploadError } = await supabaseClient.storage
            .from('statisticsrevision')
            .upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabaseClient.storage
            .from('statisticsrevision')
            .getPublicUrl(fileName);
        const publicUrl = urlData.publicUrl;

        // Using original retry logic as provided
        let updateError;
        for (let i = 0; i < 3; i++) {
            const { data: records, error: fetchError } = await supabaseClient
                .from('stats_review_2025').select('id').eq('id', userData.id).limit(1);
            if (fetchError || !records || records.length === 0) continue;

            const { data: updateData, error: err } = await supabaseClient
                .from('stats_review_2025')
                .update({ payment_proof_url: publicUrl, payment_status: 'under_review' })
                .eq('id', userData.id)
                .select();
            if (!err && updateData && updateData.length > 0) {
                updateError = null;
                break;
            }
            updateError = err;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (updateError) throw updateError;

        userData.payment_proof_url = publicUrl;
        userData.payment_status = 'under_review';
        sessionStorage.setItem('user', JSON.stringify(userData));

        document.getElementById('previewImage').src = publicUrl + '?t=' + new Date().getTime();
        document.getElementById('uploadArea').classList.add('has-preview');
        document.getElementById('removeImage').style.display = 'block';
        document.getElementById('viewImageBtn').style.display = 'inline-flex'; // Show view button
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
    
    fileInput.value = '';
    previewImage.src = '';
    uploadArea.classList.remove('has-preview');
    document.getElementById('removeImage').style.display = 'none';
    document.getElementById('viewImageBtn').style.display = 'none'; // Hide view button
    document.querySelector('.submit-btn').disabled = true;
}

async function checkExistingPaymentProof() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('user'));
        if (!userData || !userData.id) return;

        const supabaseClient = await supabase();
        const { data, error } = await supabaseClient
            .from('stats_review_2025')
            .select('payment_proof_url, payment_status')
            .eq('id', userData.id)
            .single(); // Use single() for better error handling if row is missing

        if (error) {
             // Silently fail if user not found, e.g., after DB reset
            if (error.code !== 'PGRST116') { // PGRST116: "exact one row not found"
                 throw error;
            }
            return;
        }

        if (data && data.payment_proof_url) {
            userData.payment_proof_url = data.payment_proof_url;
            userData.payment_status = data.payment_status;
            sessionStorage.setItem('user', JSON.stringify(userData));
            
            document.getElementById('previewImage').src = data.payment_proof_url + '?t=' + new Date().getTime();
            document.getElementById('uploadArea').classList.add('has-preview');
            document.getElementById('removeImage').style.display = 'block';
            document.getElementById('viewImageBtn').style.display = 'inline-flex'; // Show view button
            document.querySelector('.submit-btn').disabled = true;

            updatePaymentStatus(data.payment_status);
        }
    } catch (error) {
        console.error('Error checking payment proof:', error);
        // Do not show an error to the user for this background check
    }
}

function updatePaymentStatus(status) {
    const statusElement = document.getElementById('paymentStatus');
    const statusMap = {
        'pending': { icon: 'fa-clock', text: 'قيد الانتظار', class: 'pending' },
        'under_review': { icon: 'fa-spinner', text: 'قيد المراجعة', class: 'under-review' },
        'accepted': { icon: 'fa-check-circle', text: 'تم القبول', class: 'accepted' }
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    statusElement.innerHTML = `<i class="fas ${statusInfo.icon}"></i> <span>${statusInfo.text}</span>`;
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
    const types = { 'azhar': 'ثانوي أزهري', 'general_arts': 'ثانوي عام/أدبي' };
    return types[type] || type;
}

function getAttendanceTypeText(type) {
    const types = { 'zoom': 'Zoom', 'offline': 'حضوري' };
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