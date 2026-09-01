/*
   Stackly Portal Core Javascript (main.js)
   Accessibility features, responsive controls, slider mechanics, and authentication routing.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Accessibility: Font Resizing & High Contrast Theme
    initAccessibility();

    // 2. Mobile Menu Toggle
    initMobileMenu();

    // 3. News Ticker Pause/Resume on Hover
    initNewsTicker();

    // 4. Hero Slider Autoplay & Dot controls
    initHeroSlider();

    // 5. Interactive Services Tabs
    initServiceTabs();

    // 6. Interactive Contact / Grievance Redressal form validation
    initContactForm();

    // 7. Role-Based Login Validation and Redirects
    initAuthHandlers();
});

/* --- 1. Accessibility Functions --- */
function initAccessibility() {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    // Load saved preferences
    const savedContrast = localStorage.getItem('stackly-high-contrast');
    if (savedContrast === 'true') {
        bodyEl.classList.add('high-contrast');
    }

    const savedFontScale = localStorage.getItem('stackly-font-scale');
    if (savedFontScale) {
        htmlEl.className = savedFontScale;
    }

    // Contrast Toggle Button
    const contrastBtn = document.getElementById('toggle-contrast');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', () => {
            bodyEl.classList.toggle('high-contrast');
            const isHighContrast = bodyEl.classList.contains('high-contrast');
            localStorage.setItem('stackly-high-contrast', isHighContrast);
        });
    }

    // Font Scaling Buttons
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const fontNormalBtn = document.getElementById('font-normal');
    const fontIncreaseBtn = document.getElementById('font-increase');

    if (fontDecreaseBtn && fontNormalBtn && fontIncreaseBtn) {
        fontDecreaseBtn.addEventListener('click', () => {
            htmlEl.className = 'font-scale-down';
            localStorage.setItem('stackly-font-scale', 'font-scale-down');
        });

        fontNormalBtn.addEventListener('click', () => {
            htmlEl.className = '';
            localStorage.setItem('stackly-font-scale', '');
        });

        fontIncreaseBtn.addEventListener('click', () => {
            if (htmlEl.className === 'font-scale-up') {
                htmlEl.className = 'font-scale-up-more';
                localStorage.setItem('stackly-font-scale', 'font-scale-up-more');
            } else {
                htmlEl.className = 'font-scale-up';
                localStorage.setItem('stackly-font-scale', 'font-scale-up');
            }
        });
    }
}

/* --- 2. Mobile Menu Toggle --- */
function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (toggleBtn && mainNav) {
        toggleBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const isOpen = mainNav.classList.contains('active');
            toggleBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;'; // X mark vs Hamburger icon
        });
    }
}

/* --- 3. News Ticker Hover --- */
function initNewsTicker() {
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        tickerContent.addEventListener('mouseenter', () => {
            tickerContent.style.animationPlayState = 'paused';
        });
        tickerContent.addEventListener('mouseleave', () => {
            tickerContent.style.animationPlayState = 'running';
        });
    }
}

/* --- 4. Hero Slider Autoplay --- */
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        currentSlide = index;
    }

    function nextSlide() {
        let index = (currentSlide + 1) % slides.length;
        showSlide(index);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 6000); // Restart interval
        });
    });
}

/* --- 5. Interactive Services Tabs --- */
function initServiceTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length === 0) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Deactivate all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate specific
            btn.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

/* --- 6. Contact Form Validation --- */
function initContactForm() {
    const contactForm = document.getElementById('portal-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill out all required fields.');
                return;
            }

            // Mock submission success
            const responseDiv = document.getElementById('form-response');
            if (responseDiv) {
                responseDiv.innerHTML = `
                    <div style="background-color: var(--success-color); color: white; padding: 15px; border-radius: 4px; margin-top: 15px;">
                        <strong>Thank You, ${name}!</strong> Your request has been successfully registered on the Stackly Portal. 
                        A confirmation email has been sent to ${email}. Track ID: STK-${Math.floor(100000 + Math.random() * 900000)}.
                    </div>
                `;
                contactForm.reset();
            }
        });
    }
}

/* --- 7. Role-Based Login Validation and Redirects --- */
function initAuthHandlers() {
    // Tab toggles on login page
    const roleTabs = document.querySelectorAll('.role-tab');
    const loginRoleInput = document.getElementById('login-role');
    const roleHeader = document.getElementById('role-header-text');

    if (roleTabs.length > 0 && loginRoleInput) {
        roleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                roleTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const selectedRole = tab.getAttribute('data-role');
                loginRoleInput.value = selectedRole;

                if (roleHeader) {
                    roleHeader.textContent = selectedRole === 'admin' 
                        ? 'Administrator/Officer Login' 
                        : 'Citizen/User Secure Login';
                }
            });
        });
    }

    // Handle Login Simulation
    const loginForm = document.getElementById('portal-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const role = loginRoleInput.value;
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const captcha = document.getElementById('login-captcha-input').value.trim();

            if (!username || !password || !captcha) {
                alert('Please enter all credentials and the verification code.');
                return;
            }

            // Simulate loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Authenticating with Secure Gateway...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;

                // Simple simulated authorization
                if (role === 'admin') {
                    // Redirect to Admin Dashboard
                    alert('Access Granted. Redirecting to Stackly Officer Dashboard...');
                    window.location.href = 'dashboard-admin.html';
                } else {
                    // Redirect to User Dashboard
                    alert('Access Granted. Redirecting to Stackly Citizen Portal...');
                    window.location.href = 'dashboard-user.html';
                }
            }, 1000);
        });
    }

    // Handle Signup Multi-step
    const signupForm = document.getElementById('portal-signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const username = document.getElementById('signup-username').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const name = document.getElementById('signup-fullname').value.trim();
            const role = document.getElementById('signup-role').value;
            const captcha = document.getElementById('signup-captcha-input').value.trim();

            if (!username || !email || !name || !captcha) {
                alert('Please complete all steps of the registration form.');
                return;
            }

            alert(`Registration successful for ${name}! Please login.`);
            window.location.href = 'login.html';
        });
    }
}
