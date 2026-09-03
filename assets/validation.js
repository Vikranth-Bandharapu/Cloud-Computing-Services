/*
   Stackly Portal Input Validation Library (validation.js)
   Enforces secure formats, password complexity, and triggers inline warning nodes.
*/

// Regex check strings
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,15}$/;

/**
 * Validates signup inputs and checks complexity rules.
 */
function validateSignupForm(formElement) {
    let isValid = true;

    const name = formElement.querySelector('#signup-name') || formElement.querySelector('#signup-fullname');
    const email = formElement.querySelector('#signup-email');
    const password = formElement.querySelector('#signup-password');

    // 1. Full name check
    if (name) {
        if (!name.value.trim()) {
            showError(name, 'Full name is required');
            isValid = false;
        } else {
            clearError(name);
        }
    }

    // 2. Email check
    if (email) {
        if (!email.value.trim()) {
            showError(email, 'Email address is required');
            isValid = false;
        } else if (!EMAIL_REGEX.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }
    }

    // 3. Password check
    if (password) {
        const pwdVal = password.value;
        if (!pwdVal) {
            showError(password, 'Password is required');
            isValid = false;
        } else if (pwdVal.length < 6) {
            showError(password, 'Password must be at least 6 characters long');
            isValid = false;
        } else {
            clearError(password);
        }
    }

    return isValid;
}

/**
 * Validates login inputs.
 */
function validateLoginForm(formElement) {
    let isValid = true;

    const email = formElement.querySelector('#login-email');
    const password = formElement.querySelector('#login-password');
    const role = formElement.querySelector('#login-role');

    if (!email.value.trim()) {
        showError(email, 'Email address is required');
        isValid = false;
    } else if (!EMAIL_REGEX.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    } else {
        clearError(email);
    }

    if (!password.value) {
        showError(password, 'Password is required');
        isValid = false;
    } else {
        clearError(password);
    }

    if (!role.value) {
        showError(role, 'Role selection is required');
        isValid = false;
    } else {
        clearError(role);
    }

    return isValid;
}

/**
 * Validates consultation/contact inquiry form inputs.
 */
/**
 * Validates consultation/contact inquiry form inputs.
 */
function validateContactForm(formElement) {
    if (!formElement) return false;
    let isValid = true;

    const name = formElement.querySelector('#contact-name') || formElement.querySelector('[name="name"]');
    const company = formElement.querySelector('#contact-company') || formElement.querySelector('[name="company"]');
    const email = formElement.querySelector('#contact-email') || formElement.querySelector('[type="email"]');
    const phone = formElement.querySelector('#contact-phone') || formElement.querySelector('[name="phone"]');
    const service = formElement.querySelector('#contact-service');
    const message = formElement.querySelector('#contact-message') || formElement.querySelector('textarea');

    if (name) {
        if (!name.value.trim()) {
            showError(name, 'Full name is required');
            isValid = false;
        } else {
            clearError(name);
        }
    }

    if (company) {
        if (!company.value.trim()) {
            showError(company, 'Company name is required');
            isValid = false;
        } else {
            clearError(company);
        }
    }

    if (email) {
        if (!email.value.trim()) {
            showError(email, 'Email address is required');
            isValid = false;
        } else if (!EMAIL_REGEX.test(email.value.trim())) {
            showError(email, 'Invalid email address format');
            isValid = false;
        } else {
            clearError(email);
        }
    }

    if (phone) {
        if (!phone.value.trim()) {
            showError(phone, 'Phone number is required');
            isValid = false;
        } else if (!PHONE_REGEX.test(phone.value.trim())) {
            showError(phone, 'Invalid phone number format');
            isValid = false;
        } else {
            clearError(phone);
        }
    }

    if (service) {
        if (!service.value) {
            showError(service, 'Please select a service category');
            isValid = false;
        } else {
            clearError(service);
        }
    }

    if (message) {
        if (!message.value.trim()) {
            showError(message, 'Requirements description is required');
            isValid = false;
        } else {
            clearError(message);
        }
    }

    return isValid;
}

/* Universal Inline Error Display Helper */
function showError(inputElement, errorMessage) {
    if (!inputElement) return;
    inputElement.classList.add('is-invalid');
    inputElement.style.borderColor = '#ef4444';
    inputElement.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.4)';

    let parent = inputElement.parentElement;
    let feedback = parent.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback text-red-400 font-size-0.8 mt-1 d-block';
        parent.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
    feedback.style.display = 'block';
}

function clearError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove('is-invalid');
    inputElement.style.borderColor = '';
    inputElement.style.boxShadow = '';

    let parent = inputElement.parentElement;
    let feedback = parent.querySelector('.invalid-feedback');
    if (feedback) {
        feedback.remove();
    }
}

/* Universal Form Validation & 404 Redirect Listener */
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Skip auth login/signup forms (handled by auth.js for dashboard redirection)
        if (form.id === 'login-form-v3' || form.id === 'signup-form-v3') return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isFormValid = true;
            if (form.id === 'contact-form-v3') {
                isFormValid = validateContactForm(form);
            } else {
                // Validate generic form inputs (e.g. newsletter subscribe)
                const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
                inputs.forEach(input => {
                    if (input.type === 'email') {
                        if (!input.value.trim() || !EMAIL_REGEX.test(input.value.trim())) {
                            showError(input, 'Please enter a valid email address.');
                            isFormValid = false;
                        } else {
                            clearError(input);
                        }
                    } else {
                        if (!input.value.trim()) {
                            showError(input, 'This field is required.');
                            isFormValid = false;
                        } else {
                            clearError(input);
                        }
                    }
                });
            }

            if (isFormValid) {
                if (typeof showToast === 'function') {
                    showToast('Form validated successfully! Redirecting...', 'success');
                }
                setTimeout(() => {
                    window.location.href = '404.html';
                }, 800);
            } else {
                if (typeof showToast === 'function') {
                    showToast('Please fill in all required fields accurately.', 'error');
                }
            }
        });
    });
});
