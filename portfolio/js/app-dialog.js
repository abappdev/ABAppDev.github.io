const overlay = () => document.getElementById('appDialogOverlay');

function hasDocumentation(app, docType) {
    return app.docs && app.docs[docType] && app.docs[docType].trim() !== '';
}

function openDocumentation(app, docType) {
    if (hasDocumentation(app, docType)) {
        window.open(app.docs[docType], '_blank');
    }
}

export function closeAppDialog() {
    const el = overlay();
    el.classList.remove('active');
    document.body.style.overflow = '';
}

export function openAppDialog(app, appType) {
    const appDialogTitle = document.getElementById('appDialogTitle');
    const appDialogDescription = document.getElementById('appDialogDescription');
    const appDialogPlatform = document.getElementById('appDialogPlatform');
    const appDialogIcon = document.getElementById('appDialogIcon');
    const appDialogIconGlyph = document.getElementById('appDialogIconGlyph');
    const appDialogPlatformBadge = document.getElementById('appDialogPlatformBadge');
    const appDialogPlatformIcon = document.getElementById('appDialogPlatformIcon');
    const appDialogTechStack = document.getElementById('appDialogTechStack');
    const appDialogSections = document.getElementById('appDialogSections');
    const appDialogActions = document.getElementById('appDialogActions');

    appDialogTitle.textContent = app.title;
    appDialogDescription.textContent = app.longDescription || app.description;

    let platformText = app.platform || appType;
    if (platformText === 'android') platformText = 'Android Application';
    else if (platformText === 'ios') platformText = 'iOS Application';
    else if (platformText === 'mac') platformText = 'macOS Application';
    else if (platformText === 'swift') platformText = 'Universal Apple App';
    appDialogPlatform.textContent = platformText;

    window.ABIcons?.setIcon(appDialogIconGlyph, app.icon);
    appDialogIcon.className = 'app-dialog-icon';
    appDialogPlatformBadge.className = 'platform-badge';

    if (appType === 'android') {
        appDialogIcon.classList.add('android');
        appDialogPlatformBadge.classList.add('android');
        window.ABIcons?.setIcon(appDialogPlatformIcon, 'android');
    } else {
        const platform = app.platform || 'ios';
        appDialogIcon.classList.add(platform);
        appDialogPlatformBadge.classList.add(platform);
        window.ABIcons?.setIcon(appDialogPlatformIcon, app.platformIcon || 'smartphone');
    }

    appDialogTechStack.innerHTML = '';
    app.techStack.forEach((tech) => {
        const chip = document.createElement('span');
        chip.className = 'app-dialog-tech-chip';
        chip.textContent = tech;
        appDialogTechStack.appendChild(chip);
    });

    appDialogSections.innerHTML = '';
    if (app.features && app.features.length > 0) {
        const featuresSection = document.createElement('div');
        featuresSection.className = 'app-dialog-section';
        featuresSection.innerHTML = `
            <h4 class="app-dialog-section-title">Key Features</h4>
            <div class="app-dialog-section-content">
                <ul style="margin-left: 20px; color: var(--md-sys-color-on-surface-variant);">
                    ${app.features.map((f) => `<li style="margin-bottom: 4px;">${f}</li>`).join('')}
                </ul>
            </div>
        `;
        appDialogSections.appendChild(featuresSection);
    }

    appDialogActions.innerHTML = '';
    const storeUrl = app.playStoreUrl || app.appStoreUrl;
    if (storeUrl) {
        const storeBtn = document.createElement('a');
        storeBtn.href = storeUrl;
        storeBtn.target = '_blank';
        storeBtn.className = 'app-dialog-btn app-dialog-btn-primary';
        const storeIcon = appType === 'android' ? 'play' : 'app-store';
        storeBtn.innerHTML = `${window.ABIcons?.iconHtml(storeIcon) || ''} ${appType === 'android' ? 'Get on Play Store' : 'Get on App Store'}`;
        appDialogActions.appendChild(storeBtn);
    }

    if (hasDocumentation(app, 'website')) {
        const websiteBtn = document.createElement('a');
        websiteBtn.href = app.docs.website;
        websiteBtn.target = '_blank';
        websiteBtn.className = 'app-dialog-btn app-dialog-btn-secondary';
        websiteBtn.innerHTML = `${window.ABIcons?.iconHtml('globe') || ''} Visit Website`;
        appDialogActions.appendChild(websiteBtn);
    }

    [['privacyPolicy', 'shield-check', 'Privacy Policy'], ['termsAndConditions', 'file-text', 'Terms & Conditions'], ['support', 'help-circle', 'Support']].forEach(
        ([key, icon, label]) => {
            if (!hasDocumentation(app, key)) return;
            const btn = document.createElement('button');
            btn.className = 'app-dialog-btn app-dialog-btn-text';
            btn.innerHTML = `${window.ABIcons?.iconHtml(icon) || ''} ${label}`;
            btn.onclick = () => openDocumentation(app, key);
            appDialogActions.appendChild(btn);
        }
    );

    window.ABIcons?.applyIcons(overlay());
    overlay().classList.add('active');
    document.body.style.overflow = 'hidden';
}

export function bindAppDialog() {
    document.getElementById('appDialogClose').addEventListener('click', closeAppDialog);
    overlay().addEventListener('click', (e) => {
        if (e.target === overlay()) closeAppDialog();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay().classList.contains('active')) closeAppDialog();
    });
}

export function addAppClickListeners(androidApps, iosApps) {
    document.querySelectorAll('#androidRoadmap .roadmap-card').forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openAppDialog(androidApps[index], 'android'));
    });
    document.querySelectorAll('#iosRoadmap .roadmap-card').forEach((card, index) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openAppDialog(iosApps[index], 'ios'));
    });
}
