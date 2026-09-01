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
function validateContactForm(formElement) {
    let isValid = true;

    const name = formElement.querySelector('#contact-name');
    const company = formElement.querySelector('#contact-company');
    const email = formElement.querySelector('#contact-email');
    const phone = formElement.querySelector('#contact-phone');
    const service = formElement.querySelector('#contact-service');
    const requirement = formElement.querySelector('#contact-requirement');
    const message = formElement.querySelector('#contact-message');

    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    } else {
        clearError(name);
    }

    if (!company.value.trim()) {
        showError(company, 'Company is required');
        isValid = false;
    } else {
        clearError(company);
    }

    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!EMAIL_REGEX.test(email.value.trim())) {
        showError(email, 'Invalid email format');
        isValid = false;
    } else {
        clearError(email);
    }

    if (!phone.value.trim()) {
        showError(phone, 'Phone number is required');
        isValid = false;
    } else if (!PHONE_REGEX.test(phone.value.trim())) {
        showError(phone, 'Invalid phone number format');
        isValid = false;
    } else {
        clearError(phone);
    }

    if (!service.value) {
        showError(service, 'Please select a service');
        isValid = false;
    } else {
        clearError(service);
    }

    if (!requirement.value) {
        showError(requirement, 'Please select cloud requirement scale');
        isValid = false;
    } else {
        clearError(requirement);
    }

    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    } else {
        clearError(message);
    }

    return isValid;
}

/* Helper Functions to display/clear inline errors */
function showError(inputElement, errorMessage) {
    const formGroup = inputElement.closest('.form-group-stackly');
    if (!formGroup) return;

    formGroup.classList.add('is-invalid');
    let feedback = formGroup.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        formGroup.appendChild(feedback);
    }
    feedback.textContent = errorMessage;
}

function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group-stackly');
    if (!formGroup) return;

    formGroup.classList.remove('is-invalid');
}
