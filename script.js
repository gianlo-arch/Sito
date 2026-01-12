// ═══════════════════════════════════════════════════════════
// DE RE AEDIFICATORIA DIGITALIS - Interactive Script
// Mathematical beauty through code
// ═══════════════════════════════════════════════════════════

const PHI = 1.618033988749895;

// ═══════════════════════════════════════════════════════════
// SMOOTH SCROLL WITH EASING
// ═══════════════════════════════════════════════════════════

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ═══════════════════════════════════════════════════════════
// PARALLAX SCROLL EFFECTS
// ═══════════════════════════════════════════════════════════

const parallaxElements = document.querySelectorAll('.golden-ratio-visual, .perspective-grid');

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) / PHI;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// ═══════════════════════════════════════════════════════════
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ═══════════════════════════════════════════════════════════

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all major sections
document.querySelectorAll('section, .work-card, .shape-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all ${1 / PHI}s cubic-bezier(0.645, 0.045, 0.355, 1)`;
    fadeInObserver.observe(el);
});

// ═══════════════════════════════════════════════════════════
// INTERACTIVE GOLDEN RECTANGLE
// ═══════════════════════════════════════════════════════════

const goldenRect = document.querySelector('.golden-rectangle');

if (goldenRect) {
    goldenRect.addEventListener('mouseenter', function() {
        this.style.transform = `scale(${1 + (1 / PHI - 1)})`;
        this.style.transition = 'transform 0.618s cubic-bezier(0.645, 0.045, 0.355, 1)';
    });

    goldenRect.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // Animated measurement display
    const measurements = document.querySelector('.measure-formula');
    if (measurements) {
        let count = 0;
        const targetValue = PHI;
        const duration = 2000;
        const startTime = Date.now();

        function animateValue() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = 1 + (targetValue - 1) * eased;

            measurements.textContent = `a/b = φ = ${current.toFixed(6)}...`;

            if (progress < 1) {
                requestAnimationFrame(animateValue);
            }
        }

        // Start animation when element is visible
        const measureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateValue();
                    measureObserver.unobserve(entry.target);
                }
            });
        });

        measureObserver.observe(measurements);
    }
}

// ═══════════════════════════════════════════════════════════
// GEOMETRIC SHAPES INTERACTION
// ═══════════════════════════════════════════════════════════

const shapeItems = document.querySelectorAll('.shape-item');

shapeItems.forEach((item, index) => {
    const shape = item.querySelector('.shape');

    item.addEventListener('mouseenter', function() {
        // Calculate rotation based on golden ratio
        const rotation = (360 / PHI) * (index + 1);

        shape.style.transform = `rotate(${rotation}deg) scale(1.1)`;
        shape.style.filter = `hue-rotate(${rotation}deg)`;
    });

    item.addEventListener('mouseleave', function() {
        shape.style.transform = 'rotate(0deg) scale(1)';
        shape.style.filter = 'hue-rotate(0deg)';
    });

    // Add click interaction for more info
    item.addEventListener('click', function() {
        const shapeName = this.dataset.shape;
        createGeometricPattern(shapeName);
    });
});

// ═══════════════════════════════════════════════════════════
// DYNAMIC GEOMETRIC PATTERN GENERATOR
// ═══════════════════════════════════════════════════════════

function createGeometricPattern(shapeType) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(10, 10, 10, 0.95);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    `;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Draw pattern based on shape type
    drawPattern(ctx, shapeType, canvas.width, canvas.height);

    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    // Close on click
    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    });

    overlay.style.opacity = '0';
    setTimeout(() => overlay.style.opacity = '1', 10);
    overlay.style.transition = 'opacity 0.3s ease';
}

function drawPattern(ctx, shapeType, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 50;

    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.05)';

    switch(shapeType) {
        case 'circle':
            // Concentric circles based on golden ratio
            for (let i = 1; i <= 8; i++) {
                const radius = maxRadius / Math.pow(PHI, 8 - i);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            break;

        case 'square':
            // Rotating squares
            for (let i = 0; i < 12; i++) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate((Math.PI / 6) * i);
                const size = maxRadius / Math.pow(PHI, i / 3);
                ctx.strokeRect(-size/2, -size/2, size, size);
                ctx.restore();
            }
            break;

        case 'triangle':
            // Sierpinski-like triangular pattern
            for (let i = 0; i < 6; i++) {
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate((Math.PI * 2 / 6) * i);
                const size = maxRadius / Math.pow(PHI, i / 2);
                drawTriangle(ctx, 0, -size/2, size);
                ctx.restore();
            }
            break;

        case 'pentagon':
            // Golden ratio is inherent in pentagons
            for (let layer = 0; layer < 5; layer++) {
                const radius = maxRadius / Math.pow(PHI, layer);
                drawPentagon(ctx, centerX, centerY, radius);

                // Draw pentagram inside
                drawPentagram(ctx, centerX, centerY, radius / PHI);
            }
            break;
    }
}

function drawTriangle(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size/2, y + size * Math.sqrt(3)/2);
    ctx.lineTo(x + size/2, y + size * Math.sqrt(3)/2);
    ctx.closePath();
    ctx.stroke();
}

function drawPentagon(ctx, cx, cy, radius) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
}

function drawPentagram(ctx, cx, cy, radius) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 / 5) * i * 2 - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    ctx.stroke();
}

// ═══════════════════════════════════════════════════════════
// CURSOR EFFECTS
// ═══════════════════════════════════════════════════════════

const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: ${20 / PHI}px;
    height: ${20 / PHI}px;
    border: 1px solid rgba(212, 175, 55, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease;
    mix-blend-mode: difference;
`;
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateCursor() {
    // Smooth cursor following with golden ratio damping
    cursorX += (mouseX - cursorX) / PHI;
    cursorY += (mouseY - cursorY) / PHI;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(updateCursor);
}

updateCursor();

// Scale cursor on interactive elements
document.querySelectorAll('a, button, .work-card, .shape-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = `scale(${PHI})`;
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
    });
});

// ═══════════════════════════════════════════════════════════
// WORK CARDS HOVER EFFECT
// ═══════════════════════════════════════════════════════════

const workCards = document.querySelectorAll('.work-card');

workCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / (PHI * 10);
        const rotateY = (centerX - x) / (PHI * 10);

        card.style.transform = `
            translateY(-10px)
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ═══════════════════════════════════════════════════════════
// NAVIGATION STATE
// ═══════════════════════════════════════════════════════════

let lastScroll = 0;
const nav = document.querySelector('.nav-minimal');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.background = 'rgba(10, 10, 10, 0.8)';
        nav.style.backdropFilter = 'blur(10px)';
    } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
    }

    lastScroll = currentScroll;
});

// ═══════════════════════════════════════════════════════════
// FIBONACCI SEQUENCE EASTER EGG
// ═══════════════════════════════════════════════════════════

function generateFibonacci(n) {
    const sequence = [0, 1];
    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i-1] + sequence[i-2]);
    }
    return sequence;
}

// Console art
console.log(`
╔═══════════════════════════════════════════════════════════╗
║  DE RE AEDIFICATORIA DIGITALIS                           ║
║  Leon Battista Alberti, MMXXVI                           ║
║                                                           ║
║  φ = ${PHI}                                    ║
║                                                           ║
║  "La bellezza è armonia delle parti"                     ║
╚═══════════════════════════════════════════════════════════╝

Fibonacci sequence (first 20):
${generateFibonacci(20).join(', ')}

Golden Ratio = φ = (1 + √5) / 2 ≈ 1.618

Each consecutive pair of Fibonacci numbers
approaches the golden ratio:
${generateFibonacci(20).slice(-5).map((n, i, arr) =>
    i > 0 ? `${arr[i]}/${arr[i-1]} = ${(n / arr[i-1]).toFixed(6)}` : ''
).filter(Boolean).join('\n')}
`);

// ═══════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION
// ═══════════════════════════════════════════════════════════

// Throttle function for scroll events
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    }
}

// Apply throttling to scroll-heavy operations
const throttledScroll = throttle(() => {
    // Additional scroll operations here
}, 1000 / PHI / 10); // ~100ms based on golden ratio

window.addEventListener('scroll', throttledScroll);

// ═══════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏛️ Renaissance principles loaded');
    console.log('📐 Golden ratio applied throughout');
    console.log('✨ Mathematical beauty initialized');

    // Preload animations
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.618s ease';
        document.body.style.opacity = '1';
    }, 100);
});
