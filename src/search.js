import { fetchData, buildUrl } from './api.js';
import { updatePageUI } from './update.js';

// Cache Elements
const newsTitleText = $('.news-title-text');
const keywords = $("#keywords");
const selectLanguage = $("#select-language");
const selectRegion = $("#select-region");
const selectCategories = $("#select-categories");
const searchForm = $('#news-form');
const newsFilters = $('.news-filters');
const filterButton = $('#filter-button');
const searchButton = $("#search-button");
const startDate = $('#select-date-start');
const endDate = $('#select-date-end');

/**
 * Initialize the search and add search events
 */
export function initSearch () {
    keywords.on('focus', onSearchFocus);
    keywords.on('blur', onSearchBlur);
    filterButton.on('click', toggleAsideFilters);
    searchButton.on("click", onSearchClick);
    newsTitleText.on('click', () => $('html, body').animate({ scrollTop: 0 }, 600));

    // Search on inital load
    onSearchClick();
}

/**
 * Click hanlder that creates a new search URL, fetched the data, and updates the UI
 * @param {Object} event
 */
async function onSearchClick (event) {

    // Create the url, first
    // Send value for each of the search input fields
    const url = buildUrl({
        keywordsVal: keywords.val(),
        languageVal: selectLanguage.val(),
        regionsVal: selectRegion.val(),
        categoryVal: selectCategories.val(),
        startDateVal: startDate.val(),
        endDateVal: endDate.val()
    });
    
    if(event) {
        event.preventDefault();
        localStorage.removeItem(url);
    }
    
    // Fetch the data
    const data = await fetchData(url);

    // Update the page UI
    updatePageUI(data, url);
}

function onSearchFocus() {
    searchForm.addClass('is-focused');
}

function onSearchBlur () {
    searchForm.removeClass('is-focused');
}

/**
 * Toggles the aside filters, open and closes
 */
function toggleAsideFilters() {
    const closedValue = getComputedStyle(document.documentElement).getPropertyValue('--filter-width');
    const openValue = '240px';
    
    // Toggle the class first
    newsFilters.toggleClass('active');

    // Check if the filters aside should be open or closed
    const asideWidth = newsFilters.hasClass('active') ? openValue : closedValue;

    // Then assign the value to the CSS variable
    document.documentElement.style.setProperty('--ui-filters-width', asideWidth);
}