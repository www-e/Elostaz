/**
 * Firebase Database Service
 * Provides functions for interacting with Firebase Firestore
 * Enhanced with improved password synchronization and security
 */

import { db, auth, app } from './firebase-config.js';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js';
import { browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { default as passwordUtils } from './password-utils.js';

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

    // Flag to track if Firebase is initialized
    isInitialized: false,

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

    // Initialize Firebase Database
    async init() {
        try {
            // Check for connection issues
            console.log('Checking for connection issues...');
            try {
                // Test internet connection by pinging Firebase
                await fetch('https://firebasestorage.googleapis.com/v0/b/alostaz-student-system-2fffd.appspot.com/o?name=connection_test', {
                    method: 'HEAD',
                    mode: 'no-cors',
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                console.log('Firebase connection test successful');
            } catch (connectionError) {
                console.error('Firebase connection test failed:', connectionError);
                localStorage.setItem('useFirebase', 'false');
                return false;
            }

            // Initialize Firebase if not already initialized
            if (!this.isInitialized) {
                // Initialize Firebase Auth persistence
                try {
                    await setPersistence(auth, browserLocalPersistence);
                    console.log('Firebase Auth persistence set to local');
                } catch (authError) {
                    console.error('Error setting auth persistence:', authError);
                }
                
                // Set initialized flag
                this.isInitialized = true;
                localStorage.setItem('useFirebase', 'true');
            }
            
            // Initialize settings
            try {
                // Check if settings collection exists
                const settingsCollection = this.COLLECTIONS.SETTINGS;
                const adminDoc = await getDoc(doc(db, settingsCollection, 'admin'));
                
                // If admin settings don't exist, create them
                if (!adminDoc.exists()) {
                    console.log('Admin settings not found, creating default settings...');
                    
                    // Check if we have a local password to use
                    const localPassword = localStorage.getItem('sms_admin_password') || 
                                         localStorage.getItem('admin_password') || 
                                         localStorage.getItem('ADMIN_PASSWORD');
                    
                    if (localPassword && localPassword.length === 64) {
                        // Use existing hashed password
                        await setDoc(doc(db, settingsCollection, 'admin'), {
                            password: localPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Created admin settings using existing hashed password');
                    } else if (localPassword) {
                        // Hash the existing plaintext password
                        const hashedPassword = await passwordUtils.hashPassword(localPassword);
                        await setDoc(doc(db, settingsCollection, 'admin'), {
                            password: hashedPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Created admin settings using hashed version of existing password');
                    } else {
                        // Use default password
                        const hashedDefaultPassword = await passwordUtils.hashPassword('Elostaz@2025');
                        await setDoc(doc(db, settingsCollection, 'admin'), {
                            password: hashedDefaultPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Created admin settings with default password');
                    }
                } else {
                    // Check if the admin document needs upgrading
                    const adminData = adminDoc.data();
                    let needsUpdate = false;
                    
                    if (!adminData.isHashed && adminData.password) {
                        // Upgrade plaintext password to hashed
                        const hashedPassword = await passwordUtils.hashPassword(adminData.password);
                        await updateDoc(doc(db, settingsCollection, 'admin'), {
                            password: hashedPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Upgraded admin password from plaintext to hashed');
                        needsUpdate = true;
                    }
                    
                    if (!adminData.lastModified) {
                        // Add lastModified field if missing
                        await updateDoc(doc(db, settingsCollection, 'admin'), {
                            lastModified: new Date().toISOString()
                        });
                        console.log('Added lastModified timestamp to admin settings');
                        needsUpdate = true;
                    }
                    
                    if (needsUpdate) {
                        console.log('Admin settings were upgraded');
                    } else {
                        console.log('Admin settings are up to date');
                    }
                }
                
                // Notify the local database to sync the admin password
                this.triggerPasswordSync();
            } catch (settingsError) {
                console.error('Error initializing admin settings:', settingsError);
            }
            
            // Initialize users collection
            try {
                // Check if users collection exists
                const usersCollection = this.COLLECTIONS.USERS;
                const usersSnapshot = await getDocs(collection(db, usersCollection));
                
                if (usersSnapshot.empty) {
                    console.log('Users collection is empty, creating metadata document...');
                    
                    // Create a metadata document to indicate the collection exists
                    await setDoc(doc(db, usersCollection, '_metadata'), {
                        collectionExists: true,
                        lastUpdated: new Date().toISOString(),
                        message: 'No students have been added yet'
                    });
                    
                    console.log('Metadata document created in users collection');
                } else {
                    console.log(`Users collection exists with ${usersSnapshot.size} documents`);
                }
            } catch (usersError) {
                console.error('Error checking users collection:', usersError);
            }
            
            console.log('Firebase Database initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing Firebase Database:', error);
            return false;
        }
    },
    
    // Trigger a password sync in the local database
    triggerPasswordSync() {
        if (window.Database && typeof window.Database.syncAdminPasswordFromFirebase === 'function') {
            console.log('Triggering password sync in local database');
            window.Database.syncAdminPasswordFromFirebase();
        }
    },

    // User Management Functions
    users: {
        // Get all users
        async getAll() {
            try {
                // Check if Firebase is initialized
                if (!this.isInitialized) {
                    console.warn('Firebase is not initialized yet, trying to initialize...');
                    const initialized = await this.init();
                    if (!initialized) {
                        console.error('Failed to initialize Firebase');
                        return { 
                            success: false, 
                            error: 'فشل الاتصال بقاعدة البيانات',
                            data: []
                        };
                    }
                }
                
                const usersCollection = collection(db, FirebaseDatabase.COLLECTIONS.USERS);
                
                try {
                    const usersSnapshot = await getDocs(usersCollection);
                    
                    // Check if the collection is empty
                    if (usersSnapshot.empty) {
                        console.log('No students found in Firebase database');
                        
                        // Create a metadata document to indicate the collection exists but is empty
                        try {
                            await setDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, '_metadata'), {
                                collectionExists: true,
                                lastUpdated: new Date().toISOString(),
                                message: 'No students have been added yet'
                            });
                            console.log('Created metadata document for empty users collection');
                        } catch (metadataError) {
                            console.error('Error creating metadata document:', metadataError);
                        }
                        
                        return { 
                            success: true, 
                            data: [],
                            message: 'لا يوجد طلاب في قاعدة البيانات'
                        };
                    }
                    
                    // Process the student data
                    const users = [];
                    usersSnapshot.forEach(doc => {
                        // Skip the metadata document
                        if (doc.id !== '_metadata') {
                            users.push({ id: doc.id, ...doc.data() });
                        }
                    });
                    
                    console.log(`Retrieved ${users.length} students from Firebase`);
                    
                    return { 
                        success: true, 
                        data: users,
                        count: users.length
                    };
                } catch (firestoreError) {
                    console.error('Error accessing Firestore:', firestoreError);
                    
                    // Check if it's a network error
                    if (firestoreError.code === 'unavailable' || 
                        firestoreError.code === 'failed-precondition' ||
                        firestoreError.message.includes('network') ||
                        firestoreError.message.includes('connection')) {
                        
                        return { 
                            success: false, 
                            error: 'لا يمكن الوصول إلى قاعدة البيانات. يرجى التحقق من اتصالك بالإنترنت.',
                            networkError: true,
                            data: []
                        };
                    }
                    
                    return { 
                        success: false, 
                        error: firestoreError.message,
                        data: []
                    };
                }
            } catch (error) {
                console.error('Error getting users from Firebase:', error);
                return { 
                    success: false, 
                    error: error.message,
                    data: []
                };
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
                
                // Import password utilities
                const passwordUtils = window.passwordUtils;
                
                // Check if admin settings exist
                if (!adminDoc.exists()) {
                    console.error('Admin login failed: Admin settings not found');
                    
                    // Create default admin settings if they don't exist
                    try {
                        // Hash a more secure default password
                        const hashedDefaultPassword = await passwordUtils.hashPassword('Elostaz@2025');
                        
                        await setDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'), {
                            password: hashedDefaultPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Created default admin settings with secure hashed password');
                        
                        // Check if the provided password matches the default
                        if (await passwordUtils.verifyPassword(password, hashedDefaultPassword)) {
                            console.log('Admin login successful with default password');
                            
                            // Set admin status in localStorage
                            localStorage.setItem('sms_admin_logged_in', 'true');
                            localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                            localStorage.setItem('lastLoginMode', 'firebase');
                            
                            // Also sync password to local storage for other pages
                            localStorage.setItem('sms_admin_password', hashedDefaultPassword);
                            localStorage.setItem('admin_password', hashedDefaultPassword);
                            localStorage.setItem('ADMIN_PASSWORD', hashedDefaultPassword);
                            localStorage.setItem('sms_admin_password_last_synced', new Date().getTime().toString());
                            
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
                
                // Check if password is hashed
                if (adminData.isHashed) {
                    // Verify the password against the stored hash
                    const isValid = await passwordUtils.verifyPassword(password, adminData.password);
                    
                    if (isValid) {
                        console.log('Admin password correct, login successful');
                        
                        // Set admin status in localStorage
                        localStorage.setItem('sms_admin_logged_in', 'true');
                        localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                        localStorage.setItem('lastLoginMode', 'firebase');
                        
                        // Also sync password to local storage for other pages
                        localStorage.setItem('sms_admin_password', adminData.password);
                        localStorage.setItem('admin_password', adminData.password);
                        localStorage.setItem('ADMIN_PASSWORD', adminData.password);
                        localStorage.setItem('sms_admin_password_last_synced', new Date().getTime().toString());
                        
                        return { success: true };
                    } else {
                        console.error('Admin login failed: Incorrect password');
                        return { 
                            success: false, 
                            error: 'كلمة المرور غير صحيحة',
                            details: 'Incorrect password'
                        };
                    }
                } else {
                    // Legacy plaintext password check
                    if (adminData.password === password) {
                        console.log('Admin password correct, login successful');
                        
                        // Upgrade to hashed password
                        const hashedPassword = await passwordUtils.hashPassword(password);
                        await updateDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'), {
                            password: hashedPassword,
                            isHashed: true,
                            lastModified: new Date().toISOString()
                        });
                        console.log('Upgraded admin password to hashed version');
                        
                        // Set admin status in localStorage
                        localStorage.setItem('sms_admin_logged_in', 'true');
                        localStorage.setItem('sms_admin_login_time', new Date().toISOString());
                        localStorage.setItem('lastLoginMode', 'firebase');
                        
                        // Also sync password to local storage for other pages
                        localStorage.setItem('sms_admin_password', hashedPassword);
                        localStorage.setItem('admin_password', hashedPassword);
                        localStorage.setItem('ADMIN_PASSWORD', hashedPassword);
                        localStorage.setItem('sms_admin_password_last_synced', new Date().getTime().toString());
                        
                        return { success: true };
                    } else {
                        console.error('Admin login failed: Incorrect password');
                        return { 
                            success: false, 
                            error: 'كلمة المرور غير صحيحة',
                            details: 'Incorrect password'
                        };
                    }
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
                // Use global passwordUtils object instead of import
                const passwordUtils = window.passwordUtils;
                
                // Hash the new password
                const hashedPassword = await passwordUtils.hashPassword(newPassword);
                
                // Update in Firebase
                console.log('Updating admin password in Firebase');
                await updateDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'), {
                    password: hashedPassword,
                    isHashed: true,
                    lastModified: new Date().toISOString()
                });
                
                // Also update in localStorage for consistency
                console.log('Updating admin password in localStorage for consistency');
                localStorage.setItem('sms_admin_password', hashedPassword);
                localStorage.setItem('admin_password', hashedPassword);
                localStorage.setItem('ADMIN_PASSWORD', hashedPassword);
                localStorage.setItem('sms_admin_password_last_synced', new Date().getTime().toString());
                
                return { success: true };
            } catch (error) {
                console.error('Error changing admin password:', error);
                return { success: false, error: error.message };
            }
        }
    },

    // Utility methods for direct access to Firebase
    getFirestore() {
        return db;
    },
    
    doc(firestore, collection, docId) {
        return doc(firestore, collection, docId);
    },
    
    setDoc(docRef, data) {
        return setDoc(docRef, data);
    },
    
    updateDoc(docRef, data) {
        return updateDoc(docRef, data);
    }
};

// Initialize the isInitialized property
FirebaseDatabase.isInitialized = false;

// Set isInitialized to true when database is initialized successfully
const originalInit = FirebaseDatabase.init;
FirebaseDatabase.init = async function() {
    const result = await originalInit.apply(this, arguments);
    if (result && result.success) {
        FirebaseDatabase.isInitialized = true;
    }
    return result;
};

// Expose FirebaseDatabase to the global window object
window.FirebaseDatabase = FirebaseDatabase;

// Also support ES6 modules
export { FirebaseDatabase as default, FirebaseDatabase };

// Initialize database when script loads
FirebaseDatabase.init().catch(error => {
    console.error("Error initializing Firebase Database:", error);
});
