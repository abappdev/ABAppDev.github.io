/**
 * Wrap visible "ab appdev" / "ab appdev" text in .brand-wordmark (Comfortaa Bold).
 * Skips nodes already inside .brand-wordmark or .logo.
 */
(function () {
    const RE = /ab appdev|ab appdev/g;

    function shouldSkip(node) {
        const parent = node.parentElement;
        if (!parent) return true;
        if (parent.closest('.brand-wordmark, .logo, script, style, noscript, textarea')) return true;
        return false;
    }

    function wrapTextNode(node) {
        if (shouldSkip(node)) return;
        const text = node.textContent;
        if (!RE.test(text)) return;
        RE.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let last = 0;
        let match;

        while ((match = RE.exec(text)) !== null) {
            if (match.index > last) {
                frag.appendChild(document.createTextNode(text.slice(last, match.index)));
            }
            const span = document.createElement('span');
            span.className = 'brand-wordmark';
            span.textContent = match[0];
            frag.appendChild(span);
            last = match.index + match[0].length;
        }

        if (last < text.length) {
            frag.appendChild(document.createTextNode(text.slice(last)));
        }

        node.replaceWith(frag);
    }

    function walk(root) {
        const nodes = [];
        const tree = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        while (tree.nextNode()) {
            nodes.push(tree.currentNode);
        }
        nodes.forEach(wrapTextNode);
    }

    function applyBrandWordmarks(root) {
        const el = root || document.body;
        if (!el) return;
        walk(el);
    }

    window.ABBrandWordmark = { apply: applyBrandWordmarks };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyBrandWordmarks());
    } else {
        applyBrandWordmarks();
    }
})();
