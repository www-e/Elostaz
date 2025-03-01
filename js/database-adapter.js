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
            } catch (error) {
                console.error('Failed to initialize Firebase database:', error);
                // Fallback to localStorage if Firebase initialization fails
                this.setMode('local');
                await LocalDatabase.init();
            }
        } else {
            await LocalDatabase.init();
            console.log('Local database initialized successfully');
        }
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
            const db = DatabaseAdapter.getDatabase();
            return await db.auth.login(username, password);
        },
        
        // Logout user
        async logout() {
            const db = DatabaseAdapter.getDatabase();
            return await db.auth.logout();
        },
        
        // Get current user
        getCurrentUser() {
            const db = DatabaseAdapter.getDatabase();
            return db.auth.getCurrentUser();
        },
        
        // Check if user is logged in
        isLoggedIn() {
            const db = DatabaseAdapter.getDatabase();
            return db.auth.isLoggedIn();
        },
        
        // Check if user is admin
        isAdmin() {
            const db = DatabaseAdapter.getDatabase();
            return db.auth.isAdmin();
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
