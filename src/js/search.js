import { fetchData, buildUrl } from './api.js';
import { updatePageUI } from './update.js';

// Cache Elements
const newsTitleText = document.querySelector('.news-title-text');
const keywords = document.getElementById('keywords');
const selectLanguage = document.getElementById('select-language');
const selectRegion = document.getElementById('select-region');
const selectCategories = document.getElementById('select-categories');
const searchForm = document.getElementById('news-form');
const newsFilters = document.querySelector('.news-filters');
const filterButton = document.getElementById('filter-button');
const searchButton = document.getElementById('search-button');
const startDate = document.getElementById('select-date-start');
const endDate = document.getElementById('select-date-end');

/**
 * Initialize the search and add search events
 */
export function initSearch () {
    keywords.addEventListener('focus', onSearchFocus);
    keywords.addEventListener('blur', onSearchBlur);
    filterButton.addEventListener('click', toggleAsideFilters);
    searchButton.addEventListener("click", onSearchClick);
    newsTitleText.addEventListener('click', () => window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }));

    // Search on inital load
    onSearchClick();
}

/**
 * Click hanlder that creates a new search URL, fetched the data, and updates the UI
 * @param {Object} event
 */
async function onSearchClick (event) {
    if(event) {
        event.preventDefault();
    }

    // Create the url, first
    // Send value for each of the search input fields
    const url = buildUrl({
        keywordsVal: keywords.value,
        languageVal: selectLanguage.value,
        regionsVal: selectRegion.value,
        categoryVal: selectCategories.value,
        startDateVal: startDate.value,
        endDateVal: endDate.value
    });
    
    // Fetch the data
    const data = await fetchData(url);

    // Update the page UI
    updatePageUI(data, url);
}

function onSearchFocus() {
    searchForm.classList.add('is-focused');
}

function onSearchBlur () {
    searchForm.classList.remove('is-focused');
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