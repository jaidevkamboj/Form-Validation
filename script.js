document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const successMessage = document.getElementById('successMessage');
    const resetFormBtn = document.getElementById('resetForm');
    
    // Form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const ageField = document.getElementById('age');
    const termsCheckbox = document.getElementById('terms');
    
    // Error elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const ageError = document.getElementById('ageError');
    const termsError = document.getElementById('termsError');
    
    // Password strength elements
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    
    // Validation functions
    function validateName() {
        const name = nameField.value.trim();
        if (name === '') {
            showError(nameField, nameError, 'Name is required');
            return false;
        } else if (name.length < 3) {
            showError(nameField, nameError, 'Name must be at least 3 characters');
            return false;
        } else {
            showSuccess(nameField, nameError);
            return true;
        }
    }
    
    function validateEmail() {
        const email = emailField.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email === '') {
            showError(emailField, emailError, 'Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            showError(emailField, emailError, 'Please enter a valid email');
            return false;
        } else {
            showSuccess(emailField, emailError);
            return true;
        }
    }
    
    function validatePassword() {
        const password = passwordField.value;
        const strength = checkPasswordStrength(password);
        
        if (password === '') {
            showError(passwordField, passwordError, 'Password is required');
            updatePasswordStrength(0, 'Weak');
            return false;
        } else if (password.length < 8) {
            showError(passwordField, passwordError, 'Password must be at least 8 characters');
            updatePasswordStrength(30, 'Weak');
            return false;
        } else {
            showSuccess(passwordField, passwordError);
            updatePasswordStrength(strength.score * 25, strength.text);
            return strength.score >= 3; // Require at least medium strength
        }
    }
    
    function validateConfirmPassword() {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        
        if (confirmPassword === '') {
            showError(confirmPasswordField, confirmPasswordError, 'Please confirm your password');
            return false;
        } else if (password !== confirmPassword) {
            showError(confirmPasswordField, confirmPasswordError, 'Passwords do not match');
            return false;
        } else {
            showSuccess(confirmPasswordField, confirmPasswordError);
            return true;
        }
    }
    
    function validateAge() {
        const age = ageField.value;
        
        if (age === '') {
            showError(ageField, ageError, 'Age is required');
            return false;
        } else if (age < 13) {
            showError(ageField, ageError, 'You must be at least 13 years old');
            return false;
        } else {
            showSuccess(ageField, ageError);
            return true;
        }
    }
    
    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, termsError, 'You must accept the terms and conditions');
            return false;
        } else {
            showSuccess(termsCheckbox, termsError);
            return true;
        }
    }
    
    // Helper functions
    function showError(input, errorElement, message) {
        input.classList.add('error');
        input.classList.remove('success');
        errorElement.textContent = message;
    }
    
    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
    }
    
    function checkPasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // Complexity checks
        if (/[A-Z]/.test(password)) score++; // Uppercase letter
        if (/[0-9]/.test(password)) score++; // Number
        if (/[^A-Za-z0-9]/.test(password)) score++; // Special character
        
        let text;
        if (score < 2) text = 'Weak';
        else if (score < 4) text = 'Medium';
        else text = 'Strong';
        
        return { score, text };
    }
    
    function updatePasswordStrength(percent, text) {
        const meter = strengthMeter.querySelector('::after') || strengthMeter;
        meter.style.width = `${percent}%`;
        
        if (percent < 30) {
            meter.style.backgroundColor = '#e74c3c';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e74c3c';
        } else if (percent < 70) {
            meter.style.backgroundColor = '#f39c12';
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#f39c12';
        } else {
            meter.style.backgroundColor = '#2ecc71';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#2ecc71';
        }
    }
    
    // Event listeners
    nameField.addEventListener('input', validateName);
    nameField.addEventListener('blur', validateName);
    
    emailField.addEventListener('input', validateEmail);
    emailField.addEventListener('blur', validateEmail);
    
    passwordField.addEventListener('input', validatePassword);
    passwordField.addEventListener('blur', validatePassword);
    
    confirmPasswordField.addEventListener('input', validateConfirmPassword);
    confirmPasswordField.addEventListener('blur', validateConfirmPassword);
    
    ageField.addEventListener('input', validateAge);
    ageField.addEventListener('blur', validateAge);
    
    termsCheckbox.addEventListener('change', validateTerms);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isAgeValid = validateAge();
        const isTermsValid = validateTerms();
        
        if (isNameValid && isEmailValid && isPasswordValid && 
            isConfirmPasswordValid && isAgeValid && isTermsValid) {
            // Form is valid - show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
        }
    });
    
    resetFormBtn.addEventListener('click', function() {
        // Reset form and UI
        form.reset();
        successMessage.style.display = 'none';
        form.style.display = 'block';
        
        // Clear all validation states
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('error', 'success');
        });
        
        updatePasswordStrength(0, '');
    });
});