import { supabase } from '../supabase-client.js';

let registrationsDataTable;
let gradeFilter, groupFilter, searchInput;
let editModal; // Declared here, but assigned in init
let editForm, editStudentIdInput, editStudentNameInput, editStudentPhoneInput, editParentPhoneInput, editGradeInput, editSectionInput, editSectionContainer;
let searchTimeout;

const gradeMap = { first: 'الصف الأول', second: 'الصف الثاني', third: 'الصف الثالث' };
const sectionMap = { general: 'علمي رياضة', statistics: 'إحصاء (أدبي)', science: 'علمي', arts: 'أدبي' };
const groupMap = { sat_tue: 'سبت وثلاثاء', sun_wed: 'أحد وأربعاء', mon_thu: 'اثنين وخميس', sat_tue_thu: 'سبت وثلاثاء وخميس', sun_wed_fri: 'أحد وأربعاء وجمعة' };

function formatTime12HourArabic(timeString) {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    let H = parseInt(hours, 10);
    const M = minutes;
    const period = H >= 12 ? 'م' : 'ص';
    H = H % 12 || 12;
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const formatNumber = n => n.toString().split('').map(digit => arabicNumbers[digit]).join('');
    return `${formatNumber(H)}:${formatNumber(M)} ${period}`;
}

function showLoader() {
    document.getElementById('registrations-loader').style.display = 'block';
    const tableWrapper = document.getElementById('registrationsTable_wrapper');
    if (tableWrapper) {
        tableWrapper.style.display = 'none';
    }
}

function hideLoader() {
    document.getElementById('registrations-loader').style.display = 'none';
    const tableWrapper = document.getElementById('registrationsTable_wrapper');
    if (tableWrapper) {
        tableWrapper.style.display = 'block';
    }
}

async function fetchRegistrations() {
    showLoader();
    try {
        const supabaseClient = await supabase();
        let query = supabaseClient.from('registrations_2025_2026').select('*');
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
            section_formatted: student.section ? (sectionMap[student.section] || student.section) : '—',
            group_formatted: groupMap[student.days_group] || student.days_group,
            time_slot_formatted: formatTime12HourArabic(student.time_slot),
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
    
    if (studentData.grade === 'second' || studentData.grade === 'third') {
        editSectionContainer.style.display = 'block';
        editSectionInput.value = studentData.section || "";
    } else {
        editSectionContainer.style.display = 'none';
        editSectionInput.value = '';
    }
    editModal.show();
}

async function handleSaveChanges(e) {
    e.preventDefault();
    const saveButton = document.getElementById('saveStudentChangesBtn');
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
        const { error } = await supabaseClient.from('registrations_2025_2026').update(updatedData).eq('id', studentId);
        if (error) throw error;
        window.showAlert('تم تحديث بيانات الطالب بنجاح.', 'success');
        editModal.hide();
        fetchRegistrations();
    } catch (error) {
        console.error("Error updating student data:", error);
        window.showAlert('فشل تحديث البيانات. حاول مرة أخرى.', 'danger');
    } finally {
        saveButton.disabled = false;
        saveButton.innerHTML = 'حفظ التغييرات';
    }
}

function updateFilteredCount() {
    const count = registrationsDataTable.rows({ search: 'applied' }).count();
    document.getElementById('filteredCount').textContent = count;
}

export function init(modalInstance) {
    editModal = modalInstance; // Assign the passed-in modal

    gradeFilter = document.getElementById('gradeFilter');
    groupFilter = document.getElementById('groupFilter');
    searchInput = document.getElementById('registrationSearch');
    editForm = document.getElementById('editStudentForm');
    editStudentIdInput = document.getElementById('editStudentId');
    editStudentNameInput = document.getElementById('editStudentName');
    editStudentPhoneInput = document.getElementById('editStudentPhone');
    editParentPhoneInput = document.getElementById('editParentPhone');
    editGradeInput = document.getElementById('editGrade');
    editSectionInput = document.getElementById('editSection');
    editSectionContainer = document.getElementById('editSectionContainer');

    registrationsDataTable = $('#registrationsTable').DataTable({
        data: [],
        columns: [
            {
                searchable: false,
                orderable: false,
                data: null, 
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: 'student_name' },
            { data: 'student_phone' },
            { data: 'parent_phone' },
            { data: 'grade_formatted' },
            { data: 'section_formatted' },
            { data: 'group_formatted' },
            { data: 'time_slot_formatted' },
            { data: 'action_button', orderable: false, className: 'no-print' }
        ],
        dom: 'Bfrtip',
        buttons: [
             { extend: 'excel', text: '<i class="fas fa-file-excel me-1"></i>Excel', className: 'btn-success', exportOptions: { columns: ':visible:not(.no-print)' }},
             { extend: 'print', text: '<i class="fas fa-print me-1"></i>طباعة', className: 'btn-primary', exportOptions: { columns: ':visible:not(.no-print)' }}
        ],
        language: { url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/ar.json' },
        pageLength: 25,
        responsive: true,
        searching: false,
        pagingType: 'simple_numbers',
        columnDefs: [ { targets: '_all', className: 'align-middle text-center' } ]
    });

    searchInput.addEventListener('keyup', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(fetchRegistrations, 300);
    });
    
    [gradeFilter, groupFilter].forEach(el => el.addEventListener('change', fetchRegistrations));
    editForm.addEventListener('submit', handleSaveChanges);
    registrationsDataTable.on('draw.dt', updateFilteredCount);

    $('#registrationsTable tbody').on('click', '.edit', function () {
        const studentId = $(this).data('id');
        const studentData = registrationsDataTable.rows().data().toArray().find(s => s.id === studentId);
        if (studentData) {
            openEditModal(studentData);
        }
    });

    fetchRegistrations();
}