import { renderTab, renderFooter } from './render.js';

const VALID_TABS = ['privacy', 'terms', 'support'];
const TAB_LABELS = { privacy: 'Privacy', terms: 'Terms', support: 'Support' };

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get('id'),
        tab: params.get('tab') || 'privacy',
    };
}

function setCanonical(url) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
    }
    link.href = url;
}

function showError(message) {
    const card = document.getElementById('legal-content');
    card.innerHTML = `
        <div class="legal-error">
            <h1>Document not found</h1>
            <p>${message}</p>
            <p><a href="/">Return to AB App Dev</a></p>
        </div>
    `;
    document.getElementById('legal-tabs').innerHTML = '';
}

function updateTabUI(activeTab) {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
        const isActive = btn.dataset.tab === activeTab;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

function navigateTab(appId, tab) {
    const url = new URL(window.location.href);
    url.searchParams.set('id', appId);
    url.searchParams.set('tab', tab);
    history.replaceState(null, '', url);
}

function renderTabsBar(appId, activeTab) {
    const container = document.getElementById('legal-tabs');
    container.innerHTML = VALID_TABS.map(
        (t) =>
            `<button type="button" class="tab-btn" data-tab="${t}" aria-selected="${t === activeTab ? 'true' : 'false'}">${TAB_LABELS[t]}</button>`
    ).join('');

    container.querySelectorAll('.tab-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.dispatchEvent(
                new CustomEvent('appdocs:tab', { detail: { tab: btn.dataset.tab, appId } })
            );
        });
    });
}

function renderApp(data, activeTab) {
    const tab = data.tabs[activeTab];
    if (!tab) {
        showError('The requested tab does not exist for this app.');
        return;
    }

    document.title = `${tab.title} — ${data.appName}`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = tab.description || `${tab.title} for ${data.appName} by AB App Dev.`;

    setCanonical(`https://www.abappdev.in/appdocs/?id=${data.id}&tab=${activeTab}`);

    const brand = document.getElementById('app-brand');
    if (brand) brand.textContent = `AB App Dev · ${data.appName}`;

    document.getElementById('legal-content').innerHTML = renderTab(tab);
    document.getElementById('legal-footer-inner').innerHTML = renderFooter(data.id, data.appName);

    updateTabUI(activeTab);
}

let appData = null;

async function loadApp(id) {
    const card = document.getElementById('legal-content');
    card.innerHTML = '<div class="legal-loading">Loading…</div>';

    try {
        const res = await fetch(`/appdocs/${encodeURIComponent(id)}.json`);
        if (!res.ok) throw new Error('not found');
        appData = await res.json();
        return appData;
    } catch {
        showError('No legal documents were found for this app. Check the link and try again.');
        return null;
    }
}

async function init() {
    const { id, tab } = getParams();

    if (!id) {
        showError('Please provide an app id in the URL, for example: <code>/appdocs/?id=opacity&amp;tab=privacy</code>');
        return;
    }

    const activeTab = VALID_TABS.includes(tab) ? tab : 'privacy';
    const data = await loadApp(id);
    if (!data) return;

    renderTabsBar(data.id, activeTab);
    renderApp(data, activeTab);

    window.addEventListener('appdocs:tab', (e) => {
        const newTab = e.detail.tab;
        navigateTab(data.id, newTab);
        renderApp(data, newTab);
    });
}

init();
