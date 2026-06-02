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

    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    if (heroContent) {
        animate(heroContent, { opacity: [0, 1], y: [28, 0] }, { duration: 0.65, easing: [0.22, 1, 0.36, 1] });
    }
    if (heroVisual) {
        animate(heroVisual, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.7, delay: 0.12, easing: [0.22, 1, 0.36, 1] });
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
            { margin: '-12% 0px -12% 0px', amount: 0.35 }
        );
    });
}
