/**
 * Student Management System Database Module
 * Uses localStorage for persistent storage of user accounts and related data
 * 
 * NOTE: This is the original localStorage implementation.
 * For global data access, use database-adapter.js instead.
 */

const Database = {
    // Database keys
    KEYS: {
        USERS: 'sms_users',
        CURRENT_USER: 'sms_current_user',
        ADMIN_PASSWORD: 'sms_admin_password',
        LAST_STUDENT_INDEX: 'sms_last_student_index',
        ATTENDANCE: 'sms_attendance',
        SETTINGS: 'sms_settings',
        ADMIN_PASSWORD_LAST_SYNCED: 'sms_admin_password_last_synced'
    },

    // Default settings
    DEFAULT_SETTINGS: {
        // Add default settings here if needed
    },

    // Initialize the database with default values if not already set
    init() {
        console.log('Initializing local database...');
        
        // Initialize settings if not exist
        if (!localStorage.getItem(Database.KEYS.SETTINGS)) {
            localStorage.setItem(Database.KEYS.SETTINGS, JSON.stringify(Database.DEFAULT_SETTINGS));
        }
        
        // Initialize admin password if not exist
        if (!localStorage.getItem(Database.KEYS.ADMIN_PASSWORD)) {
            console.log('Setting default admin password');
            // Check if FirebaseDatabase is available for sync
            if (window.FirebaseDatabase && typeof window.FirebaseDatabase.init === 'function') {
                // Will initialize from Firebase instead
                console.log('Firebase available, will initialize admin password from there');
                this.syncAdminPasswordFromFirebase();
            } else {
                // Use default password as fallback
                localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, 'Elostaz@2025');
                localStorage.setItem('admin_password', 'Elostaz@2025');
                localStorage.setItem('ADMIN_PASSWORD', 'Elostaz@2025');
            }
        } else {
            // If password exists, schedule a sync check
            setTimeout(() => this.syncAdminPasswordFromFirebase(), 1000);
        }
        
        // Initialize users array if it doesn't exist
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }
        
        // Initialize last student index if it doesn't exist
        if (!localStorage.getItem(this.KEYS.LAST_STUDENT_INDEX)) {
            localStorage.setItem(this.KEYS.LAST_STUDENT_INDEX, '0');
        }
        
        // Initialize attendance data if it doesn't exist
        if (!localStorage.getItem(this.KEYS.ATTENDANCE)) {
            localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify({}));
        }
        
        console.log('Local database initialized');
    },

    // Sync admin password from Firebase if available
    async syncAdminPasswordFromFirebase() {
        try {
            // Check if FirebaseDatabase is available
            if (!window.FirebaseDatabase || typeof window.FirebaseDatabase.getFirestore !== 'function') {
                console.log('Firebase not available for password sync');
                return false;
            }

            console.log('Attempting to sync admin password from Firebase...');
            
            // Get reference to Firestore
            const db = window.FirebaseDatabase.getFirestore();
            const FirebaseDatabase = window.FirebaseDatabase;
            
            // Check when we last synced
            const lastSynced = localStorage.getItem(Database.KEYS.ADMIN_PASSWORD_LAST_SYNCED) || '0';
            const currentTime = new Date().getTime();
            const timeSinceLastSync = currentTime - parseInt(lastSynced);
            
            // Only sync if it's been more than 1 hour since last sync
            const ONE_HOUR = 60 * 60 * 1000;
            if (lastSynced !== '0' && timeSinceLastSync < ONE_HOUR) {
                console.log('Password recently synced, skipping sync');
                return true;
            }
            
            // Get admin document from Firestore
            const docRef = FirebaseDatabase.doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin');
            const docSnap = await FirebaseDatabase.getDoc(docRef);
            
            if (!docSnap.exists()) {
                console.log('Admin settings not found in Firebase, skipping sync');
                return false;
            }
            
            // Get admin data
            const adminData = docSnap.data();
            
            if (adminData && adminData.password) {
                console.log('Found admin password in Firebase, updating local storage');
                
                // Update all password locations
                localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, adminData.password);
                localStorage.setItem('admin_password', adminData.password);
                localStorage.setItem('ADMIN_PASSWORD', adminData.password);
                
                // Update last synced timestamp
                localStorage.setItem(Database.KEYS.ADMIN_PASSWORD_LAST_SYNCED, currentTime.toString());
                
                return true;
            } else {
                console.warn('Admin document found but no password field');
                return false;
            }
        } catch (error) {
            console.error('Error syncing admin password from Firebase:', error);
            return false;
        }
    },

    // User Management Functions
    users: {
        // Get all users
        getAll() {
            return JSON.parse(localStorage.getItem(Database.KEYS.USERS) || '[]');
        },

        // Get user by ID
        getById(id) {
            const users = this.getAll();
            return users.find(user => user.id === id) || null;
        },
        
        // Get next student index
        getNextStudentIndex() {
            let currentIndex = parseInt(localStorage.getItem(Database.KEYS.LAST_STUDENT_INDEX) || '0');
            currentIndex++;
            localStorage.setItem(Database.KEYS.LAST_STUDENT_INDEX, currentIndex.toString());
            return currentIndex;
        },
        
        // Filter users by grade
        getByGrade(grade) {
            const users = this.getAll();
            return users.filter(user => user.grade === grade);
        },

        // Filter users by group
        getByGroup(group) {
            const users = this.getAll();
            return users.filter(user => user.group === group);
        },

        // Add new user
        add(user) {
            const users = this.getAll();
            
            // Check if user with same ID already exists
            if (users.some(u => u.id === user.id)) {
                return { success: false, message: 'معرف الطالب موجود بالفعل' };
            }
            
            // Add student index and creation timestamp if not provided
            if (!user.index) {
                user.index = this.getNextStudentIndex();
            }
            
            if (!user.createdAt) {
                user.createdAt = new Date().toISOString();
            }
            
            users.push(user);
            localStorage.setItem(Database.KEYS.USERS, JSON.stringify(users));
            return { success: true, user };
        },
        
        // Add multiple users (bulk import)
        addBulk(users) {
            let successCount = 0;
            let errorCount = 0;
            let errors = [];
            
            users.forEach(user => {
                // Add student index and creation timestamp
                user.index = this.getNextStudentIndex();
                user.createdAt = new Date().toISOString();
                
                const result = this.add(user);
                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                    errors.push({ id: user.id, message: result.message });
                }
            });
            
            return {
                success: successCount > 0,
                successCount,
                errorCount,
                errors
            };
        },

        // Update existing user
        update(id, updatedUser) {
            const users = this.getAll();
            const index = users.findIndex(user => user.id === id);
            
            if (index === -1) {
                return { success: false, message: 'لم يتم العثور على الطالب' };
            }
            
            users[index] = { ...users[index], ...updatedUser };
            localStorage.setItem(Database.KEYS.USERS, JSON.stringify(users));
            
            return { success: true };
        },

        // Replace all users with data from Firebase
        replaceAll(users) {
            if (!Array.isArray(users)) {
                console.error('replaceAll: Expected an array of users');
                return { success: false, message: 'بيانات غير صالحة' };
            }
            
            try {
                localStorage.setItem(Database.KEYS.USERS, JSON.stringify(users));
                console.log(`Replaced local users with ${users.length} users from Firebase`);
                return { success: true };
            } catch (error) {
                console.error('Error replacing users:', error);
                return { success: false, message: 'حدث خطأ أثناء تحديث البيانات' };
            }
        },

        // Delete user
        delete(id) {
            const users = this.getAll();
            const filteredUsers = users.filter(user => user.id !== id);
            
            if (filteredUsers.length === users.length) {
                return { success: false, message: 'الطالب غير موجود' };
            }
            
            localStorage.setItem(Database.KEYS.USERS, JSON.stringify(filteredUsers));
            return { success: true };
        }
    },

    // Attendance Management Functions
    attendance: {
        // Get all attendance data
        getAttendanceData() {
            return JSON.parse(localStorage.getItem(Database.KEYS.ATTENDANCE)) || {};
        },
        
        // Save all attendance data
        saveAttendanceData(attendanceData) {
            localStorage.setItem(Database.KEYS.ATTENDANCE, JSON.stringify(attendanceData));
        },
        
        // Get attendance for a specific month (nested by student ID)
        getMonthAttendance(year, month) {
            const attendanceData = this.getAttendanceData();
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            return attendanceData[monthKey] || {};
        },
        
        // Save attendance for a specific month (nested by student ID)
        saveMonthAttendance(year, month, data) {
            const attendanceData = this.getAttendanceData();
            const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
            attendanceData[monthKey] = data;
            this.saveAttendanceData(attendanceData);
        },
        
        // Get all attendance for a specific student (across all months)
        getStudentAttendance(studentId) {
            const attendanceData = this.getAttendanceData();
            const result = {};
            
            // Loop through all months
            Object.keys(attendanceData).forEach(monthKey => {
                const monthData = attendanceData[monthKey];
                
                // If student has attendance data for this month
                if (monthData && monthData[studentId]) {
                    if (!result[monthKey]) {
                        result[monthKey] = {};
                    }
                    result[monthKey] = monthData[studentId];
                }
            });
            
            return result;
        },
        
        // Get student attendance for a specific month
        getStudentMonthAttendance(studentId, year, month) {
            const monthData = this.getMonthAttendance(year, month);
            return monthData[studentId] || {};
        }
    },

    // Authentication Functions
    auth: {
        // Login user
        login(id, password) {
            const users = Database.users.getAll();
            const user = users.find(u => u.id === id && u.password === password);
            
            if (!user) {
                return { success: false, message: 'معرف الطالب أو كلمة المرور غير صحيحة' };
            }
            
            localStorage.setItem(Database.KEYS.CURRENT_USER, JSON.stringify(user));
            return { success: true, user };
        },

        // Admin login
        async adminLogin(password) {
            try {
                console.log('Attempting admin login with password');
                
                // Try to sync admin password from Firebase first
                try {
                    await Database.syncAdminPasswordFromFirebase();
                } catch (syncError) {
                    console.warn('Failed to sync admin password from Firebase:', syncError);
                    // Continue with login using local passwords
                }
                
                // Get admin password from multiple possible locations
                const adminPasswordSMS = localStorage.getItem(Database.KEYS.ADMIN_PASSWORD);
                const adminPasswordLegacy = localStorage.getItem('admin_password');
                const adminPasswordUppercase = localStorage.getItem('ADMIN_PASSWORD');
                
                // Use the first available password
                const adminPassword = adminPasswordSMS || adminPasswordLegacy || adminPasswordUppercase;
                
                console.log('Admin password status:',
                    'sms_admin_password exists:', !!adminPasswordSMS,
                    'admin_password exists:', !!adminPasswordLegacy,
                    'ADMIN_PASSWORD exists:', !!adminPasswordUppercase
                );
                
                // Use global passwordUtils object instead of import
                const passwordUtils = window.passwordUtils;
                
                // Check if the password is already hashed (if it starts with a hash pattern)
                if (adminPassword && adminPassword.length === 64) {
                    // Password is already hashed, verify it
                    const isValid = await passwordUtils.verifyPassword(password, adminPassword);
                    console.log('Password verification result:', isValid);
                    
                    if (!isValid) {
                        return { success: false, message: 'كلمة المرور غير صحيحة' };
                    }
                } else if (adminPassword === 'Elostaz@2025') {
                    // Default password, hash it and store it
                    const hashedPassword = await passwordUtils.hashPassword(password);
                    localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, hashedPassword);
                    // Also set in legacy locations
                    localStorage.setItem('admin_password', hashedPassword);
                    localStorage.setItem('ADMIN_PASSWORD', hashedPassword);
                    
                    // Sync to Firebase if available
                    try {
                        if (window.FirebaseDatabase && typeof window.FirebaseDatabase.auth.changeAdminPassword === 'function') {
                            await window.FirebaseDatabase.auth.changeAdminPassword(password);
                            console.log('Synced default password to Firebase');
                        }
                    } catch (fbError) {
                        console.error('Failed to sync default password to Firebase:', fbError);
                    }
                } else {
                    // Old plaintext password comparison (for backward compatibility)
                    if (password !== adminPassword) {
                        return { success: false, message: 'كلمة المرور غير صحيحة' };
                    }
                    
                    // Upgrade the plaintext password to a hashed one
                    const hashedPassword = await passwordUtils.hashPassword(password);
                    localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, hashedPassword);
                    // Also set in legacy locations
                    localStorage.setItem('admin_password', hashedPassword);
                    localStorage.setItem('ADMIN_PASSWORD', hashedPassword);
                    
                    // Sync to Firebase if available
                    try {
                        if (window.FirebaseDatabase && typeof window.FirebaseDatabase.auth.changeAdminPassword === 'function') {
                            await window.FirebaseDatabase.auth.changeAdminPassword(password);
                            console.log('Synced upgraded password to Firebase');
                        }
                    } catch (fbError) {
                        console.error('Failed to sync upgraded password to Firebase:', fbError);
                    }
                }
                
                // Set admin logged in flags
                localStorage.setItem('sms_admin_logged_in', 'true');
                sessionStorage.setItem('adminLoggedIn', 'true');
                
                return { success: true };
            } catch (error) {
                console.error('Error during admin login:', error);
                return { success: false, message: 'حدث خطأ أثناء تسجيل الدخول' };
            }
        },
        
        // Logout current user
        logout() {
            localStorage.removeItem(Database.KEYS.CURRENT_USER);
        },

        // Get current logged in user
        getCurrentUser() {
            const userData = localStorage.getItem(Database.KEYS.CURRENT_USER);
            return userData ? JSON.parse(userData) : null;
        },

        // Check if user is logged in
        isLoggedIn() {
            return !!this.getCurrentUser();
        },

        // Check if admin is logged in
        isAdmin() {
            try {
                // Check multiple sources for admin login status
                const isLoggedInLocalStorage = localStorage.getItem(Database.KEYS.ADMIN_PASSWORD) !== null &&
                                             localStorage.getItem('sms_admin_logged_in') === 'true';
                const isLoggedInSessionStorage = sessionStorage.getItem('adminLoggedIn') === 'true';
                
                // Admin is logged in if either condition is true
                return isLoggedInLocalStorage || isLoggedInSessionStorage;
            } catch (error) {
                console.error('Error checking admin status:', error);
                return false;
            }
        },

        // Admin logout
        adminLogout() {
            localStorage.removeItem('sms_admin_logged_in');
            sessionStorage.removeItem('adminLoggedIn');
            return { success: true };
        },

        // Change admin password
        async changeAdminPassword(newPassword) {
            try {
                // Use global passwordUtils object instead of import
                const passwordUtils = window.passwordUtils;
                
                // Hash the new password
                const hashedPassword = await passwordUtils.hashPassword(newPassword);
                
                // Store the new password in all localStorage locations for consistency
                console.log('Changing admin password in local storage');
                localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, hashedPassword);
                localStorage.setItem('admin_password', hashedPassword);
                localStorage.setItem('ADMIN_PASSWORD', hashedPassword);
                
                // Sync to Firebase if available
                try {
                    if (window.FirebaseDatabase && typeof window.FirebaseDatabase.auth.changeAdminPassword === 'function') {
                        await window.FirebaseDatabase.auth.changeAdminPassword(newPassword);
                        console.log('Synced new password to Firebase');
                        
                        // Update last synced timestamp after successful sync
                        localStorage.setItem(Database.KEYS.ADMIN_PASSWORD_LAST_SYNCED, new Date().getTime().toString());
                    }
                } catch (fbError) {
                    console.error('Failed to sync new password to Firebase:', fbError);
                }
                
                return { success: true };
            } catch (error) {
                console.error('Error changing admin password:', error);
                return { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' };
            }
        }
    }
};

// Initialize database when script loads
Database.init();

// Expose to window for compatibility with modules
window.Database = Database;
