export function createAppCard(app, index, appType) {
    const delay = (index + 1) * 100;
    const platformClass = appType === 'android' ? 'android' : app.platform;
    const platformIcon = appType === 'android' ? 'android' : app.platformIcon;

    return `
        <div class="roadmap-item" data-delay="${delay}">
            <div class="roadmap-card">
                <div class="roadmap-card-header">
                    <div class="roadmap-icon ${platformClass}">
                        <i data-icon="${app.icon}"></i>
                        <div class="platform-badge ${platformClass}">
                            <i data-icon="${platformIcon}"></i>
                        </div>
                    </div>
                    <h3 class="roadmap-title">${app.title}</h3>
                </div>
                <p class="roadmap-description">${app.description}</p>
                <div class="tech-stack">
                    ${app.techStack.map((tech) => `<span class="tech-chip">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

export function populateApps(androidApps, iosApps) {
    const androidContainer = document.getElementById('androidRoadmap');
    const iosContainer = document.getElementById('iosRoadmap');

    androidContainer.innerHTML = androidApps
        .map((app, index) => createAppCard(app, index, 'android'))
        .join('');

    iosContainer.innerHTML = iosApps
        .map((app, index) => createAppCard(app, index, 'ios'))
        .join('');
}

export function createPortfolioNavigation(sectionId, prevBtnId, nextBtnId, indicatorsId) {
    const container = document.getElementById(sectionId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const indicators = document.getElementById(indicatorsId);

    if (!container || !prevBtn || !nextBtn || !indicators) return null;

    let currentIndex = 0;
    let items = [];
    let itemsPerView = 1;
    let maxIndex = 0;

    function calculateLayout() {
        items = container.querySelectorAll('.roadmap-item');
        if (items.length === 0) return;

        const containerWidth = container.parentElement.clientWidth;
        const screenWidth = window.innerWidth;

        if (screenWidth <= 480) itemsPerView = 1;
        else if (screenWidth <= 768) itemsPerView = 1;
        else if (screenWidth <= 1024) itemsPerView = Math.min(2, items.length);
        else if (screenWidth <= 1440) itemsPerView = Math.min(3, items.length);
        else itemsPerView = Math.min(4, items.length);

        maxIndex = Math.max(0, Math.ceil(items.length / itemsPerView) - 1);

        const gapSize = screenWidth <= 768 ? 16 : 24;
        const padding = screenWidth <= 768 ? 32 : 64;
        let itemWidth;

        if (screenWidth <= 768) {
            itemWidth = Math.min(320, containerWidth - padding);
        } else {
            itemWidth = Math.min(400, (containerWidth - padding - gapSize * (itemsPerView - 1)) / itemsPerView);
        }

        items.forEach((item) => {
            item.style.minWidth = `${itemWidth}px`;
            item.style.maxWidth = `${itemWidth}px`;
        });
    }

    function generateIndicators() {
        indicators.innerHTML = '';
        const totalPages = maxIndex + 1;
        if (totalPages <= 1) {
            indicators.style.display = 'none';
            return;
        }
        indicators.style.display = 'flex';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'portfolio-nav-dot';
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToIndex(i));
            indicators.appendChild(dot);
        }
    }

    function updateNavigation() {
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= maxIndex;
        indicators.querySelectorAll('.portfolio-nav-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToIndex(index) {
        index = Math.max(0, Math.min(maxIndex, index));
        currentIndex = index;
        const itemWidth = items[0]?.offsetWidth || 300;
        const gap = window.innerWidth <= 768 ? 16 : 24;
        let offset;
        if (window.innerWidth <= 768) {
            offset = -(index * (itemWidth + gap));
        } else {
            offset = -(index * itemsPerView * (itemWidth + gap));
        }
        container.style.transform = `translateX(${offset}px)`;
        updateNavigation();
    }

    function handleResize() {
        calculateLayout();
        generateIndicators();
        currentIndex = 0;
        goToIndex(0);
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) goToIndex(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) goToIndex(currentIndex + 1);
    });

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        container.style.transition = 'none';
    });
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const itemWidth = items[0]?.offsetWidth || 300;
        const gap = window.innerWidth <= 768 ? 16 : 24;
        let baseOffset;
        if (window.innerWidth <= 768) baseOffset = -(currentIndex * (itemWidth + gap));
        else baseOffset = -(currentIndex * itemsPerView * (itemWidth + gap));
        container.style.transform = `translateX(${baseOffset + diffX}px)`;
    });
    container.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        container.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        const diffX = currentX - startX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0 && currentIndex > 0) goToIndex(currentIndex - 1);
            else if (diffX < 0 && currentIndex < maxIndex) goToIndex(currentIndex + 1);
            else goToIndex(currentIndex);
        } else goToIndex(currentIndex);
    });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0 && currentIndex < maxIndex) goToIndex(currentIndex + 1);
        else if (e.deltaY < 0 && currentIndex > 0) goToIndex(currentIndex - 1);
    });

    window.addEventListener('resize', handleResize);

    function initialize() {
        calculateLayout();
        generateIndicators();
        goToIndex(0);
    }

    setTimeout(initialize, 600);
    return { goToIndex, initialize, handleResize };
}

export function initPortfolioNavigation() {
    setTimeout(() => {
        createPortfolioNavigation('androidRoadmap', 'androidPrev', 'androidNext', 'androidIndicators');
        createPortfolioNavigation('iosRoadmap', 'iosPrev', 'iosNext', 'iosIndicators');
    }, 1200);
}
