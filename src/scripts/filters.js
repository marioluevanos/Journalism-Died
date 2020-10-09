// Cache Elements
const newsResults = document.getElementById('news-results');
const newsFilters = document.querySelector('.news-filters');
const filterButton = document.getElementById('filter-button');
const filterTrayButtons = document.querySelectorAll('.filter-tray-button');
const filterGroups = document.querySelectorAll('.filter-group');

/**
 * Initialize the search and add search events
 */
export function initFilters () {
    filterButton.addEventListener('click', toggleAsideFilters);
    filterTrayButtons.forEach(button => button.addEventListener('click', onTrayButtonClick));
    newsResults.addEventListener('click', closeAllFilters);
}

/**
 * Toggles the aside filters, open and closes
 */
function toggleAsideFilters() {
    const closedValue = getComputedStyle(document.documentElement).getPropertyValue('--filter-width');
    const openValue = '240px';
    
    // Toggle the class first
    newsFilters.classList.toggle('active');

    // Check if the filters aside should be open or closed
    const asideWidth = newsFilters.classList.contains('active') ? openValue : closedValue;

    // Then assign the value to the CSS variable
    document.documentElement.style.setProperty('--ui-filters-width', asideWidth);
}

/**
 * Selects the active tray element and toggle the active class
 */
function onTrayButtonClick(event) {
    const activeName = event.target.dataset.name;
    const { target } = event;    
    filterTrayButtons.forEach(button => {
        if(button.dataset.name !== activeName) {
            button.classList.remove('active');
        }
    });

    target.classList.toggle('active');
    if (target.classList.contains('active')) {
        newsResults.classList.add('is-active-filters');
    } else {
        newsResults.classList.remove('is-active-filters');
    }

    filterGroups.forEach(group => {
        const groupName = group.dataset.name;
        if(groupName !== activeName) {
            group.classList.remove('active');
        } else {
            group.classList.toggle('active'); 
        }
    });
}

/**
 * Removes the active classes to the filter related elements
 */
export function closeAllFilters () {
    filterGroups.forEach(group => group.classList.remove('active'));
    filterTrayButtons.forEach(button => button.classList.remove('active'));
    newsResults.classList.remove('is-active-filters');
}

/**
 * Updates the tray text on a mobile device view
 */
export function updateTrayText({ language, region }) {
    const [
        languageTrayText,
        regionTrayText
    ] = Array.from(filterTrayButtons).map(button => button.querySelector('.tray-text'));
    
    if(language && languageTrayText) {
        const languageText = Array.from(language.children).find(option => option.selected).innerText;
        languageTrayText.innerText = languageText === 'Any' ? 'Language' : languageText;
    }

    if(region && regionTrayText) {
        const regionText = Array.from(region.children).find(option => option.selected).innerText;
        regionTrayText.innerText = regionText === 'Any' ? 'Region' : regionText;
    }
}