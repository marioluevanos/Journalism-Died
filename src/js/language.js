import { updatePageUI } from './update.js';
import { buildUrl, fetchData } from './api.js';
import { closeAllFilters, updateTrayText } from './filters.js';

const language = document.getElementById('select-language');
/**
 * Initialize the language change events
 */
export function initLanguageChange() {

    language.addEventListener('change', onChange);

    async function onChange (event) {
        const language = event.target.value;
        const url = buildUrl({ languageVal: language });
        const data = await fetchData(url);

        // Update the page results
        updatePageUI(data, url);
        updateTrayText({ language: event.target });
        closeAllFilters();
    }
}