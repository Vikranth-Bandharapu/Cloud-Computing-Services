/*
   Stackly Portal Authentication Logic (auth.js)
   Redirects roles based on validated accounts. Strictly manages temporary session states.
*/

document.addEventListener('DOMContentLoaded', () => {
    initAuthForms();
    initLogoutTriggers();
    displayLoggedInUser();
});

/**
 * Initializes listeners for Login and Signup actions.
 */
function initAuthForms() {
    // Signup Form Handler
    const signupForm = document.getElementById('signup-form-v3');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (typeof validateSignupForm === 'function' && validateSignupForm(signupForm)) {
                // Mock registration successful
                const email = signupForm.querySelector('#signup-email').value.trim();
                const roleEl = signupForm.querySelector('#signup-role');
                const role = roleEl ? roleEl.value : 'client';
                
                // Save mock registration details to session storage (NO password stored)
                const mockUsers = JSON.parse(sessionStorage.getItem('mock-users') || '[]');
                mockUsers.push({ email, role });
                sessionStorage.setItem('mock-users', JSON.stringify(mockUsers));

                // Save toast message request before redirecting
                localStorage.setItem('auth-toast-msg', 'Registration successful. Please login.');
                localStorage.setItem('auth-toast-type', 'success');

                window.location.href = 'login.html';
            } else {
                if (typeof showToast === 'function') {
                    showToast('Please correct form validation issues before submitting.', 'error');
                }
            }
        });
    }

    // Login Form Handler
    const loginForm = document.getElementById('login-form-v3');
    if (loginForm) {
        // Show redirect toasts from previous actions
        showPendingToasts();

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (typeof validateLoginForm === 'function' && validateLoginForm(loginForm)) {
                const emailInput = loginForm.querySelector('#login-email').value.trim();
                const roleInput = loginForm.querySelector('#login-role').value;

                // Set session token (NO password saved)
                sessionStorage.setItem('logged-in-user-email', emailInput);
                sessionStorage.setItem('logged-in-user-role', roleInput);

                if (typeof showToast === 'function') {
                    showToast('Credentials authenticated. Logging into console...', 'success');
                }

                setTimeout(() => {
                    if (roleInput === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (roleInput === 'client') {
                        window.location.href = 'client-dashboard.html';
                    } else {
                        window.location.href = 'client-dashboard.html';
                    }
                }, 1000);
            } else {
                if (typeof showToast === 'function') {
                    showToast('Invalid credentials format.', 'error');
                }
            }
        });
    }
}

/**
 * Initializes logout buttons on dashboard views.
 */
function initLogoutTriggers() {
    const logoutBtns = document.querySelectorAll('.logout-trigger-btn, .logout-link, .sidebar-footer a');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Clear session variables
            sessionStorage.removeItem('logged-in-user-email');
            sessionStorage.removeItem('logged-in-user-role');

            // Save pending toast
            localStorage.setItem('auth-toast-msg', 'Logged out successfully.');
            localStorage.setItem('auth-toast-type', 'success');

            window.location.href = 'index.html';
        });
    });
}

/**
 * Displays active user's credentials on dashboard banners.
 */
function displayLoggedInUser() {
    const storedEmail = sessionStorage.getItem('logged-in-user-email') || 'user@stackly.com';
    const initials = storedEmail.substring(0, 2).toUpperCase();

    const emailEls = document.querySelectorAll('#display-user-email, .display-user-email');
    emailEls.forEach(el => el.textContent = storedEmail);

    const avatarEls = document.querySelectorAll('#display-user-avatar, .display-user-avatar');
    avatarEls.forEach(el => el.textContent = initials);
}

/**
 * Checks for messages saved in localStorage to pop up as toasts upon loading a page.
 */
function showPendingToasts() {
    const pendingMsg = localStorage.getItem('auth-toast-msg');
    const pendingType = localStorage.getItem('auth-toast-type') || 'info';

    if (pendingMsg && typeof showToast === 'function') {
        showToast(pendingMsg, pendingType);
        localStorage.removeItem('auth-toast-msg');
        localStorage.removeItem('auth-toast-type');
    }
}
