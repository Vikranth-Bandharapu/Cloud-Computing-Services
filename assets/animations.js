/*
   Stackly Portal Master Scroll & Load Animations Engine (animations.js)
   Integrates GSAP, ScrollTrigger, AOS, and custom Canvas Particle systems safely.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 900,
                easing: 'ease-out-cubic',
                once: false,
                mirror: true,
                offset: 50,
                startEvent: 'DOMContentLoaded'
            });
        }
    } catch (err) {
        console.warn('AOS initialization skipped:', err);
    }

    // 2. Initialize Hero Network Canvas Background
    try {
        initHeroNetworkCanvas();
    } catch (err) {
        console.warn('Network canvas skipped:', err);
    }

    // 3. Initialize GSAP Entrance & ScrollTrigger Animations
    try {
        initGSAPScrollAnimations();
    } catch (err) {
        console.warn('GSAP scroll animations skipped:', err);
    }

    // 4. Initialize GSAP Counter Up Tweens
    try {
        initGSAPCounters();
    } catch (err) {
        console.warn('GSAP counters skipped:', err);
    }
});

// Refresh animation offsets on full image load
window.addEventListener('load', () => {
    try {
        if (typeof AOS !== 'undefined') AOS.refresh();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    } catch (err) {
        console.warn('Scroll refresh error:', err);
    }
});

/* --- 1. Hero Section: Canvas Animated Particle Network --- */
function initHeroNetworkCanvas() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight || 500;

    window.addEventListener('resize', () => {
        if (!canvas || !canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.parentElement.offsetHeight || 500;
    });

    const particles = [];
    const maxParticles = 45;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary checks
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
            ctx.fill();
        }
    }

    // Instantiate particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connections
        for (let i = 0; i < maxParticles; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            for (let j = i + 1; j < maxParticles; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(0, 102, 255, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* --- 2. GSAP ScrollTrigger Entrance & Parallax Animations --- */
function initGSAPScrollAnimations() {
    if (typeof gsap === 'undefined') return;

    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Continuous Floating / Levitation GSAP Animation on Floating Badges & Icons
    const floatingElements = document.querySelectorAll('.card-icon-pod, .author-avatar-badge, .badge, section .ui-glass-card i');
    if (floatingElements.length > 0) {
        floatingElements.forEach((el, index) => {
            gsap.to(el, {
                y: -10,
                duration: 1.8 + (index % 3) * 0.4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: (index % 4) * 0.2
            });
        });
    }

    // 2. Header Dynamic Blur Parallax Reveal on Scroll
    const header = document.querySelector('.header-public');
    if (header && typeof ScrollTrigger !== 'undefined') {
        gsap.to(header, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top -40',
                toggleActions: 'play none none reverse'
            },
            backgroundColor: 'rgba(3, 7, 18, 0.95)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 10px 30px rgba(0, 229, 255, 0.15)',
            duration: 0.4
        });
    }

    // 3. Hero & Section Background Parallax Scroll Effect
    const parallaxSections = document.querySelectorAll('#sec-hero, #sec-services, #sec-solutions, #sec-sec-cta, section[style*="background"]');
    parallaxSections.forEach(sec => {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(sec, {
                scrollTrigger: {
                    trigger: sec,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                backgroundPositionY: '40%',
                ease: 'none'
            });
        }
    });

    // 4. Parallax Lift Scroll Effect on All Section Images
    const parallaxImages = document.querySelectorAll('section img, .hero-section-wrapper img');
    parallaxImages.forEach(img => {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(img, {
                scrollTrigger: {
                    trigger: img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                },
                y: -40,
                rotate: 1.2,
                ease: 'none'
            });
        }
    });

    // 5. Parallax Entrance & 3D Interactive Tilt on UI Glassmorphic Cards
    const glassCards = document.querySelectorAll('.ui-glass-card');
    glassCards.forEach(card => {
        card.style.opacity = '1';
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                y: 35,
                duration: 0.7,
                ease: 'power2.out'
            });
        }

        // Interactive 3D Tilt on Mouse Move
        card.style.transformStyle = 'preserve-3d';
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
                rotateX: -y / 12,
                rotateY: x / 12,
                transformPerspective: 800,
                ease: 'power1.out',
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                ease: 'power2.out',
                duration: 0.5
            });
        });
    });

    // 6. Universal Guaranteed IntersectionObserver Fallback for GSAP & AOS Elements
    try {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate', 'gsap-active');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate3d(0, 0, 0) scale(1)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('[data-aos], .ui-glass-card, section h2, section p').forEach(el => {
            scrollObserver.observe(el);
        });
    } catch (err) {
        console.warn('Observer fallback skipped:', err);
    }
}

/* --- 3. GSAP Performance Metrics Increment Counter --- */
function initGSAPCounters() {
    if (typeof gsap === 'undefined') return;

    const counterElements = document.querySelectorAll('.gsap-counter');
    if (counterElements.length === 0) return;
    
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    counterElements.forEach(el => {
        const targetString = el.getAttribute('data-target');
        if (!targetString) return;

        const numericVal = parseFloat(targetString.replace(/[^0-9.]/g, ''));
        const suffix = targetString.replace(/[0-9.]/g, '');

        const counterObj = { value: 0 };

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(counterObj, {
                value: numericVal,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    if (numericVal % 1 !== 0) {
                        el.textContent = counterObj.value.toFixed(1) + suffix;
                    } else {
                        el.textContent = Math.floor(counterObj.value).toLocaleString() + suffix;
                    }
                }
            });
        } else {
            el.textContent = targetString;
        }
    });
}
