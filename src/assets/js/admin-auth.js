// /**
//  * Admin Authentication Utility
//  * Shared authentication functions for all admin pages
//  */

// const AdminAuth = (function() {
//     'use strict';

//     // Configuration
//     const CONFIG = {
//         sessionKey: 'adminSession',
//         loginPath: '/admin/login/',
//         dashboardPath: '/admin/dashboard/'
//     };

//     /**
//      * Get current session from localStorage
//      * @returns {Object|null} Session object or null if not found
//      */
//     function getSession() {
//         try {
//             const sessionData = localStorage.getItem(CONFIG.sessionKey);
//             if (!sessionData) return null;
            
//             const session = JSON.parse(sessionData);
            
//             // Check if session has expired
//             if (session.expiresAt && session.expiresAt < Date.now()) {
//                 clearSession();
//                 return null;
//             }
            
//             return session;
//         } catch (e) {
//             console.error('Error reading session:', e);
//             return null;
//         }
//     }

//     /**
//      * Check if user is authenticated
//      * @returns {boolean} True if user has valid session
//      */
//     function isAuthenticated() {
//         const session = getSession();
//         return session !== null && session.expiresAt > Date.now();
//     }

//     /**
//      * Get current user information
//      * @returns {Object|null} User object or null
//      */
//     function getCurrentUser() {
//         const session = getSession();
//         if (!session) return null;
        
//         return {
//             username: session.username,
//             name: session.name,
//             loginTime: session.loginTime,
//             expiresAt: session.expiresAt
//         };
//     }

//     /**
//      * Clear session and logout
//      */
//     function clearSession() {
//         localStorage.removeItem(CONFIG.sessionKey);
//     }

//     /**
//      * Logout user and redirect to login page
//      * @param {string} redirectTo - Optional redirect path after logout
//      */
//     function logout(redirectTo = null) {
//         clearSession();
        
//         const loginUrl = new URL(CONFIG.loginPath, window.location.origin);
//         if (redirectTo) {
//             loginUrl.searchParams.set('redirect', redirectTo);
//         }
        
//         window.location.href = loginUrl.toString();
//     }

//     /**
//      * Require authentication - redirect to login if not authenticated
//      * Call this function at the top of protected pages
//      * @param {string} currentPath - Current page path for redirect after login
//      */
//     function requireAuth(currentPath = null) {
//         if (!isAuthenticated()) {
//             const path = currentPath || window.location.pathname;
//             const loginUrl = new URL(CONFIG.loginPath, window.location.origin);
//             loginUrl.searchParams.set('redirect', path);
//             window.location.href = loginUrl.toString();
//             return false;
//         }
//         return true;
//     }

//     /**
//      * Update session activity (extend expiration)
//      */
//     function updateActivity() {
//         const session = getSession();
//         if (!session) return;
        
//         // Extend session if remember me was checked
//         if (session.rememberMe) {
//             const duration = 24 * 60 * 60 * 1000; // 24 hours
//             session.expiresAt = Date.now() + duration;
//             localStorage.setItem(CONFIG.sessionKey, JSON.stringify(session));
//         }
//     }

//     /**
//      * Format session time remaining
//      * @returns {string} Human-readable time remaining
//      */
//     function getTimeRemaining() {
//         const session = getSession();
//         if (!session) return 'Not logged in';
        
//         const remaining = session.expiresAt - Date.now();
//         if (remaining < 0) return 'Expired';
        
//         const hours = Math.floor(remaining / (1000 * 60 * 60));
//         const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        
//         if (hours > 0) {
//             return `${hours}h ${minutes}m`;
//         }
//         return `${minutes}m`;
//     }

//     /**
//      * Initialize authentication for a page
//      * Sets up activity tracking and session monitoring
//      */
//     function init() {
//         // Update activity on user interaction
//         const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//         events.forEach(event => {
//             document.addEventListener(event, () => {
//                 updateActivity();
//             }, { passive: true, once: false });
//         });

//         // Check session every minute
//         setInterval(() => {
//             if (!isAuthenticated()) {
//                 alert('Your session has expired. Please login again.');
//                 logout();
//             }
//         }, 60000);
//     }

//     // Public API
//     return {
//         getSession,
//         isAuthenticated,
//         getCurrentUser,
//         logout,
//         requireAuth,
//         getTimeRemaining,
//         init,
//         clearSession
//     };
// })();

// // Auto-initialize if script is loaded
// if (typeof window !== 'undefined') {
//     window.AdminAuth = AdminAuth;
// }
