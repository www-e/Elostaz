/**
 * Firebase Database Service
 * Provides functions for interacting with Firebase Firestore
 */

import { db, auth } from './firebase-config.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

const FirebaseDatabase = {
    // Collection names
    COLLECTIONS: {
        USERS: 'users',
        ATTENDANCE: 'attendance',
        SETTINGS: 'settings',
        PAYMENTS: 'payments',
        ANNOUNCEMENTS: 'announcements'
    },

    // Firebase references
    db,
    auth,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,

    // Flag to track if connection issues are detected
    connectionIssuesDetected: false,

    // Detect connection issues with Firebase
    async detectConnectionIssues() {
        console.log('Checking for connection issues...');

        // Reset detection flag
        this.connectionIssuesDetected = false;
        
        // Test direct Firebase connectivity using multiple methods
        let connectionSuccessful = false;
        
        try {
            // Method 1: Try to access a document
            const testRef = doc(db, this.COLLECTIONS.SETTINGS, 'connection_test');
            await getDoc(testRef);
            console.log('Firebase connection test successful');
            connectionSuccessful = true;
        } catch (error1) {
            console.warn('Firebase document access test failed:', error1.message);
            
            // Method 2: Try to list a collection
            try {
                const testCollection = collection(db, this.COLLECTIONS.SETTINGS);
                await getDocs(testCollection);
                console.log('Firebase collection access test successful');
                connectionSuccessful = true;
            } catch (error2) {
                console.warn('Firebase collection access test failed:', error2.message);
                
                // Method 3: Try to access Firestore metadata
                try {
                    await db._getAppCompat().firestore()._getClient();
                    console.log('Firebase metadata access test successful');
                    connectionSuccessful = true;
                } catch (error3) {
                    console.error('All Firebase connection tests failed');
                    
                    // Analyze errors to determine if it's a connection issue
                    const errorMessages = [
                        error1.message.toLowerCase(),
                        error2.message.toLowerCase(),
                        error3.message.toLowerCase()
                    ];
                    
                    const connectionErrorKeywords = [
                        'network', 'offline', 'unavailable', 'timeout', 
                        'connection', 'failed to fetch', 'cors', 'blocked',
                        'permission denied', 'unauthorized', 'not allowed',
                        'access', 'firewall', 'proxy'
                    ];
                    
                    const isConnectionIssue = errorMessages.some(msg => 
                        connectionErrorKeywords.some(keyword => msg.includes(keyword))
                    );
                    
                    if (isConnectionIssue) {
                        this.connectionIssuesDetected = true;
                        this.showConnectionWarning();
                        return true;
                    }
                }
            }
        }
        
        return !connectionSuccessful;
    },

    // Show connection warning to the user
    showConnectionWarning() {
        // Only show if we're in a browser environment
        if (typeof document === 'undefined') return;

        // Create warning element if it doesn't exist
        let warning = document.getElementById('firebase-connection-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'firebase-connection-warning';
            warning.style.position = 'fixed';
            warning.style.top = '10px';
            warning.style.left = '50%';
            warning.style.transform = 'translateX(-50%)';
            warning.style.backgroundColor = '#fff3cd';
            warning.style.color = '#856404';
            warning.style.padding = '15px 20px';
            warning.style.borderRadius = '5px';
            warning.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            warning.style.zIndex = '9999';
            warning.style.maxWidth = '90%';
            warning.style.width = '500px';
            warning.style.textAlign = 'center';
            warning.style.direction = 'rtl';

            warning.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div style="flex: 1;">
                        <strong style="font-size: 16px;">⚠️ مشكلة في الاتصال بقاعدة البيانات</strong>
                        <p style="margin: 8px 0 0; font-size: 14px;">
                            تم اكتشاف مشكلة في الاتصال بخدمة Firebase. سيتم استخدام التخزين المحلي كبديل.
                            <br>
                            <span style="font-size: 12px; color: #666;">
                                تأكد من اتصالك بالإنترنت وأن الموقع يعمل بشكل صحيح.
                            </span>
                        </p>
                    </div>
                    <button onclick="this.parentNode.parentNode.style.display='none'" style="background: none; border: none; cursor: pointer; font-size: 18px; margin-right: 10px; color: #856404;">×</button>
                </div>
            `;

            document.body.appendChild(warning);
        } else {
            warning.style.display = 'block';
        }
    },

    // Initialize the database
    async init() {
        try {
            console.log('Initializing Firebase database...');
            
            // Check if we're running on GitHub Pages
            const isGitHubPages = 
                window.location.hostname.includes('github.io') || 
                document.referrer.includes('github.io');
                
            if (isGitHubPages) {
                console.log('Running on GitHub Pages, using CORS-friendly initialization');
                
                // Add extra CORS headers for GitHub Pages
                const corsHeaders = {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                    'Access-Control-Allow-Headers': 'Content-Type'
                };
                
                // Store this information for future reference
                localStorage.setItem('isGitHubPages', 'true');
            }
            
            // First, check for connection issues
            const hasConnectionIssues = await this.detectConnectionIssues();
            
            if (hasConnectionIssues) {
                console.warn('Firebase connection issues detected, falling back to local storage');
                localStorage.setItem('useFirebase', 'false');
                return false;
            }
            
            // If we get here, connection is successful
            localStorage.setItem('useFirebase', 'true');
            
            // Check if admin settings exist, create if not
            try {
                const adminDoc = await getDoc(doc(db, this.COLLECTIONS.SETTINGS, 'admin'));
                if (!adminDoc.exists()) {
                    await setDoc(doc(db, this.COLLECTIONS.SETTINGS, 'admin'), {
                        password: 'admin123'
                    });
                    console.log('Admin settings initialized');
                }
                
                // Check if counter exists, create if not
                const counterDoc = await getDoc(doc(db, this.COLLECTIONS.SETTINGS, 'counter'));
                if (!counterDoc.exists()) {
                    await setDoc(doc(db, this.COLLECTIONS.SETTINGS, 'counter'), {
                        lastStudentIndex: 0
                    });
                    console.log('Counter initialized');
                }
                
                console.log('Firebase Database initialized successfully');
                return true;
            } catch (error) {
                console.error('Error initializing Firebase settings:', error);
                // If we can't initialize settings, we should fall back to local storage
                localStorage.setItem('useFirebase', 'false');
                return false;
            }
        } catch (error) {
            console.error('Error initializing Firebase Database:', error);
            localStorage.setItem('useFirebase', 'false');
            return false;
        }
    },

    // User Management Functions
    users: {
        // Get all users
        async getAll() {
            try {
                const usersSnapshot = await getDocs(collection(db, FirebaseDatabase.COLLECTIONS.USERS));
                const users = [];
                usersSnapshot.forEach(doc => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                return users;
            } catch (error) {
                console.error('Error getting users:', error);
                return [];
            }
        },

        // Get user by ID
        async getById(id) {
            try {
                const userDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id));
                if (userDoc.exists()) {
                    return { id: userDoc.id, ...userDoc.data() };
                }
                return null;
            } catch (error) {
                console.error('Error getting user:', error);
                return null;
            }
        },
        
        // Get next student index
        async getNextStudentIndex() {
            try {
                const counterDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'counter'));
                if (counterDoc.exists()) {
                    const data = counterDoc.data();
                    const nextIndex = (data.lastStudentIndex || 0) + 1;
                    
                    // Update counter
                    await updateDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'counter'), {
                        lastStudentIndex: nextIndex
                    });
                    
                    return nextIndex;
                }
                return 1; // Default start index
            } catch (error) {
                console.error('Error getting next student index:', error);
                return 1;
            }
        },

        // Filter users by grade
        async getByGrade(grade) {
            try {
                const q = query(
                    collection(db, FirebaseDatabase.COLLECTIONS.USERS),
                    where('grade', '==', grade)
                );
                const querySnapshot = await getDocs(q);
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                return users;
            } catch (error) {
                console.error('Error filtering users by grade:', error);
                return [];
            }
        },

        // Filter users by group
        async getByGroup(group) {
            try {
                const q = query(
                    collection(db, FirebaseDatabase.COLLECTIONS.USERS),
                    where('group', '==', group)
                );
                const querySnapshot = await getDocs(q);
                const users = [];
                querySnapshot.forEach(doc => {
                    users.push({ id: doc.id, ...doc.data() });
                });
                return users;
            } catch (error) {
                console.error('Error filtering users by group:', error);
                return [];
            }
        },

        // Add new user
        async add(user) {
            try {
                // Add timestamp if not present
                if (!user.createdAt) {
                    user.createdAt = new Date().toISOString();
                }
                
                await setDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, user.id), user);
                return { success: true, user };
            } catch (error) {
                console.error('Error adding user:', error);
                return { success: false, error };
            }
        },
        
        // Add multiple users (bulk import)
        async addBulk(users) {
            try {
                const timestamp = new Date().toISOString();
                const results = {
                    success: [],
                    failed: []
                };
                
                for (const user of users) {
                    try {
                        // Add timestamp if not present
                        if (!user.createdAt) {
                            user.createdAt = timestamp;
                        }
                        
                        await setDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, user.id), user);
                        results.success.push(user.id);
                    } catch (error) {
                        console.error(`Error adding user ${user.id}:`, error);
                        results.failed.push({ id: user.id, error: error.message });
                    }
                }
                
                return results;
            } catch (error) {
                console.error('Error in bulk import:', error);
                return { success: [], failed: users.map(u => ({ id: u.id, error: error.message })) };
            }
        },

        // Update existing user
        async update(id, updatedData) {
            try {
                await updateDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id), updatedData);
                return { success: true };
            } catch (error) {
                console.error('Error updating user:', error);
                return { success: false, error };
            }
        },

        // Delete user
        async delete(id) {
            try {
                await deleteDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id));
                return { success: true };
            } catch (error) {
                console.error('Error deleting user:', error);
                return { success: false, error };
            }
        }
    },

    // Attendance Management Functions
    attendance: {
        // Get all attendance data
        async getAttendanceData() {
            try {
                const monthsSnapshot = await getDocs(
                    collection(db, FirebaseDatabase.COLLECTIONS.ATTENDANCE)
                );
                
                const attendanceData = {};
                monthsSnapshot.forEach(doc => {
                    attendanceData[doc.id] = doc.data();
                });
                
                return attendanceData;
            } catch (error) {
                console.error('Error getting attendance data:', error);
                return {};
            }
        },
        
        // Get attendance for a specific month
        async getMonthAttendance(year, month) {
            try {
                // Format month key (YYYY-MM)
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                
                const monthDoc = await getDoc(
                    doc(db, FirebaseDatabase.COLLECTIONS.ATTENDANCE, monthKey)
                );
                
                if (monthDoc.exists()) {
                    return monthDoc.data();
                }
                
                return {};
            } catch (error) {
                console.error('Error getting month attendance:', error);
                return {};
            }
        },
        
        // Save attendance for a specific month
        async saveMonthAttendance(year, month, data) {
            try {
                // Format month key (YYYY-MM)
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                
                await setDoc(
                    doc(db, FirebaseDatabase.COLLECTIONS.ATTENDANCE, monthKey),
                    data
                );
                
                return { success: true };
            } catch (error) {
                console.error('Error saving month attendance:', error);
                return { success: false, error };
            }
        },
        
        // Get student attendance for a specific month
        async getStudentMonthAttendance(studentId, year, month) {
            try {
                // Format month key (YYYY-MM)
                const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
                
                const monthDoc = await getDoc(
                    doc(db, FirebaseDatabase.COLLECTIONS.ATTENDANCE, monthKey)
                );
                
                if (monthDoc.exists()) {
                    const monthData = monthDoc.data();
                    return monthData[studentId] || {};
                }
                
                return {};
            } catch (error) {
                console.error('Error getting student month attendance:', error);
                return {};
            }
        }
    },

    // Authentication Functions
    auth: {
        // Login user
        async login(id, password) {
            try {
                console.log(`Attempting to login user with ID: ${id}`);
                
                // Validate input
                if (!id || !password) {
                    console.error('Login failed: Missing ID or password');
                    return { 
                        success: false, 
                        error: 'معرف الطالب وكلمة المرور مطلوبان',
                        details: 'Missing ID or password'
                    };
                }
                
                // Check if we're connected to Firebase
                if (this.connectionIssuesDetected) {
                    console.warn('Login: Firebase connection issues detected, cannot proceed with Firebase login');
                    return { 
                        success: false, 
                        error: 'تعذر الاتصال بقاعدة البيانات',
                        details: 'Firebase connection issues detected',
                        connectionIssue: true
                    };
                }
                
                // Get user document from Firestore
                let userDoc;
                try {
                    userDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id));
                } catch (firestoreError) {
                    console.error('Firestore error during login:', firestoreError);
                    
                    // Check if this is a network-related error
                    const errorMessage = firestoreError.message.toLowerCase();
                    const isNetworkError = 
                        errorMessage.includes('network') || 
                        errorMessage.includes('offline') || 
                        errorMessage.includes('unavailable') ||
                        errorMessage.includes('timeout') ||
                        errorMessage.includes('connection');
                        
                    return { 
                        success: false, 
                        error: 'خطأ في الاتصال بقاعدة البيانات',
                        details: `Firestore error: ${firestoreError.message}`,
                        connectionIssue: isNetworkError
                    };
                }
                
                // Check if user exists
                if (!userDoc.exists()) {
                    console.error(`Login failed: User with ID ${id} not found`);
                    return { 
                        success: false, 
                        error: 'معرف الطالب أو كلمة المرور غير صحيحة',
                        details: `User with ID ${id} not found`
                    };
                }
                
                // Get user data
                const userData = userDoc.data();
                console.log(`User found: ${userData.name}, checking password...`);
                
                // Check password
                if (userData.password === password) {
                    console.log('Password correct, login successful');
                    
                    // Store current user in localStorage
                    const userInfo = {
                        id: userDoc.id,
                        name: userData.name,
                        grade: userData.grade,
                        group: userData.group,
                        role: userData.role || 'student',
                        loginTime: new Date().toISOString(),
                        loginMode: 'firebase'
                    };
                    
                    localStorage.setItem('sms_current_user', JSON.stringify(userInfo));
                    localStorage.setItem('lastLoginMode', 'firebase');
                    
                    return { 
                        success: true, 
                        user: { id: userDoc.id, ...userData } 
                    };
                } else {
                    console.error('Login failed: Incorrect password');
                    return { 
                        success: false, 
                        error: 'معرف الطالب أو كلمة المرور غير صحيحة',
                        details: 'Incorrect password'
                    };
                }
            } catch (error) {
                console.error('Unexpected error during login:', error);
                
                // Check if this might be a connection issue
                const errorMessage = error.message.toLowerCase();
                const isConnectionIssue = 
                    errorMessage.includes('network') || 
                    errorMessage.includes('offline') || 
                    errorMessage.includes('unavailable') ||
                    errorMessage.includes('timeout') ||
                    errorMessage.includes('connection') ||
                    errorMessage.includes('failed to fetch');
                    
                return { 
                    success: false, 
                    error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول',
                    details: error.message,
                    connectionIssue: isConnectionIssue
                };
            }
        },

        // Admin login
        async adminLogin(password) {
            try {
                console.log('Attempting admin login');
                
                // Validate input
                if (!password) {
                    console.error('Admin login failed: Missing password');
                    return { 
                        success: false, 
                        error: 'كلمة المرور مطلوبة',
                        details: 'Missing password'
                    };
                }
                
                // Check if we're connected to Firebase
                if (this.connectionIssuesDetected) {
                    console.warn('Admin Login: Firebase connection issues detected, cannot proceed with Firebase login');
                    return { 
                        success: false, 
                        error: 'تعذر الاتصال بقاعدة البيانات',
                        details: 'Firebase connection issues detected',
                        connectionIssue: true
                    };
                }
                
                // Get admin document from Firestore
                let adminDoc;
                try {
                    adminDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'));
                } catch (firestoreError) {
                    console.error('Firestore error during admin login:', firestoreError);
                    
                    // Check if this is a network-related error
                    const errorMessage = firestoreError.message.toLowerCase();
                    const isNetworkError = 
                        errorMessage.includes('network') || 
                        errorMessage.includes('offline') || 
                        errorMessage.includes('unavailable') ||
                        errorMessage.includes('timeout') ||
                        errorMessage.includes('connection');
                        
                    return { 
                        success: false, 
                        error: 'خطأ في الاتصال بقاعدة البيانات',
                        details: `Firestore error: ${firestoreError.message}`,
                        connectionIssue: isNetworkError
                    };
                }
                
                // Check if admin settings exist
                if (!adminDoc.exists()) {
                    console.error('Admin login failed: Admin settings not found');
                    
                    // Create default admin settings if they don't exist
                    try {
                        await setDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'), {
                            password: 'admin123'
                        });
                        console.log('Created default admin settings');
                        
                        // Check if the provided password matches the default
                        if (password === 'admin123') {
                            console.log('Admin login successful with default password');
                            
                            // Set admin status in localStorage
                            localStorage.setItem('sms_admin_logged_in', 'true');
                            localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                            
                            return { success: true };
                        }
                    } catch (error) {
                        console.error('Failed to create default admin settings:', error);
                    }
                    
                    return { 
                        success: false, 
                        error: 'إعدادات المسؤول غير موجودة',
                        details: 'Admin settings not found'
                    };
                }
                
                // Get admin data
                const adminData = adminDoc.data();
                
                // Check password
                if (adminData.password === password) {
                    console.log('Admin password correct, login successful');
                    
                    // Set admin status in localStorage
                    localStorage.setItem('sms_admin_logged_in', 'true');
                    localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                    localStorage.setItem('lastLoginMode', 'firebase');
                    
                    return { success: true };
                } else {
                    console.error('Admin login failed: Incorrect password');
                    return { 
                        success: false, 
                        error: 'كلمة المرور غير صحيحة',
                        details: 'Incorrect password'
                    };
                }
            } catch (error) {
                console.error('Unexpected error during admin login:', error);
                
                // Check if this might be a connection issue
                const errorMessage = error.message.toLowerCase();
                const isConnectionIssue = 
                    errorMessage.includes('network') || 
                    errorMessage.includes('offline') || 
                    errorMessage.includes('unavailable') ||
                    errorMessage.includes('timeout') ||
                    errorMessage.includes('connection') ||
                    errorMessage.includes('failed to fetch');
                    
                return { 
                    success: false, 
                    error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول',
                    details: error.message,
                    connectionIssue: isConnectionIssue
                };
            }
        },

        // Logout current user
        logout() {
            localStorage.removeItem('sms_current_user');
            localStorage.removeItem('sms_admin_logged_in');
        },

        // Get current logged in user
        getCurrentUser() {
            const userJson = localStorage.getItem('sms_current_user');
            return userJson ? JSON.parse(userJson) : null;
        },

        // Check if user is logged in
        isLoggedIn() {
            return !!localStorage.getItem('sms_current_user');
        },

        // Change admin password
        async changeAdminPassword(newPassword) {
            try {
                await updateDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'), {
                    password: newPassword
                });
                
                return { success: true };
            } catch (error) {
                console.error('Error changing admin password:', error);
                return { success: false, error: error.message };
            }
        }
    }
};

// Initialize database when script loads
FirebaseDatabase.init().catch(error => {
    console.error("Error initializing Firebase Database:", error);
});

// Expose to global scope
window.FirebaseDatabase = FirebaseDatabase;

export default FirebaseDatabase;
