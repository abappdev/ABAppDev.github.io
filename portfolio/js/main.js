import { populateApps, initPortfolioNavigation } from './render-apps.js';
import { populateJourney, initJourneyTimeline } from './render-journey.js';
import { bindAppDialog, addAppClickListeners } from './app-dialog.js';

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
                if (entry.target.classList.contains('hero')) {
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

    document.querySelectorAll('.hero').forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
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

function initScrollEffects() {
    let ticking = false;
    window.addEventListener(
        'scroll',
        () => {
            if (ticking) return;
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const navbar = document.querySelector('.navbar');
                if (scrollY > 100) {
                    navbar.style.backgroundColor = 'var(--md-sys-color-surface-container-high)';
                    navbar.style.boxShadow = 'var(--md-sys-elevation-level3)';
                } else {
                    navbar.style.backgroundColor = 'var(--md-sys-color-surface-container)';
                    navbar.style.boxShadow = 'var(--md-sys-elevation-level2)';
                }
                ticking = false;
            });
            ticking = true;
        },
        { passive: true }
    );
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

function initProfileImage() {
    const profileImg = document.querySelector('.profile-image img');
    const fallbackIcon = document.querySelector('.profile-image i[data-lucide="user"]');
    if (!profileImg) return;
    profileImg.addEventListener('error', () => {
        profileImg.style.display = 'none';
        fallbackIcon.style.display = 'flex';
        profileImg.parentElement.style.background =
            'linear-gradient(135deg, var(--md-sys-color-primary), var(--md-sys-color-tertiary))';
    });
    profileImg.addEventListener('load', () => {
        fallbackIcon.style.display = 'none';
    });
}

async function init() {
    lucide.createIcons();

    const [androidApps, iosApps, careerJourney] = await Promise.all([
        fetchJson('/portfolio/data/android-apps.json'),
        fetchJson('/portfolio/data/ios-apps.json'),
        fetchJson('/portfolio/data/journey.json'),
    ]);

    populateApps(androidApps, iosApps);
    populateJourney(careerJourney);
    lucide.createIcons();

    bindAppDialog();
    addAppClickListeners(androidApps, iosApps);
    initPortfolioNavigation();
    initJourneyTimeline(careerJourney);
    initAnimations();
    initScrollEffects();
    initSmoothScroll();
    initProfileImage();

    const year = document.getElementById('footerYear');
    if (year) year.textContent = new Date().getFullYear();
}

init();
