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
    const journeyContainer = document.querySelector('.journey-container');
    const journeyTimeline = document.getElementById('journeyTimeline');
    const journeyPrev = document.getElementById('journeyPrev');
    const journeyNext = document.getElementById('journeyNext');

    if (!journeyContainer || !journeyTimeline || !journeyPrev || !journeyNext) return;

    let journeyItems = [];
    let currentJourneyIndex =
        careerJourney.findIndex((item) => item.current) !== -1
            ? careerJourney.findIndex((item) => item.current)
            : 3;
    let scrollRaf = null;

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

    function scrollJourneyTo(index, behavior = 'smooth') {
        if (index < 0 || index >= journeyItems.length) return;
        currentJourneyIndex = index;
        journeyItems[index].scrollIntoView({
            behavior,
            inline: 'center',
            block: 'nearest',
        });
        updateJourneyItems();
        updateJourneyNavigation();
    }

    function syncIndexFromScroll() {
        if (!journeyItems.length) return;

        const containerRect = journeyContainer.getBoundingClientRect();
        const containerCenter = containerRect.left + containerRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        journeyItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const distance = Math.abs(itemCenter - containerCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== currentJourneyIndex) {
            currentJourneyIndex = closestIndex;
            updateJourneyItems();
            updateJourneyNavigation();
        }
    }

    journeyContainer.addEventListener(
        'scroll',
        () => {
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(syncIndexFromScroll);
        },
        { passive: true }
    );

    journeyPrev.addEventListener('click', () => {
        if (currentJourneyIndex > 0) scrollJourneyTo(currentJourneyIndex - 1);
    });
    journeyNext.addEventListener('click', () => {
        if (currentJourneyIndex < journeyItems.length - 1) scrollJourneyTo(currentJourneyIndex + 1);
    });

    window.addEventListener('resize', () => {
        setTimeout(() => scrollJourneyTo(currentJourneyIndex, 'auto'), 100);
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => scrollJourneyTo(currentJourneyIndex, 'auto'), 200);
    });

    setTimeout(() => {
        journeyItems = [...journeyTimeline.querySelectorAll('.journey-item')];
        scrollJourneyTo(currentJourneyIndex, 'auto');
    }, 300);
}
