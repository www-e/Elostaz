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

    // Flag to track if ad blocker is detected
    adBlockerDetected: false,

    // Detect ad blockers and other connection issues
    async detectConnectionIssues() {
        console.log('Checking for connection issues...');

        // Create a test image URL that ad blockers typically block
        const testImageUrl = 'https://www.google-analytics.com/collect?v=1&t=event';

        try {
            // Try to fetch a resource that ad blockers typically block
            const testFetch = await fetch(testImageUrl, { 
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache',
                credentials: 'omit',
                redirect: 'error',
                referrerPolicy: 'no-referrer'
            });

            // If we get here, ad blocker might not be active
            console.log('No ad blocker detected via fetch test');
            this.adBlockerDetected = false;
        } catch (error) {
            // Fetch failed, might be an ad blocker
            console.warn('Possible ad blocker detected via fetch test:', error);
            this.adBlockerDetected = true;
        }

        // Additional test using image loading
        const testImage = new Image();
        let imageLoaded = false;

        // Set up timeout to check if image loads
        const imageTimeout = setTimeout(() => {
            if (!imageLoaded) {
                console.warn('Possible ad blocker detected via image load test (timeout)');
                this.adBlockerDetected = true;
                this.showAdBlockerWarning();
            }
        }, 2000);

        // Image loaded successfully
        testImage.onload = () => {
            imageLoaded = true;
            clearTimeout(imageTimeout);
            console.log('No ad blocker detected via image load test');
        };

        // Image failed to load
        testImage.onerror = () => {
            imageLoaded = true; // Set to true to prevent timeout from firing
            clearTimeout(imageTimeout);
            console.warn('Possible ad blocker detected via image load test (error)');
            this.adBlockerDetected = true;
            this.showAdBlockerWarning();
        };

        // Start loading the test image
        testImage.src = testImageUrl;

        return this.adBlockerDetected;
    },

    // Show ad blocker warning to the user
    showAdBlockerWarning() {
        // Only show if we're in a browser environment
        if (typeof document === 'undefined') return;

        // Create warning element if it doesn't exist
        let warning = document.getElementById('ad-blocker-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'ad-blocker-warning';
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
                        <strong style="font-size: 16px;">⚠️ تم اكتشاف مانع إعلانات</strong>
                        <p style="margin: 8px 0 0; font-size: 14px;">
                            قد يمنع مانع الإعلانات الخاص بك الاتصال بخدمة Firebase. يرجى تعطيل مانع الإعلانات أو السماح بالوصول إلى النطاقات التالية:
                            <br>
                            <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-size: 12px;">*.firebaseio.com</code>,
                            <code style="background: #f8f9fa; padding: 2px 4px; border-radius: 3px; font-size: 12px;">*.googleapis.com</code>
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

            // Check Firebase connectivity by making a simple request
            try {
                await getDocs(collection(db, this.COLLECTIONS.SETTINGS));
                console.log('Firebase connection test successful');
            } catch (error) {
                console.error('Firebase connection test failed:', error);
                throw new Error('فشل الاتصال بقاعدة البيانات. تأكد من اتصالك بالإنترنت وعدم وجود مانع للإعلانات.');
            }

            // Detect ad blockers and other connection issues
            await this.detectConnectionIssues();

            // Check if admin settings exist, create if not
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

            console.log('Firebase Database initialized');
        } catch (error) {
            console.error('Error initializing Firebase Database:', error);
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
                
                // Get user document from Firestore
                let userDoc;
                try {
                    userDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id));
                } catch (firestoreError) {
                    console.error('Firestore error during login:', firestoreError);
                    return { 
                        success: false, 
                        error: 'خطأ في الاتصال بقاعدة البيانات',
                        details: `Firestore error: ${firestoreError.message}`
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
                        loginTime: new Date().toISOString()
                    };
                    
                    localStorage.setItem('sms_current_user', JSON.stringify(userInfo));
                    
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
                return { 
                    success: false, 
                    error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول',
                    details: error.message 
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
                
                // Get admin document from Firestore
                let adminDoc;
                try {
                    adminDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'));
                } catch (firestoreError) {
                    console.error('Firestore error during admin login:', firestoreError);
                    return { 
                        success: false, 
                        error: 'خطأ في الاتصال بقاعدة البيانات',
                        details: `Firestore error: ${firestoreError.message}`
                    };
                }
                
                // Check if admin document exists
                if (!adminDoc.exists()) {
                    console.error('Admin login failed: Admin settings not found');
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
                    
                    // Store admin session in localStorage
                    localStorage.setItem('sms_admin_logged_in', 'true');
                    localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                    
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
                return { 
                    success: false, 
                    error: 'حدث خطأ غير متوقع أثناء تسجيل الدخول',
                    details: error.message 
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
