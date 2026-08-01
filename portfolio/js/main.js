import { populateApps, initPortfolioNavigation } from './render-apps.js';
import { populateJourney, initJourneyTimeline } from './render-journey.js';
import { bindAppDialog, addAppClickListeners } from './app-dialog.js';
import { initSectionScroll } from '/shared/js/section-scroll.js';
import { initTechStackReveal } from '/shared/js/tech-stack.js';

async function fetchJson(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
}

function initAnimations() {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                if (entry.target.classList.contains('roadmap')) {
                    entry.target.querySelectorAll('.roadmap-item').forEach((item, index) => {
                        const delay = parseInt(item.dataset.delay, 10) || (index + 1) * 150;
                        setTimeout(() => item.classList.add('animate-in'), delay);
                    });
                }
                if (entry.target.classList.contains('hero-content') || entry.target.classList.contains('hero-image--desktop')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                if (entry.target.classList.contains('section-title')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                if (entry.target.classList.contains('section-subtitle')) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 200);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.hero-content, .hero-image--desktop').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(el);
    });
    document.querySelectorAll('.section-title').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(el);
    });
    document.querySelectorAll('.section-subtitle').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        animationObserver.observe(el);
    });
    document.querySelectorAll('.roadmap').forEach((roadmap) => animationObserver.observe(roadmap));
}

function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('navToggle');
    const drawer = document.getElementById('navDrawer');

    window.addEventListener(
        'scroll',
        () => navbar?.classList.toggle('scrolled', window.pageYOffset > 24),
        { passive: true }
    );

    function setMenuIcon(open) {
        if (!toggle) return;
        const icon = toggle.querySelector('[data-icon]');
        if (icon) window.ABIcons?.setIcon(icon, open ? 'x' : 'menu');
    }

    if (toggle && drawer) {
        toggle.addEventListener('click', () => {
            const open = drawer.classList.toggle('open');
            drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
            toggle.setAttribute('aria-expanded', String(open));
            setMenuIcon(open);
        });
        drawer.querySelectorAll('a').forEach((a) => {
            a.addEventListener('click', () => {
                drawer.classList.remove('open');
                drawer.setAttribute('aria-hidden', 'true');
                toggle.setAttribute('aria-expanded', 'false');
                setMenuIcon(false);
            });
        });
    }
}

function initScrollEffects() {
    initNavbar();
}

function initProfileImage() {
    const profileImg = document.querySelector('.profile-image img');
    if (!profileImg) return;
    profileImg.addEventListener('error', () => {
        profileImg.closest('.hero-image--desktop')?.setAttribute('hidden', '');
    });
}

async function init() {
    const [androidApps, iosApps, careerJourney] = await Promise.all([
        fetchJson('/portfolio/data/android-apps.json'),
        fetchJson('/portfolio/data/ios-apps.json'),
        fetchJson('/portfolio/data/journey.json'),
    ]);

    populateApps(androidApps, iosApps);
    populateJourney(careerJourney);
    window.ABIcons?.applyIcons();

    bindAppDialog();
    addAppClickListeners(androidApps, iosApps);
    initPortfolioNavigation();
    initJourneyTimeline(careerJourney);
    initAnimations();
    initScrollEffects();
    initSectionScroll();
    initProfileImage();
    initTechStackReveal();

    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();
}

init();
