/**
 * Firebase Configuration
 * Initializes Firebase with configuration from localStorage or default values
 */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, browserLocalPersistence, setPersistence } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Get Firebase configuration from localStorage or use default
function getFirebaseConfig() {
    // Check if we're on GitHub Pages
    const isGitHubPages = 
        window.location.hostname.includes('github.io') || 
        document.referrer.includes('github.io');
        
    // Log the current hostname for debugging
    console.log('Current hostname:', window.location.hostname);
    
    // Always return the hardcoded configuration values
    const config = {
        apiKey: "AIzaSyCjAi7EyzNSFY4MU2agMKVW99pTQaMNVIo",
        authDomain: "alostaz-student-system-2fffd.firebaseapp.com",
        projectId: "alostaz-student-system-2fffd",
        storageBucket: "alostaz-student-system-2fffd.firebaseapp.com",
        messagingSenderId: "619298988595",
        appId: "1:619298988595:web:dbd93ff8e90d5bb45fb946",
        measurementId: "G-3BB9XCHW22"
    };
    
    // If on GitHub Pages, ensure we have the correct authDomain
    if (isGitHubPages) {
        console.log('Configuring Firebase for GitHub Pages');
        
        // Add the current domain to the authorized domains list
        const currentDomain = window.location.hostname;
        config.authDomain = currentDomain;
        
        // Store this information for debugging
        localStorage.setItem('firebaseAuthDomain', currentDomain);
    }
    
    return config;
}

// Initialize Firebase with configuration
const firebaseConfig = getFirebaseConfig();
console.log('Firebase configuration:', firebaseConfig);

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

export { app, db, auth, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, signInWithEmailAndPassword, signOut, onAuthStateChanged, getFirebaseConfig };
