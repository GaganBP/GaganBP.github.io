// Portfolio JavaScript - Enhanced functionality with animations and interactions

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    // Initialize all portfolio functionality
    handleLoading();
    setupNavigation();
    setupScrollEffects();
    setupAnimations();
    setupContactForm();
    setupBackToTop();
    setupThemeHandling();
    setupResumeModal();
}

// Loading Screen Management
function handleLoading() {
    const loader = document.getElementById('loader');

    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            // Trigger entrance animations after loading
            triggerEntranceAnimations();
        }, 1200);
    });
}

// Navigation Management
function setupNavigation() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const header = document.getElementById('header');

    // Mobile menu toggle
    mobileMenu.addEventListener('click', function() {
        toggleMobileMenu(mobileMenu, navLinks);
    });

    // Close mobile menu when clicking on nav links
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu(mobileMenu, navLinks);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mobileMenu.contains(event.target) || navLinks.contains(event.target);

        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            closeMobileMenu(mobileMenu, navLinks);
        }
    });

    // Smooth scrolling for anchor links
    setupSmoothScrolling();
}

function toggleMobileMenu(menuButton, navLinks) {
    menuButton.classList.toggle('active');
    navLinks.classList.toggle('active');

    const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
    menuButton.setAttribute('aria-expanded', !expanded);

    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu(menuButton, navLinks) {
    menuButton.classList.remove('active');
    navLinks.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Effects
function setupScrollEffects() {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleHeaderScroll(header);
                handleActiveNavigation(sections, navLinks);
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleHeaderScroll(header) {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function handleActiveNavigation(sections, navLinks) {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;

        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLinks[index]) {
                navLinks[index].classList.add('active');
            }
        }
    });
}

// Animation Management
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Special handling for staggered animations
                if (entry.target.classList.contains('stagger-animation')) {
                    staggerChildAnimations(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .skill-category');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function triggerEntranceAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate-in');
    }
}

function staggerChildAnimations(parent) {
    const children = parent.children;
    Array.from(children).forEach((child, index) => {
        setTimeout(() => {
            child.classList.add('animate-in');
        }, index * 100);
    });
}

// Contact Form Management
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!form) return;

    // Email domain validation
    setupEmailDomainValidation();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(form, submitButton);
    });

    // Real-time form validation
    setupFormValidation(form);
}

// Email domain validation function
function setupEmailDomainValidation() {
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'protonmail.com', 'icloud.com'];
    const emailInput = document.getElementById('email');
    const warning = document.getElementById('email-warning');
    const form = document.getElementById('contact-form');

    if (!emailInput || !warning || !form) return;

    emailInput.addEventListener('input', function() {
        const email = emailInput.value;
        const domain = email.substring(email.lastIndexOf("@") + 1);

        if (email && !allowedDomains.includes(domain)) {
            warning.style.display = 'block';
            emailInput.setCustomValidity("Invalid email domain.");
        } else {
            warning.style.display = 'none';
            emailInput.setCustomValidity("");
        }
    });

    form.addEventListener('submit', function(e) {
        const email = emailInput.value;
        const domain = email.substring(email.lastIndexOf("@") + 1);

        if (email && !allowedDomains.includes(domain)) {
            e.preventDefault();
            warning.style.display = 'block';
            showNotification("Submission blocked: Only trusted email domains allowed.", 'error');
            return false;
        }
    });
}

function handleFormSubmission(form, submitButton) {
    const originalText = submitButton.innerHTML;
    const formData = new FormData(form);

    // Validate form before submission
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Update button state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    // Submit form
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('Network response was not ok');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('There was a problem sending your message. Please try again later.', 'error');
    })
    .finally(() => {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }

    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }

    // Name validation
    if (field.name === 'name' && value) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Name should only contain letters and spaces.';
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('error');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto-hide after 5 seconds
    setTimeout(() => hideNotification(notification), 5000);

    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Back to Top Button
function setupBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (!backToTopButton) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Theme Handling (for future dark/light mode toggle)
function setupThemeHandling() {
    // Check for saved theme preference or default to 'light' mode
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Theme toggle functionality (can be extended with a toggle button)
    window.toggleTheme = function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const debouncedScroll = debounce(function() {
    // Handle scroll-based operations that don't need frequent updates
}, 250);

const throttledScroll = throttle(function() {
    // Handle scroll-based operations that need frequent updates
}, 16); // ~60fps

// Event listeners for optimized scroll handling
window.addEventListener('scroll', debouncedScroll);
window.addEventListener('scroll', throttledScroll);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement error reporting here
});

// Accessibility enhancements
function enhanceAccessibility() {
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            const navLinks = document.getElementById('nav-links');
            if (navLinks.classList.contains('active')) {
                closeMobileMenu(mobileMenu, navLinks);
            }
        }
    });
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// Resume Modal Management
function setupResumeModal() {
    const resumeLink = document.getElementById('resume-link');
    const resumeModal = document.getElementById('resume-modal');
    const closeResumeButton = document.getElementById('close-resume');
    
    if (!resumeLink || !resumeModal || !closeResumeButton) return;
    
    // Open resume modal
    resumeLink.addEventListener('click', function(e) {
        e.preventDefault();
        openResumeModal();
    });
    
    // Close resume modal
    closeResumeButton.addEventListener('click', function() {
        closeResumeModal();
    });
    
    // Close modal when clicking outside
    resumeModal.addEventListener('click', function(e) {
        if (e.target === resumeModal) {
            closeResumeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });
}

function openResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
        resumeModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeResumeModal() {
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
        resumeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        showNotification,
        debounce,
        throttle
    };
}
// For Transition of roles
const phrases = [
    "Freelance Data Analyst",
    "Power BI Developer",
    "Excel Dashboard Specialist",
    "Data Cleaning Expert",
    "Python + AI Analyst"
];

let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;
const typeSpeed = 100;
const eraseSpeed = 50;
const delayBetween = 1500;

const el = document.querySelector('.typewriter-text');

function type() {
    const phrase = phrases[currentPhrase];
    if (el) {
        el.textContent = phrase.slice(0, currentChar);
    }

    if (!isDeleting) {
        if (currentChar < phrase.length) {
            currentChar++;
            setTimeout(type, typeSpeed);
        } else {
            isDeleting = true;
            setTimeout(type, delayBetween);
        }
    } else {
        if (currentChar > 0) {
            currentChar--;
            setTimeout(type, eraseSpeed);
        } else {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            setTimeout(type, typeSpeed);
        }
    }
}

document.addEventListener('DOMContentLoaded', type);
