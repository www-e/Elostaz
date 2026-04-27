/**
 * Settings Page JavaScript
 * Handles system settings and data migration
 */

import DatabaseAdapter from './database-adapter.js';
import DataMigration from './data-migration.js';
import { getFirebaseConfig } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const settingsContent = document.getElementById('settingsContent');
    const adminPasswordInput = document.getElementById('adminPassword');
    const loginBtn = document.getElementById('loginBtn');
    
    const useFirebaseSwitch = document.getElementById('useFirebaseSwitch');
    const localStorageInfo = document.getElementById('localStorageInfo');
    const firebaseInfo = document.getElementById('firebaseInfo');
    const firebaseConfigSection = document.getElementById('firebaseConfigSection');
    const dataMigrationSection = document.getElementById('dataMigrationSection');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const migrateDataBtn = document.getElementById('migrateDataBtn');
    
    // Alert Modal Elements
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    const alertModalTitle = document.getElementById('alertModalTitle');
    const alertModalMessage = document.getElementById('alertModalMessage');
    
    // Check if already authenticated
    checkAuthentication();
    
    // Event Listeners
    loginBtn.addEventListener('click', authenticateAdmin);
    adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authenticateAdmin();
        }
    });
    
    useFirebaseSwitch.addEventListener('change', toggleStorageInfo);
    saveSettingsBtn.addEventListener('click', saveSettings);
    migrateDataBtn.addEventListener('click', migrateData);
    
    // Check if admin is already authenticated
    function checkAuthentication() {
        const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
        
        if (isAuthenticated) {
            showSettingsPage();
            initSettings();
        }
    }
    
    // Authenticate admin
    async function authenticateAdmin() {
        const password = adminPasswordInput.value.trim();
        
        if (!password) {
            showAlert('خطأ', 'يرجى إدخال كلمة المرور');
            return;
        }
        
        try {
            // Get admin password from database
            let adminPassword;
            
            // Try to get from Firebase first if enabled
            if (localStorage.getItem('useFirebase') === 'true') {
                try {
                    const db = DatabaseAdapter.getDatabase();
                    const settings = await db.getAdminSettings();
                    adminPassword = settings?.password;
                } catch (error) {
                    console.error('Error getting admin settings from Firebase:', error);
                }
            }
            
            // Fallback to localStorage
            if (!adminPassword) {
                const adminSettings = JSON.parse(localStorage.getItem('adminSettings') || '{"password":"admin123"}');
                adminPassword = adminSettings.password;
            }
            
            if (password === adminPassword) {
                // Set authentication in session storage (will be cleared when browser is closed)
                sessionStorage.setItem('adminAuthenticated', 'true');
                showSettingsPage();
                initSettings();
            } else {
                showAlert('خطأ', 'كلمة المرور غير صحيحة');
                adminPasswordInput.value = '';
            }
        } catch (error) {
            console.error('Authentication error:', error);
            showAlert('خطأ', 'حدث خطأ أثناء التحقق من كلمة المرور');
        }
    }
    
    // Show settings page after authentication
    function showSettingsPage() {
        loginForm.style.display = 'none';
        settingsContent.style.display = 'block';
    }
    
    // Initialize settings
    function initSettings() {
        // Check if Firebase is enabled
        const useFirebase = localStorage.getItem('useFirebase') === 'true';
        useFirebaseSwitch.checked = useFirebase;
        
        // Show/hide appropriate sections
        toggleStorageInfo();
    }
    
    // Toggle storage info based on switch
    function toggleStorageInfo() {
        const useFirebase = useFirebaseSwitch.checked;
        
        if (useFirebase) {
            localStorageInfo.classList.remove('active');
            firebaseInfo.classList.add('active');
            firebaseConfigSection.style.display = 'block';
            dataMigrationSection.style.display = 'block';
        } else {
            localStorageInfo.classList.add('active');
            firebaseInfo.classList.remove('active');
            firebaseConfigSection.style.display = 'none';
            dataMigrationSection.style.display = 'none';
        }
    }
    
    // Save settings
    function saveSettings() {
        const useFirebase = useFirebaseSwitch.checked;
        
        if (useFirebase) {
            // Use the hardcoded Firebase config
            const firebaseConfig = getFirebaseConfig();
            
            // Save the config to localStorage for compatibility with existing code
            localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));
            
            // Set database mode to Firebase
            localStorage.setItem('useFirebase', 'true');
            DatabaseAdapter.setMode('firebase');
        } else {
            // Set database mode to localStorage
            localStorage.setItem('useFirebase', 'false');
            DatabaseAdapter.setMode('local');
        }
        
        showAlert('تم', 'تم حفظ الإعدادات بنجاح');
    }
    
    // Migrate data from localStorage to Firebase
    async function migrateData() {
        try {
            // Use the hardcoded Firebase config
            const firebaseConfig = getFirebaseConfig();
            
            // Save the config to localStorage for compatibility with existing code
            localStorage.setItem('firebaseConfig', JSON.stringify(firebaseConfig));
            
            // Confirm migration
            if (!confirm('سيتم نقل جميع البيانات من التخزين المحلي إلى التخزين السحابي. هل أنت متأكد؟')) {
                return;
            }
            
            // Show loading message
            showAlert('جاري التنفيذ', 'جاري نقل البيانات، يرجى الانتظار...');
            
            // Migrate data
            const result = await DataMigration.migrateAllData();
            
            if (result.success) {
                showAlert('تم', 'تم نقل البيانات بنجاح');
            } else {
                showAlert('خطأ', `حدث خطأ أثناء نقل البيانات: ${result.error.message}`);
            }
        } catch (error) {
            console.error('Error migrating data:', error);
            showAlert('خطأ', `حدث خطأ أثناء نقل البيانات: ${error.message}`);
        }
    }
    
    // Get Firebase config from the hardcoded values
    function getFirebaseConfigFromStorage() {
        // Use the hardcoded Firebase config
        return getFirebaseConfig();
    }
    
    // Show alert modal
    function showAlert(title, message) {
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        alertModal.show();
    }
});
