/*
   Stackly Portal Core Script (main.js)
   Controls drawer menus, FAQ accordions, toast notifications, and programmatic CTA routing.
*/

document.addEventListener('DOMContentLoaded', () => {
    initDrawerMenu();
    initFAQAccordions();
    initGlobalCTARouting();
    initThemeSwitcher();
});

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

        const ctaBtn = e.target.closest('a.btn, button.btn, .btn-cta, .btn-primary-stackly, .btn-hero-cta, [class*="btn-"], section a, section button');
        if (!ctaBtn) return;

        // Skip submit buttons inside forms (handled by validation.js)
        if (ctaBtn.type === 'submit' || ctaBtn.closest('form')) {
            return;
        }

        const href = ctaBtn.getAttribute('href');
        // Do not block topbar header links, auth login/signup pages, back buttons, navbar menu links, theme switcher, or 404 page buttons
        if (ctaBtn.classList.contains('btn-back-auth') || ctaBtn.closest('.ref-auth-card') || ctaBtn.closest('.auth-page-container') || href === 'login.html' || href === 'signup.html' || href === 'signin.html' || href === 'index.html' || ctaBtn.closest('.header-public') || ctaBtn.closest('.nav-public-menu') || ctaBtn.closest('.logo-link') || ctaBtn.closest('.hamburger-public') || ctaBtn.closest('.close-drawer-btn') || ctaBtn.closest('.color-theme-widget') || ctaBtn.closest('.error-card-reference')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html';
    });
}
