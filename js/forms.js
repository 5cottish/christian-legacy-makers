// js/forms.js - Form Handling and Validation

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    // Volunteer Form
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', handleVolunteerSubmit);
    }
    
    // Prayer Form
    const prayerForm = document.getElementById('prayerForm');
    if (prayerForm) {
        prayerForm.addEventListener('submit', handlePrayerSubmit);
    }
    
    // Donation Form
    initDonationForm();
});

// Contact Form Handler
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validation
    if (!data.name || !data.email || !data.subject || !data.message) {
        showFormError(e.target, 'Please fill in all required fields.');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showFormError(e.target, 'Please enter a valid email address.');
        return;
    }
    
    // Simulate form submission
    submitForm(e.target, data, 'Thank you! Your message has been sent successfully.');
}

// Volunteer Form Handler
function handleVolunteerSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!data.name || !data.email || !data.interest) {
        showFormError(e.target, 'Please fill in all required fields.');
        return;
    }
    
    submitForm(e.target, data, 'Thank you for your interest! We will contact you soon.');
}

// Prayer Form Handler
function handlePrayerSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate subscription
    alert('Thank you for joining our prayer network!');
    e.target.reset();
}

// Donation Form Initialization
function initDonationForm() {
    const donationForm = document.getElementById('donationForm');
    if (!donationForm) return;
    
    // Step navigation
    const steps = ['step1', 'step2', 'step3', 'stepSuccess'];
    let currentStep = 0;
    
    // Amount selection
    const amountBtns = donationForm.querySelectorAll('.amount-btn');
    const customAmount = document.getElementById('customAmount');
    const impactText = document.getElementById('impactText');
    
    const impactMessages = {
        25: '$25 provides school supplies for 1 child for one term.',
        50: '$50 supports a monthly reading club in one community.',
        100: '$100 provides vocational training for 1 mother.',
        250: '$250 provides a start-up kit for a small business.',
        500: '$500 sponsors a child\'s full year of education and support.'
    };
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const amount = btn.getAttribute('data-amount');
            customAmount.value = amount;
            updateImpact(amount);
            updateSummary();
        });
    });
    
    customAmount.addEventListener('input', (e) => {
        amountBtns.forEach(b => b.classList.remove('active'));
        const value = e.target.value;
        updateImpact(value);
        updateSummary();
    });
    
    function updateImpact(amount) {
        const message = impactMessages[amount] || `Your $${amount} donation will support our programs in Wakiso District.`;
        impactText.textContent = message;
    }
    
    // Donation type toggle
    const typeBtns = donationForm.querySelectorAll('.toggle-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateSummary();
        });
    });
    
    // Program designation
    const designation = document.getElementById('programDesignation');
    if (designation) {
        designation.addEventListener('change', updateSummary);
    }
    
    // Payment method selection
    const paymentMethods = donationForm.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            
            const methodType = method.getAttribute('data-method');
            document.querySelectorAll('.payment-form').forEach(f => f.classList.remove('active'));
            document.querySelector(`.${methodType}-form`).classList.add('active');
        });
    });
    
    // Navigation
    donationForm.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                document.getElementById(steps[currentStep]).classList.remove('active');
                currentStep++;
                document.getElementById(steps[currentStep]).classList.add('active');
                
                if (currentStep === 2) {
                    updateSummary();
                }
            }
        });
    });
    
    donationForm.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById(steps[currentStep]).classList.remove('active');
            currentStep--;
            document.getElementById(steps[currentStep]).classList.add('active');
        });
    });
    
    // Form submission
    donationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitDonation');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate payment processing
        setTimeout(() => {
            document.getElementById(steps[currentStep]).classList.remove('active');
            document.getElementById('stepSuccess').classList.add('active');
            
            // Update success message
            const amount = customAmount.value;
            document.getElementById('successAmount').textContent = '$' + amount;
            document.getElementById('successEmail').textContent = document.getElementById('donorEmail').value;
            document.getElementById('successReference').textContent = 'CLM-' + Date.now().toString().slice(-8);
        }, 2000);
    });
    
    function validateStep(step) {
        if (step === 1) {
            const required = ['donorFirstName', 'donorLastName', 'donorEmail', 'donorCountry'];
            for (let id of required) {
                const field = document.getElementById(id);
                if (!field.value.trim()) {
                    field.focus();
                    field.style.borderColor = 'red';
                    setTimeout(() => field.style.borderColor = '', 2000);
                    return false;
                }
            }
            
            if (!isValidEmail(document.getElementById('donorEmail').value)) {
                alert('Please enter a valid email address.');
                return false;
            }
        }
        
        if (step === 2) {
            const activeMethod = document.querySelector('.payment-method.active').getAttribute('data-method');
            if (activeMethod === 'card') {
                const cardFields = ['cardNumber', 'cardExpiry', 'cardCvc', 'cardName'];
                for (let id of cardFields) {
                    const field = document.getElementById(id);
                    if (!field.value.trim()) {
                        field.focus();
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    function updateSummary() {
        const amount = customAmount.value || 100;
        const isMonthly = document.querySelector('.toggle-btn.active').getAttribute('data-type') === 'monthly';
        const desig = designation ? designation.options[designation.selectedIndex].text : 'Where Most Needed';
        
        document.getElementById('summaryAmount').textContent = '$' + amount + (isMonthly ? '/month' : '.00');
        document.getElementById('summaryFrequency').textContent = isMonthly ? 'Monthly' : 'One-time';
        document.getElementById('summaryDesignation').textContent = desig;
        document.getElementById('summaryTotal').textContent = '$' + amount + (isMonthly ? '/month' : '.00');
    }
}

// Utility Functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(form, message) {
    const existingError = form.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = 'background: #fee; color: #c33; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function submitForm(form, data, successMessage) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = 'background: #efe; color: #3c3; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;';
        successDiv.textContent = successMessage;
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => successDiv.remove(), 5000);
    }, 1500);
}

// Card number formatting
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue.slice(0, 19);
    }
    
    if (e.target.id === 'cardExpiry') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
    }
    
    if (e.target.id === 'cardCvc') {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    }
});