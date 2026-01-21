// Event Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventContactForm');
    
    if (!form) return;

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }

    // Set minimum date to today
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) {
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.setAttribute('min', today);
    }

    // Form validation
    function validateField(field) {
        const errorElement = document.getElementById(`${field.id}Error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('invalid');

        // Required field check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.id === 'phone' && field.value.trim()) {
            const phoneDigits = field.value.replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit phone number';
            }
        }

        // Date validation
        if (field.type === 'date' && field.value) {
            const selectedDate = new Date(field.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Event date must be in the future';
            }
        }

        if (!isValid && errorElement) {
            errorElement.textContent = errorMessage;
            field.classList.add('invalid');
        }

        return isValid;
    }

    // Add blur validation to all form fields
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });

        // Clear error on input
        field.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateField(this);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate all fields
        let isFormValid = true;
        formFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            // Scroll to first error
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Prepare form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            eventType: document.getElementById('eventType').value,
            eventDate: document.getElementById('eventDate').value,
            eventDescription: document.getElementById('eventDescription').value.trim(),
            submittedAt: new Date().toISOString()
        };

        try {
            // Get API endpoint from data attribute or use default
            if(window.location.hostname !== 'localhost' && window.location.hostname !== ''){
                const apiEndpoint = form.dataset.apiEndpoint || 'http://167.172.22.76/api/database/index.php';
            } else {
                const apiEndpoint = form.dataset.apiEndpoint || '/api/database/index.php';
            }
            
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    functionname: 'create',
                    collection: 'eventRequests',
                    arguments:formData 
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Show success message
            successMessage.style.display = 'flex';
            form.reset();

            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);

        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error message
            const errorMessageText = document.getElementById('errorMessageText');
            errorMessageText.textContent = 'Sorry, there was an error submitting your request. Please try again or contact us directly.';
            errorMessage.style.display = 'flex';

            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
});
