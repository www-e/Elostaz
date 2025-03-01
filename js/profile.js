/**
 * Student Profile Page JavaScript
 * Handles student authentication and profile management
 */

import Database from './database.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginSection = document.getElementById('loginSection');
    const profileSection = document.getElementById('profileSection');
    const loginForm = document.getElementById('loginForm');
    const studentId = document.getElementById('studentId');
    const studentPassword = document.getElementById('studentPassword');
    const studentNameDisplay = document.getElementById('studentNameDisplay');
    const studentIdDisplay = document.getElementById('studentIdDisplay');
    const studentGradeDisplay = document.getElementById('studentGradeDisplay');
    const studentGroupDisplay = document.getElementById('studentGroupDisplay');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutNavItem = document.getElementById('logoutNavItem');

    // Change Password Modal Elements
    const changePasswordModal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const savePasswordButton = document.getElementById('savePasswordButton');

    // Alert Modal Elements
    const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    const alertModalTitle = document.getElementById('alertModalTitle');
    const alertModalMessage = document.getElementById('alertModalMessage');

    // Initialize Profile Page
    function initProfilePage() {
        // Register event handlers
        loginForm.addEventListener('submit', handleLogin);
        changePasswordBtn.addEventListener('click', () => changePasswordModal.show());
        savePasswordButton.addEventListener('click', handleChangePassword);
        logoutBtn.addEventListener('click', handleLogout);
        
        // Update UI based on auth status
        const isLoggedIn = Database.auth.isLoggedIn();
        
        if (isLoggedIn) {
            const user = Database.auth.getCurrentUser();
            displayUserProfile(user);
            console.log('Logged in user:', user); // Debug the current user
        } else {
            updateUIBasedOnAuthStatus();
        }
    }

    initProfilePage();

    // Login Handler
    function handleLogin(e) {
        e.preventDefault();
        
        const id = studentId.value.trim();
        const password = studentPassword.value.trim();
        
        if (!id) {
            showValidationError(studentId, 'يرجى إدخال معرف الطالب');
            return;
        }
        
        if (!password) {
            showValidationError(studentPassword, 'يرجى إدخال كلمة المرور');
            return;
        }
        
        const result = Database.auth.login(id, password);
        
        if (result.success) {
            displayUserProfile(result.user);
            loginForm.reset();
        } else {
            showValidationError(studentPassword, result.message);
        }
    }

    // Change Password Handler
    function handleChangePassword() {
        const currentPasswordValue = currentPassword.value.trim();
        const newPasswordValue = newPassword.value.trim();
        const confirmPasswordValue = confirmPassword.value.trim();
        
        // Validate inputs
        let isValid = true;
        
        if (!currentPasswordValue) {
            showValidationError(currentPassword, 'يرجى إدخال كلمة المرور الحالية');
            isValid = false;
        }
        
        if (!newPasswordValue) {
            showValidationError(newPassword, 'يرجى إدخال كلمة المرور الجديدة');
            isValid = false;
        }
        
        if (!confirmPasswordValue) {
            showValidationError(confirmPassword, 'يرجى تأكيد كلمة المرور');
            isValid = false;
        }
        
        if (newPasswordValue !== confirmPasswordValue) {
            showValidationError(confirmPassword, 'كلمة المرور غير متطابقة');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Verify current password
        const currentUser = Database.auth.getCurrentUser();
        
        if (!currentUser || currentUser.password !== currentPasswordValue) {
            showValidationError(currentPassword, 'كلمة المرور الحالية غير صحيحة');
            return;
        }
        
        // Update password
        const result = Database.users.update(currentUser.id, { password: newPasswordValue });
        
        if (result.success) {
            // Update current user in session
            Database.auth.logout();
            Database.auth.login(currentUser.id, newPasswordValue);
            
            showAlert('تم بنجاح', 'تم تغيير كلمة المرور بنجاح');
            changePasswordForm.reset();
            changePasswordModal.hide();
        } else {
            showAlert('خطأ', result.message);
        }
    }

    // Logout Handler
    function handleLogout(e) {
        e.preventDefault();
        
        Database.auth.logout();
        updateUIBasedOnAuthStatus();
    }

    // Display User Profile
    function displayUserProfile(user) {
        // Save current student to localStorage for use by attendance system
        localStorage.setItem('currentStudent', JSON.stringify(user));
        
        studentNameDisplay.textContent = user.name;
        studentIdDisplay.textContent = user.id;
        studentGradeDisplay.textContent = user.grade;
        studentGroupDisplay.textContent = user.group;
        
        updateUIBasedOnAuthStatus();
    }

    // Update UI Based on Auth Status
    function updateUIBasedOnAuthStatus() {
        const isLoggedIn = Database.auth.isLoggedIn();
        
        if (isLoggedIn) {
            loginSection.style.display = 'none';
            profileSection.style.display = 'block';
            logoutNavItem.style.display = 'block';
        } else {
            // Clear currentStudent from localStorage
            localStorage.removeItem('currentStudent');
            
            loginSection.style.display = 'block';
            profileSection.style.display = 'none';
            logoutNavItem.style.display = 'none';
        }
    }

    // Show Validation Error
    function showValidationError(inputElement, message) {
        const validationMessage = inputElement.nextElementSibling;
        validationMessage.textContent = message;
        validationMessage.style.display = 'block';
        
        inputElement.addEventListener('input', function hideError() {
            validationMessage.style.display = 'none';
            inputElement.removeEventListener('input', hideError);
        });
    }

    // Show Alert Modal
    function showAlert(title, message) {
        alertModalTitle.textContent = title;
        alertModalMessage.textContent = message;
        alertModal.show();
    }
});
