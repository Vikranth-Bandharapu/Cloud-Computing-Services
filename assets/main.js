/*
   Stackly Portal Core Script (main.js)
   Controls drawer menus, FAQ accordions, toast notifications, and programmatic CTA routing.
*/

document.addEventListener('DOMContentLoaded', () => {
    initDrawerMenu();
    initFAQAccordions();
    initGlobalCTARouting();
    initThemeSwitcher();
    highlightActivePageNav();
});

/* Dynamic Active Page Navbar Highlighter */
function highlightActivePageNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-public-menu a, .mobile-drawer-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === '/' && href === 'index.html')) {
            link.classList.add('active');
        } else if (href !== '#' && !href.startsWith('javascript:')) {
            link.classList.remove('active');
        }
    });
}

/* Interactive Color Panel Theme Switcher */
function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('stackly-color-theme') || 'cyan';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme-val');
            if (!theme) return;

            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('stackly-color-theme', theme);
            if (typeof showToast === 'function') {
                showToast(`Color Theme Switched: ${theme.toUpperCase()}`, 'info');
            }
        });
    });
}

/* Mobile Drawer Menu Toggling & Strict Background Scroll Lock */
function initDrawerMenu() {
    const hamburgerBtn = document.querySelector('.hamburger-public') || document.querySelector('.hamburger');
    const closeBtn = document.querySelector('.close-drawer-btn') || document.getElementById('close-drawer-btn');
    const drawer = document.querySelector('.mobile-nav-drawer');

    let savedScrollY = 0;

    const lockBackground = () => {
        savedScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${savedScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
        document.body.classList.add('drawer-open');
    };

    const unlockBackground = () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
        document.body.classList.remove('drawer-open');
        window.scrollTo(0, savedScrollY);
    };

    if (drawer) {
        drawer.classList.remove('active');
        unlockBackground();
    }

    if (hamburgerBtn && drawer) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            drawer.classList.add('active');
            lockBackground();
        });
    }

    const closeDrawerAction = () => {
        if (drawer) drawer.classList.remove('active');
        unlockBackground();
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawerAction);
    }

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
        if (drawer && drawer.classList.contains('active') && !drawer.contains(e.target) && !hamburgerBtn?.contains(e.target)) {
            closeDrawerAction();
        }
    });

    const drawerLinks = document.querySelectorAll('.mobile-drawer-menu a');
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawerAction);
    });
}

/* FAQ Accordion Transitions */
function initFAQAccordions() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                const answer = i.querySelector('.faq-answer');
                if (answer) answer.style.maxHeight = null;
            });
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                if (answer) {
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            }
        });
    });
}

/* Toast Notification Dispatcher */
function showToast(message, type = 'info') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'warning') icon = 'exclamation-triangle';

    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <div>${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

/* CTA Destination Enforcement Rule: All section CTA action buttons redirect to 404.html */
function initGlobalCTARouting() {
    document.addEventListener('click', (e) => {
        // Skip 404 page entirely
        if (window.location.pathname.indexOf('404.html') !== -1) return;

        // Skip any form elements or buttons inside forms (handled exclusively by validation.js)
        if (e.target.closest('form') || e.target.type === 'submit') {
            return;
        }

        // Skip FAQ accordions (Bootstrap .accordion-button and custom .faq-header-btn)
        if (e.target.closest('.accordion-button') || e.target.closest('.accordion-item') || e.target.closest('.accordion') || e.target.closest('.faq-header-btn') || e.target.closest('.faq-item') || e.target.closest('.faq-body')) {
            return;
        }

        const ctaBtn = e.target.closest('a.btn, button.btn, .btn-cta, .btn-primary-stackly, .btn-hero-cta, [class*="btn-"], section a, section button');
        if (!ctaBtn) return;

        // Skip submit buttons inside forms (handled by validation.js)
        if (ctaBtn.type === 'submit' || ctaBtn.closest('form')) {
            return;
        }

        const href = ctaBtn.getAttribute('href');
        // Do not block topbar header links, auth login/signup pages, back buttons, navbar menu links, theme switcher, faq buttons, or 404 page buttons
        if (ctaBtn.classList.contains('accordion-button') || ctaBtn.classList.contains('faq-header-btn') || ctaBtn.closest('.faq-item') || ctaBtn.closest('.accordion-item') || ctaBtn.classList.contains('btn-back-auth') || ctaBtn.closest('.ref-auth-card') || ctaBtn.closest('.auth-page-container') || href === 'login.html' || href === 'signup.html' || href === 'signin.html' || href === 'index.html' || ctaBtn.closest('.header-public') || ctaBtn.closest('.nav-public-menu') || ctaBtn.closest('.logo-link') || ctaBtn.closest('.hamburger-public') || ctaBtn.closest('.close-drawer-btn') || ctaBtn.closest('.color-theme-widget') || ctaBtn.closest('.error-card-reference')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html';
    });
}

/* Universal Smooth FAQ Accordion Toggle Handler */
window.toggleFAQ = function(faqId) {
    const body = document.getElementById(faqId);
    const icon = document.getElementById(faqId + '-icon');
    if (!body) return;

    const isOpen = body.style.maxHeight && body.style.maxHeight !== '0px';

    if (isOpen) {
        body.style.maxHeight = '0px';
        body.style.opacity = '0';
        body.style.paddingTop = '0px';
        body.style.paddingBottom = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
    } else {
        body.style.maxHeight = '300px';
        body.style.opacity = '1';
        body.style.paddingTop = '15px';
        body.style.paddingBottom = '15px';
        if (icon) icon.style.transform = 'rotate(180deg)';
    }
};
