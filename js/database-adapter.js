/**
 * Database Adapter
 * Provides a unified interface for both localStorage and Firebase
 * Always uses Firebase as the primary storage method
 */

import FirebaseDatabase from './firebase-database.js';

// Original localStorage-based Database for fallback, accessed from window global
const LocalDatabase = window.Database || {};

// Database adapter that primarily uses Firebase
const DatabaseAdapter = {
    // Storage mode: always 'firebase' by default
    mode: 'firebase',
    
    // Flag to track Firebase connection status
    firebaseConnectionFailed: false,
    
    // Initialize the database adapter
    async init() {
        try {
            // Always use Firebase
            const firebaseInitResult = await FirebaseDatabase.init();
            
            // If Firebase initialization was successful and no connection issues detected
            if (firebaseInitResult && !FirebaseDatabase.connectionIssuesDetected) {
                console.log('Firebase database initialized successfully');
                this.setMode('firebase');
                this.firebaseConnectionFailed = false;
                
                // Add a connection status listener
                this.monitorFirebaseConnection();
            } else {
                // Firebase had issues, use localStorage as fallback
                console.log('Using local storage as fallback due to Firebase connection issues');
                this.setMode('local');
                this.firebaseConnectionFailed = true;
                await LocalDatabase.init();
                
                // Show a warning to the user
                if (typeof showAlert === 'function') {
                    showAlert('تنبيه', 'تعذر الاتصال بقاعدة البيانات السحابية. سيتم استخدام التخزين المحلي مؤقتًا حتى يعود الاتصال.', 'warning');
                }
            }
        } catch (error) {
            // Something went wrong with initialization
            console.error('Error during database initialization:', error);
            this.setMode('local');
            this.firebaseConnectionFailed = true;
            await LocalDatabase.init();
            console.log('Local database initialized successfully (fallback)');
            
            // Show a warning to the user
            if (typeof showAlert === 'function') {
                showAlert('تنبيه', 'حدث خطأ أثناء الاتصال بقاعدة البيانات السحابية. سيتم استخدام التخزين المحلي مؤقتًا.', 'warning');
            }
        }
        
        // Always set useFirebase to true in localStorage
        localStorage.setItem('useFirebase', 'true');
    },
    
    // Monitor Firebase connection status
    monitorFirebaseConnection() {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') return;
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            if (this.mode === 'firebase' && this.firebaseConnectionFailed) {
                console.log('Internet connection restored, attempting to reconnect to Firebase...');
                this.init();
            }
        });
        
        window.addEventListener('offline', () => {
            if (this.mode === 'firebase') {
                console.warn('Internet connection lost, Firebase operations may fail');
                this.firebaseConnectionFailed = true;
            }
        });
    },
    
    // Show connection error message
    showConnectionError(error) {
        // Create a notification element if it doesn't exist
        let notification = document.getElementById('firebase-error-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'firebase-error-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#f8d7da';
            notification.style.color = '#721c24';
            notification.style.padding = '10px 15px';
            notification.style.borderRadius = '4px';
            notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            notification.style.zIndex = '9999';
            notification.style.direction = 'rtl';
            document.body.appendChild(notification);
        }
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div>
                    <strong>خطأ في الاتصال بقاعدة البيانات</strong>
                    <p style="margin: 5px 0 0;">تم التبديل إلى التخزين المحلي. ${error.message}</p>
                </div>
                <button onclick="this.parentNode.parentNode.style.display='none'" style="background: none; border: none; cursor: pointer; font-size: 16px; margin-right: 10px;">×</button>
            </div>
        `;
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification) {
                notification.style.display = 'none';
            }
        }, 10000);
    },
    
    // Set the storage mode
    setMode(mode) {
        if (mode !== 'local' && mode !== 'firebase') {
            console.error(`Invalid storage mode: ${mode}. Must be 'local' or 'firebase'.`);
            return;
        }
        
        this.mode = mode;
        localStorage.setItem('useFirebase', mode === 'firebase');
        console.log(`Database mode set to: ${mode}`);
    },
    
    // Get the current database based on mode
    getDatabase() {
        return this.mode === 'firebase' ? FirebaseDatabase : LocalDatabase;
    },
    
    // User Management Functions
    users: {
        // Get all users
        async getAll() {
            const db = DatabaseAdapter.getDatabase();
            return await db.users.getAll();
        },
        
        // Get user by ID
        async getById(id) {
            const db = DatabaseAdapter.getDatabase();
            return await db.users.getById(id);
        },
        
        // Add new user
        async add(user) {
            const db = DatabaseAdapter.getDatabase();
            return await db.users.add(user);
        },
        
        // Update user
        async update(id, userData) {
            const db = DatabaseAdapter.getDatabase();
            return await db.users.update(id, userData);
        },
        
        // Delete user
        async delete(id) {
            const db = DatabaseAdapter.getDatabase();
            return await db.users.delete(id);
        }
    },
    
    // Attendance Management
    attendance: {
        // Get attendance for a specific month
        async getMonthAttendance(month) {
            const db = DatabaseAdapter.getDatabase();
            return await db.attendance.getMonthAttendance(month);
        },
        
        // Get attendance for a specific student
        async getStudentAttendance(studentId, month) {
            const db = DatabaseAdapter.getDatabase();
            return await db.attendance.getStudentAttendance(studentId, month);
        },
        
        // Set attendance for a specific date
        async setAttendance(date, studentId, status) {
            const db = DatabaseAdapter.getDatabase();
            return await db.attendance.setAttendance(date, studentId, status);
        },
        
        // Get attendance for a specific date
        async getDateAttendance(date) {
            const db = DatabaseAdapter.getDatabase();
            return await db.attendance.getDateAttendance(date);
        }
    },
    
    // Authentication
    auth: {
        // Login user
        async login(username, password) {
            console.log(`DatabaseAdapter: Login attempt for user ${username}`);
            
            try {
                // Try to login with the current database mode
                let result;
                
                if (DatabaseAdapter.mode === 'firebase') {
                    console.log('DatabaseAdapter: Attempting Firebase login');
                    result = await FirebaseDatabase.auth.login(username, password);
                    
                    // If login failed due to connection issues, try local login
                    if (!result.success && result.connectionIssue) {
                        console.warn('DatabaseAdapter: Firebase login failed due to connection issues, trying local login');
                        
                        // Update connection status
                        DatabaseAdapter.firebaseConnectionFailed = true;
                        
                        // Try local login
                        const localResult = LocalDatabase.auth.login(username, password);
                        
                        if (localResult.success) {
                            console.log('DatabaseAdapter: Local login successful');
                            // Store the login mode for future reference
                            localStorage.setItem('lastLoginMode', 'local');
                            return {
                                ...localResult,
                                message: 'تم تسجيل الدخول باستخدام التخزين المحلي (وضع عدم الاتصال)'
                            };
                        } else {
                            console.error('DatabaseAdapter: Local login fallback failed');
                            return {
                                success: false,
                                error: 'فشل تسجيل الدخول: بيانات الاعتماد غير صالحة',
                                details: 'تعذر الاتصال بقاعدة البيانات عبر الإنترنت، وفشل تسجيل الدخول المحلي'
                            };
                        }
                    }
                    
                    return result;
                } else {
                    console.log('DatabaseAdapter: Attempting local login');
                    result = LocalDatabase.auth.login(username, password);
                    return result;
                }
            } catch (error) {
                console.error('DatabaseAdapter: Error during login:', error);
                
                // If Firebase login fails, try local login as fallback
                if (DatabaseAdapter.mode === 'firebase') {
                    console.warn('DatabaseAdapter: Falling back to local database for login');
                    
                    try {
                        // Try local login as a fallback
                        console.log('DatabaseAdapter: Trying local login as fallback');
                        const localResult = LocalDatabase.auth.login(username, password);
                        
                        if (localResult.success) {
                            console.log('DatabaseAdapter: Local login successful');
                            // Store the login mode for future reference
                            localStorage.setItem('lastLoginMode', 'local');
                            return {
                                ...localResult,
                                message: 'تم تسجيل الدخول باستخدام التخزين المحلي (وضع عدم الاتصال)'
                            };
                        } else {
                            console.error('DatabaseAdapter: Local login fallback failed:', localResult);
                            return {
                                success: false,
                                error: 'فشل تسجيل الدخول: بيانات الاعتماد غير صالحة',
                                details: 'تعذر الاتصال بقاعدة البيانات عبر الإنترنت، وفشل تسجيل الدخول المحلي'
                            };
                        }
                    } catch (localError) {
                        console.error('DatabaseAdapter: Local login fallback error:', localError);
                        return {
                            success: false,
                            error: 'فشل تسجيل الدخول: تعذر الاتصال بقاعدة البيانات',
                            details: error.message || localError.message
                        };
                    }
                }
                
                // If we're already in local mode, just return the error
                return {
                    success: false,
                    error: 'فشل تسجيل الدخول',
                    details: error.message
                };
            }
        },
        
        // Logout user
        async logout() {
            try {
                const db = DatabaseAdapter.getDatabase();
                return await db.auth.logout();
            } catch (error) {
                console.error('DatabaseAdapter: Error during logout:', error);
                // Ensure user is logged out even if there's an error
                localStorage.removeItem('sms_current_user');
                localStorage.removeItem('sms_admin_logged_in');
            }
        },
        
        // Get current user
        getCurrentUser() {
            try {
                const db = DatabaseAdapter.getDatabase();
                return db.auth.getCurrentUser();
            } catch (error) {
                console.error('DatabaseAdapter: Error getting current user:', error);
                // Fallback to localStorage
                const userData = localStorage.getItem('sms_current_user');
                return userData ? JSON.parse(userData) : null;
            }
        },
        
        // Check if user is logged in
        isLoggedIn() {
            try {
                const db = DatabaseAdapter.getDatabase();
                return db.auth.isLoggedIn();
            } catch (error) {
                console.error('DatabaseAdapter: Error checking login status:', error);
                // Fallback to localStorage
                return !!localStorage.getItem('sms_current_user');
            }
        },
        
        // Check if user is admin
        isAdmin() {
            try {
                const db = DatabaseAdapter.getDatabase();
                return db.auth.isAdmin ? db.auth.isAdmin() : !!localStorage.getItem('sms_admin_logged_in');
            } catch (error) {
                console.error('DatabaseAdapter: Error checking admin status:', error);
                // Fallback to localStorage
                return !!localStorage.getItem('sms_admin_logged_in');
            }
        },
        
        // Admin login
        async adminLogin(password) {
            console.log('DatabaseAdapter: Admin login attempt');
            
            try {
                // Try to login with the current database mode
                let result;
                
                if (DatabaseAdapter.mode === 'firebase') {
                    console.log('DatabaseAdapter: Attempting Firebase admin login');
                    result = await FirebaseDatabase.auth.adminLogin(password);
                    
                    // If login failed due to connection issues, try local login
                    if (!result.success && result.connectionIssue) {
                        console.warn('DatabaseAdapter: Firebase admin login failed due to connection issues, trying local login');
                        
                        // Update connection status
                        DatabaseAdapter.firebaseConnectionFailed = true;
                        
                        // Try local login
                        const localResult = LocalDatabase.auth.adminLogin(password);
                        
                        if (localResult.success) {
                            console.log('DatabaseAdapter: Local admin login successful');
                            // Store the login mode for future reference
                            localStorage.setItem('lastLoginMode', 'local');
                            return {
                                ...localResult,
                                message: 'تم تسجيل الدخول كمسؤول باستخدام التخزين المحلي (وضع عدم الاتصال)'
                            };
                        } else {
                            console.error('DatabaseAdapter: Local admin login fallback failed');
                            return {
                                success: false,
                                error: 'فشل تسجيل الدخول: كلمة المرور غير صالحة',
                                details: 'تعذر الاتصال بقاعدة البيانات عبر الإنترنت، وفشل تسجيل الدخول المحلي'
                            };
                        }
                    }
                    
                    return result;
                } else {
                    console.log('DatabaseAdapter: Attempting local admin login');
                    result = LocalDatabase.auth.adminLogin(password);
                    return result;
                }
            } catch (error) {
                console.error('DatabaseAdapter: Error during admin login:', error);
                
                // If Firebase login fails, try local login as fallback
                if (DatabaseAdapter.mode === 'firebase') {
                    console.warn('DatabaseAdapter: Falling back to local database for admin login');
                    
                    try {
                        const localResult = LocalDatabase.auth.adminLogin(password);
                        
                        if (localResult.success) {
                            console.log('DatabaseAdapter: Local admin login successful');
                            // Store the login mode for future reference
                            localStorage.setItem('lastLoginMode', 'local');
                            return {
                                ...localResult,
                                message: 'تم تسجيل الدخول كمسؤول باستخدام التخزين المحلي (وضع عدم الاتصال)'
                            };
                        } else {
                            console.error('DatabaseAdapter: Local admin login fallback failed');
                            return localResult;
                        }
                    } catch (localError) {
                        console.error('DatabaseAdapter: Local admin login fallback error:', localError);
                        return {
                            success: false,
                            error: 'فشل تسجيل الدخول كمسؤول: تعذر الاتصال بقاعدة البيانات',
                            details: error.message || localError.message
                        };
                    }
                }
                
                // If we're already in local mode, just return the error
                return {
                    success: false,
                    error: 'فشل تسجيل الدخول كمسؤول',
                    details: error.message
                };
            }
        }
    },
    
    // Admin Settings
    admin: {
        // Get admin settings
        async getSettings() {
            const db = DatabaseAdapter.getDatabase();
            return await db.admin.getSettings();
        },
        
        // Update admin settings
        async updateSettings(settings) {
            const db = DatabaseAdapter.getDatabase();
            return await db.admin.updateSettings(settings);
        },
        
        // Change admin password
        async changePassword(newPassword) {
            const db = DatabaseAdapter.getDatabase();
            return await db.admin.changePassword(newPassword);
        }
    }
};

// Initialize the database adapter
DatabaseAdapter.init();

export default DatabaseAdapter;
