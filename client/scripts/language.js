import { updatePageUI } from './update.js';
import { fetchData } from './api.js';
import { 
    closeAllFilters, 
    updateTrayText, 
    loadStoredFilter
} from './filters.js';

const languageEl = document.getElementById('select-language');

/**
 * Initialize the language change events
 */
export function initLanguageChange() {
    languageEl.addEventListener('change', onChange);
    loadStoredFilter('language', languageEl);
}

async function onChange (event) {
    const { data, url } = await fetchData();
    const lang = event.target.value;

    // Update the page results
    updatePageUI(data, url);
    updateTrayText({ language: event.target });
    closeAllFilters();

    // Save to local storage
    localStorage.setItem('language', lang);

    // Set the lang on the HTML element
    if (lang !== 'any') {
        document.documentElement.setAttribute('lang', lang);
    }
}