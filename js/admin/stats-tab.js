import { supabase } from '../supabase-client.js';

let statsDataTable;

function showLoader() {
    document.getElementById('stats-loader').style.display = 'block';
    document.getElementById('studentsTable').style.display = 'none';
}

function hideLoader() {
    document.getElementById('stats-loader').style.display = 'none';
    document.getElementById('studentsTable').style.display = 'table';
}

function showPaymentProof(url) {
    const modal = new bootstrap.Modal(document.getElementById('paymentProofModal'));
    document.getElementById('proofImage').src = `${url}?t=${new Date().getTime()}`;
    modal.show();
}

async function acceptPayment(studentId) {
    try {
        const supabaseClient = await supabase();
        const { error } = await supabaseClient
            .from('stats_review_2025')
            .update({ payment_status: 'accepted' })
            .eq('id', studentId);

        if (error) throw error;
        
        window.showAlert('تم قبول الدفع بنجاح.', 'success');
        statsDataTable.ajax.reload(); // Reload table data
    } catch (error) {
        console.error('Error accepting payment:', error);
        window.showAlert('حدث خطأ أثناء قبول الدفع.', 'danger');
    }
}

// Make functions available on the window object so inline onclicks can find them
window.showPaymentProof = showPaymentProof;
window.acceptPayment = acceptPayment;

export async function init() {
    showLoader();

    statsDataTable = $('#studentsTable').DataTable({
        ajax: async function (data, callback, settings) {
            try {
                const supabaseClient = await supabase();
                const { data: students, error } = await supabaseClient
                    .from('stats_review_2025')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formattedData = students.map(student => ({
                    ...student,
                    school_type_formatted: getSchoolTypeText(student.school_type),
                    attendance_type_formatted: getAttendanceTypeText(student.attendance_type),
                    payment_status_formatted: getPaymentStatusText(student.payment_status),
                    payment_proof_cell: createPaymentProofCell(student),
                    action_buttons: createActionButtons(student)
                }));

                callback({ data: formattedData });
                hideLoader();

            } catch (error) {
                console.error('Error loading students:', error);
                window.showAlert('حدث خطأ أثناء تحميل بيانات الطلاب', 'danger');
                hideLoader();
                callback({ data: [] });
            }
        },
        columns: [
            { data: 'student_name' },
            { data: 'student_phone' },
            { data: 'parent_phone' },
            { data: 'school_type_formatted' },
            { data: 'attendance_type_formatted' },
            { data: 'payment_status_formatted' },
            { data: 'payment_proof_cell', orderable: false },
            { data: 'action_buttons', orderable: false }
        ],
        dom: 'Bfrtip',
        buttons: [
            { extend: 'excel', text: '<i class="fas fa-file-excel me-1"></i>Excel', className: 'btn-success' },
            { extend: 'print', text: '<i class="fas fa-print me-1"></i>طباعة', className: 'btn-primary' }
        ],
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/ar.json' },
        order: [[5, 'asc']],
        pageLength: 25,
        responsive: true,
        columnDefs: [ { targets: '_all', className: 'align-middle text-center' } ]
    });
}

// Helper functions for formatting data in the table
function createPaymentProofCell(student) {
    if (student.payment_proof_url) {
        return `<button class="btn btn-info btn-sm" onclick="showPaymentProof('${student.payment_proof_url}')">
                    <i class="fas fa-image"></i> عرض
                </button>`;
    }
    return 'لا يوجد';
}

function getPaymentStatusText(status) {
    const statusMap = {
        'pending': '<span class="status-badge pending"><i class="fas fa-clock"></i> في انتظار الدفع</span>',
        'under_review': '<span class="status-badge under_review"><i class="fas fa-spinner"></i> قيد المراجعة</span>',
        'accepted': '<span class="status-badge accepted"><i class="fas fa-check-circle"></i> تم القبول</span>'
    };
    return statusMap[status] || statusMap.pending;
}

function createActionButtons(student) {
    if (student.payment_status === 'under_review') {
        return `<button class="action-btn accept" onclick="acceptPayment('${student.id}')">
                    <i class="fas fa-check"></i> قبول
                </button>`;
    }
    return 'لا يوجد إجراء';
}

function getSchoolTypeText(type) {
    const types = { 'azhar': 'أزهري', 'general_arts': 'عام - أدبي' };
    return types[type] || type;
}

function getAttendanceTypeText(type) {
    const types = { 'zoom': 'Zoom', 'offline': 'حضوري' };
    return types[type] || type;
}