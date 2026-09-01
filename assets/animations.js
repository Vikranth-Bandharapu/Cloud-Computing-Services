/*
   Stackly Portal Scroll & Load Animations Engine (animations.js)
   Integrates GSAP, ScrollTrigger, AOS, and custom Canvas Particle systems safely.
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS (Animate on Scroll)
    try {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                disable: 'mobile'
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

    // 3. Initialize GSAP Entrance Transitions
    try {
        initGSAPEntrances();
    } catch (err) {
        console.warn('GSAP entrance skipped:', err);
    }

    // 4. Initialize GSAP Counter Up Tweens
    try {
        initGSAPCounters();
    } catch (err) {
        console.warn('GSAP counters skipped:', err);
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

/* --- 2. GSAP Page Elements Entrances --- */
function initGSAPEntrances() {
    if (typeof gsap === 'undefined') return;

    if (document.querySelector('.gsap-hero-title')) {
        gsap.from('.gsap-hero-title', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    }

    if (document.querySelector('.gsap-hero-text')) {
        gsap.from('.gsap-hero-text', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: 'power3.out'
        });
    }

    if (document.querySelector('.gsap-hero-cta')) {
        gsap.from('.gsap-hero-cta', {
            scale: 0.95,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'back.out(1.7)'
        });
    }

    if (document.querySelectorAll('.floating-card-gsap').length > 0) {
        gsap.from('.floating-card-gsap', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            stagger: 0.15,
            ease: 'power4.out'
        });
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
            // Immediate counter fallback if ScrollTrigger is unavailable
            el.textContent = targetString;
        }
    });
}
