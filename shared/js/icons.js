/**
 * Flaticon Uicons — https://www.flaticon.com/uicons
 * Maps semantic icon names to fi-rr-* / fi-brands-* classes.
 */
(function (global) {
    const BRAND_ICONS = new Set([
        'linkedin',
        'github',
        'instagram',
        'twitter',
        'android',
        'apple',
        'google',
        'app-store-ios',
        'node-js',
    ]);

    /** Lucide / legacy names → Flaticon slug (without prefix) */
    const ALIASES = {
        menu: 'menu-burger',
        x: 'cross-small',
        mail: 'envelope',
        'folder-open': 'folder-open',
        'code-xml': 'laptop-code',
        'git-branch': 'code-branch',
        'chevron-left': 'angle-left',
        'chevron-right': 'angle-right',
        'arrow-up-right': 'arrow-up-right',
        smartphone: 'smartphone',
        layout: 'grid',
        cloud: 'cloud',
        verified_user: 'shield-check',
        'shield-check': 'shield-check',
        'file-text': 'file-edit',
        'help-circle': 'interrogation',
        play: 'play-circle',
        'app-store': 'app-store-ios',
        globe: 'globe',
        'graduation-cap': 'graduation-cap',
        briefcase: 'briefcase',
        code: 'laptop-code',
        crown: 'crown',
        brain: 'brain',
        server: 'database',
        sparkles: 'sparkles',
        headphones: 'headphones',
        users: 'users',
        'file-check': 'file-circle-info',
        layers: 'layers',
        zap: 'bolt',
        bird: 'bird',
        flame: 'flame',
        laptop: 'laptop',
        user: 'user',
        rocket: 'rocket',
        sun: 'sun',
        moon: 'moon',
        react: 'react',
        nodejs: 'node-js',
        'node.js': 'node-js',
        'ai-ml': 'brain',
    };

    function slug(name) {
        if (!name) return 'circle';
        return ALIASES[name] || name;
    }

    function resolveIcon(name) {
        const key = slug(name);
        if (BRAND_ICONS.has(key)) {
            return `fi fi-brands-${key}`;
        }
        return `fi fi-rr-${key}`;
    }

    function applyIcons(root) {
        const scope = root || document;
        scope.querySelectorAll('[data-icon]').forEach((el) => {
            const name = el.getAttribute('data-icon');
            const extra = el.getAttribute('data-icon-class') || '';
            el.className = `${resolveIcon(name)}${extra ? ` ${extra}` : ''}`.trim();
            if (!el.hasAttribute('aria-hidden')) {
                el.setAttribute('aria-hidden', 'true');
            }
        });
    }

    function setIcon(el, name) {
        if (!el) return;
        el.setAttribute('data-icon', name);
        const extra = el.getAttribute('data-icon-class') || '';
        el.className = `${resolveIcon(name)}${extra ? ` ${extra}` : ''}`.trim();
    }

    function iconHtml(name, extraClass) {
        const cls = `${resolveIcon(name)}${extraClass ? ` ${extraClass}` : ''}`;
        return `<i class="${cls}" aria-hidden="true"></i>`;
    }

    global.ABIcons = { resolveIcon, applyIcons, setIcon, iconHtml };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyIcons());
    } else {
        applyIcons();
    }
})(typeof window !== 'undefined' ? window : globalThis);
