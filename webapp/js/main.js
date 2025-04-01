// Main JavaScript for Solar Fluidity web application

document.addEventListener('DOMContentLoaded', function() {
    console.log("Solar Fluidity web application initialized");
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            if (!nameInput.value || !emailInput.value || !messageInput.value) {
                alert('Por favor, completa todos los campos del formulario.');
                return;
            }
            
            // Simulate form submission
            alert('Gracias por tu mensaje. Te contactaremos pronto.');
            contactForm.reset();
        });
    }
    
    // Mobile menu toggle (for future implementation)
    // Subscription plan selection handling (for future implementation)
    // Authentication flow handling (for future implementation)
});

// Utility functions for the application
const SolarFluidityUtils = {
    // Format currency
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },
    
    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('es-CR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Generate random ID (for demo purposes)
    generateId: function(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    }
};

// This will be expanded with additional functionality as the application grows
