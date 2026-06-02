import { initAnimations } from './animations.js';

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('navDrawer');
    const desktopLinks = document.querySelector('.nav-links');

    window.addEventListener(
        'scroll',
        () => navbar.classList.toggle('scrolled', window.pageYOffset > 24),
        { passive: true }
    );

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('open');
        drawer.setAttribute('aria-hidden', 'true');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            const icon = toggle.querySelector('[data-lucide]');
            if (icon) icon.setAttribute('data-lucide', 'menu');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
            const icon = toggle.querySelector('[data-lucide]');
            if (icon) icon.setAttribute('data-lucide', 'x');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    if (toggle && drawer) {
        toggle.addEventListener('click', () => {
            if (drawer.classList.contains('open')) closeDrawer();
            else openDrawer();
        });
        drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
    }

    if (desktopLinks) {
        desktopLinks.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', closeDrawer);
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
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
