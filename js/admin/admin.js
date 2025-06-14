import { supabase } from '../supabase-client.js';

// Initialize payment proof modal function
function showPaymentProof(url) {
    const modal = new bootstrap.Modal(document.getElementById('paymentProofModal'));
    document.getElementById('proofImage').src = url;
    modal.show();
}

document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is admin
    const userData = JSON.parse(sessionStorage.getItem('user'));
    if (!userData || userData.id !== '4dba45ee-33a6-41cd-b0da-af7c1f7d9870') {
        window.location.href = '/pages/signin.html';
        return;
    }

    // Initialize DataTable
    const table = $('#studentsTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel ms-2"></i>تصدير Excel',
                className: 'btn btn-success',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                }
            },
            {
                extend: 'print',
                text: '<i class="fas fa-print ms-2"></i>طباعة',
                className: 'btn btn-primary',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5]
                }
            }
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/ar.json'
        },
        order: [[5, 'asc']], // Sort by payment status
        pageLength: 25,
        responsive: true,
        columnDefs: [
            {
                targets: '_all',
                className: 'align-middle text-center'
            },
            {
                targets: [6, 7], // Payment proof and actions columns
                orderable: false
            }
        ]
    });

    // Initialize Supabase client
    const supabaseClient = await supabase();

    // Make functions available globally
    window.showPaymentProof = showPaymentProof;
    window.acceptPayment = acceptPayment;

    // Load data
    loadStudents(supabaseClient);

    // Initialize logout handler
    initializeLogout();
});

async function loadStudents(supabaseClient) {
    try {
        const { data: students, error } = await supabaseClient
            .from('stats_review_2025')
            .select('*')
            .order('payment_status', { ascending: false });

        if (error) throw error;

        const table = $('#studentsTable').DataTable();
        table.clear();

        students.forEach(student => {
            table.row.add([
                student.student_name,
                student.student_phone,
                student.parent_phone,
                getSchoolTypeText(student.school_type),
                getAttendanceTypeText(student.attendance_type),
                getPaymentStatusText(student.payment_status),
                createPaymentProofCell(student),
                createActionButtons(student)
            ]);
        });

        table.draw();
    } catch (error) {
        console.error('Error loading students:', error);
        showError('حدث خطأ أثناء تحميل بيانات الطلاب');
    }
}

function createPaymentProofCell(student) {
    if (student.payment_proof_url) {
        return `
            <button class="btn btn-info btn-sm" onclick="showPaymentProof('${student.payment_proof_url}')">
                <i class="fas fa-image"></i>
                عرض الإثبات
            </button>
        `;
    }
    return 'لا يوجد';
}

function getPaymentStatusText(status) {
    const statusMap = {
        'pending': '<span class="badge bg-warning">في انتظار الدفع</span>',
        'under_review': '<span class="badge bg-info">قيد المراجعة</span>',
        'accepted': '<span class="badge bg-success">تم القبول</span>'
    };
    return statusMap[status] || statusMap.pending;
}

function createActionButtons(student) {
    if (student.payment_status === 'under_review') {
        return `
            <button class="action-btn accept" onclick="acceptPayment('${student.id}')">
                <i class="fas fa-check"></i>
                قبول الدفع
            </button>
        `;
    }
    return 'لا يوجد';
}

async function acceptPayment(studentId) {
    try {
        const supabaseClient = await supabase();
        
        // Get student data first
        const { data: student, error: fetchError } = await supabaseClient
            .from('stats_review_2025')
            .select('*')
            .eq('id', studentId)
            .single();

        if (fetchError) throw fetchError;

        // Update payment status
        const { error: updateError } = await supabaseClient
            .from('stats_review_2025')
            .update({ 
                payment_status: 'accepted'
            })
            .eq('id', studentId);

        if (updateError) throw updateError;

        // Reload data
        loadStudents(supabaseClient);
        showSuccess('تم قبول الدفع بنجاح');

    } catch (error) {
        console.error('Error accepting payment:', error);
        showError('حدث خطأ أثناء قبول الدفع');
    }
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = '/pages/signin.html';
        });
    }
}

function showSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'alert alert-success alert-dismissible fade show';
    successElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.admin-content').insertBefore(successElement, document.querySelector('.table-container'));
    setTimeout(() => successElement.remove(), 5000);
}

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'alert alert-danger alert-dismissible fade show';
    errorElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.admin-content').insertBefore(errorElement, document.querySelector('.table-container'));
    setTimeout(() => errorElement.remove(), 5000);
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