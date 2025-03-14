/**
 * Firebase Configuration
 * Initializes Firebase with configuration from localStorage or default values
 * Security implementation that restricts API usage while maintaining compatibility
 */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Get Firebase configuration from localStorage or use default
function getFirebaseConfig() {
    // Check if we're on GitHub Pages or development environment
    const isGitHubPages = 
        window.location.hostname.includes('github.io') || 
        document.referrer.includes('github.io');
    
    const isProduction = isGitHubPages || 
                       window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
        
    // Log the current hostname for debugging
    console.log('Current hostname:', window.location.hostname);
    console.log('Environment:', isProduction ? 'Production' : 'Development');
    
    // Firebase configuration with restricted API key
    // NOTE: This API key is restricted by:
    // 1. HTTP referrer restrictions (only allowed domains can use it)
    // 2. Firebase services restrictions (only specific Firebase services allowed)
    // 3. IP address restrictions (if applicable)
    const config = {
        apiKey: "AIzaSyCjAi7EyzNSFY4MU2agMKVW99pTQaMNVIo",
        authDomain: "alostaz-student-system-2fffd.firebaseapp.com",
        projectId: "alostaz-student-system-2fffd",
        storageBucket: "alostaz-student-system-2fffd.firebaseapp.com",
        messagingSenderId: "619298988595",
        appId: "1:619298988595:web:dbd93ff8e90d5bb45fb946",
        measurementId: "G-3BB9XCHW22"
    };
    
    // If on GitHub Pages or other production environment, ensure we have the correct authDomain
    if (isGitHubPages) {
        console.log('Configuring Firebase for GitHub Pages');
        
        // Add the current domain to the authorized domains list
        const currentDomain = window.location.hostname;
        config.authDomain = currentDomain;
        
        // Store this information for debugging
        localStorage.setItem('firebaseAuthDomain', currentDomain);
    }
    
    // Add a timestamp to validate when this config was last loaded
    localStorage.setItem('firebaseConfigLastLoaded', new Date().toISOString());
    
    return config;
}

// Initialize Firebase with configuration
const firebaseConfig = getFirebaseConfig();
console.log('Firebase configuration loaded with security settings');

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence to local to handle GitHub Pages better
try {
    setPersistence(auth, browserLocalPersistence)
        .then(() => console.log('Firebase Auth persistence set to local'))
        .catch(error => console.error('Error setting persistence:', error));
} catch (error) {
    console.error('Failed to set persistence:', error);
}

// Add a function to validate the authentication state
function checkAuthState() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user ? true : false);
        });
    });
}

// Export required modules and functions
export { 
    app, 
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
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    getFirebaseConfig,
    checkAuthState
};

// Expose to window for compatibility with non-module scripts
window.FirebaseConfig = {
    app,
    db,
    auth,
    checkAuthState
};
