/**
 * Admin Dashboard JavaScript
 * Handles admin authentication, student management, and dashboard functionality
 */

// Use the global Database object without redeclaring it
// This fixes the "Identifier 'Database' has already been declared" error

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
    // Settings page has been removed, so we need to check if changePasswordForm exists
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
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
            
            // Debug: Log existing passwords in localStorage
            console.log('Password storage check:',
                'sms_admin_password exists:', !!localStorage.getItem('sms_admin_password'),
                'admin_password exists:', !!localStorage.getItem('admin_password'), 
                'ADMIN_PASSWORD exists:', !!localStorage.getItem('ADMIN_PASSWORD')
            );
            
            // Attempt login
            console.log('Attempting admin login with Database.auth.adminLogin');
            const result = await window.Database.auth.adminLogin(password);
            
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
                
                // Additional debug check to make sure admin login is properly marked
                console.log('Admin login state after login:',
                    'localStorage sms_admin_logged_in:', localStorage.getItem('sms_admin_logged_in'),
                    'sessionStorage adminLoggedIn:', sessionStorage.getItem('adminLoggedIn')
                );
                
                updateUIBasedOnAuthStatus();
                loadStudentsTable();
            } else {
                console.error('Admin login failed:', result);
                
                // Check for specific error types
                if (result.message) {
                    showAlert('خطأ في تسجيل الدخول', result.message, 'danger');
                } else {
                    showAlert('خطأ في تسجيل الدخول', 'كلمة المرور غير صحيحة أو حدث خطأ أثناء المصادقة. حاول مرة أخرى.', 'danger');
                }
                
                // Clear password field for security
                adminPassword.value = '';
                adminPassword.focus();
            }
        } catch (error) {
            console.error('Error during admin login:', error);
            showAlert('خطأ في النظام', 'حدث خطأ غير متوقع أثناء محاولة تسجيل الدخول. حاول مرة أخرى.', 'danger');
            
            // Reset button state
            const submitButton = adminLoginForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i> تسجيل الدخول';
            submitButton.disabled = false;
            
            // Clear password field for security
            adminPassword.value = '';
            adminPassword.focus();
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
        const result = window.Database.users.add(student);
        
        if (result.success) {
            // Automatically sync with Firebase if Firebase is enabled
            if (localStorage.getItem('useFirebase') === 'true') {
                import('./firebase-database.js').then(module => {
                    const FirebaseDatabase = module.default;
                    window.FirebaseDatabase.users.add(student)
                        .then(() => {
                            console.log('Student synced with Firebase successfully');
                        })
                        .catch(error => {
                            console.error('Error syncing student with Firebase:', error);
                            showAlert('تنبيه', 'تم إضافة الطالب محليًا ولكن فشلت المزامنة مع السحابة. يرجى التحقق من اتصالك بالإنترنت.', 'warning');
                        });
                });
            }
            
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
            const result = window.Database.users.addBulk(students);
            
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
        
        // Redirect to the dedicated password update page
        window.location.href = 'update-password.html';
    }

    // Student Search and Filter Handler
    function handleStudentSearch() {
        applyFilters();
    }
    
    // Apply all filters (search and grade)
    function applyFilters() {
        const searchTerm = studentSearch.value.trim().toLowerCase();
        let students = window.Database.users.getAll();
        
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
        const student = window.Database.users.getById(studentId);
        
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
            window.Database.users.update(currentEditingId, updatedUser);
            
            // Automatically sync with Firebase if Firebase is enabled
            if (localStorage.getItem('useFirebase') === 'true') {
                import('./firebase-database.js').then(module => {
                    const FirebaseDatabase = module.default;
                    window.FirebaseDatabase.users.update(currentEditingId, updatedUser)
                        .then(() => {
                            console.log('Student update synced with Firebase successfully');
                        })
                        .catch(error => {
                            console.error('Error syncing student update with Firebase:', error);
                            showAlert('تنبيه', 'تم تحديث بيانات الطالب محليًا ولكن فشلت المزامنة مع السحابة. يرجى التحقق من اتصالك بالإنترنت.', 'warning');
                        });
                });
            }
            
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
        const student = window.Database.users.getById(studentId);
        
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
            window.Database.users.delete(currentDeletingId);
            
            // Automatically sync with Firebase if Firebase is enabled
            if (localStorage.getItem('useFirebase') === 'true') {
                import('./firebase-database.js').then(module => {
                    const FirebaseDatabase = module.default;
                    window.FirebaseDatabase.users.delete(currentDeletingId)
                        .then(() => {
                            console.log('Student deletion synced with Firebase successfully');
                        })
                        .catch(error => {
                            console.error('Error syncing student deletion with Firebase:', error);
                            showAlert('تنبيه', 'تم حذف الطالب محليًا ولكن فشلت المزامنة مع السحابة. يرجى التحقق من اتصالك بالإنترنت.', 'warning');
                        });
                });
            }
            
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
            if (typeof window.Database.auth.logout === 'function') {
                await window.Database.auth.logout();
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
    async function loadStudentsTable() {
        try {
            let students = [];
            const tableBody = document.getElementById('studentsTableBody');
            
            // Show loading indicator
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">جاري التحميل...</span>
                        </div>
                        <p class="mt-2">جاري تحميل بيانات الطلاب...</p>
                    </td>
                </tr>
            `;
            
            // Check if we're using Firebase
            const isUsingFirebase = localStorage.getItem('useFirebase') === 'true';
            
            if (isUsingFirebase) {
                // Load students from Firebase
                console.log('Loading students from Firebase...');
                const FirebaseDatabase = (await import('./firebase-database.js')).default;
                
                try {
                    // Make sure Firebase is initialized
                    if (!window.FirebaseDatabase || !window.FirebaseDatabase.isInitialized) {
                        console.log('Firebase not initialized yet, waiting 1 second...');
                        await new Promise(resolve => {
                            setTimeout(() => {
                                if (window.FirebaseDatabase && window.FirebaseDatabase.isInitialized) {
                                    console.log('Firebase initialized after waiting');
                                    resolve();
                                } else {
                                    console.warn('Firebase still not initialized after waiting');
                                    resolve(); // Continue anyway
                                }
                            }, 1000);
                        });
                    }
                    
                    // Get students from Firebase
                    const result = await window.FirebaseDatabase.users.getAll();
                    if (result.success) {
                        students = result.data;
                        console.log(`Loaded ${students.length} students from Firebase`);
                        
                        // If we got a message from Firebase about no students, display it
                        if (result.message && students.length === 0) {
                            showAlert('معلومات', result.message, 'info');
                            renderEmptyStudentsTable(result.message);
                            return;
                        }
                        
                        // Update local storage with Firebase data to keep them in sync
                        window.Database.users.replaceAll(students);
                    } else {
                        console.error('Failed to load students from Firebase:', result.error);
                        showAlert('تنبيه', 'فشل تحميل بيانات الطلاب من السحابة. سيتم استخدام البيانات المحلية.', 'warning');
                        students = window.Database.users.getAll();
                    }
                } catch (error) {
                    console.error('Error loading students from Firebase:', error);
                    showAlert('تنبيه', 'حدث خطأ أثناء تحميل بيانات الطلاب من السحابة. سيتم استخدام البيانات المحلية.', 'warning');
                    students = window.Database.users.getAll();
                }
            } else {
                // Load students from local storage
                console.log('Loading students from local storage...');
                students = window.Database.users.getAll();
            }
            
            // Render the students table
            if (students.length === 0) {
                renderEmptyStudentsTable('لا يوجد طلاب في قاعدة البيانات');
            } else {
                renderStudentsTable(students);
            }
        } catch (error) {
            console.error('Error in loadStudentsTable:', error);
            showAlert('خطأ', 'حدث خطأ أثناء تحميل بيانات الطلاب.', 'danger');
            renderEmptyStudentsTable('حدث خطأ أثناء تحميل بيانات الطلاب');
        }
    }
    
    // Render Empty Students Table
    function renderEmptyStudentsTable(message) {
        const tableBody = document.getElementById('studentsTableBody');
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="alert alert-info mb-0">
                        <i class="fas fa-info-circle me-2"></i>
                        ${message || 'لا يوجد طلاب'}
                    </div>
                </td>
            </tr>
        `;
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
        
        // Safely check if Database exists and has auth.isAdmin method
        if (window.Database && window.Database.auth && typeof window.Database.auth.isAdmin === 'function') {
            try {
                const isAdminViaAPI = window.Database.auth.isAdmin();
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
