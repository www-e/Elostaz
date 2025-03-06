Roadmap for Elostaz System Enhancements
1. Changing from Firebase Test Mode
Current Status: Firebase project is in test mode (development)
Solution:
Navigate to Firebase Console → Authentication → Get Started → Sign-in method tab
Switch from "Test mode" to "Production mode"
Set up proper security rules for Firestore and Storage
Implement email verification if needed for student accounts
2. Securing Firebase API Keys
Current Status: API keys exposed in client-side code
Solution Options:
Option A: Create Firebase environment variables using .env files (for local development)
Option B: Implement Firebase Cloud Functions as a secure API layer
Option C: Set up Firebase Security Rules to restrict access even if keys are visible
Implementation: We'll create domain restrictions in Firebase console so the API keys only work on your domain
3. Monthly Subscription Tracking
Current Status: No subscription tracking functionality
Solution:
Add a "payment" field to student records
Create a payment history collection in Firebase
Add payment status indicator in the attendance UI
Implement monthly data tracking tied to the existing month selection
4. Bulk Student Import via CSV
Current Status: Manual student entry only
Solution:
Enhance the existing CSV import functionality
Create proper validation for imported data
Implement Firebase batch operations for efficient imports
Add progress tracking and error reporting
5. Bulk Attendance Import
Current Status: Manual attendance tracking
Solution:
Create a CSV template specifically for attendance data
Implement validation to ensure students exist before importing
Add date mapping to ensure correct month/day assignment
Sync with Firebase using batch operations
6. Payment Column in Student CSV
Current Status: No payment field in student data
Solution:
Add payment status field to student schema
Update CSV import to handle payment information
Create payment history tracking for reporting
7. CSV Format Guidelines
Recommended Format:
CopyInsert
ID,Name,Grade,Group,Password,PaymentStatus
12345,أحمد محمد,الصف الثالث الثانوي,السبت والثلاثاء,student123,200
67890,ليلى أحمد,الصف الثاني الثانوي,الاثنين والخميس,student456,150
Attendance CSV Format:
CopyInsert
StudentID,Date,Status,PaymentAmount
12345,2025-03-01,حاضر,200
67890,2025-03-01,غائب,0
8. Firebase Synchronization
Current Status: Basic Firebase sync implemented
Solution:
Implement proper error handling for all Firebase operations
Add offline support with synchronized queue
Enhance the existing batch operations for performance
Add data validation before syncing
9. Firebase Free Tier Assessment
Current Limits:
50,000 reads, 20,000 writes, 20,000 deletes per day
1GB stored data
10GB bandwidth per month
Assessment for Your Needs:
5,000 text fields and daily access is well within limits
Your current usage pattern should remain free
Alternatives if needed:
Backend-as-a-Service: Supabase (PostgreSQL-based)
Self-hosted: MongoDB + Express backend
Hybrid approach: Use Firebase Auth with your own database
Implementation Timeline
Phase 1 (Immediate)
Secure API keys
Set up proper Firebase security rules
Switch to production mode
Phase 2 (Short-term)
Implement student payment tracking
Create CSV import functionality for students
Add payment field to student records
Phase 3 (Medium-term)
Implement attendance bulk import
Enhance reporting for payments
Add data validation and error handling