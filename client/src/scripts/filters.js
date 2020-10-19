import { fetchFilterOptions } from './api.js';
import { state } from './state.js';

// Cache Elements
const newsResults = document.getElementById('news-results');
const newsFilters = document.querySelector('.news-filters');
const filterButton = document.getElementById('filter-button');
const filterTrayButtons = document.querySelectorAll('.filter-tray-button');
const filterGroups = document.querySelectorAll('.filter-group');

/**
 * Initialize the search and add search events
 */
export async function initFilters () {
    await loadFilters();
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
 * @param {HTMLSelectElement} language
 * @param {HTMLSelectElement} region
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

/**
 * Load once and set previous filter preference
 * @param {String} keyName
 * @param {HTMLSelectElement} el
 */
export function loadStoredFilter(keyName, el) {
    const storedLang = localStorage.getItem(keyName);
    if(storedLang) {
        el.value = storedLang;
        updateTrayText({ [keyName]: el });
    }
}

/**
 * Loads the category, language and regions filters from the API
 */
async function loadFilters() {
    // Promise.all takes in an array of Promises, that run in parallel
    // It returns the results when all 3 process are completed
    const results = await Promise.all([
        fetchFilterOptions('categories'),
        fetchFilterOptions('languages'),
        fetchFilterOptions('regions'),
    ]);

    // Destructure the array, in the same order they were called above
    // So, first position would be the categories, etc.
    const [
        categories,
        languages,
        regions
    ] = results;

    state.categories = categories;
    state.languages = languages;
    state.regions = regions;

    // Now that we have data for our DropDowns, 
    // we can use the same function to append to each dropdown <select> element
    appendFilterOptions("#select-categories", categories);
    appendFilterOptions("#select-language", languages);
    appendFilterOptions("#select-region", regions);
}

/**
 * Loop through a list, then create and append an <option> element to it's selector
 * @param {String} selector CSS Selector
 * @param {Array | Object} list A list to interate and create an <option> element
 */
function appendFilterOptions (selector, list) {

    if(!list || !selector) return;

    const el = document.querySelector(selector);
    // Check if the list is an Array (without named keys)
    if(list instanceof Array) {
        sortAlphabetically(list).forEach((item) => {
            el.innerHTML += `<option value=${ item }>${ toTitleCase(item) }</option>`;
        });
    } else {
        // If not an Array, then it's an Object with key, value pairs.
        // Create an Array from the object, 
        // with position zero[0] as key and position one[1] as value
        const entries = Object.entries(list);
        // Destructure the params within the arguments
        entries.forEach(([key, value]) => {
            el.innerHTML += `<option value=${ value }>${ toTitleCase(key) }</option>`;
        });
    }
}

/**
 * @param {String} text Some text content
 * @return {String} A text string that is title-cased ex: "Title Cased Example"
 */
function toTitleCase (text = '') {
    return text
        // make array of words
        .split(' ')
        // transform each first letter of word
        .map(word => word.replace(/\w{1}/, match => match.toUpperCase()))
        // join array words with space into string
        .join(' ')
}

function sortAlphabetically (list) {
    return list.sort((a, b) => b.toUpperCase() < a.toUpperCase() ? 1 : -1);
}