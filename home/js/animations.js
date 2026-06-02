import { animate, inView, stagger } from 'https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initAnimations() {
    if (reducedMotion) {
        document.querySelectorAll('[data-animate]').forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const hero = document.querySelector('.hero-content');
    if (hero) {
        animate(hero, { opacity: [0, 1], y: [32, 0] }, { duration: 0.7, easing: [0.22, 1, 0.36, 1] });
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        animate(heroVisual, { opacity: [0, 1], y: [24, 0] }, { duration: 0.7, delay: 0.15, easing: [0.22, 1, 0.36, 1] });
    }

    document.querySelectorAll('[data-animate-section]').forEach((section) => {
        inView(
            section,
            () => {
                const items = section.querySelectorAll('[data-animate]');
                if (items.length) {
                    animate(
                        items,
                        { opacity: [0, 1], y: [24, 0] },
                        { delay: stagger(0.08), duration: 0.5, easing: [0.22, 1, 0.36, 1] }
                    );
                }
            },
            { margin: '-80px' }
        );
    });
}
