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

    // Initialize the database
    async init() {
        try {
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
                const userDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.USERS, id));
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    
                    // Check password
                    if (userData.password === password) {
                        // Store current user in localStorage
                        localStorage.setItem('sms_current_user', JSON.stringify({
                            id: userDoc.id,
                            name: userData.name,
                            grade: userData.grade,
                            group: userData.group,
                            role: userData.role || 'student'
                        }));
                        
                        return { success: true, user: { id: userDoc.id, ...userData } };
                    }
                }
                
                return { success: false, error: 'Invalid ID or password' };
            } catch (error) {
                console.error('Error logging in:', error);
                return { success: false, error: error.message };
            }
        },

        // Admin login
        async adminLogin(password) {
            try {
                const adminDoc = await getDoc(doc(db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'admin'));
                
                if (adminDoc.exists()) {
                    const adminData = adminDoc.data();
                    
                    // Check password
                    if (adminData.password === password) {
                        // Store admin session in localStorage
                        localStorage.setItem('sms_admin_logged_in', 'true');
                        
                        return { success: true };
                    }
                }
                
                return { success: false, error: 'Invalid admin password' };
            } catch (error) {
                console.error('Error admin login:', error);
                return { success: false, error: error.message };
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
