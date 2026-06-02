/**
 * Renders legal document blocks from JSON into HTML.
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function renderBlock(block) {
    if (!block || !block.type) return '';

    switch (block.type) {
        case 'meta':
            return `<div class="meta">${(block.items || [])
                .map((item) => `<span><strong>${escapeHtml(item.label)}:</strong> ${item.html || escapeHtml(item.value)}</span>`)
                .join('')}</div>`;

        case 'callout':
            return `<div class="callout">${(block.paragraphs || [])
                .map((p) => `<p>${p}</p>`)
                .join('')}</div>`;

        case 'heading':
            return block.level === 3
                ? `<h3${block.id ? ` id="${block.id}"` : ''}>${block.text}</h3>`
                : `<h2${block.id ? ` id="${block.id}"` : ''}>${block.text}</h2>`;

        case 'paragraph':
            return `<p>${block.html || escapeHtml(block.text || '')}</p>`;

        case 'list':
            const tag = block.ordered ? 'ol' : 'ul';
            return `<${tag}>${(block.items || [])
                .map((item) => `<li>${item.html || escapeHtml(item)}</li>`)
                .join('')}</${tag}>`;

        case 'table':
            const head = (block.headers || [])
                .map((h) => `<th>${h}</th>`)
                .join('');
            const rows = (block.rows || [])
                .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
                .join('');
            return `<table class="compact"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;

        case 'toc':
            return `<nav class="toc" aria-label="Table of contents"><strong>${block.title || 'Contents'}</strong><ol>${(block.items || [])
                .map((item) => `<li><a href="#${item.id}">${escapeHtml(item.label)}</a></li>`)
                .join('')}</ol></nav>`;

        default:
            return '';
    }
}

export function renderTab(tab) {
    const sections = (tab.sections || []).map(renderBlock).join('');
    return `
        <h1>${tab.title}</h1>
        ${tab.subtitle ? `<p class="subtitle">${tab.subtitle}</p>` : ''}
        ${sections}
    `;
}

export function renderFooter(appId, appName) {
    const base = `/appdocs/?id=${encodeURIComponent(appId)}`;
    return `© ${new Date().getFullYear()} <span class="brand-wordmark">ab appdev</span> · <a href="${base}&tab=privacy">Privacy</a> · <a href="${base}&tab=terms">Terms</a> · <a href="${base}&tab=support">Support</a> · ${escapeHtml(appName)}`;
}
