/**
 * Database Adapter
 * Provides a unified interface for both localStorage and Firebase
 * Allows for seamless transition between storage methods
 */

import FirebaseDatabase from './firebase-database.js';

// Original localStorage-based Database
import LocalDatabase from './database.js';

// Database adapter that can switch between storage methods
const DatabaseAdapter = {
    // Storage mode: 'local' or 'firebase'
    mode: 'local',
    
    // Flag to track Firebase connection status
    firebaseConnectionFailed: false,
    
    // Initialize the database adapter
    async init() {
        // Check if Firebase is enabled in localStorage
        const useFirebase = localStorage.getItem('useFirebase') === 'true';
        this.setMode(useFirebase ? 'firebase' : 'local');
        
        // Initialize the appropriate database
        if (this.mode === 'firebase') {
            try {
                await FirebaseDatabase.init();
                console.log('Firebase database initialized successfully');
                this.firebaseConnectionFailed = false;
                
                // Add a connection status listener
                this.monitorFirebaseConnection();
            } catch (error) {
                console.error('Failed to initialize Firebase database:', error);
                // Fallback to localStorage if Firebase initialization fails
                this.firebaseConnectionFailed = true;
                this.setMode('local');
                await LocalDatabase.init();
                
                // Show error message to user if in a browser environment
                if (typeof document !== 'undefined') {
                    this.showConnectionError(error);
                }
            }
        } else {
            await LocalDatabase.init();
            console.log('Local database initialized successfully');
        }
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
            try {
                // Get the current database based on mode
                const db = DatabaseAdapter.getDatabase();
                console.log(`DatabaseAdapter: Attempting login with ${DatabaseAdapter.mode} database`);
                
                // If we're in Firebase mode but had connection issues, show a warning
                if (DatabaseAdapter.mode === 'firebase' && DatabaseAdapter.firebaseConnectionFailed) {
                    console.warn('DatabaseAdapter: Using local database due to Firebase connection failure');
                    
                    // Try to reconnect to Firebase
                    try {
                        await FirebaseDatabase.init();
                        DatabaseAdapter.firebaseConnectionFailed = false;
                        console.log('DatabaseAdapter: Successfully reconnected to Firebase');
                    } catch (reconnectError) {
                        console.error('DatabaseAdapter: Failed to reconnect to Firebase:', reconnectError);
                    }
                }
                
                // Attempt login with the appropriate database
                const result = await db.auth.login(username, password);
                
                // If login was successful and we're using Firebase, store a flag in localStorage
                if (result.success && DatabaseAdapter.mode === 'firebase') {
                    localStorage.setItem('lastLoginMode', 'firebase');
                }
                
                return result;
            } catch (error) {
                console.error('DatabaseAdapter: Error during login:', error);
                
                // If we're in Firebase mode and encounter an error, try falling back to local
                if (DatabaseAdapter.mode === 'firebase') {
                    console.warn('DatabaseAdapter: Falling back to local database for login');
                    
                    try {
                        // Try local login as fallback
                        const localResult = await LocalDatabase.auth.login(username, password);
                        
                        // If local login succeeds, update the connection status
                        if (localResult.success) {
                            DatabaseAdapter.firebaseConnectionFailed = true;
                            DatabaseAdapter.setMode('local');
                            
                            // Show connection error
                            DatabaseAdapter.showConnectionError(error);
                            
                            return {
                                ...localResult,
                                warning: 'تم تسجيل الدخول باستخدام التخزين المحلي بسبب مشكلة في الاتصال بالخادم'
                            };
                        }
                        
                        return localResult;
                    } catch (localError) {
                        console.error('DatabaseAdapter: Local login fallback also failed:', localError);
                        return {
                            success: false,
                            error: 'فشل تسجيل الدخول: تعذر الاتصال بقاعدة البيانات',
                            details: error.message
                        };
                    }
                }
                
                // Return error for local mode
                return {
                    success: false,
                    error: 'حدث خطأ أثناء تسجيل الدخول',
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
            try {
                const db = DatabaseAdapter.getDatabase();
                console.log(`DatabaseAdapter: Attempting admin login with ${DatabaseAdapter.mode} database`);
                
                // Attempt admin login with the appropriate database
                const result = await db.auth.adminLogin(password);
                
                return result;
            } catch (error) {
                console.error('DatabaseAdapter: Error during admin login:', error);
                
                // If we're in Firebase mode and encounter an error, try falling back to local
                if (DatabaseAdapter.mode === 'firebase') {
                    console.warn('DatabaseAdapter: Falling back to local database for admin login');
                    
                    try {
                        // Try local admin login as fallback
                        return await LocalDatabase.auth.adminLogin(password);
                    } catch (localError) {
                        console.error('DatabaseAdapter: Local admin login fallback also failed:', localError);
                    }
                }
                
                return {
                    success: false,
                    error: 'حدث خطأ أثناء تسجيل دخول المسؤول',
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
