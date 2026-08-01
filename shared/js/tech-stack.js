const REVEAL_MS = 5000;
const ITEM_SELECTOR = '.tech-stack--icons .tech-pill, .tech-stack--icons .tech-grid__item';
const timers = new WeakMap();

function getLabelText(item) {
    const label = item.querySelector('.tech-pill__label, span:not([aria-hidden])');
    return label?.textContent?.trim() || '';
}

function revealItem(item) {
    const existing = timers.get(item);
    if (existing) clearTimeout(existing);

    item.classList.add('is-revealed');
    item.setAttribute('aria-expanded', 'true');

    const timer = setTimeout(() => {
        item.classList.remove('is-revealed');
        item.setAttribute('aria-expanded', 'false');
        timers.delete(item);
    }, REVEAL_MS);

    timers.set(item, timer);
}

function bindItem(item) {
    const label = getLabelText(item);
    if (!label) return;

    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', label);
    item.setAttribute('aria-expanded', 'false');

    item.addEventListener('mouseenter', () => revealItem(item));
    item.addEventListener('focus', () => revealItem(item));
    item.addEventListener('click', (event) => {
        event.preventDefault();
        revealItem(item);
    });
    item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            revealItem(item);
        }
    });
}

export function initTechStackReveal(root = document) {
    root.querySelectorAll(ITEM_SELECTOR).forEach(bindItem);
}
