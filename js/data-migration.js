/**
 * Data Migration Script
 * Transfers data from localStorage to Firebase Firestore
 */

import FirebaseDatabase from './firebase-database.js';

const DataMigration = {
    // Migrate all data from localStorage to Firebase
    async migrateAllData() {
        try {
            console.log('Starting data migration to Firebase...');
            
            // Show migration status to user
            this.showMigrationStatus('جاري نقل البيانات إلى السحابة...', 0);
            
            // Migrate users
            await this.migrateUsers();
            this.showMigrationStatus('تم نقل بيانات الطلاب', 25);
            
            // Migrate attendance
            await this.migrateAttendance();
            this.showMigrationStatus('تم نقل بيانات الحضور', 50);
            
            // Migrate admin settings
            await this.migrateAdminSettings();
            this.showMigrationStatus('تم نقل إعدادات المسؤول', 75);
            
            // Migration complete
            this.showMigrationStatus('تم نقل جميع البيانات بنجاح!', 100);
            console.log('Data migration completed successfully!');
            
            // Hide migration status after 3 seconds
            setTimeout(() => {
                const migrationStatus = document.getElementById('migrationStatus');
                if (migrationStatus) {
                    migrationStatus.style.display = 'none';
                }
            }, 3000);
            
            return { success: true };
        } catch (error) {
            console.error('Error migrating data:', error);
            this.showMigrationStatus(`خطأ في نقل البيانات: ${error.message}`, 0);
            return { success: false, error };
        }
    },
    
    // Migrate users from localStorage to Firebase
    async migrateUsers() {
        // Get users from localStorage
        const usersJson = localStorage.getItem('sms_users');
        if (!usersJson) return;
        
        const users = JSON.parse(usersJson);
        console.log(`Migrating ${users.length} users...`);
        
        // Add each user to Firebase
        for (const user of users) {
            await FirebaseDatabase.users.add(user);
        }
        
        console.log('Users migration completed');
    },
    
    // Migrate attendance data from localStorage to Firebase
    async migrateAttendance() {
        // Get attendance data from localStorage
        const attendanceJson = localStorage.getItem('sms_attendance');
        if (!attendanceJson) return;
        
        const attendanceData = JSON.parse(attendanceJson);
        console.log('Migrating attendance data...');
        
        // Migrate each month's attendance data
        for (const [monthKey, monthData] of Object.entries(attendanceData)) {
            // Extract year and month from monthKey (format: YYYY-MM)
            const [year, month] = monthKey.split('-').map(num => parseInt(num));
            
            // Save month data to Firebase
            await FirebaseDatabase.attendance.saveMonthAttendance(year, month - 1, monthData);
        }
        
        console.log('Attendance migration completed');
    },
    
    // Migrate admin settings from localStorage to Firebase
    async migrateAdminSettings() {
        // Get admin password from localStorage
        const adminPassword = localStorage.getItem('sms_admin_password');
        if (adminPassword) {
            // Update admin password in Firebase
            await FirebaseDatabase.auth.changeAdminPassword(adminPassword);
        }
        
        // Get last student index from localStorage
        const lastStudentIndex = localStorage.getItem('sms_last_student_index');
        if (lastStudentIndex) {
            // Update counter in Firebase
            await FirebaseDatabase.updateDoc(
                FirebaseDatabase.doc(FirebaseDatabase.db, FirebaseDatabase.COLLECTIONS.SETTINGS, 'counter'),
                { lastStudentIndex: parseInt(lastStudentIndex) }
            );
        }
        
        console.log('Admin settings migration completed');
    },
    
    // Show migration status to user
    showMigrationStatus(message, progress) {
        // Create or get migration status element
        let migrationStatus = document.getElementById('migrationStatus');
        
        if (!migrationStatus) {
            // Create migration status element
            migrationStatus = document.createElement('div');
            migrationStatus.id = 'migrationStatus';
            migrationStatus.style.position = 'fixed';
            migrationStatus.style.top = '20px';
            migrationStatus.style.left = '50%';
            migrationStatus.style.transform = 'translateX(-50%)';
            migrationStatus.style.backgroundColor = '#fff';
            migrationStatus.style.padding = '15px 20px';
            migrationStatus.style.borderRadius = '5px';
            migrationStatus.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            migrationStatus.style.zIndex = '9999';
            migrationStatus.style.textAlign = 'center';
            migrationStatus.style.direction = 'rtl';
            
            // Create progress bar container
            const progressContainer = document.createElement('div');
            progressContainer.style.width = '100%';
            progressContainer.style.backgroundColor = '#f0f0f0';
            progressContainer.style.borderRadius = '3px';
            progressContainer.style.marginTop = '10px';
            
            // Create progress bar
            const progressBar = document.createElement('div');
            progressBar.id = 'migrationProgressBar';
            progressBar.style.width = '0%';
            progressBar.style.height = '6px';
            progressBar.style.backgroundColor = '#4CAF50';
            progressBar.style.borderRadius = '3px';
            progressBar.style.transition = 'width 0.5s ease-in-out';
            
            // Add progress bar to container
            progressContainer.appendChild(progressBar);
            
            // Create message element
            const messageElement = document.createElement('div');
            messageElement.id = 'migrationMessage';
            
            // Add elements to migration status
            migrationStatus.appendChild(messageElement);
            migrationStatus.appendChild(progressContainer);
            
            // Add migration status to document
            document.body.appendChild(migrationStatus);
        }
        
        // Update message and progress
        document.getElementById('migrationMessage').textContent = message;
        document.getElementById('migrationProgressBar').style.width = `${progress}%`;
    }
};

export default DataMigration;
