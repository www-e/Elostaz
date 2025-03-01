/**
 * Admin Dashboard JavaScript
 * Handles admin authentication, student management, and dashboard functionality
 */

import Database from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminDashboardSection = document.getElementById('adminDashboardSection');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminPassword = document.getElementById('adminPassword');
    const studentsTableBody = document.getElementById('studentsTableBody');
    const noStudentsMessage = document.getElementById('noStudentsMessage');
    const addStudentForm = document.getElementById('addStudentForm');
    const csvImportForm = document.getElementById('csvImportForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const studentSearch = document.getElementById('studentSearch');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminLogoutBtn = document.querySelector('.admin-logout-btn');
    const gradeFilters = document.querySelectorAll('.grade-filter');
    const importResults = document.getElementById('importResults');
    const importSummary = document.getElementById('importSummary');
    const importErrors = document.getElementById('importErrors');
    const errorsList = document.getElementById('errorsList');

    // Edit Student Modal Elements
    const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    const editModal = editStudentModal;
    const editStudentForm = document.getElementById('editStudentForm');
    const editStudentId = document.getElementById('editStudentId');
    const editStudentName = document.getElementById('editStudentName');
    const editStudentGrade = document.getElementById('editStudentGrade');
    const editStudentGroup = document.getElementById('editStudentGroup');
    const editStudentPassword = document.getElementById('editStudentPassword');
    const saveEditButton = document.getElementById('saveEditButton');

    // Delete Confirmation Modal Elements
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const deleteStudentName = document.getElementById('deleteStudentName');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    let studentToDelete = null;

    // Alert Modal Elements
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    const alertModalTitle = document.getElementById('alertModalTitle');
    const alertModalMessage = document.getElementById('alertModalMessage');

    // Current filter state
    let currentGradeFilter = 'all';

    // Variables for edit and delete operations
    let currentEditingId = null;
    let currentDeletingId = null;

    // Check if admin is already logged in (for demo purposes)
    let isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    updateUIBasedOnAuthStatus();

    // Event Listeners
    adminLoginForm.addEventListener('submit', handleAdminLogin);
    addStudentForm.addEventListener('submit', handleAddStudent);
    csvImportForm.addEventListener('submit', handleCsvImport);
    changePasswordForm.addEventListener('submit', handleChangePassword);
    studentSearch.addEventListener('input', handleStudentSearch);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Add event listeners for edit and delete buttons
    saveEditButton.addEventListener('click', handleSaveEdit);
    confirmDeleteButton.addEventListener('click', handleConfirmDelete);
    
    // Add event listeners to grade filters
    gradeFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Update active class
            gradeFilters.forEach(btn => btn.classList.remove('active'));
            filter.classList.add('active');
            
            // Update current filter
            currentGradeFilter = filter.dataset.grade;
            
            // Apply filter
            applyFilters();
        });
    });

    // Initialize the dashboard if admin is logged in
    if (isAdminLoggedIn) {
        loadStudentsTable();
    }

    // Admin Login Handler
    async function handleAdminLogin(e) {
        e.preventDefault();
        
        const password = adminPassword.value.trim();
        
        if (!password) {
            showValidationError(adminPassword, 'يرجى إدخال كلمة المرور');
            return;
        }
        
        try {
            // Show loading state
            const submitButton = adminLoginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
            submitButton.disabled = true;
            
            // Check if we're using Firebase
            const isUsingFirebase = localStorage.getItem('useFirebase') === 'true';
            console.log('Admin login: Using Firebase storage:', isUsingFirebase);
            
            // Attempt login
            console.log('Attempting admin login');
            const result = await Database.auth.adminLogin(password);
            
            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
            
            if (result.success) {
                console.log('Admin login successful');
                isAdminLoggedIn = true;
                localStorage.setItem('sms_admin_logged_in', 'true');
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                // Store login timestamp
                localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                
                updateUIBasedOnAuthStatus();
                loadStudentsTable();
            } else {
                console.error('Admin login failed:', result);
                
                // Check for specific error types
                if (isUsingFirebase && result.details && result.details.includes('Firestore error')) {
                    // Firebase connection error
                    showAlert('خطأ في الاتصال', 'فشل الاتصال بقاعدة البيانات. تأكد من اتصالك بالإنترنت وعدم وجود مانع للإعلانات.', 'danger');
                    
                    // Check for ad blockers
                    if (typeof FirebaseDatabase !== 'undefined') {
                        FirebaseDatabase.detectConnectionIssues();
                    }
                } else {
                    // Standard authentication error
                    showValidationError(adminPassword, result.error || 'كلمة المرور غير صحيحة');
                }
            }
        } catch (error) {
            console.error('Unexpected error during admin login:', error);
            showAlert('خطأ غير متوقع', 'حدث خطأ أثناء محاولة تسجيل الدخول. يرجى المحاولة مرة أخرى لاحقًا.', 'danger');
        }
    }

    // Add Student Handler
    function handleAddStudent(e) {
        e.preventDefault();
        
        // Get form values
        const id = document.getElementById('studentId').value.trim();
        const password = document.getElementById('studentPassword').value.trim();
        const name = document.getElementById('studentNameInput').value.trim();
        const grade = document.getElementById('studentGrade').value;
        const group = document.getElementById('studentGroup').value;
        
        // Validate inputs
        let isValid = true;
        
        if (!id) {
            showValidationError(document.getElementById('studentId'), 'يرجى إدخال معرف الطالب');
            isValid = false;
        }
        
        if (!password) {
            showValidationError(document.getElementById('studentPassword'), 'يرجى إدخال كلمة المرور');
            isValid = false;
        }
        
        if (!name) {
            showValidationError(document.getElementById('studentNameInput'), 'يرجى إدخال اسم الطالب');
            isValid = false;
        }
        
        if (!grade) {
            showValidationError(document.getElementById('studentGrade'), 'يرجى اختيار الصف الدراسي');
            isValid = false;
        }
        
        if (!group) {
            showValidationError(document.getElementById('studentGroup'), 'يرجى اختيار المجموعة');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Create student object
        const student = {
            id,
            password,
            name,
            grade,
            group,
            createdAt: new Date().toISOString()
        };
        
        // Add student to database
        const result = Database.users.add(student);
        
        if (result.success) {
            showAlert('تم بنجاح', 'تم إضافة الطالب بنجاح');
            addStudentForm.reset();
            loadStudentsTable();
            
            // Switch to students tab
            const studentsTab = document.getElementById('students-tab');
            if (studentsTab) {
                // Bootstrap 5 way of showing a tab
                const tabEl = new bootstrap.Tab(studentsTab);
                tabEl.show();
            }
        } else {
            showAlert('خطأ', result.message);
        }
    }
    
    // CSV Import Handler
    function handleCsvImport(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        
        if (!file) {
            showValidationError(fileInput, 'يرجى اختيار ملف CSV');
            return;
        }
        
        // Check file type
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            showValidationError(fileInput, 'يرجى اختيار ملف بتنسيق CSV');
            return;
        }
        
        // Read file
        const reader = new FileReader();
        reader.onload = function(event) {
            const csvData = event.target.result;
            const students = parseCSV(csvData);
            
            if (students.length === 0) {
                showAlert('خطأ', 'لم يتم العثور على بيانات صالحة في الملف');
                return;
            }
            
            // Import students
            const result = Database.users.addBulk(students);
            
            // Show import results
            importSummary.textContent = `تم استيراد ${result.successCount} طالب بنجاح. ${result.errorCount} طالب لم يتم استيرادهم.`;
            
            if (result.errorCount > 0) {
                errorsList.innerHTML = result.errors.map(error => 
                    `<li>معرف الطالب ${error.id}: ${error.message}</li>`
                ).join('');
                importErrors.style.display = 'block';
            } else {
                importErrors.style.display = 'none';
            }
            
            importResults.style.display = 'block';
            csvImportForm.reset();
            
            // Reload students table
            loadStudentsTable();
        };
        
        reader.readAsText(file);
    }
    
    // Parse CSV data
    function parseCSV(csvData) {
        const lines = csvData.split(/\r\n|\n/);
        const students = [];
        
        for (let i = 0; i < lines.length; i++) {
            // Skip empty lines
            if (lines[i].trim() === '') continue;
            
            // Parse CSV line
            const values = lines[i].split(',');
            
            // Ensure we have all required fields
            if (values.length >= 5) {
                const student = {
                    id: values[0].trim(),
                    name: values[1].trim(),
                    grade: values[2].trim(),
                    group: values[3].trim(),
                    password: values[4].trim()
                };
                
                // Validate required fields
                if (student.id && student.name && student.grade && student.group && student.password) {
                    students.push(student);
                }
            }
        }
        
        return students;
    }

    // Change Admin Password Handler
    function handleChangePassword(e) {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Validate inputs
        let isValid = true;
        
        if (!currentPassword) {
            showValidationError(document.getElementById('currentPassword'), 'يرجى إدخال كلمة المرور الحالية');
            isValid = false;
        }
        
        if (!newPassword) {
            showValidationError(document.getElementById('newPassword'), 'يرجى إدخال كلمة المرور الجديدة');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showValidationError(document.getElementById('confirmPassword'), 'يرجى تأكيد كلمة المرور الجديدة');
            isValid = false;
        }
        
        if (newPassword !== confirmPassword) {
            showValidationError(document.getElementById('confirmPassword'), 'كلمات المرور غير متطابقة');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Verify current password
        const loginResult = Database.auth.adminLogin(currentPassword);
        
        if (!loginResult.success) {
            showValidationError(document.getElementById('currentPassword'), 'كلمة المرور الحالية غير صحيحة');
            return;
        }
        
        // Change password
        Database.auth.changeAdminPassword(newPassword);
        showAlert('تم بنجاح', 'تم تغيير كلمة المرور بنجاح');
        changePasswordForm.reset();
    }

    // Student Search and Filter Handler
    function handleStudentSearch() {
        applyFilters();
    }
    
    // Apply all filters (search and grade)
    function applyFilters() {
        const searchTerm = studentSearch.value.trim().toLowerCase();
        let students = Database.users.getAll();
        
        // Apply grade filter
        if (currentGradeFilter !== 'all') {
            students = students.filter(student => student.grade === currentGradeFilter);
        }
        
        // Apply search filter
        if (searchTerm) {
            students = students.filter(student => 
                student.id.toLowerCase().includes(searchTerm) || 
                student.name.toLowerCase().includes(searchTerm)
            );
        }
        
        renderStudentsTable(students);
    }

    // Initialize edit modal
    function initEditModal(studentId) {
        currentEditingId = studentId;
        const student = Database.users.getById(studentId);
        
        if (student) {
            document.getElementById('editStudentId').value = student.id;
            document.getElementById('editStudentName').value = student.name;
            document.getElementById('editStudentGrade').value = student.grade;
            document.getElementById('editStudentGroup').value = student.group;
            
            // Show the modal
            editModal.show();
        } else {
            showAlert('خطأ', 'لم يتم العثور على الطالب', 'danger');
        }
    }

    // Handle save edit
    function handleSaveEdit() {
        if (!currentEditingId) return;
        
        const id = document.getElementById('editStudentId').value;
        const name = document.getElementById('editStudentName').value;
        const grade = document.getElementById('editStudentGrade').value;
        const group = document.getElementById('editStudentGroup').value;
        
        // Validate inputs
        if (!name || !grade || !group) {
            showAlert('خطأ', 'جميع الحقول مطلوبة', 'danger');
            return;
        }
        
        // Update user
        const updatedUser = {
            id,
            name,
            grade,
            group
        };
        
        try {
            Database.users.update(currentEditingId, updatedUser);
            
            // Close the modal
            editModal.hide();
            
            // Reload the table
            loadStudentsTable();
            
            showAlert('تم', 'تم تحديث بيانات الطالب بنجاح', 'success');
        } catch (error) {
            showAlert('خطأ', error.message, 'danger');
        }
    }

    // Initialize delete modal
    function initDeleteModal(studentId) {
        currentDeletingId = studentId;
        const student = Database.users.getById(studentId);
        
        if (student) {
            document.getElementById('deleteStudentName').textContent = student.name;
            
            // Show the modal
            deleteConfirmModal.show();
        } else {
            showAlert('خطأ', 'لم يتم العثور على الطالب', 'danger');
        }
    }

    // Handle confirm delete
    function handleConfirmDelete() {
        if (!currentDeletingId) return;
        
        try {
            Database.users.delete(currentDeletingId);
            
            // Close the modal
            deleteConfirmModal.hide();
            
            // Reload the table
            loadStudentsTable();
            
            showAlert('تم', 'تم حذف الطالب بنجاح', 'success');
        } catch (error) {
            showAlert('خطأ', error.message, 'danger');
        }
    }

    // Logout Handler
    async function handleLogout(e) {
        e.preventDefault();
        
        try {
            console.log('Admin logout: Attempting to log out');
            
            // Call the database logout function
            if (typeof Database.auth.logout === 'function') {
                await Database.auth.logout();
                console.log('Admin logout: Database logout function called');
            }
            
            // Clear all admin session data
            isAdminLoggedIn = false;
            localStorage.removeItem('sms_admin_logged_in');
            localStorage.removeItem('sms_admin_login_time');
            sessionStorage.removeItem('adminLoggedIn');
            
            console.log('Admin logout: Session data cleared');
            
            // Update UI
            updateUIBasedOnAuthStatus();
            
            // Redirect to login page if needed
            if (adminLoginSection && adminDashboardSection) {
                adminDashboardSection.style.display = 'none';
                adminLoginSection.style.display = 'block';
            }
            
            // Show success message
            showAlert('تم تسجيل الخروج', 'تم تسجيل الخروج بنجاح', 'success');
        } catch (error) {
            console.error('Error during admin logout:', error);
            
            // Ensure logout happens even if there's an error
            isAdminLoggedIn = false;
            localStorage.removeItem('sms_admin_logged_in');
            localStorage.removeItem('sms_admin_login_time');
            sessionStorage.removeItem('adminLoggedIn');
            updateUIBasedOnAuthStatus();
        }
    }

    // Load Students Table
    function loadStudentsTable() {
        const students = Database.users.getAll();
        renderStudentsTable(students);
    }

    // Render Students Table
    function renderStudentsTable(students) {
        const tableBody = document.getElementById('studentsTableBody');
        tableBody.innerHTML = '';
        
        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">لا يوجد طلاب</td>
                </tr>
            `;
            return;
        }
        
        // Sort students by creation timestamp (newest first)
        students.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
        });
        
        students.forEach(student => {
            const row = document.createElement('tr');
            
            // Format the timestamp if it exists
            let formattedDate = 'غير متوفر';
            if (student.createdAt) {
                const date = new Date(student.createdAt);
                formattedDate = `${date.toLocaleDateString('ar-EG')} ${date.toLocaleTimeString('ar-EG')}`;
            }
            
            row.innerHTML = `
                <td>${student.index || 'غير متوفر'}</td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.grade}</td>
                <td>${student.group}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-btn" data-id="${student.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                initEditModal(btn.dataset.id);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                initDeleteModal(btn.dataset.id);
            });
        });
    }

    // Update UI Based on Auth Status
    function updateUIBasedOnAuthStatus() {
        // Check multiple sources for admin login status
        const isLoggedInLocalStorage = localStorage.getItem('sms_admin_logged_in') === 'true';
        const isLoggedInSessionStorage = sessionStorage.getItem('adminLoggedIn') === 'true';
        
        // Update the global variable
        isAdminLoggedIn = isLoggedInLocalStorage || isLoggedInSessionStorage;
        
        console.log('Admin auth status check:', {
            isAdminLoggedIn,
            isLoggedInLocalStorage,
            isLoggedInSessionStorage
        });
        
        // Check if the admin is actually logged in via the Database API
        if (typeof Database.auth.isAdmin === 'function') {
            try {
                const isAdminViaAPI = Database.auth.isAdmin();
                console.log('Admin status via API:', isAdminViaAPI);
                
                // If there's a mismatch between localStorage and the API, trust the API
                if (isAdminLoggedIn !== isAdminViaAPI) {
                    console.warn('Admin login status mismatch between localStorage and API');
                    isAdminLoggedIn = isAdminViaAPI;
                    
                    // Update localStorage to match the API status
                    if (isAdminViaAPI) {
                        localStorage.setItem('sms_admin_logged_in', 'true');
                        sessionStorage.setItem('adminLoggedIn', 'true');
                    } else {
                        localStorage.removeItem('sms_admin_logged_in');
                        sessionStorage.removeItem('adminLoggedIn');
                    }
                }
            } catch (error) {
                console.error('Error checking admin status via API:', error);
            }
        }
        
        // Update UI based on login status
        if (isAdminLoggedIn) {
            adminLoginSection.style.display = 'none';
            adminDashboardSection.style.display = 'block';
            adminLogoutBtn.style.display = 'block';
            
            // Load data if needed
            if (studentsTableBody && studentsTableBody.children.length === 0) {
                loadStudentsTable();
            }
        } else {
            adminLoginSection.style.display = 'block';
            adminDashboardSection.style.display = 'none';
            adminLogoutBtn.style.display = 'none';
            
            // Clear any sensitive data from the UI
            if (studentsTableBody) {
                studentsTableBody.innerHTML = '';
            }
        }
    }

    // Show Validation Error
    function showValidationError(inputElement, message) {
        // Find validation message element
        const validationMessage = inputElement.nextElementSibling;
        
        if (validationMessage && validationMessage.classList.contains('validation-message')) {
            validationMessage.textContent = message;
            validationMessage.style.display = 'block';
            
            // Clear error message after 3 seconds
            setTimeout(() => {
                validationMessage.textContent = '';
                validationMessage.style.display = 'none';
            }, 3000);
        }
    }

    // Show Alert Modal
    function showAlert(title, message, type = 'success') {
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        
        // Get the modal element
        const modalElement = document.getElementById('alertModal');
        
        // Remove existing alert classes and add the new one
        modalElement.classList.remove('alert-success', 'alert-danger');
        modalElement.classList.add(`alert-${type}`);
        
        // Show the modal using the Bootstrap modal instance
        alertModal.show();
    }
});
