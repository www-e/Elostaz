/**
 * Student Management System Database Module
 * Uses localStorage for persistent storage of user accounts and related data
 */

const Database = {
    // Database keys
    KEYS: {
        USERS: 'sms_users',
        CURRENT_USER: 'sms_current_user',
        ADMIN_PASSWORD: 'sms_admin_password',
        LAST_STUDENT_INDEX: 'sms_last_student_index',
        ATTENDANCE: 'sms_attendance'
    },

    // Initialize the database with default values if not already set
    init() {
        // Initialize users array if it doesn't exist
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }

        // Set default admin password if not set
        if (!localStorage.getItem(this.KEYS.ADMIN_PASSWORD)) {
            localStorage.setItem(this.KEYS.ADMIN_PASSWORD, 'admin123'); // Default password
        }
        
        // Initialize last student index if it doesn't exist
        if (!localStorage.getItem(this.KEYS.LAST_STUDENT_INDEX)) {
            localStorage.setItem(this.KEYS.LAST_STUDENT_INDEX, '0');
        }
        
        // Initialize attendance data if it doesn't exist
        if (!localStorage.getItem(this.KEYS.ATTENDANCE)) {
            localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify({}));
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
        update(id, updatedData) {
            const users = this.getAll();
            const index = users.findIndex(user => user.id === id);
            
            if (index === -1) {
                return { success: false, message: 'الطالب غير موجود' };
            }
            
            users[index] = { ...users[index], ...updatedData };
            localStorage.setItem(Database.KEYS.USERS, JSON.stringify(users));
            return { success: true, user: users[index] };
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
        adminLogin(password) {
            const adminPassword = localStorage.getItem(Database.KEYS.ADMIN_PASSWORD);
            
            if (password !== adminPassword) {
                return { success: false, message: 'كلمة المرور غير صحيحة' };
            }
            
            return { success: true };
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

        // Change admin password
        changeAdminPassword(newPassword) {
            localStorage.setItem(Database.KEYS.ADMIN_PASSWORD, newPassword);
            return { success: true };
        }
    }
};

// Initialize database when script loads
Database.init();

// Expose to global scope
window.Database = Database;

export default Database;
