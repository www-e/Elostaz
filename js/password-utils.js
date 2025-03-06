/**
 * Password utility functions for hashing and verifying passwords
 */

// Using SubtleCrypto for secure password hashing
const passwordUtils = {
    /**
     * Hash a password using SHA-256
     * @param {string} password - The plain text password to hash
     * @returns {Promise<string>} - A promise that resolves to the hashed password
     */
    async hashPassword(password) {
        // Convert the password string to an ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        
        // Hash the password using SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        
        // Convert the hash to a hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    },
    
    /**
     * Verify a password against a stored hash
     * @param {string} password - The plain text password to verify
     * @param {string} storedHash - The stored hash to compare against
     * @returns {Promise<boolean>} - A promise that resolves to true if the password matches
     */
    async verifyPassword(password, storedHash) {
        const hashedPassword = await this.hashPassword(password);
        return hashedPassword === storedHash;
    }
};

// Expose to window object for non-module access
window.passwordUtils = passwordUtils;

// Also support ES6 modules
export default passwordUtils;
