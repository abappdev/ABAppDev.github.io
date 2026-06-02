/**
 * Full-page section scroll: snap navigation, wheel assist, enter animations.
 */
const NAV_OFFSET = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getPanels() {
    return [...document.querySelectorAll('.snap-panel')];
}

function getScrollParent() {
    return document.scrollingElement || document.documentElement;
}

function getActiveIndex(panels) {
    const mid = window.scrollY + NAV_OFFSET() + window.innerHeight * 0.35;
    let index = 0;
    panels.forEach((panel, i) => {
        if (panel.offsetTop <= mid) index = i;
    });
    return index;
}

function getInnerScroller(panel) {
    return panel.querySelector('.snap-panel__inner');
}

function innerCanScroll(el, deltaY) {
    if (!el || el.scrollHeight <= el.clientHeight + 2) return false;
    if (deltaY > 0) return el.scrollTop + el.clientHeight < el.scrollHeight - 2;
    return el.scrollTop > 2;
}

export function scrollToPanel(panel, behavior = 'smooth') {
    if (!panel) return;
    const top = panel.offsetTop - NAV_OFFSET();
    getScrollParent().scrollTo({ top: Math.max(0, top), behavior });
}

export function initSectionScroll() {
    if (!document.documentElement.classList.contains('snap-page')) return;

    const panels = getPanels();
    if (!panels.length) return;

    const reduced = prefersReducedMotion();

    panels[0].classList.add('is-active', 'is-initial');

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                }
            });
        },
        {
            root: null,
            threshold: 0.38,
            rootMargin: `-${NAV_OFFSET()}px 0px -12% 0px`,
        }
    );

    panels.forEach((panel) => revealObserver.observe(panel));

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target?.classList.contains('snap-panel')) return;
            e.preventDefault();
            scrollToPanel(target, reduced ? 'auto' : 'smooth');
        });
    });

    if (reduced) return;

    let wheelLocked = false;
    const lockMs = 720;

    window.addEventListener(
        'wheel',
        (e) => {
            if (wheelLocked || Math.abs(e.deltaY) < 8) return;

            const delta = e.deltaY;
            const index = getActiveIndex(panels);
            const panel = panels[index];
            const scroller = getInnerScroller(panel);

            if (innerCanScroll(scroller, delta)) return;

            const next = delta > 0 ? panels[index + 1] : panels[index - 1];
            if (!next) return;

            e.preventDefault();
            wheelLocked = true;
            scrollToPanel(next, 'smooth');
            setTimeout(() => {
                wheelLocked = false;
            }, lockMs);
        },
        { passive: false }
    );

    let touchStartY = 0;
    window.addEventListener(
        'touchstart',
        (e) => {
            touchStartY = e.changedTouches[0].screenY;
        },
        { passive: true }
    );

    window.addEventListener(
        'touchend',
        (e) => {
            if (wheelLocked) return;
            const delta = touchStartY - e.changedTouches[0].screenY;
            if (Math.abs(delta) < 48) return;

            const index = getActiveIndex(panels);
            const panel = panels[index];
            const scroller = getInnerScroller(panel);

            if (innerCanScroll(scroller, delta)) return;

            const next = delta > 0 ? panels[index + 1] : panels[index - 1];
            if (!next) return;

            wheelLocked = true;
            scrollToPanel(next, 'smooth');
            setTimeout(() => {
                wheelLocked = false;
            }, lockMs);
        },
        { passive: true }
    );
}
