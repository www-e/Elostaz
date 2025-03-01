/**
 * Firebase Configuration
 * Initializes Firebase with configuration from localStorage or default values
 */

// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';

// Get Firebase configuration from localStorage or use default
function getFirebaseConfig() {
    // Always return the hardcoded configuration values
    return {
        apiKey: "AIzaSyCjAi7EyzNSFY4MU2agMKVW99pTQaMNVIo",
        authDomain: "alostaz-student-system-2fffd.firebaseapp.com",
        projectId: "alostaz-student-system-2fffd",
        storageBucket: "alostaz-student-system-2fffd.firebasestorage.app",
        messagingSenderId: "619298988595",
        appId: "1:619298988595:web:dbd93ff8e90d5bb45fb946",
        measurementId: "G-3BB9XCHW22"
    };
}

// Initialize Firebase with configuration
const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, signInWithEmailAndPassword, signOut, onAuthStateChanged, getFirebaseConfig };
