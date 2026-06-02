import { initAnimations } from './animations.js';

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener(
        'scroll',
        () => {
            navbar.classList.toggle('scrolled', window.pageYOffset > 40);
        },
        { passive: true }
    );

    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('open');
            toggle.setAttribute('aria-expanded', links.classList.contains('open'));
        });
        links.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => links.classList.remove('open'));
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    initNavbar();
    initSmoothScroll();
    initFooterYear();
    initAnimations();
});
