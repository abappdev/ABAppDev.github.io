import { initAnimations } from './animations.js';
import { initSectionScroll } from '/shared/js/section-scroll.js';
import { initTechStackReveal } from '/shared/js/tech-stack.js';

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('navDrawer');
    const desktopLinks = document.querySelector('.topbar-links');

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
            const icon = toggle.querySelector('[data-icon]');
            if (icon) window.ABIcons?.setIcon(icon, 'menu');
        }
    }

    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('open');
        drawer.setAttribute('aria-hidden', 'false');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
            const icon = toggle.querySelector('[data-icon]');
            if (icon) window.ABIcons?.setIcon(icon, 'x');
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

function initFooterYear() {
    const el = document.getElementById('footerYear');
    if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
    window.ABIcons?.applyIcons();
    initNavbar();
    initSectionScroll();
    initFooterYear();
    initAnimations();
    initTechStackReveal();
});
