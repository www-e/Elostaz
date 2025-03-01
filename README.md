# Student Management System with Firebase Integration

## Overview
This Student Management System now supports both local storage and cloud-based Firebase storage, allowing for global access to student data across different devices and locations.

## Features
- **Dual Storage Options**: Choose between localStorage (device-specific) or Firebase (cloud-based)
- **Real-time Data Synchronization**: When using Firebase, all data changes are synchronized across devices
- **User Authentication**: Secure login for students and administrators
- **Student Management**: Add, edit, and delete student records
- **Attendance Tracking**: Record and view student attendance
- **Data Migration**: Easily migrate existing data from localStorage to Firebase

## Setup Instructions

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once your project is created, click on "Web" to add a web app to your project
4. Register your app with a nickname (e.g., "Student Management System")
5. Copy the Firebase configuration object that looks like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Configure Firebase in the App
1. Navigate to the Settings page in the app
2. Enable Firebase storage by toggling the switch
3. Enter your Firebase configuration details in the provided fields
4. Click "Save Firebase Config"

### 3. Migrate Your Data
1. After configuring Firebase, click on "Migrate Data to Cloud" to transfer your existing data
2. Wait for the migration to complete (you'll see a progress indicator)
3. Once migration is complete, your data is now available in the cloud

### 4. Switch Between Storage Options
- You can switch between localStorage and Firebase at any time from the Settings page
- When using localStorage, data is only available on the current device
- When using Firebase, data is synchronized across all devices

## Technical Details

### File Structure
- `firebase-config.js`: Firebase initialization and configuration
- `firebase-database.js`: Firebase database service implementation
- `database-adapter.js`: Adapter that provides a unified interface for both storage options
- `data-migration.js`: Utility for migrating data from localStorage to Firebase

### Database Adapter
The system uses a database adapter pattern to seamlessly switch between storage options:
```javascript
// Example usage
import DatabaseAdapter from './database-adapter.js';

// Get all users
const users = await DatabaseAdapter.users.getAll();

// Add a new user
await DatabaseAdapter.users.add(newUser);
```

## Troubleshooting
- **Firebase Configuration**: If you experience connection issues, verify your Firebase configuration details
- **Data Migration**: If migration fails, try refreshing the page and attempting again
- **Permissions**: Ensure your Firebase project has proper security rules set up

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
For support or questions, contact the developer at [Omar Ashraf](whatsapp://send?phone=+201154688628).
