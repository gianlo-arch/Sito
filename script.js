// ═══════════════════════════════════════════════════════════
// PLISSÉ — Studio di Forma e Piega
// ═══════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

    const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const ACCENT_MAP = {
        manifesto: 'red',
        griglia: 'yellow',
        collezione: 'blue',
        studio: 'pink',
        contatti: 'red'
    };

    // ── Curtain intro + hero reveal ───────────────────────────
    function initCurtain() {
        const curtain = document.getElementById('curtain');
        const heroContent = document.querySelector('.hero-content');

        if (REDUCE_MOTION) {
            curtain.classList.add('done');
            heroContent.classList.add('reveal');
            return;
        }

        setTimeout(() => heroContent.classList.add('reveal'), 350);
        setTimeout(() => curtain.classList.add('done'), 1500);
    }

    // ── Custom cursor (drafting compass) ──────────────────────
    function initCursor() {
        if (!FINE_POINTER) return;

        document.documentElement.classList.add('has-cursor');
        const cursor = document.getElementById('cursor');
        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        let tx = cx;
        let ty = cy;

        window.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });

        function loop() {
            cx += (tx - cx) * 0.22;
            cy += (ty - cy) * 0.22;
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(loop);
        }
        loop();

        document.querySelectorAll('a, button, .look-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }

    // ── Hero canvas: generative pleat fan ─────────────────────
    function initHeroCanvas() {
        const canvas = document.getElementById('pleatCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const colors = ['#e8332a', '#111110', '#ffcf00', '#1652f0', '#ff3fa4', '#111110'];
        let width, height, dpr;
        let mouseX = 0.5;
        let targetMouseX = 0.5;
        let running = true;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.offsetWidth;
            height = canvas.offsetHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function draw(time) {
            ctx.clearRect(0, 0, width, height);
            const focusX = width * (0.3 + mouseX * 0.4);
            const focusY = height * 1.05;
            const lineCount = 56;
            const spread = Math.PI * 0.62;
            const baseAngle = -Math.PI / 2 - spread / 2;
            const wobble = REDUCE_MOTION ? 0 : Math.sin(time / 4000) * 0.05;

            for (let i = 0; i < lineCount; i++) {
                const t = i / (lineCount - 1);
                const angle = baseAngle + spread * t + wobble;
                const len = Math.max(width, height) * 1.3;
                const x2 = focusX + Math.cos(angle) * len;
                const y2 = focusY + Math.sin(angle) * len;
                const emphasis = i % 7 === 0;

                ctx.beginPath();
                ctx.moveTo(focusX, focusY);
                ctx.lineTo(x2, y2);
                ctx.lineWidth = emphasis ? 2 : 1;
                ctx.strokeStyle = colors[i % colors.length];
                ctx.globalAlpha = emphasis ? 0.5 : 0.15;
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        function loop(time) {
            if (!running) return;
            mouseX += (targetMouseX - mouseX) * 0.04;
            draw(time || 0);
            requestAnimationFrame(loop);
        }

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX / window.innerWidth;
        });
        document.addEventListener('visibilitychange', () => {
            running = !document.hidden && !REDUCE_MOTION;
            if (running) requestAnimationFrame(loop);
        });

        if (REDUCE_MOTION) {
            draw(0);
        } else {
            requestAnimationFrame(loop);
        }
    }

    // ── Magnetic buttons ───────────────────────────────────────
    function initMagnetic() {
        if (!FINE_POINTER) return;
        document.querySelectorAll('.magnetic').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ── Mobile nav toggle ────────────────────────────────────
    function initMobileNav() {
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
    }

    // ── Blueprint mode: grid overlay + coordinate HUD ─────────
    function initBlueprint() {
        const gridOverlay = document.getElementById('gridOverlay');
        const gridToggle = document.getElementById('gridToggle');
        const coordHud = document.getElementById('coordHud');
        let active = false;

        function onMove(e) {
            const col = Math.floor((e.clientX / window.innerWidth) * 12);
            coordHud.textContent = `X ${String(e.clientX).padStart(3, '0')} · Y ${String(e.clientY).padStart(3, '0')} · MOD ${col}`;
        }

        gridToggle.addEventListener('click', () => {
            active = !active;
            gridOverlay.classList.toggle('visible', active);
            gridToggle.setAttribute('aria-pressed', String(active));
            coordHud.classList.toggle('visible', active);
            if (active) {
                window.addEventListener('mousemove', onMove);
            } else {
                window.removeEventListener('mousemove', onMove);
            }
        });
    }

    // ── Scrollspy: active nav link + accent color per section ─
    function initScrollspy() {
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
    }

    // ── Fade-in on scroll ─────────────────────────────────────
    function initFadeIn() {
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
    }

    // ── Facade grid generator (Terragni bays, Fibonacci fill) ─
    function initFacadeGrid() {
        const facadeGrid = document.getElementById('facadeGrid');
        if (!facadeGrid) return;

        const COLS = 10;
        const ROWS = 5;
        const FIB_INDICES = new Set([1, 2, 3, 5, 8, 13, 21, 34]);
        const ACCENT_CYCLE = ['red', 'yellow', 'blue', 'pink'];
        let accentPointer = 0;

        for (let i = 0; i < COLS * ROWS; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            cell.style.transitionDelay = `${col * 18 + row * 30}ms`;

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

        const gridRevealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    facadeGrid.classList.add('in-view');
                    gridRevealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        gridRevealObserver.observe(facadeGrid);
    }

    // ── Look cards: click / keyboard to flip to technical spec ─
    function initLookCards() {
        document.querySelectorAll('.look-card').forEach(card => {
            const toggle = () => {
                const flipped = card.classList.toggle('flipped');
                card.setAttribute('aria-pressed', String(flipped));
            };
            card.addEventListener('click', toggle);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    // ── Back to top button ─────────────────────────────────────
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.pageYOffset > 500);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: REDUCE_MOTION ? 'auto' : 'smooth' });
        });
    }

    // ── Smooth scroll for in-page anchors ───────────────────────
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId.length <= 1) return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: REDUCE_MOTION ? 'auto' : 'smooth', block: 'start' });
                }
            });
        });
    }

    initCurtain();
    initCursor();
    initHeroCanvas();
    initMagnetic();
    initMobileNav();
    initBlueprint();
    initScrollspy();
    initFadeIn();
    initFacadeGrid();
    initLookCards();
    initBackToTop();
    initSmoothScroll();
});
