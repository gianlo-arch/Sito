// ═══════════════════════════════════════════════════════════
// PLISSÉ — Studio di Forma e Piega
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

    // ── Accent color per section (Alberti/Terragni + pop) ──
    const ACCENT_MAP = {
        manifesto: 'red',
        griglia: 'yellow',
        collezione: 'blue',
        studio: 'pink',
        contatti: 'red'
    };

    // ── Mobile nav toggle ────────────────────────────────────
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // ── Grid overlay toggle (Terragni module lines) ─────────
    const gridOverlay = document.getElementById('gridOverlay');
    const gridToggle = document.getElementById('gridToggle');

    gridToggle.addEventListener('click', () => {
        const visible = gridOverlay.classList.toggle('visible');
        gridToggle.setAttribute('aria-pressed', visible);
    });

    // ── Scrollspy: active nav link + accent color per section ─
    const sections = document.querySelectorAll('main section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinkEls.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
                if (ACCENT_MAP[id]) {
                    document.body.setAttribute('data-accent', ACCENT_MAP[id]);
                }
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(section => spyObserver.observe(section));

    // ── Fade-in on scroll ─────────────────────────────────────
    const fadeTargets = document.querySelectorAll('.look-card, .contact-block, .manifesto-quote, .manifesto-text, .studio-visual, .studio-text');
    fadeTargets.forEach(el => el.classList.add('fade-in'));

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    fadeTargets.forEach(el => fadeObserver.observe(el));

    // ── Facade grid generator (Terragni bays, Fibonacci fill) ─
    const facadeGrid = document.getElementById('facadeGrid');
    const COLS = 10;
    const ROWS = 5;
    const FIB_INDICES = new Set([1, 2, 3, 5, 8, 13, 21, 34]);
    const ACCENT_CYCLE = ['red', 'yellow', 'blue', 'pink'];
    let accentPointer = 0;

    for (let i = 0; i < COLS * ROWS; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        if (FIB_INDICES.has(i)) {
            const colorName = ACCENT_CYCLE[accentPointer % ACCENT_CYCLE.length];
            accentPointer++;
            cell.classList.add('cell-fill');
            cell.style.background = `var(--${colorName})`;

            const label = document.createElement('span');
            label.className = 'cell-label';
            label.textContent = `M${i} · 1:φ`;
            cell.appendChild(label);
        }

        facadeGrid.appendChild(cell);
    }

    // ── Look cards: subtle fold tilt on mousemove ─────────────
    document.querySelectorAll('.look-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateX = (y - cy) / 22;
            const rotateY = (cx - x) / 22;
            card.style.transform = `translate(-4px, -4px) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── Back to top button ─────────────────────────────────────
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.pageYOffset > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── Smooth scroll for in-page anchors ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId.length <= 1) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
