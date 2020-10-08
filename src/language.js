import { updatePageUI } from './update.js';
import { buildUrl, fetchData } from './api.js';

const language = $('#select-language');

/**
 * Initialize the language change events
 */
export function initLanguageChange() {

    language.on('change', onChange);

    async function onChange (event) {
        const language = event.target.value;
        const url = buildUrl({ languageVal: language });
        const data = await fetchData(url);

        // Update the page results
        updatePageUI(data, url);
    }
}
