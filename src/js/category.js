import { updatePageUI } from './update.js';
import { buildUrl, fetchData } from './api.js';

const categories = document.getElementById('select-categories');

/**
 * @param {Object} event
 */
export async function onCategoryClick (event) {
    event.preventDefault();
    const { category } = event.target.dataset;
    const url = buildUrl({ categoryVal: category });
    const data = await fetchData(url);

    // Update the category selector
    categories.value = category;

    // Update the page results
    updatePageUI(data, url);   
}

/**
 * Change handler for category, also sends a new request for data and updates UI
 */
export function initCategoryChange () {
    
    categories.addEventListener('change', onChange);

    async function onChange (event) {
        const category = event.target.value;
        const url = buildUrl({ categoryVal: category });
        const data = await fetchData(url);

        // Update the page results
        updatePageUI(data, url);
    }
}