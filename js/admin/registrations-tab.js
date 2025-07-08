import { supabase } from '../supabase-client.js';

let registrationsDataTable;
let gradeFilter, groupFilter, searchInput;
let editModal, editForm, editStudentIdInput, editStudentNameInput, editStudentPhoneInput, editParentPhoneInput, editGradeInput, editSectionInput, editSectionContainer;

// --- Helper Functions ---
const gradeMap = { first: 'الصف الأول', second: 'الصف الثاني', third: 'الصف الثالث' };
const sectionMap = { general: 'علمي رياضة', statistics: 'إحصاء (أدبي)', science: 'علمي', arts: 'أدبي', null: 'N/A' };
const groupMap = { sat_tue: 'سبت وثلاثاء', sun_wed: 'أحد وأربعاء', mon_thu: 'اثنين وخميس', sat_tue_thu: 'سبت وثلاثاء وخميس', sun_wed_fri: 'أحد وأربعاء وجمعة' };

function showLoader() {
    document.getElementById('registrations-loader').style.display = 'block';
    document.getElementById('registrationsTable').style.display = 'none';
}

function hideLoader() {
    document.getElementById('registrations-loader').style.display = 'none';
    document.getElementById('registrationsTable').style.display = 'table';
}

async function fetchRegistrations() {
    showLoader();
    try {
        const supabaseClient = await supabase();
        let query = supabaseClient.from('registrations_2025_2026').select('*');

        // Apply filters
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            query = query.or(`student_name.ilike.%${searchTerm}%,student_phone.like.%${searchTerm}%`);
        }
        if (gradeFilter.value) {
            query = query.eq('grade', gradeFilter.value);
        }
        if (groupFilter.value) {
            query = query.eq('days_group', groupFilter.value);
        }
        
        query = query.order('created_at', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        
        const formattedData = data.map(student => ({
            ...student,
            grade_formatted: gradeMap[student.grade] || student.grade,
            section_formatted: sectionMap[student.section] || 'لا يوجد',
            group_formatted: groupMap[student.days_group] || student.days_group,
            action_button: `<button class="btn btn-sm action-btn edit" data-id="${student.id}"><i class="fas fa-edit"></i> تعديل</button>`
        }));
        
        registrationsDataTable.clear().rows.add(formattedData).draw();
        
    } catch (error) {
        console.error("Error fetching registrations:", error);
        window.showAlert('فشل في تحميل بيانات التسجيل.', 'danger');
    } finally {
        hideLoader();
    }
}

function openEditModal(studentData) {
    editStudentIdInput.value = studentData.id;
    editStudentNameInput.value = studentData.student_name;
    editStudentPhoneInput.value = studentData.student_phone;
    editParentPhoneInput.value = studentData.parent_phone;
    editGradeInput.value = studentData.grade;
    
    // Show/hide section based on grade
    if (studentData.grade === 'second' || studentData.grade === 'third') {
        editSectionContainer.style.display = 'block';
        editSectionInput.value = studentData.section;
    } else {
        editSectionContainer.style.display = 'none';
        editSectionInput.value = '';
    }

    editModal.show();
}

async function handleSaveChanges(e) {
    e.preventDefault();
    const saveButton = e.target.querySelector('#saveStudentChangesBtn');
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جار الحفظ...';

    const studentId = editStudentIdInput.value;
    const updatedData = {
        student_name: editStudentNameInput.value,
        student_phone: editStudentPhoneInput.value,
        parent_phone: editParentPhoneInput.value,
    };

    try {
        const supabaseClient = await supabase();
        const { error } = await supabaseClient
            .from('registrations_2025_2026')
            .update(updatedData)
            .eq('id', studentId);
        
        if (error) throw error;
        
        window.showAlert('تم تحديث بيانات الطالب بنجاح.', 'success');
        editModal.hide();
        fetchRegistrations(); // Refresh the table data
        
    } catch (error) {
        console.error("Error updating student data:", error);
        window.showAlert('فشل تحديث البيانات. حاول مرة أخرى.', 'danger');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = 'حفظ التغييرات';
    }
}

// Main initialization function for this tab
export function init() {
    // Initialize DOM elements
    gradeFilter = document.getElementById('gradeFilter');
    groupFilter = document.getElementById('groupFilter');
    searchInput = document.getElementById('registrationSearch');

    editModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    editForm = document.getElementById('editStudentForm');
    editStudentIdInput = document.getElementById('editStudentId');
    editStudentNameInput = document.getElementById('editStudentName');
    editStudentPhoneInput = document.getElementById('editStudentPhone');
    editParentPhoneInput = document.getElementById('editParentPhone');
    editGradeInput = document.getElementById('editGrade');
    editSectionInput = document.getElementById('editSection');
    editSectionContainer = document.getElementById('editSectionContainer');

    // Initialize DataTable
    registrationsDataTable = $('#registrationsTable').DataTable({
        data: [],
        columns: [
            { data: 'student_name' },
            { data: 'student_phone' },
            { data: 'parent_phone' },
            { data: 'grade_formatted' },
            { data: 'section_formatted' },
            { data: 'group_formatted' },
            { data: 'time_slot' },
            { data: 'action_button', orderable: false }
        ],
        dom: 'Bfrtip',
        buttons: [
             { extend: 'excel', text: '<i class="fas fa-file-excel me-1"></i>Excel', className: 'btn-success' },
             { extend: 'print', text: '<i class="fas fa-print me-1"></i>طباعة', className: 'btn-primary' }
        ],
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/ar.json' },
        pageLength: 25,
        responsive: true,
        searching: false, // We use a custom search input
        columnDefs: [ { targets: '_all', className: 'align-middle text-center' } ]
    });

    // Add event listeners
    [gradeFilter, groupFilter, searchInput].forEach(el => el.addEventListener('input', fetchRegistrations));
    editForm.addEventListener('submit', handleSaveChanges);

    // Delegated event listener for edit buttons
    $('#registrationsTable tbody').on('click', '.edit-btn', function () {
        const studentId = $(this).data('id');
        const studentData = registrationsDataTable.rows().data().toArray().find(s => s.id === studentId);
        if (studentData) {
            openEditModal(studentData);
        }
    });

    // Initial data load
    fetchRegistrations();
}