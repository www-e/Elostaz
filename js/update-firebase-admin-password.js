/**
 * One-time script to update the admin password in Firebase
 * This script will ensure the admin password in Firebase matches the secure default password
 */

import FirebaseDatabase from './firebase-database.js';
import passwordUtils from './password-utils.js';

// The secure default password
const SECURE_DEFAULT_PASSWORD = 'Elostaz@2025';

// Function to update the admin password in Firebase
async function updateFirebaseAdminPassword() {
    console.log('Updating admin password in Firebase...');
    
    try {
        // Wait for Firebase to initialize
        console.log('Waiting for Firebase to initialize...');
        await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (FirebaseDatabase.isInitialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
        
        if (!FirebaseDatabase.isInitialized) {
            console.error('Firebase initialization timeout');
            return { success: false, error: 'Firebase initialization timeout' };
        }
        
        // Update the admin password in Firebase
        console.log('Firebase initialized, updating password...');
        const result = await FirebaseDatabase.admin.changeAdminPassword(SECURE_DEFAULT_PASSWORD);
        
        if (result.success) {
            console.log('Admin password updated in Firebase successfully');
            return { success: true };
        } else {
            console.error('Failed to update admin password in Firebase:', result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('Error updating admin password in Firebase:', error);
        return { success: false, error: error.message };
    }
}

// Run the update
(async function() {
    try {
        const result = await updateFirebaseAdminPassword();
        
        if (result.success) {
            console.log('✅ Admin password updated successfully in Firebase');
            alert('تم تحديث كلمة المرور في قاعدة البيانات بنجاح. كلمة المرور الجديدة هي: Elostaz@2025');
        } else {
            console.error('❌ Failed to update admin password in Firebase:', result.error);
            alert('فشل تحديث كلمة المرور في قاعدة البيانات. يرجى المحاولة مرة أخرى لاحقًا.');
        }
    } catch (error) {
        console.error('Error in update process:', error);
        alert('حدث خطأ أثناء تحديث كلمة المرور. يرجى المحاولة مرة أخرى لاحقًا.');
    }
})();
