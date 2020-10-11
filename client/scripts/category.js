import { updatePageUI } from './update.js';
import { fetchData } from './api.js';

const categories = document.getElementById('select-categories');

/**
 * Change handler for category, also sends a new request for data and updates UI
 */
export function initCategoryChange () {
    categories.addEventListener('change', onChange);
}

async function onChange () {
    const { data, url } = await fetchData();

    // Update the page results
    updatePageUI(data, url);
}

/**
 * The category tags that lay with the news cards
 * @param {Object} event
 */
export async function onCategoryTagClick (event) {
    event.preventDefault();
    const { category } = event.target.dataset;
    const { data, url } = await fetchData();

    // Update the category selector
    categories.value = category;

    // Update the page results
    updatePageUI(data, url);   
}