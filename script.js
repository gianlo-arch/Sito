/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STUDIO ALBERTI — Interazioni
 * "Nulla si può aggiungere né togliere senza renderla peggiore"
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * JavaScript minimalista e raffinato. Solo ciò che è necessario.
 */

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // I. COSTANTI E SELEZIONE ELEMENTI
    // ═══════════════════════════════════════════════════════════════════════════

    const PHI = 1.618033988749895;

    const elements = {
        loader: document.getElementById('loader'),
        nav: document.querySelector('.nav'),
        navToggle: document.querySelector('.nav-toggle'),
        navLinks: document.querySelector('.nav-links'),
        geometricGrid: document.querySelector('.geometric-grid'),
        sections: document.querySelectorAll('.section'),
        opusItems: document.querySelectorAll('.opus-item'),
        principleCards: document.querySelectorAll('.principle-card'),
        heroContent: document.querySelector('.hero-content'),
        heroOrnament: document.querySelector('.hero-ornament'),
        backToTop: document.querySelector('.back-to-top'),
        numberValues: document.querySelectorAll('.number-value'),
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // II. LOADING SCREEN
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Nasconde la loading screen dopo il caricamento
     */
    function hideLoader() {
        if (!elements.loader) return;

        // Attendi che le animazioni SVG completino
        setTimeout(() => {
            elements.loader.classList.add('hidden');

            // Rimuovi completamente dopo la transizione
            setTimeout(() => {
                elements.loader.remove();
            }, 800);
        }, 2000);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // III. NAVIGAZIONE
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Gestisce lo stato della navbar durante lo scroll
     */
    function handleNavScroll() {
        const scrollY = window.scrollY;
        const threshold = 50;

        if (scrollY > threshold) {
            elements.nav?.classList.add('scrolled');
        } else {
            elements.nav?.classList.remove('scrolled');
        }
    }

    /**
     * Toggle menu mobile
     */
    function toggleMobileNav() {
        const isExpanded = elements.navToggle.getAttribute('aria-expanded') === 'true';

        elements.navToggle.setAttribute('aria-expanded', !isExpanded);
        elements.navToggle.classList.toggle('active');
        elements.navLinks.classList.toggle('active');

        // Blocca lo scroll del body quando il menu è aperto
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    /**
     * Chiude il menu mobile quando si clicca un link
     */
    function closeMobileNavOnClick(e) {
        if (e.target.tagName === 'A') {
            elements.navToggle.setAttribute('aria-expanded', 'false');
            elements.navToggle.classList.remove('active');
            elements.navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // IV. SMOOTH SCROLL
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Scroll fluido verso le ancore
     */
    function handleSmoothScroll(e) {
        const href = e.target.closest('a')?.getAttribute('href');

        if (href && href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navHeight = elements.nav?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // V. BACK TO TOP
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Mostra/nasconde il pulsante back to top
     */
    function handleBackToTop() {
        if (!elements.backToTop) return;

        const scrollY = window.scrollY;
        const threshold = window.innerHeight * 0.5;

        if (scrollY > threshold) {
            elements.backToTop.classList.add('visible');
        } else {
            elements.backToTop.classList.remove('visible');
        }
    }

    /**
     * Scroll verso l'alto
     */
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VI. REVEAL ANIMATIONS (Intersection Observer)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Crea un observer per animazioni di reveal
     */
    function createRevealObserver() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Stagger animation per gli elementi figli
                    if (entry.target.classList.contains('reveal-stagger')) {
                        entry.target.classList.add('visible');
                    }
                }
            });
        }, options);

        return observer;
    }

    /**
     * Applica le classi reveal agli elementi
     */
    function setupRevealAnimations() {
        const observer = createRevealObserver();

        // Sezioni
        elements.sections.forEach(section => {
            section.classList.add('reveal');
            observer.observe(section);
        });

        // Griglia opus con stagger
        const opusGrid = document.querySelector('.opus-grid');
        if (opusGrid) {
            opusGrid.classList.add('reveal-stagger');
            observer.observe(opusGrid);
        }

        // Griglia principi con stagger
        const principlesGrid = document.querySelector('.ratio-principles-grid');
        if (principlesGrid) {
            principlesGrid.classList.add('reveal-stagger');
            observer.observe(principlesGrid);
        }

        // Numbers grid con stagger
        const numbersGrid = document.querySelector('.numbers-grid');
        if (numbersGrid) {
            numbersGrid.classList.add('reveal-stagger');
            observer.observe(numbersGrid);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VII. NUMBER ANIMATION
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Anima i numeri quando entrano in vista
     */
    function setupNumberAnimation() {
        if (!elements.numberValues.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = el.dataset.target;

                    // Se è un numero, animalo
                    if (!isNaN(parseFloat(target))) {
                        animateNumber(el, parseFloat(target));
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        elements.numberValues.forEach(el => observer.observe(el));
    }

    /**
     * Anima un numero da 0 al target
     */
    function animateNumber(el, target) {
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing out expo
            const easeProgress = 1 - Math.pow(2, -10 * progress);

            const current = target * easeProgress;
            el.textContent = isDecimal ? current.toFixed(3) : Math.round(current);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = isDecimal ? target.toFixed(3) : target;
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // VIII. EFFETTI PARALLAX SOTTILI
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Effetto parallax leggero sulla griglia geometrica
     * Usa la proporzione aurea per il movimento
     */
    function handleParallax() {
        if (!elements.geometricGrid) return;

        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / maxScroll;

        // Movimento basato su φ - molto sottile
        const translateY = scrollProgress * 100 / PHI;
        const opacity = 0.15 - (scrollProgress * 0.1);

        elements.geometricGrid.style.transform = `translateY(${translateY}px)`;
        elements.geometricGrid.style.opacity = Math.max(0.05, opacity);
    }

    /**
     * Parallax leggero sull'hero
     */
    function handleHeroParallax() {
        if (!elements.heroContent || !elements.heroOrnament) return;

        const scrollY = window.scrollY;
        const heroHeight = window.innerHeight;

        if (scrollY < heroHeight) {
            const progress = scrollY / heroHeight;

            // Contenuto si muove più lentamente (effetto profondità)
            elements.heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
            elements.heroContent.style.opacity = 1 - (progress * 0.5);

            // Ornamento si muove diversamente
            elements.heroOrnament.style.transform = `translateY(${scrollY * 0.1}px) rotate(${progress * 5}deg)`;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // IX. CURSORE PERSONALIZZATO (Desktop only)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Crea un cursore personalizzato elegante
     */
    function createCustomCursor() {
        // Solo per dispositivi con puntatore preciso
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
        document.body.appendChild(cursor);

        // Stili inline per il cursore
        const style = document.createElement('style');
        style.textContent = `
            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 9998;
                mix-blend-mode: difference;
            }
            .cursor-dot {
                position: absolute;
                width: 4px;
                height: 4px;
                background: white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
            }
            .cursor-ring {
                position: absolute;
                width: 30px;
                height: 30px;
                border: 1px solid white;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.15s ease-out;
            }
            .custom-cursor.hovering .cursor-ring {
                width: 50px;
                height: 50px;
                border-width: 2px;
            }
            body { cursor: none; }
            a, button, .opus-item { cursor: none; }
        `;
        document.head.appendChild(style);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animazione fluida con requestAnimationFrame
        function animateCursor() {
            // Lerp per movimento fluido
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, .opus-item, .principle-card, .social-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // X. FORM HANDLING
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Gestisce la sottomissione del form con feedback elegante
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const button = form.querySelector('.btn-submit');
        if (!button) return;

        // Aggiungi classe loading
        button.classList.add('loading');
        button.disabled = true;

        // Simulazione invio (sostituire con vera logica)
        setTimeout(() => {
            button.classList.remove('loading');
            button.style.backgroundColor = 'var(--color-verdigris)';

            const btnText = button.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Messaggio inviato!';

            // Reset dopo 3 secondi
            setTimeout(() => {
                form.reset();
                if (btnText) btnText.textContent = 'Invia il messaggio';
                button.disabled = false;
                button.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XI. EASTER EGG — Omaggio ad Alberti
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Konami code rivela un messaggio nascosto
     */
    function setupEasterEgg() {
        const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let index = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === sequence[index]) {
                index++;
                if (index === sequence.length) {
                    showAlbertiQuote();
                    index = 0;
                }
            } else {
                index = 0;
            }
        });
    }

    function showAlbertiQuote() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(26, 25, 23, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; color: #FAF8F5; padding: 2rem; max-width: 600px;">
                <div style="font-size: 4rem; color: #C4A35A; margin-bottom: 1rem;">φ</div>
                <p style="font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-style: italic; margin-bottom: 1rem;">
                    "Gli uomini possono fare tutto, se vogliono."
                </p>
                <p style="font-size: 0.875rem; color: #A89A86;">
                    — Leon Battista Alberti (1404-1472)
                </p>
                <p style="font-size: 0.75rem; color: #6B5D4A; margin-top: 2rem;">
                    Premi un tasto per chiudere
                </p>
            </div>
        `;

        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.style.opacity = '1');

        const close = () => {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 500);
        };

        overlay.addEventListener('click', close);
        document.addEventListener('keydown', close, { once: true });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XII. MAGNETIC BUTTONS (subtle effect)
    // ═══════════════════════════════════════════════════════════════════════════

    function setupMagneticButtons() {
        if (!window.matchMedia('(pointer: fine)').matches) return;

        const buttons = document.querySelectorAll('.btn-primary');

        buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XIII. THROTTLE & DEBOUNCE UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════

    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // XIV. INIZIALIZZAZIONE
    // ═══════════════════════════════════════════════════════════════════════════

    function init() {
        // Loading screen
        hideLoader();

        // Navigazione
        window.addEventListener('scroll', throttle(handleNavScroll, 10));
        elements.navToggle?.addEventListener('click', toggleMobileNav);
        elements.navLinks?.addEventListener('click', closeMobileNavOnClick);

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });

        // Back to top
        window.addEventListener('scroll', throttle(handleBackToTop, 100));
        elements.backToTop?.addEventListener('click', scrollToTop);

        // Reveal animations
        setupRevealAnimations();

        // Number animations
        setupNumberAnimation();

        // Parallax (solo desktop)
        if (window.matchMedia('(min-width: 768px)').matches) {
            window.addEventListener('scroll', throttle(() => {
                handleParallax();
                handleHeroParallax();
            }, 16));
        }

        // Form
        const contactForm = document.querySelector('.contact-form');
        contactForm?.addEventListener('submit', handleFormSubmit);

        // Cursore personalizzato (solo desktop con pointer preciso)
        createCustomCursor();

        // Magnetic buttons
        setupMagneticButtons();

        // Easter egg
        setupEasterEgg();

        // Log di benvenuto nella console
        console.log(
            '%c✦ Studio Alberti ✦',
            'font-family: Georgia, serif; font-size: 20px; color: #C4A35A;'
        );
        console.log(
            '%cProportio · Harmonia · Venustas',
            'font-family: Georgia, serif; font-style: italic; color: #8A7B66;'
        );
        console.log(
            '%cφ = ' + PHI,
            'font-family: monospace; color: #2B4B6F;'
        );
        console.log(
            '%c↑↑↓↓←→←→BA per un segreto',
            'font-family: monospace; font-size: 10px; color: #6B5D4A;'
        );
    }

    // Avvia quando il DOM è pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
