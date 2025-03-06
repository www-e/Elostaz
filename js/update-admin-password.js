/**
 * One-time script to update the admin password to a more secure value
 * This script will update the password in both localStorage and Firebase (if enabled)
 */

// Import password utilities
import passwordUtils from './password-utils.js';

// New admin password
const NEW_PASSWORD = 'omar946281';

// Update function
async function updateAdminPassword() {
    try {
        console.log('Starting admin password update...');
        
        // 1. Update in localStorage
        const hashedPassword = await passwordUtils.hashPassword(NEW_PASSWORD);
        localStorage.setItem('admin_password', hashedPassword);
        console.log('Admin password updated in localStorage');
        
        // 2. Update in Firebase if enabled
        if (localStorage.getItem('useFirebase') === 'true') {
            console.log('Firebase is enabled, updating password in Firestore...');
            
            // Import Firebase database module
            const FirebaseDatabase = (await import('./firebase-database.js')).default;
            
            // Wait for Firebase to initialize
            await new Promise(resolve => {
                const checkFirebase = () => {
                    if (FirebaseDatabase.isInitialized) {
                        resolve();
                    } else {
                        setTimeout(checkFirebase, 100);
                    }
                };
                checkFirebase();
            });
            
            // Update password in Firebase
            const result = await FirebaseDatabase.admin.changeAdminPassword(NEW_PASSWORD);
            
            if (result.success) {
                console.log('Admin password updated in Firebase successfully');
            } else {
                console.error('Failed to update admin password in Firebase:', result.error);
            }
        }
        
        console.log('Password update completed successfully');
        alert('تم تحديث كلمة مرور المسؤول بنجاح');
    } catch (error) {
        console.error('Error updating admin password:', error);
        alert('حدث خطأ أثناء تحديث كلمة مرور المسؤول: ' + error.message);
    }
}

// Run the update
updateAdminPassword();
