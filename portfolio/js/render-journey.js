export function createJourneyItem(item) {
    const currentClass = item.current ? ' current' : '';
    return `
        <div class="journey-item${currentClass}">
            <div class="journey-item-icon ${item.iconClass}">
                <i data-icon="${item.icon}"></i>
            </div>
            <div class="journey-year">${item.year}</div>
            <h3 class="journey-title">${item.title}</h3>
            <p class="journey-description">${item.description}</p>
        </div>
    `;
}

export function populateJourney(careerJourney) {
    const journeyContainer = document.getElementById('journeyTimeline');
    journeyContainer.innerHTML = careerJourney.map((item) => createJourneyItem(item)).join('');
}

export function initJourneyTimeline(careerJourney) {
    const journeyTimeline = document.getElementById('journeyTimeline');
    const journeyPrev = document.getElementById('journeyPrev');
    const journeyNext = document.getElementById('journeyNext');

    let journeyItems = [];
    let currentJourneyIndex =
        careerJourney.findIndex((item) => item.current) !== -1
            ? careerJourney.findIndex((item) => item.current)
            : 3;

    function isJourneyDesktop() {
        return window.innerWidth >= 769;
    }

    function updateJourneyItems() {
        journeyItems.forEach((item, index) => {
            item.classList.remove('current', 'future');
            if (index === currentJourneyIndex) item.classList.add('current');
            else if (index > currentJourneyIndex) item.classList.add('future');
        });
    }

    function updateJourneyNavigation() {
        journeyPrev.disabled = currentJourneyIndex <= 0;
        journeyNext.disabled = currentJourneyIndex >= journeyItems.length - 1;
        journeyPrev.style.opacity = journeyPrev.disabled ? '0.5' : '1';
        journeyNext.style.opacity = journeyNext.disabled ? '0.5' : '1';
    }

    function scrollJourneyTo(index) {
        if (index < 0 || index >= journeyItems.length) return;
        currentJourneyIndex = index;

        if (isJourneyDesktop()) {
            const containerWidth = document.querySelector('.journey-container').clientWidth;
            const itemWidth = journeyItems[0]?.offsetWidth || 350;
            const gap = 40;
            const cardPosition = index * (itemWidth + gap);
            const centerOffset = containerWidth / 2 - itemWidth / 2;
            journeyTimeline.style.transform = `translateX(${centerOffset - cardPosition}px)`;
        } else {
            const itemWidth = journeyItems[0]?.offsetWidth || 280;
            const gap = 24;
            journeyTimeline.style.transform = `translateX(${-(index * (itemWidth + gap))}px)`;
        }

        updateJourneyItems();
        updateJourneyNavigation();
    }

    journeyPrev.addEventListener('click', () => {
        if (currentJourneyIndex > 0) scrollJourneyTo(currentJourneyIndex - 1);
    });
    journeyNext.addEventListener('click', () => {
        if (currentJourneyIndex < journeyItems.length - 1) scrollJourneyTo(currentJourneyIndex + 1);
    });

    window.addEventListener('resize', () => setTimeout(() => scrollJourneyTo(currentJourneyIndex), 100));
    window.addEventListener('orientationchange', () =>
        setTimeout(() => scrollJourneyTo(currentJourneyIndex), 200)
    );

    let touchStartX = 0;
    let touchStartTransform = 0;

    journeyTimeline.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        const transform = journeyTimeline.style.transform;
        touchStartTransform = transform ? parseInt(transform.match(/-?\d+/)[0], 10) : 0;
        journeyTimeline.style.transition = 'none';
    });

    journeyTimeline.addEventListener('touchmove', (e) => {
        if (!touchStartX) return;
        e.preventDefault();
        const diff = e.touches[0].clientX - touchStartX;
        journeyTimeline.style.transform = `translateX(${touchStartTransform + diff}px)`;
    });

    journeyTimeline.addEventListener('touchend', (e) => {
        if (!touchStartX) return;
        const diff = e.changedTouches[0].clientX - touchStartX;
        journeyTimeline.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentJourneyIndex > 0) scrollJourneyTo(currentJourneyIndex - 1);
            else if (diff < 0 && currentJourneyIndex < journeyItems.length - 1)
                scrollJourneyTo(currentJourneyIndex + 1);
            else scrollJourneyTo(currentJourneyIndex);
        } else scrollJourneyTo(currentJourneyIndex);
        setTimeout(() => {
            journeyTimeline.style.transition = '';
        }, 600);
        touchStartX = 0;
    });

    setTimeout(() => {
        journeyItems = document.querySelectorAll('.journey-item');
        scrollJourneyTo(currentJourneyIndex);
    }, 300);
}
