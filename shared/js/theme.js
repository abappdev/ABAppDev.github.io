/**
 * Theme toggle — shared across home, portfolio, appdocs, legal pages.
 */
(function () {
    const STORAGE_KEY = 'theme';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getStoredTheme() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function initTheme() {
        const saved = getStoredTheme();
        const htmlTheme = document.documentElement.getAttribute('data-theme');
        applyTheme(saved || htmlTheme || getSystemTheme());
    }

    function updateToggleIcon(btn) {
        if (!btn) return;
        const icon = btn.querySelector('[data-lucide]');
        if (!icon) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function toggleTheme(btn) {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        updateToggleIcon(btn);
    }

    function bindThemeToggle(selector) {
        const btn = document.querySelector(selector || '#themeToggle');
        if (!btn) return;
        updateToggleIcon(btn);
        btn.addEventListener('click', () => toggleTheme(btn));
    }

    initTheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });

    window.ABTheme = { initTheme, bindThemeToggle, toggleTheme, updateToggleIcon };
    document.addEventListener('DOMContentLoaded', () => bindThemeToggle());
})();
